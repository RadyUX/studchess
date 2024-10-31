// components/OpeningPopup.js

import React from 'react';
import ChessGame from './ChessBoard';

const OpeningPopup = ({ title, variants, onClose, onAddVariant }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-[#2E2E2E] p-6  rounded-lg shadow-lg w-[1000x]">
                {/* Titre de l'ouverture */}
                <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
                   {/* Bouton Ajouter une Nouvelle Variante */}
                   <button 
                    onClick={onAddVariant} 
                    className="w-full border-2 border-gray-400 p-2 rounded-lg mb-6 text-gray-600 hover:bg-gray-100"
                >
                    + Nouvelle Variante
                </button>

<div className='flex justify-around space-x-5'>
             
                {/* Liste des Variantes */}
                <div className="space-y-4">
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
