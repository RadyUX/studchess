
"use client"
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const DocumentPage = () => {
    const { data: session } = useSession();

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
        },
      });
    
      const onCreate = () => {
        if (!session) {
          alert("You must be logged in to create a document");
          return;
        }
    
        const promise = createMutation.mutateAsync({ title: "Untitled" });
    
        // Utilisation de toast pour l'état du processus
        toast.promise(promise, {
          loading: "Creating a new note...",
          success: "New note created!",
          error: "Failed to create a new note",
        });
      };

    return ( 
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-medium">
        Welcome to {session?.user.name}
      </h2>
        <Button onClick={onCreate}>
            <PlusCircle className="h-4 w-4 mr-2"/> Write your first analyse
        </Button>
    </div> );
}
 
export default DocumentPage;

