import { NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma

import { auth } from "@/auth";


export async function GET(request: Request) {
  try {
    // fetch opening global
    const openings = await db.opening.findMany({

      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(openings);
  } catch (error) {
    console.error("Erreur lors de la récupération des openings :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const { openingId } = await request.json();

    // On vérifie si l'ouverture appartient bien au répertoire de l'utilisateur
    const opening = await db.opening.findUnique({
      where: {
        id: openingId,
      },
      include: {
        repertory: true,
      },
    });

    if (!opening || opening.repertory?.userId !== session.user.id) {
      return new NextResponse("Opening not found in user's repertory", { status: 404 });
    }

    // Mettre à jour l'ouverture pour retirer la référence au répertoire
    const updatedOpening = await db.opening.update({
      where: {
        id: openingId,
      },
      data: {
        repertoryId: null, // Dissocie l'ouverture du répertoire
      },
    });

    return NextResponse.json(updatedOpening);
  } catch (error) {
    console.error("Error detaching opening from repertory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
