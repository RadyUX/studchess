import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
import { auth } from "@/auth";




export async function GET(request: Request, { params }: { params: { documentId: string } }) {
  try {
    // Authentification de l'utilisateur
    const session = await auth();

    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const userId = session.user.id;
    const documentId = params.documentId;

    // Récupérer le document par son ID et son userId
    const document = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    // Vérifier si le document existe
    if (!document) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Vérifier si le document appartient à l'utilisateur et n'est pas archivé
    if (document.userId !== userId || document.isArchived) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(document);

  } catch (error) {
    console.error("Erreur lors de la récupération du document :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
  



export async function PATCH(request: Request, { params }: { params: { documentId: string } }) {
    try {
      // Authentification de l'utilisateur
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      const userId = session.user.id;
      const documentId = params.documentId; // Utilisez `params.documentId` ici
  
      const body = await request.json();
      const { title, content, coverImage, icon, isPublished } = body;
  
      // Récupérez le document avec `documentId`
      const existingDocument = await db.document.findUnique({
        where: {
          id: documentId,
        },
      });
  
      if (!existingDocument) {
        return new NextResponse("Not found", { status: 404 });
      }
  
      // Vérifiez que l'utilisateur est le propriétaire du document
      if (existingDocument.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      // Met à jour le document avec les nouvelles données
      const updatedDocument = await db.document.update({
        where: {
          id: documentId,
        },
        data: {
          title,
          content,
          coverImage,
          icon,
          isPublished,
        },
      });
  
      return NextResponse.json(updatedDocument);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du document :", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }