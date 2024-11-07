// components/OpeningPopup.js

import React, { useState } from 'react';
import ChessGame from './ChessBoard';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal } from './ConfirmDialog';
import { Trash, X } from 'lucide-react';
import { removeVariation } from '@/actions/icon';
import { useRouter } from 'next/navigation';




const OpeningPopup = ({ title, openingId, variants, onClose }) => {
    const [addVariant, setAddVariant] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleAddNewVariation = async (event) => {
        event.preventDefault();

        // Utiliser FormData pour collecter les données du formulaire
        const formData = new FormData(event.target);
        formData.append('openingId', openingId); // Ajouter l'ID de l'ouverture

        // Créer un objet JSON à partir des données de FormData
        const newVariant = {
            moves: formData.get('moves'),
            notes: formData.get('notes'),
            openingId: formData.get('openingId'),
        };

        try {
            const response = await fetch('/api/variation', {
                method: 'POST',
                body: JSON.stringify(newVariant),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log(newVariant)
                throw new Error("Erreur lors de l'ajout de la variante");
            }

            console.log("Nouvelle variante ajoutée :", newVariant);
            // @ts-expect-error xxxdxds
            queryClient.invalidateQueries(["variation", openingId]);
            // Fermer le formulaire après succès
            setAddVariant(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la variante :", error);
        }
    };

 


    const deleteOpening = useMutation({
        mutationFn: async(openingId) =>{
            const response = await fetch("/api/opening", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ openingId }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete opening");
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
          console.log("Opening deleted:", data);
          // Mettez à jour le cache si nécessaire
    queryClient.invalidateQueries({queryKey: ['repertory']})
        },
    })
    const onDeleteOpening = (openingId) => {
        deleteOpening.mutate(openingId);
       router.push('/')
    }

    const onDelete = (varitantId) =>{
       removeVariation(varitantId)
        router.push('/')
    }
    const handleAddVariant = () =>{
        setAddVariant(true)
    }

    
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-[#2E2E2E] p-6  rounded-lg shadow-lg w-[1000x] ">
               <div className='flex justify-center '>
                <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
                <ConfirmModal onConfirm={() => onDeleteOpening(openingId)}>
                <Button className='bg-transparent'><X/></Button>
               </ConfirmModal>
                </div>
                   <button 
                    onClick={handleAddVariant} 
                    className="w-full border-2 border-gray-400 p-2 rounded-lg mb-6 text-gray-600 hover:bg-gray-100"
                >
                    + Nouvelle Variante
                </button>

<div className='flex flex-col md:flex-row justify-around space-x-5'>
             
                {/* Liste des Variantes */}
                <div className="space-y-4">
               

                <div className='grid grid-cols-1 max-h-[600px] overflow-y-scroll gap-y-4'>
                {
                    addVariant && (
                        <form onSubmit={handleAddNewVariation} className="p-4 border border-gray-200 rounded-lg">
                        <h2 className='text-center'>Ajouter une Nouvelle Variante</h2>
                        <div className="flex flex-col gap-3 mt-4">
                            <label>Coups de la variante:</label>
                            <input
                                type="text"
                                name="moves"
                                placeholder="Ex: d4 f5 Cf3 Cf6"
                                required
                                className="p-4 rounded-lg w-full text-black"
                            />
                        </div>
                        <div className="flex flex-col gap-3 mt-4">
                            <label>Notes:</label>
                            <textarea
                                name="notes"
                                placeholder="Ex: Variante Leningrad, un système dynamique et agressif."
                                required
                                className='p-4 rounded-lg w-full text-black'
                            />
                        </div>

                        <Button variant="white" type="submit" className="m-4">Enregistrer</Button>
                        <Button variant="destructive" className="m-4" type="button" onClick={() => setAddVariant(false)} >Annuler</Button>
                        
                    </form>
                    )
                }
              
                    {variants.map((variant, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg ">
                            <p className="font-semibold">Coup de la variante:</p>
                            <p>{variant.moves}</p>
                            <p className="font-semibold mt-2">Note:</p>
                            <p>{variant.notes || "Write your idea"}</p>
                            <ConfirmModal onConfirm={() => onDelete(variant.id)}>
                            <div
                                    role="button"
                                    className="rounded-full w-10 h-10 mt-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 flex justify-center items-center"
                                >
                                    <Trash className="h-5 w-5 text-white" />
                                </div>
                            </ConfirmModal>
                          
                        </div>
                    ))}
                    </div>
                </div>
               
  <div className='hidden md:block'>        
<ChessGame/>
</div>     
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
};

export default OpeningPopup;
