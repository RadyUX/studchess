
"use client"
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";
import CardsElo from "../../_components/CardsElo";
import CardsOpening from "../../_components/CardsOpening";
import { useState } from "react";

import Chessboard, { fetchFen } from "../../_components/ChessBoard";
import Link from "next/link";
import OpeningListModal from "../../_components/OpeningListModal";
import OpeningPopup from "../../_components/OpeningModal";



//fetch user documents
const fetchDocuments = async (userId: string | null) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/documents`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

 //fetch user elo
 const fetchChessRating = async (chesscomusername) => {
  console.log("Fetching rating for username:", chesscomusername); // Log pour vérifier le username
  if (!chesscomusername) {
    throw new Error("No Chess.com username provided");
  }

  const url = `https://api.chess.com/pub/player/${chesscomusername}/stats`;
  console.log("Fetching URL:", url); // Log pour vérifier l'URL

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch Chess.com stats", response.status);
    throw new Error("Failed to fetch Chess.com stats");
  }



  const data = await response.json();
  return {
    bullet: data.chess_bullet?.last?.rating || "N/A",
    blitz: data.chess_blitz?.last?.rating || "N/A",
    rapid: data.chess_rapid?.last?.rating || "N/A",
  };
};




const openings = [
  {
    name: 'Ruy Lopez Opening',
    image: '/ruylopez.jpg',
    status: 'TO_LEARN',
  },
  {
    name: 'Sicilian Defense',
    image: '/sicilian.jpg',
    status: 'LEARNING',
  },
  {
    name: 'Caro Kann Defense',
    image: '/carokann.jpg',
    status: 'LEARNING',
  },
  // Ajoute plus d'ouvertures ici
];


export const fetchUserRepertory = async (userId: string | null) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/repertory`);
  if (!response.ok) {
    throw new Error("Failed the repertoire");
  }

  return response.json();
}
const DocumentPage = () => {
const [isModal, setIsModal] = useState(false)
const [isPopupOpen, setIsPopupOpen] = useState(false);



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

const sampleVariants = [
  { moves: "e4 e5 Nf3 Nc6 Bb5", notes: "Attention au coup d3 pour éviter le piège." },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6", notes: "Variante classique de la défense sicilienne." }

]

    const { data: session } = useSession();
    const queryClient = useQueryClient();
  //  vérifie s'il y a des documents existants
  const { data: documents = [], isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: () => fetchDocuments(session?.user.id),
    enabled: !!session?.user.id, // Active la requête seulement si l'utilisateur est connecté
  });

    const createMutation = useMutation({
        mutationFn: async (newDocument) => {
          const response = await fetch("/api/documents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDocument),
          });
      
          if (!response.ok) {
            throw new Error("Failed to create document");
          }
      
          return response.json();
        }, onSuccess: () => {
          queryClient.invalidateQueries(["documents"]);
        },
      });
    
      const onCreate = () => {
        if (!session) {
          alert("You must be logged in to create a document");
          return;
        }
    
        const promise = createMutation.mutateAsync({ title: "Untitled" },
          
        );
    
   
        toast.promise(promise, {
          loading: "Creating Analysis...",
          success: "New note created!",
          error: "Failed to create ",
        });
      };


     
      const { data: ratings = { bullet: "N/A", blitz: "N/A", rapid: "N/A" }} = useQuery({
        queryKey: ["chessRating", session?.user.chesscomUsername],
        queryFn: () => fetchChessRating(session?.user.chesscomUsername),
  
      })

      const { data: fens = [], isLoading: isLoadingFens, error: errorFens } = useQuery({
        queryKey: ['fetchFen', session?.user.chesscomUsername],
        queryFn: () => fetchFen(session?.user.chesscomUsername),
        enabled: !!session?.user.chesscomUsername,
      });
      
  // Utilisez React Query pour récupérer les ouvertures du répertoire de l'utilisateur
  const { data: repertory} = useQuery({
    queryKey: ['userRepertory', session?.user.id],
    queryFn: () => fetchUserRepertory(session?.user.id),
    enabled: !!session?.user.id, // Active la requête seulement si l'utilisateur est connecté
  });

  

  const openings = repertory?.openings || [];
  
      const handleModal = (e) =>{
        e.stopPropagation()
        setIsModal(true)
      }
      const handleClose = (e) =>{
        e.stopPropagation()
        setIsModal(false)
      }
    

      
    
    
    return ( 
      <div className="h-full ml-28 flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-medium p-6">
        {session?.user.chesscomUsername}'s Chess Tracker ! 
      </h2>
      {documents.length === 0 && (
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" /> Write your first analysis
        </Button>
       
      )}
      <div className="flex flex-col w-full">
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">Objectif</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardsElo title="Objectif Bullet 🔥" elo={ratings.bullet} eloObjectif={session?.user.eloBullet}/>
            <CardsElo title="Objectif Blitz ⚡ " elo={ratings.blitz} eloObjectif={session?.user.eloBlitz}/>
            <CardsElo title="Objectif Rapid ⏰" elo={ratings.rapid} eloObjectif={session?.user.eloRapid}/>
          </div>
          <Button variant='white' className="p-6 text-[16px] m-2"><Link href="https://www.chess.com/home"> Play a Game ♟</Link></Button>
        </div>
        {isModal && (
               <OpeningListModal onClose={handleClose} />
            )}
             {isPopupOpen && (
                <OpeningPopup
                    title="Ruy Lopez Opening" 
                    variants={sampleVariants} 
                    onClose={handleClosePopup}
                    onAddVariant={() => console.log("Ajouter une nouvelle variante")}
                />
            )}
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">My Repertoire  <Button variant="white" onClick={handleModal}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Opening
        </Button></h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {openings.length > 0 ? (
              openings.map((opening) => (
                <CardsOpening
                  key={opening.name}
                  name={opening.name}
                  image={opening.image}
                  status={opening.status}
                  onClick={handleOpenPopup}
                />
              ))
            ) : (
              <p>Pas d'ouverture dans votre répertoire</p>
            )}

          </div>
        </div>
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">My Games</h1>
          <div className="flex gap-20">
          {isLoadingFens ? (
              <p>Loading games...</p>
            ) : errorFens ? (
              <p>Error: {errorFens.message}</p>
            ) : (
              fens.slice(0, 3).map((fen, index) => (
                <Chessboard key={index} initialFen={fen} />
              ))
            )}
          </div>
        </div>
      </div>
    
       
    </div> );
}
 
export default DocumentPage;

