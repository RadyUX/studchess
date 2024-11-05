import { removeCover } from "@/actions/icon";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/useCouverImage";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CoverImageProps {
    url?: string;
    preview?: boolean;
  }
  


const Cover = ({
    url,
    preview,
  }: CoverImageProps) => {
    const {edgestore} = useEdgeStore()
    const params = useParams()
    const coverImage = useCoverImage()
    

    
  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url
      })
    }
    // @ts-ignore
   removeCover(params.id)
   window.location.reload()
  };
    return (  
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted"
          )}>
            {!!url && (
              <Image
                src={url}
                fill
                alt="Cover"
                className="object-cover"
              />
            )}
            {url && !preview && (
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                <Button
                  onClick={() => coverImage.onReplace(url)}
                  className="text-muted-foreground text-xs"
                  variant="outline"
                  size="sm"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change cover
                </Button>
                <Button
                  onClick={onRemove}
                  className="text-muted-foreground text-xs"
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
    );
}
 
export default Cover;