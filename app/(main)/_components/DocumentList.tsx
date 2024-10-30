import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Item from "./Item";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils"
import { ObjectId } from "bson";
import { Document } from "@prisma/client";

interface DocumentListProps {
    parentDocumentId?: ObjectId | null;
    level?: number;
    data?: Document;
  }
  
const fetchDocumentsbyUrl = async (parentDocumentId: ObjectId | null): Promise<Document[]> => {
  const url = `/api/documents${parentDocumentId ? `?parentDocument=${parentDocumentId}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

const DocumentList = ({ parentDocumentId = null, level = 0 }:DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: documents, isLoading, isError } = useQuery({
    queryKey: ["documents", parentDocumentId], 
    queryFn: () => fetchDocumentsbyUrl(parentDocumentId),
  });

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirect = (documentId: string) => {
    router.push(`/main/${documentId}`);
  };

  if (isLoading) return <p>Loading documents...</p>;
  if (isError) return <p>Error loading documents.</p>;

  return (
    <>
      {documents.length === 0 && level > 0 && (
        <p
          style={{
            paddingLeft: `${(level * 12) + 25}px`
          }}
          className="text-[#B8D4E3] text-sm font-medium text-muted-foreground/80"
        >
          No pages inside
        </p>
      )}
      <div>
        {documents?.map((document) => (
          <div key={document.id}>
            <Item
              id={document.id}
              onClick={() => onRedirect(document.id)}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params.documentId === document.id}
              level={level}
              onExpand={() => onExpand(document.id)}
              expanded={expanded[document.id]}
            />
            {expanded[document.id] && (
              <DocumentList parentDocumentId={document.id} level={level + 1} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentList;
