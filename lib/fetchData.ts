export  const fetchUserRepertory = async (userId: string | null) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
  
    const response = await fetch(`/api/repertory`);
    if (!response.ok) {
      throw new Error("Failed the repertoire");
    }
  
    return response.json();
  }
  

  export const fetchOpening = async () => {
    console.log("Appel à fetchOpening");  // Tracez le point d'entrée
    try {
        const response = await fetch('/api/opening');
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        const data = await response.json();
        console.log("Données récupérées par fetchOpening :", data);
        return data;
    } catch (error) {
        console.error("Erreur dans fetchOpening :", error);
        throw error;  // Relancez l'erreur pour que `useQuery` la capte
    }
  };
  

  export const fetchDocumentId = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, { // Notez l'URL corrigée ici
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
  
      const data = await response.json();
      console.log("Document récupéré :", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du document :", error);
    }
  }
  