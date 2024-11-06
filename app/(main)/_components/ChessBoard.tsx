import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js'; // import Chess from "chess.js" (default) if receiving an error about new Chess() not being a constructor

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

 
const Chessboard = dynamic(() => import('chessboardjsx'), { ssr: false });

export default function ChessGame({ initialFen = 'start' }) {
    
    const [chess, setChess] = useState(null); // Instancie un nouvel objet Chess
    const [fen, setFen] = useState(initialFen); // État pour suivre la position actuelle de l'échiquie
    const [boardWidth, setBoardWidth] = useState(500)
    
    useEffect(() => {
      if (typeof window !== 'undefined') {
        setChess(new Chess());
      }
    }, []);

    useEffect(() => {
      const updateBoardWidth = () => {
        // Définit la largeur comme 90% de la largeur de l'écran, jusqu'à une taille maximale (ex. : 500px)
        setBoardWidth(Math.min(window.innerWidth * 0.9, 500));
      };
  
      // Met à jour la largeur au chargement de la page et lors du redimensionnement
      updateBoardWidth();
      window.addEventListener('resize', updateBoardWidth);
  
      // Nettoie l'événement lorsque le composant est démonté
      return () => window.removeEventListener('resize', updateBoardWidth);
    }, []);

    

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // Vérifier si le mouvement est légal avant de l'appliquer
    const moves = chess.moves({ square: sourceSquare, verbose: true });
    const validMove = moves.find(
      (move) => move.from === sourceSquare && move.to === targetSquare
    );

    if (!validMove) {
      // Si le coup est illégal, ne faites rien, l'échiquier reste dans sa position actuelle
      console.log('Coup illégal');
      return;
    }

    // Si le coup est légal, l'appliquer avec chess.js
    chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Promotion par défaut en Reine
    });

    // Mettre à jour l'état pour refléter la nouvelle position
    setFen(chess.fen());
  };

    // Fonction pour réinitialiser l'échiquier
    const resetBoard = () => {
        const newChess = new Chess(); // Crée une nouvelle instance de Chess pour réinitialiser
        setChess(newChess); // Met à jour l'état avec le nouvel objet Chess
        setFen('start'); // Réinitialise la position FEN à la position de départ
      };
    

  return (
    <div>
      <Chessboard
        width={boardWidth}
        position={fen} // Position actuelle de l'échiquier
        onDrop={onDrop} // Appelle la fonction onDrop lorsqu'un coup est joué
      />
        <button onClick={resetBoard} style={{ marginTop: '10px', padding: '10px' }}>
        Réinitialiser l'échiquier
      </button>
    </div>
  );
}
