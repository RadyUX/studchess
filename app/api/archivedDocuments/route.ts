import { NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
import { auth } from "@/auth";



export async function GET(req: Request) {
  try {
    // Obtenez la session utilisateur pour vérifier l'authentification
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Rechercher tous les documents appartenant à l'utilisateur et non archivés
    const documents = await db.document.findMany({
      where: {
        userId: userId,
        isArchived: true,
      },
      orderBy: {
        createdAt: "desc", // Trier les documents par ordre décroissant de création
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Erreur interne :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PATCH(req: Request) {
    try {
      // Obtenez la session utilisateur pour vérifier l'authentification
      const session = await auth();
  
      if (!session || !session.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
  
      const userId = session.user.id;
      const { id } = await req.json(); // Récupérer l'ID du document depuis le corps de la requête
  
      if (!id) {
        return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
      }
  
      // Récupérer le document existant
      const existingDocument = await db.document.findUnique({
        where: { id },
        include: { parentDocument: true },
      });
  
      if (!existingDocument) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }
  
      if (existingDocument.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
  
      // Fonction récursive pour restaurer les documents enfants
      const recursiveRestore = async (documentId: string) => {
        const children = await db.document.findMany({
          where: {
            parentDocumentId: documentId,
            userId: userId,
          },
        });
  
        for (const child of children) {
          await db.document.update({
            where: { id: child.id },
            data: { isArchived: false },
          });
  
          // Restaurer les sous-documents de manière récursive
          await recursiveRestore(child.id);
        }
      };
  
      // Options pour mettre à jour le document existant
      const updateData: any = {
        isArchived: false,
      };
  
      // Si le document parent est archivé, supprimer la référence au document parent
      if (existingDocument.parentDocumentId) {
        const parentDocument = await db.document.findUnique({
          where: { id: existingDocument.parentDocumentId },
        });
  
        if (parentDocument?.isArchived) {
          updateData.parentDocumentId = null;
        }
      }
  
      // Mettre à jour le document avec les nouvelles options
      const updatedDocument = await db.document.update({
        where: { id },
        data: updateData,
      });
  
      // Restaurer les enfants de manière récursive
      await recursiveRestore(id);
  
      return NextResponse.json(updatedDocument);
    } catch (error) {
      console.error("Erreur interne :", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }



  export async function DELETE(req: Request) {
    try {
      const session = await auth();
  
      if (!session || !session.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
  
      const userId = session.user.id;
      const { id } = await req.json(); // Assurez-vous que l'id est récupéré correctement
  
      if (!id) {
        return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
      }
  
      // Récupérer le document existant
      const existingDocument = await db.document.findUnique({
        where: { id }, // Correction ici : utiliser "id" au lieu de "documentId"
      });
  
      if (!existingDocument) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }
  
      if (existingDocument.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
  
      // Supprimer le document
      await db.document.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Erreur interne :", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  