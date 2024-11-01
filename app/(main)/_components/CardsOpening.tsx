// components/CardsOpening.js

import Image from 'next/image';
import React from 'react';
import { useState , useEffect} from 'react';
import OpeningPopup from './OpeningModal';


const CardsOpening = ({ name, image, status, onClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const sampleVariants = [
      { moves: "e4 e5 Nf3 Nc6 Bb5", notes: "Attention au coup d3 pour éviter le piège." },
      { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6", notes: "Variante classique de la défense sicilienne." }

  ]

  useEffect(() => {
    console.log("État de isPopupOpen après mise à jour:", isPopupOpen);
  }, [isPopupOpen]); // Ce useEffect se déclenche chaque fois que isPopupOpen change

  const handleOpenPopup = (e) => {
    e.stopPropagation(); // Empêche les événements de propagation pour éviter les boucles
    console.log("Ouverture du popup");
    setIsPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    e.stopPropagation(); // Empêche la propagation pour éviter de réouvrir le popup
    console.log("Fermeture du popup");
    setIsPopupOpen(false);
  };

    const statusLabels = {
        TO_LEARN: 'À apprendre',
        LEARNING: 'En cours',
        MASTERED: 'Maîtrisé',
    };

    const statusColors = {
        TO_LEARN: 'bg-[#002c44]',
        LEARNING: 'bg-[#0077B6]',
        MASTERED: 'bg-[#62c5fa]',
    };

    return (
      
      <div  onClick={onClick} className="cursor-pointer w-full max-w-[14rem] sm:max-w-[16rem] md:max-w-[18rem] lg:max-w-[20rem] xl:max-w-[24rem] bg-[#B8D4E3] rounded-lg p-4 m-2 aspect-square flex flex-col justify-between items-center">
            
           
      <h3 className="text-lg font-semibold text-center text-[#0077B6] ">{name}</h3>
      

      <div className="relative w-full h-full  rounded-lg">
          <Image 
              src={image} 
            width={500}
            height={500}
              objectFit="cover"
              alt={`${name} image`} 
          />
      </div>

      {/* Affichage du statut */}
      <span className={`text-white font-semibold py-1 px-3 rounded-full mt-4 ${statusColors[status]}`}>
          {statusLabels[status]}
      </span>
  </div>
    );
};

export default CardsOpening;
