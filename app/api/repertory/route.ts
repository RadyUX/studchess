  // get user's repertory

import { NextRequest, NextResponse } from "next/server";
  import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
  import { auth } from "@/auth";
  
  
  
  export async function GET(request: Request) {


    try {
      
        const session = await auth();

        if (!session) {
          return new NextResponse("Not authenticated", { status: 401 });
        }
    
        const userId = session.user.id;
  
      const UserRepertory = await db.repertory.findUnique({
        where: {
            userId
        }, 
        include: {
            openings: true
        }
      })
  
      return NextResponse.json(UserRepertory);
    } catch (error) {
      console.error("Erreur lors de la récupération de votre répertoire :", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  
  export async function PATCH(request: Request) {
    try {
      const body = await request.json();
      const { repertoryId, openingId } = body;
  
      if (!repertoryId || !openingId) {
        return new NextResponse("Missing repertoryId or openingId", { status: 400 });
      }
  
      const updatedRepertory = await db.repertory.update({
        where: {
          id: repertoryId,
        },
        data: {
          openings: {
            connect: { id: openingId },
          },
        },
      });
  
      return NextResponse.json(updatedRepertory);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ouverture au répertoire :", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  