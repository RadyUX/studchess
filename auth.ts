
import { PrismaAdapter} from '@auth/prisma-adapter'
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { hashPassword } from "./utils/hash"
import NextAuth from "next-auth"
import { signIn, signOut } from "next-auth/react";

export const authOptions = {
    adapter: PrismaAdapter(db),
    session: {
      strategy: "jwt",
    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: {
            label: "email",
            type: "email",
            placeholder: "email@exemple.com",
          },
          password: {
            label: "password",
            type: "password",
          },
        },
        authorize: async (credentials) => {
          if (!credentials || !credentials.email || !credentials.password) {
            return console.log("no credential")
          }
  
          const email = credentials.email as string;
          const hash = hashPassword(credentials.password as string);
  

          
          let user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.log("No user found with this email");
            return null;
          }

            const isMatch = bcrypt.compareSync(credentials.password as string, user.hashedPassword as string);
            if (!isMatch) {
              throw new Error("Mot de passe incorrect");
            }

      
  
          return user;
        },
      }),
    ],
  };


  export default NextAuth(authOptions)