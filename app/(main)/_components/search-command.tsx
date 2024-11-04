"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { getSearch } from "@/actions/auth";
import { useSearch } from "@/hooks/useSearch";

export const SearchCommand = () => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [documents, setDocuments] = useState([]); // État pour stocker les documents
  const router = useRouter();

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  // Récupérez les documents dans un useEffect pour éviter l'appel direct à chaque rendu
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await getSearch(); // Récupère les documents via getSearch
        setDocuments(result || []); // Mets à jour l'état avec les documents récupérés
      } catch (error) {
        console.error("Erreur lors de la récupération des documents :", error);
      }
    };

    fetchDocuments();
  }, []);

  // Ajoute un écouteur pour les raccourcis clavier
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  // Met à jour l'état pour gérer l'affichage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search An Analysis" />
      <CommandList>
        <CommandEmpty>No results Found</CommandEmpty>
        <CommandGroup heading="documents">
          {documents.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document.id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
