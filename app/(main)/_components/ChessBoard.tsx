import React, { useState } from 'react';
import { Chess } from 'chess.js'; // import Chess from "chess.js" (default) if receiving an error about new Chess() not being a constructor
import Chessboard from 'chessboardjsx';

export default function ChessGame() {
  const [chess, setChess] = useState(new Chess()); // Instancie un nouvel objet Chess
  const [fen, setFen] = useState('start'); // État pour suivre la position actuelle de l'échiquier

  // Fonction pour gérer le déplacement des pièces
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
        width={500}
        position={fen} // Position actuelle de l'échiquier
        onDrop={onDrop} // Appelle la fonction onDrop lorsqu'un coup est joué
      />
        <button onClick={resetBoard} style={{ marginTop: '10px', padding: '10px' }}>
        Réinitialiser l'échiquier
      </button>
    </div>
  );
}
