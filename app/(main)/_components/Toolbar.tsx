"use client";

import { Document } from "@prisma/client";
import IconPicker from "./IconPicker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useRef, useState, ElementRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextareaAutosize from "react-textarea-autosize"
import { removeIcon } from "@/actions/icon";
import { useCoverImage } from "@/hooks/useCouverImage";

interface ToolbarProps {
  initialData: Document;
  preview?: boolean;
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {

    const inputRef = useRef<ElementRef<"textarea">>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialData.title)
   const queryClient = useQueryClient()
const coverImage = useCoverImage()
    const update = useMutation({
        mutationFn: async ({  title, icon }) => {
          const response = await fetch(`/api/documents/${initialData.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({title, icon}),
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

      
    const enableInput = ()=>{
        if(preview) return;

        setIsEditing(true)
        setTimeout(()=>{
            setValue(initialData.title)
            inputRef.current?.focus()
        },0)
    }

    
    const disableInput = () => {
        setIsEditing(false);
      };
    

      const onInput = (value: string) =>{
        setValue(value)
        update.mutate({ title: value || "Untitled" });
      
    
      }

      
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {

    update.mutate({ icon });

  };


  const onRemoveIcon = () =>{
    removeIcon(initialData.id)
    window.location.reload()
  }
 

  return (
<>

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

    <div className="group"> {/* Ajout d'un div conteneur avec `group` */}
    

    <div className="group-hover:opacity-100 flex items-center gap-x-1 py-4 transition-opacity duration-300">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2  pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 hover:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!initialData.icon && !preview && (
        <IconPicker asChild onChange={onIconSelect}>
          <Button
            className="text-xs opacity-0 group-hover:opacity-100 transition"
            variant="outline"
            size="sm"
          >
            <Smile className="h-4 w-4 mr-2" />
            Add icon
          </Button>
        </IconPicker>
      )}
      {!initialData.coverImage && !preview && (
        <Button
          onClick={coverImage.onOpen}
          className="text-xs opacity-0 group-hover:opacity-100 transition"
          variant="outline"
          size="sm"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Add cover
        </Button>
      )}
    </div>
    {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-white resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-white"
        >
          {initialData.title}
        </div>
      )}
  </div>
  </>
  );
};

export default Toolbar;
