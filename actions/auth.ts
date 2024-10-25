"use server"

import { signIn, signOut } from "next-auth/react";
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { hashPassword } from "@/utils/hash";



const getUserByEmail = async (email: string) => {
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

export const login = async (formData: FormData) =>{
    const rawFormData = {
        email:formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/"
    }

    const existingUser = await getUserByEmail(formData.get("email") as string)
    console.log(existingUser)

    try{
        await signIn("credentials", rawFormData)
        
    }catch(error){
        console.log('no user founds', error)
        console.log(rawFormData)
       
    }

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
            eloBullet: eloBullet ,
            eloBlitz: eloBlitz,
            eloRapid: eloRapid,
            chesscomUsername: rawFormData.chesscomUsername,
          },
        });
    
        console.log('User registered successfully', newUser);
        return { message: 'User registered successfully' }
        
    }

   
  }catch(error){
    
    console.log(error)
  }
}