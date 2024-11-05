import { Document } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ObjectId } from "bson";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, restoreDocument } from "./Trashbox";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "./ConfirmDialog";

interface BannerProps {
    documentId: string; // Assurez-vous que documentId soit une chaîne ou un Document
}

const Banner = ({ documentId }: BannerProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { mutateAsync: restore } = useMutation({
        mutationFn: restoreDocument,
        onError: () => {
            toast.error("Failed to restore the document.");
        },
        onSuccess: () => {
            toast.success("Document restored successfully.");
            queryClient.invalidateQueries({queryKey: ["archived"]});
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });

    const { mutateAsync: deletedoc } = useMutation({
        mutationFn: deleteDocument,
        onError: () => {
            toast.error("Failed to delete the document.");
        },
        onSuccess: () => {
            toast.success("Document deleted successfully.");
            queryClient.invalidateQueries({queryKey: ["archived"]});
        },
    });

    const onDelete = async () => {
        try {
            await deletedoc({ documentId: documentId.toString() }); // Convertit documentId en chaîne
            router.push('/');
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const onRestore = async () => {
        try {
            await restore({ documentId: documentId.toString() }); // Convertit documentId en chaîne
        } catch (error) {
            console.error("Erreur lors de la restauration du document :", error);
        }
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                This page is in the Trash.
            </p>
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    );
}

export default Banner;
