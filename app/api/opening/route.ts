import { NextResponse } from "next/server";
import { db } from "@/db"; // Assurez-vous que ceci pointe vers votre instance Prisma




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
