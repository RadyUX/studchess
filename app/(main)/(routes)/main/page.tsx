
"use client"
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";
import CardsElo from "../../_components/CardsElo";
import CardsOpening from "../../_components/CardsOpening";


const fetchDocuments = async (userId: string | null) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/documents`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};
 
const DocumentPage = () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
  // Utiliser useQuery pour vérifier s'il y a des documents existants
  const { data: documents = [], isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: () => fetchDocuments(session?.user.id),
    enabled: !!session?.user.id, // Active la requête seulement si l'utilisateur est connecté
  });

    const createMutation = useMutation({
        mutationFn: async (newDocument) => {
          const response = await fetch("/api/documents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDocument),
          });
      
          if (!response.ok) {
            throw new Error("Failed to create document");
          }
      
          return response.json();
        }, onSuccess: () => {
          queryClient.invalidateQueries(["documents"]);
        },
      });
    
      const onCreate = () => {
        if (!session) {
          alert("You must be logged in to create a document");
          return;
        }
    
        const promise = createMutation.mutateAsync({ title: "Untitled" },
          
        );
    
        // Utilisation de toast pour l'état du processus
        toast.promise(promise, {
          loading: "Creating a new note...",
          success: "New note created!",
          error: "Failed to create a new note",
        });
      };

    return ( 
      <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-medium p-6">
        {session?.user.name}'s Chess Tracker !
      </h2>
      <div className="flex flex-col w-full">
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">Objectif</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardsElo />
            <CardsElo />
            <CardsElo />
          </div>
        </div>
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">My Repertory</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            <CardsOpening />
            <CardsOpening />
            <CardsOpening />
            <CardsOpening />
          </div>
        </div>
      </div>
    
      {documents.length === 0 && (
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" /> Write your first analysis
        </Button>
      )}
 
    </div> );
}
 
export default DocumentPage;

