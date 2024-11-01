import { NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
import { auth } from "@/auth";

import { ObjectId } from "mongodb";


export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { documentId, userId } = body;

    if (!documentId || !userId) {
      return NextResponse.json({ error: "Missing documentId or userId" }, { status: 400 });
    }

    await recursiveArchive(documentId, userId);

    return NextResponse.json({ message: "Document and its children archived successfully" });
  } catch (error) {
    console.error("Erreur interne :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Fonction récursive pour archiver un document et ses enfants
async function recursiveArchive(documentId: string, userId: string) {
  // Rechercher tous les enfants du document donné
  const children = await db.document.findMany({
    where: {
      userId: userId,
      parentDocumentId: documentId,
    },
  });

  // Archiver tous les enfants trouvés
  for (const child of children) {
    await db.document.update({
      where: {
        id: child.id,
      },
      data: {
        isArchived: true,
      },
    });

    // Appeler la fonction récursive pour archiver les enfants du document courant
    await recursiveArchive(child.id, userId);
  }

  // Archiver le document parent donné
  await db.document.update({
    where: {
      id: documentId,
    },
    data: {
      isArchived: true,
    },
  });
}


export async function GET(request: Request) {
  try {
    // Authentification de l'utilisateur
    const session = await auth();

    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer les paramètres de requête (ex. : parentDocumentId)
    const { searchParams } = new URL(request.url);
    const parentDocument = searchParams.get("parentDocument");

    // Requête à la base de données pour récupérer les documents
    const documents = await db.document.findMany({
      where: {
        userId: userId, // Filtrer par utilisateur connecté
        parentDocumentId: parentDocument || null, // Filtrer par parentDocumentId (optionnel)
        isArchived: false, // Ne prendre que les documents non archivés
      },
      orderBy: {
        createdAt: "desc", // Trier par date de création (ordre décroissant)
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function POST(req: Request) {
  try {

    const session = await auth();

    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const userId = session.user.id;


    const body = await req.json();
    const { title, parentDocument } = body;

    // Validation de l'entrée
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Insertion dans la base de données avec Prisma
    const document = await db.document.create({
      data: {
        id: new ObjectId().toHexString(), // Génère un ObjectID valide
        title: title,
        parentDocumentId: parentDocument || null,
        userId: userId,
        isArchived: false,
        isPublished: false,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Erreur interne: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
