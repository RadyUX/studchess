"use client"

import {  ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react";
import { ObjectId } from "bson";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
  } from "@/components/ui/dropdown-menu";

interface itemProps {
    id?: ObjectId;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}



  

const Item = ({ 
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded, }: itemProps) => {
        const router = useRouter()
        const createDocument = async ({ title, parentDocument }: { title: string; parentDocument: ObjectId }): Promise<string> => {
            const response = await fetch("/api/documents", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, parentDocument }),
            });
          
            if (!response.ok) {
              throw new Error("Failed to create document");
            }
          
            const data = await response.json();
            return data.id; // Retourne l'ID du document créé
          };
         // Mutation pour créer un nouveau document
         const { mutateAsync: createUnderDocument, isLoading } = useMutation({
            mutationFn: createDocument,
            onError: () => {
              toast.error("Failed to create a new note.");
            },
            onSuccess: (documentId: string) => {
              toast.success("New note created!");
              if (!expanded) {
                onExpand?.();
              }
              router.push(`/documents/${documentId}`);
            },
          });

          const onCreate = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            if (!id) return;
          
            try {
              const documentId = await createUnderDocument({ title: "child document", parentDocument: id });
            } catch (error) {
              console.error("Erreur lors de la création du document :", error);
            }
          };
          
        const ChevronIcon = expanded ? ChevronDown : ChevronRight;

        const handleExpand = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            event.stopPropagation();
            onExpand?.();
          };
    return ( 

        

        <div onClick={onClick} role="button" style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px"}}  className={cn(
            "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary"
          )}> 
          {!!id && (
            <div
            role="button"
            className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
            onClick={handleExpand}
          >
            <ChevronIcon
              className="h-4 w-4 shrink-0 text-muted-foreground/50 text-[#B8D4E3]"
            />
          </div>
          )}
           {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px] ">
          {documentIcon}
        </div>
      ) : (
        <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        />
      )}
        <span className="truncate text-[#B8D4E3]">{label}</span>
        
        {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
             
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
           
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: username
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
        
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
      <div
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
        }}
        className="flex gap-x-2 py-[3px]"
      >
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[30%]" />
      </div>
    )
}
export default Item;