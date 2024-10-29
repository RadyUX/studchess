
import { PrismaAdapter} from '@auth/prisma-adapter'
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { hashPassword } from "./utils/hash"
import NextAuth from "next-auth"

export const { auth, handlers, signIn, signOut } = NextAuth({
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
            type: "email"
          },
          password: {
            label: "password",
            type: "password",
          },
        },
        authorize: async (credentials) => {
            if (!credentials) {
                throw new Error("Missing credentials");
              }
      
              const { email, password } = credentials;
      
              // Rechercher l'utilisateur par email dans la base de données
              const user = await db.user.findUnique({
                where: {email },
              });
      
              if (!user) {
                console.log("no user found with this email")
                return null
                
             
              }

              const isPasswordValid = await bcrypt.compare(password as string, user.hashedPassword as string);
              if (!isPasswordValid) {
                console.log("password incorrect")
                return null
                
              }
      
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                eloBullet: user.eloBullet,
                eloBlitz: user.eloBlitz,
                eloRapid: user.eloRapid,
                chesscomUsername: user.chesscomUsername,
              };
        },
      }),
    ],   //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
    callbacks: {
      jwt({ token, user }) {
        if (user) { // User is available during sign-in
          token.id = user.id
          token.eloBullet = user.eloBullet
        }
        return token
      },
      session({ session, token }) {
        session.user.id = token.id as string
        session.user.eloBullet = token.eloBullet as number
        return session
      },
    },
  
    
    
  });


  export default NextAuth