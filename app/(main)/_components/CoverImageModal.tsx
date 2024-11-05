"use client"


import {
    Dialog,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog"
import { useCoverImage } from "@/hooks/useCouverImage";
import { SingleImageDropzone } from "@/components/ui/dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const ConverImageModal = () => {
    const params = useParams()
    const coverImage = useCoverImage()
    const { edgestore } = useEdgeStore()

    const [file, setFile] = useState<File>()
    const [submitting, setSubmitting] = useState(false)

    const update = useMutation({
        mutationFn: async ({id, coverImage }) => {
          const response = await fetch(`/api/documents/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({coverImage}),
          });
    
          if (!response.ok) {
            throw new Error("Failed to update title");
          }
    
          return response.json();
        },
         onSuccess: (updatedData) => {
            console.log("Titre mis à jour avec succès :", updatedData); 
            window.location.reload()
         },
      });

      const onClose = () => {
        setFile(undefined);
        setSubmitting(false);
        coverImage.onClose();
      }
    


    const onChange = async(file: File)=>{
        if(file){
            setSubmitting(true)
            setFile(file)
let res
            if(coverImage.url){
                res = await edgestore.publicFiles.upload({
                    file,
                    options:{
                        replaceTargetUrl: coverImage.url,
                    }
                })
            }else {
                 res = await edgestore.publicFiles.upload({
                    file
                })
            }

           

          update.mutate({id: params.id, coverImage: res.url})

            onClose()
          
        }
    }

    return ( 
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">Cover Image</h2>
                </DialogHeader>
                <div>
                    <SingleImageDropzone className="w-full outline-none" disabled={submitting}  value={file} onChange={onChange}/>
                </div>
            </DialogContent>
        </Dialog>
     );
}
 
export default ConverImageModal;