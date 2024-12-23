/*import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma
import { auth } from "@/auth";
import { ObjectId } from "bson"; // Import de bson pour convertir l'ID

export async function GET(request: NextRequest) {
  try {
    // Authentification
  
    const { searchParams } = new URL(request.url);
    const openingId = searchParams.get("openingId");

    if (!openingId) {
      console.log("Erreur : Paramètre `openingId` manquant");
      return NextResponse.json({ message: "Missing openingId parameter" }, { status: 400 });
    }

    // Convertit l'ID en ObjectId
    let objectId;
    try {
      objectId = new ObjectId(openingId);
    } catch (e) {
      console.log("Erreur : `openingId` n'est pas un ObjectId valide");
      return NextResponse.json({ message: "Invalid openingId format" }, { status: 400 });
    }

    // Recherche dans la base de données avec Prisma
    const openingVariation = await db.opening.findUnique({
      where: {
        id: objectId,
      },
      include: {
        variation: true,
      },
    });

    if (!openingVariation) {
      console.log("Erreur : Ouverture non trouvée");
      return NextResponse.json({ message: "Opening not found" }, { status: 404 });
    }

    return NextResponse.json(openingVariation);
  } catch (error) {
    console.error("Erreur lors de la récupération des variantes :", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}*/

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Votre instance Prisma
import { auth } from "@/auth";


export async function POST(request) {
  // Authentification
  const session = await auth();
  if (!session) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  try {

    const body = await request.json(); 
    const { notes, moves, openingId } = body;

   
    if (!notes || !moves || !openingId) {
      return new NextResponse("Missing fields", { status: 400 });
    }


     const variation = await db.variation.create({
      data: {
        notes,
        moves,
        openingId,
        userId: session.user.id, 
      },
    });

    // Réponse en cas de succès
    return new NextResponse(JSON.stringify(variation), { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la variation :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url);
    const openingId = searchParams.get("openingId");

    if (!openingId) {
      return new NextResponse("Missing opening ID", { status: 400 });
    }

    // Trouver les variations associées à une ouverture spécifique
    const variations = await db.variation.findMany({
      where: {
        openingId: openingId,
        userId: session.user.id, 
      },
    });

    return NextResponse.json(variations);
  } catch (error) {
    console.error("Erreur lors de la récupération des variations :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

