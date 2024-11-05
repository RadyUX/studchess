"use client"; // Ajoutez ceci si le composant est destiné à être côté client

import Cover from "@/app/(main)/_components/Cover";
import Editor from "@/app/(main)/_components/Editor";
import { fetchDocumentId } from "@/lib/fetchData";
import Toolbar from "@/app/(main)/_components/Toolbar";
import { Document } from "@prisma/client";
import { useQuery , useMutation, useQueryClient} from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface DocumentIdPageProps {
  params: {
    id: string // Remplacez `Document` par `string` car l'ID est probablement un `string`
  };
}

const DocumentPage = ({ params }: DocumentIdPageProps) => {
    const queryClient = useQueryClient()
    const param = useParams()
  const { data: doc, error, isLoading } = useQuery({
    queryKey: ["document", params.id],
    queryFn: () => fetchDocumentId(params.id), // Utilisez `params.id` ici
    enabled: !!params.id, // Exécute la requête uniquement si `id` est défini
    staleTime: 0, // S'assure que les données sont actualisées à chaque navigation
  });

  const update = useMutation({
    mutationFn: async ({ id, content }) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({content}),
      });

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      return response.json();
    },
     onSuccess: (updatedData) => {
        console.log("CONTENT UPDATED:", updatedData);
          // Met à jour le cache immédiatement après la mutation
        queryClient.setQueryData(["document", params.id], (oldData) => ({
            ...oldData,
            content: updatedData.content,
          }));
     },
  });

  const onChange = (content: string) =>{
    update.mutate({id: param.id, content})
  }

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors de la récupération du document</div>;
  if (!doc) return <div>Document non trouvé</div>;

  return (
    <div className="pb-40">

       <Cover url={doc.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={doc} />
        <Editor onChange={onChange} initialContent={doc.content} />
      </div>
    </div>
  );
};

export default DocumentPage;
