import { NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
import { auth } from "@/auth";

import { ObjectId } from "mongodb";


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
