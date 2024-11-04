"use server"

import { signIn, signOut } from "next-auth/react";
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { hashPassword } from "@/utils/hash";
import { auth } from "@/auth";



export async function updateUserSettings({
  userId,
  bullet,
  blitz,
  rapid,
}: {
  userId: string;
  bullet: string;
  blitz: string;
  rapid: string;
}) {
  try {
    // Mettre à jour les objectifs ELO de l'utilisateur dans la base de données
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        eloBullet: parseInt(bullet, 10),
        eloBlitz: parseInt(blitz, 10),
        eloRapid: parseInt(rapid, 10),
      },
    });
    console.log(updatedUser)
    return updatedUser;
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres utilisateur:", error);
    throw new Error("Erreur lors de la mise à jour des informations.");
  }
}

export const getSearch = async () =>{
  try{
    const session = await auth()
    if(!session){
      throw new Error('not authentivcated')
    }
      const userId = session.user.id 

      const document = await db.document.findMany({
        where: {
          userId,
          isArchived: false
        },
        orderBy: {
          createdAt: "desc"
        },
      })


      return document

  }catch(error){
    console.log(error)
    throw new Error("error")
  }
}
export const getUserByEmail = async (email: string) => {
    try{
        const user = await db.user.findUnique({
            where:{
                email,
            },
        })

        return user
    }catch(error){
        return null
    }
}
export const logout = async () =>{
    await signOut({ callbackUrl: "/" });
    revalidatePath("/");
}



export const register = async (formData: FormData) =>{
      const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email')as string,
    password: formData.get('password') as string,
    eloBullet: formData.get('eloBullet'),
    eloBlitz: formData.get('eloBlitz'),
    eloRapid: formData.get('eloRapid'),
    chesscomUsername: formData.get('chesscomUsername') as string,
  };

  if (!rawFormData.name || !rawFormData.email || !rawFormData.password) {
    throw new Error('Name, email, and password are required');
  }
  try {
    
    const existingUser = await db.user.findUnique({
      where: { email: rawFormData.email as string },
    });

    if (existingUser) {
      throw new Error('User already exists');
    } else {  
 
        const hashedPassword = hashPassword(rawFormData.password as string)

        const eloBullet = rawFormData.eloBullet ? parseInt(rawFormData.eloBullet as string, 10) : 0;
        const eloBlitz = rawFormData.eloBlitz ? parseInt(rawFormData.eloBlitz as string, 10) : 0;
        const eloRapid = rawFormData.eloRapid ? parseInt(rawFormData.eloRapid as string, 10) : 0;
    
    
       
        const newUser = await db.user.create({
          data: {
            name: rawFormData.name as string,
            email: rawFormData.email as string,
            hashedPassword: hashedPassword,
            eloBullet: eloBullet,
            eloBlitz: eloBlitz,
            eloRapid: eloRapid,
            chesscomUsername: rawFormData.chesscomUsername,
            // Crée un répertoire par défaut lors de la création de l'utilisateur
            repertory: {
              create: {},
            },
          },
          include: {
            repertory: true, // Inclut les répertoires dans la réponse
          },
        });
    
        console.log('User registered successfully', newUser);
        return { message: 'User registered successfully' }
        
    }

   
  }catch(error){
    
    console.log(error)
  }
}

