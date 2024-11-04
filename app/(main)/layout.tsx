"use client"

import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import { SearchCommand } from "./_components/search-command";

const MainLayout =  ({children}: { children: React.ReactNode}) => {
    const { data: session, status } = useSession(); 
    // Attendre l'authentification si nécessaire
    if (status === "loading") {
      return <Loader size='lg' />;
    }
  
    if (!session) {
      return redirect("/")// Peut-être rediriger vers une page de connexion ou afficher un message
    }
  
    // Rendu du composant principal lorsque l'utilisateur est authentifié
    return (
      <div className="h-full flex">
        <Navigation/>
        <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
        </main>
      
      </div>
    );
}
 
export default MainLayout;