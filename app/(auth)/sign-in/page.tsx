"use client"

import AuthButton from "../_components/AuthButton";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter
} from 'next/navigation'
import { getUserByEmail } from "@/actions/auth"; 
import {useState }from "react"


const SignIn = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter(); 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
    
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
    
        if (!email || !password) {
          console.log("No data found");
          return;
        }
    
        // Vérifier si l'utilisateur existe déjà (optionnel, pour debug)
        try {
          const existingUser = await getUserByEmail(email);
          console.log('Utilisateur existant :', existingUser);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        }
    
        // Appel de signIn avec NextAuth
        try {
          const result = await signIn('credentials', {
            redirect: false, // Pour éviter la redirection automatique
            email: email,
            password: password,
          });
    
          if (result && !result.error) {
            console.log('User signed in successfully:', result);
            // Rediriger l'utilisateur après la connexion réussie (si nécessaire)
            router.push("/main"); 
          } else {
            console.log('Sign in failed:', result?.error);
            if (result?.error === "CredentialsSignin") {
              setErrorMessage("Mot de passe incorrect ou utilisateur introuvable.");
            } else {
              setErrorMessage("Une autre erreur s'est produite lors de la connexion.");
            }
          }
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          setErrorMessage("Une erreur s'est produite lors de la tentative de connexion.");
        }
      };
    return ( 
        <div className="w-full flex mt-20 justify-center">
            <section className="flex flex-col w-[400px]">
                <h1>Sign in</h1>
                {error && (
                    <div className="text-red-500 mb-4">
                        {error === 'CredentialsSignin' ? "Email ou mot de passe incorrect." : "Une erreur s'est produite."}
                    </div>
                )}
                {errorMessage && (
                    <div className="text-red-500 mb-4">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div><label >email</label><input type="email" placeholder="email" id="email" name='email' /></div>
                    <div><label >password</label><input type="password" placeholder="password" id="password" name="password"/></div>
                    <div>
                        <AuthButton/>
                    </div>
                   
                </form>
            </section>
        </div>
     );
}
 
export default SignIn;