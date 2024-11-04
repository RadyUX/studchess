"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";

interface TitleProps {
    initialData: Document
  };





const TitleX = ({initialData}: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false)


    const [title, setTitle] = useState(initialData.title || "Untitled");
    const queryClient = useQueryClient()

    const updateTitle = useMutation({
        mutationFn: async (newTitle: string) => {
          const response = await fetch(`/api/documents/${initialData.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTitle),
          });
    
          if (!response.ok) {
            throw new Error("Failed to update title");
          }
    
          return response.json();
        },
         onSuccess: (updatedData) => {
            console.log("Titre mis à jour avec succès :", updatedData);
            queryClient.invalidateQueries(["document", initialData.id]); 
         },
      });

    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
      };
    
      const disableInput = () => {
        setIsEditing(false);
      };
    
      const onChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const newTitle = event.target.value;
        setTitle(newTitle);
        updateTitle.mutate(newTitle)
      };
    
      const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
      ) => {
        if (event.key === "Enter") {
          disableInput();
        }
      };

    return ( 
        <div className="flex items-ceneter gap-x-1">
            {
            !!initialData.icon && <p>{initialData.icon}</p>
        }
         {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent text-black"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {title}
          </span>
        </Button>
      )}
        
        
        </div>
    );
}
 
export default TitleX;