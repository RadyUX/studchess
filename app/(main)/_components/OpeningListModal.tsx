import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/db";
import CardsOpening from "./CardsOpening";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { fetchUserRepertory } from "../(routes)/main/page";

const fetchOpening = async () =>{
    

      const response = await fetch(`/api/opening`);
      if (!response.ok) {
        throw new Error("Failed to fetch openings");
      }
    
      return response.json()
  }
  


const OpeningListModal = ({onClose}) => {
    
    const { data: session } = useSession();
    const queryClient = useQueryClient();
   
    // Utilisez React Query pour récupérer les ouvertures du répertoire de l'utilisateur
  const { data: repertory} = useQuery({
    queryKey: ['userRepertory', session?.user.id],
    queryFn: () => fetchUserRepertory(session?.user.id),
    enabled: !!session?.user.id, // Active la requête seulement si l'utilisateur est connecté
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
        onSuccess: () => {
            queryClient.invalidateQueries(['userRepertory', session?.user.id]);
        },
      });

      const { data: openings = [], isLoading, isError } = useQuery({
        queryKey: ["openings"],
        queryFn: () => fetchOpening(),
      });
    

      if (isLoading) return <p>Chargement des ouvertures...</p>;
      if (isError) return <p>Erreur lors du chargement des ouvertures</p>;

  

    
      const addOpening = (openingId) => {
        if (!session?.user.id) {
          alert("You must be logged in to update your repertory");
          return;
        }
        console.log("added")
        const repertoryId = repertory.id
    
        const updatedRepertory = {
          repertoryId: repertoryId, // Assurez-vous que vous avez l'ID du répertoire
          openingId, // ID de l'ouverture à ajouter
        };
      

       
          
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