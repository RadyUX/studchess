
import { useQuery } from "@tanstack/react-query";

import CardsOpening from "./CardsOpening";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { fetchOpening } from "@/lib/fetchData";
import { fetchUserRepertory } from "@/lib/fetchData";



const fetchOpeningVariations = async (openingId: string | undefined) => {
  console.log("opening id", openingId)
 try {
   const response = await fetch(`/api/variation?openingId=${openingId}`, {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
     },
   });

   if (!response.ok) {
     throw new Error("Failed to fetch opening variations");
   }

   const data = await response.json();
   console.log("Variations récupérées :", data);
   return data;
 } catch (error) {
   console.error("Erreur lors de la récupération des variantes :", error);
 }
};





const OpeningListModal = ({onClose}) => {
    
    const { data: session } = useSession();
    const queryClient = useQueryClient();
   

  const { data: repertory} = useQuery({
    queryKey: ['userRepertory', session?.user.id],
    queryFn: () => fetchUserRepertory(session?.user.id),
    enabled: !!session?.user.id,
  });

  

      const updateRepertory = useMutation({
        mutationFn: async (updatedRepertory) => {
          const response = await fetch("/api/repertory", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRepertory),
          });
    
          if (!response.ok) {
            throw new Error("Failed to update repertory");
          }
    
          return response.json();
        },
        onSuccess: () => {// @ts-ignore
            queryClient.invalidateQueries(['userRepertory', session?.user.id]);
        },
      });

      const { data: openings = [], isLoading, isError } = useQuery({
        queryKey: ["openings"],
        queryFn: () => fetchOpening(),
        staleTime: 0,  
        enabled: true, // Marque les données comme obsolètes immédiatement
        
      });
    

      const { data: variation = [], isLoading: isLoadingVariations, isError: isErrorVariations } = useQuery({
        queryKey: ["variation", openings?.id],
        queryFn: () => fetchOpeningVariations(openings?.id),
        enabled: !!openings?.id, // Assurez-vous que `opening.id` est défini avant d'appeler cette requête
      })
      if (isLoading) return <p>Chargement des ouvertures...</p>;
      if (isError) {
        console.error("Erreur rencontrée:", isError);
        return <p>Erreur lors de la récupération des données.</p>;
    }


      if ( isLoadingVariations) return <p>Chargement  des variantes...</p>;
      if (isErrorVariations) return <p>Erreur lors du chargement des variantes</p>;

  
    
      const addOpening = (openingId) => {
        if (!session?.user.id) {
          alert("You must be logged in to update your repertory");
          return;
        }
        console.log("added")
        const repertoryId = repertory.id
    
        const updatedRepertory = {
          repertoryId: repertoryId,
          openingId, 
        };
      

       
          // @ts-ignore
        updateRepertory.mutate(updatedRepertory);

        
      };
    return (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll">
        <div className="bg-[#2E2E2E] p-6 rounded-lg shadow-lg w-[999px]">
            <h1 className="text-2xl text-center font-medium text-white">Add An Opening</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 max-h-[900px] overflow-y-scroll">
          {openings.map((opening) => (
         
         
            <CardsOpening key={opening.id} name={opening.name} image={opening.image} status={opening.status} onClick={() => addOpening(opening.id)}/>
           
          ))}
        {variation.map((variant) => (
  <div key={variant.id}>{variant.note}</div>
))}

          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          >
            Fermer
          </button>
         
        </div>
      </div>
        
    

        
      );
}
 
export default OpeningListModal;