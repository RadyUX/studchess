// components/OpeningPopup.js

import React, { useState } from 'react';
import ChessGame from './ChessBoard';
import { Button } from '@/components/ui/button';

const OpeningPopup = ({ title, openingId, variants, onClose, onAddVariant }) => {
    const [addVariant, setAddVariant] = useState(false)

    const handleAddVariant = () =>{
        setAddVariant(true)
    }
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-[#2E2E2E] p-6  rounded-lg shadow-lg w-[1000x]">
                {/* Titre de l'ouverture */}
                <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
                   {/* Bouton Ajouter une Nouvelle Variante */}
                   <button 
                    onClick={handleAddVariant} 
                    className="w-full border-2 border-gray-400 p-2 rounded-lg mb-6 text-gray-600 hover:bg-gray-100"
                >
                    + Nouvelle Variante
                </button>

<div className='flex justify-around space-x-5'>
             
                {/* Liste des Variantes */}
                <div className="space-y-4">
                {
                    addVariant && (
                        <form onSubmit={onAddVariant} className="p-4 border border-gray-200 rounded-lg">
                        <h2 className='text-center'>Ajouter une Nouvelle Variante</h2>
                        <div className="flex flex-col gap-3 mt-4">
                            <label>Coups de la variante:</label>
                            <input
                                type="text"
                                name="moves"
                                placeholder="Ex: d4 f5 Cf3 Cf6"
                                required
                                className="p-4 rounded-lg w-full"
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
                        <Button variant="destructive" className="m-4" type="button" onClick={() => setAddVariant(false)} className="cancel-button">Annuler</Button>
                    </form>
                    )
                }
                    {variants.map((variant, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <p className="font-semibold">Coup de la variante:</p>
                            <p>{variant.moves}</p>
                            <p className="font-semibold mt-2">Note:</p>
                            <p>{variant.notes || "Write your idea"}</p>
                        </div>
                    ))}
                </div>
               
               
<ChessGame/>
</div>
                {/* Bouton de fermeture */}
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