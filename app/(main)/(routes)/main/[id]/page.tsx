"use client"; // Ajoutez ceci si le composant est destiné à être côté client

import { fetchDocumentId } from "@/app/(main)/_components/Navbar";
import Toolbar from "@/app/(main)/_components/Toolbar";
import { Document } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface DocumentIdPageProps {
  params: {
    id: string // Remplacez `Document` par `string` car l'ID est probablement un `string`
  };
}

const DocumentPage = ({ params }: DocumentIdPageProps) => {
  const { data: doc, error, isLoading } = useQuery({
    queryKey: ["document", params.id],
    queryFn: () => fetchDocumentId(params.id), // Utilisez `params.id` ici
    enabled: !!params.id, // Exécute la requête uniquement si `id` est défini
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur lors de la récupération du document</div>;
  if (!doc) return <div>Document non trouvé</div>;

  return (
    <div className="pb-40">
        <div className="h-[35vh]"></div>
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={doc} />
      </div>
    </div>
  );
};

export default DocumentPage;
