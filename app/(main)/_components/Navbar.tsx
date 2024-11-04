import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { Title } from "@radix-ui/react-dialog";
import TitleX from "./Title";



const fetchDocumentId = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, { // Notez l'URL corrigée ici
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
  
      const data = await response.json();
      console.log("Document récupéré :", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du document :", error);
    }
  }
  
const Navbar = ({isCollapsed, onResetWidth}) => {
    const params = useParams();

    const { data: doc, error, isLoading } = useQuery({
      queryKey: ["document", params.id],
      queryFn: () => fetchDocumentId(params.id), // Utilisez `params.id` ici
      enabled: !!params.id, // Exécute la requête uniquement si `id` est défini
    });
  
    console.log("Données du document (doc) :", doc);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Erreur lors de la récupération du document</div>;
  
    return (
      <nav className="bg-transparent px-3 py-2 w-full flex items-center gap-x-3">
        {isCollapsed && (
          <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6" />
        )}
        <div className="flex items-center justify-between w-full">
          {doc ? <TitleX initialData={doc} /> : <p>Chargement...</p>}
        </div>
      </nav>
    )
}
 
export default Navbar;