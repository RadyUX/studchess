"use server";
import { auth } from "@/auth";
import { db } from "@/db"; // Assurez-vous que db est correctement importé


export const removeCover = async (documentId) =>{
    try {
        const session = await auth();
        if (!session) {
          throw new Error("Not authenticated");
        }
    
        const userId = session.user.id; // Vérifiez que l'utilisateur est propriétaire du document
    
        // Mettez le champ icon à null pour supprimer l'icône
        const updatedDocument = await db.document.update({
          where: {
            id: documentId, // Utilisez le champ `id` pour identifier le document
            userId: userId, // Assurez-vous que seul le propriétaire peut modifier
          },
          data: {
            coverImage: null, // Supprimez l'icône en la mettant à `null`
          },
        });
    
        return updatedDocument;
      } catch (error) {
        console.error("Erreur lors de la suppression de limage :", error);
        throw new Error("Erreur lors de la suppression de l'image");
      }

}
export const removeIcon = async (documentId) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id; // Vérifiez que l'utilisateur est propriétaire du document

    // Mettez le champ icon à null pour supprimer l'icône
    const updatedDocument = await db.document.update({
      where: {
        id: documentId, // Utilisez le champ `id` pour identifier le document
        userId: userId, // Assurez-vous que seul le propriétaire peut modifier
      },
      data: {
        icon: null, // Supprimez l'icône en la mettant à `null`
      },
    });

    return updatedDocument;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'icône :", error);
    throw new Error("Erreur lors de la suppression de l'icône");
  }
};
