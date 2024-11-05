"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { Search, Trash, Undo } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmDialog";

export const fetchArchivedDocument = async () => {
    try {
      const response = await fetch("/api/archivedDocuments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch archived documents");
      }
  
      return response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des documents archivés :", error);
      throw error;
    }
  };

  
  export const restoreDocument = async ({ documentId}: { documentId: string}) => {
    const response = await fetch("/api/archivedDocuments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: documentId.toString() }),
    });
  
    if (!response.ok) {
        console.log(documentId)
      throw new Error("Failed to restore");

    }
    return response.json();
  }
  export const deleteDocument = async({ documentId}: { documentId:string}) =>{
    const response = await fetch("/api/archivedDocuments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: documentId.toString() }), // Correction ici
    });
  
    if (!response.ok) {
      console.log(documentId);
      throw new Error("Failed to delete");
    }
  };
  

const Trashbox = () => {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");

    
    const {data: archived , isLoading, isError} = useQuery({
        queryKey: ["archived"],
        queryFn: fetchArchivedDocument
    })
    const filteredDocuments = archived?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
      });
    
      
const { mutateAsync: restore } = useMutation({
    mutationFn: restoreDocument,
    onError: () => {
      toast.error("Failed to restore the document.");
    },
    onSuccess: () => {
      toast.success("Document restored successfully.");
      // @ts-ignore
      queryClient.invalidateQueries(["archived"]); 
      // @ts-ignore
      queryClient.invalidateQueries(["documents"]); // Invalider les requêtes avec le cache "archived" pour mettre à jour les données
    },
  });

  const { mutateAsync: deletedoc } = useMutation({
    mutationFn: deleteDocument,
    onError: () => {
        toast.error("Failed to delete the document.");
      },
      onSuccess: () => {
        toast.success("Document deleted successfully.");// @ts-ignore
        queryClient.invalidateQueries(["archived"]); 
      },
    });

    const onClick = (documentId: string) => {
      router.push(`/main/${documentId}`);
    };
  
      
     // Gérer l'état de chargement
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Gérer l'état d'erreur
  if (isError) {
    return <div>Erreur lors de la récupération des documents archivés.</div>;
  }




  const onRestore = async (documentId: ObjectId | string) => {
    try {
      await restore({ documentId: documentId.toString() });
    } catch (error) {
      console.error("Erreur lors de la restauration du document :", error);
    }
  };
  
  const onDelete = async (documentId: ObjectId | string) => {
    try {
      await deletedoc({ documentId: documentId.toString() });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }

    if(params.documentId === documentId){
        router.push('/main')
    }
  };
  

  return (
    <div className="text-sm">
     <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
     </div>
     <div className="mt-2 px-1 pb-1">
     <h2>Documents Archivés</h2>
     {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={() => onRestore(document.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onDelete(document.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
     </div>
     
    </div>
  );
};
export default Trashbox;