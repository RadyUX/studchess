
"use client"
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";
import CardsElo from "../../_components/CardsElo";
import CardsOpening from "../../_components/CardsOpening";


import Chessboard from "../../_components/ChessBoard";
import Link from "next/link";



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

 
const DocumentPage = () => {


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

    return ( 
      <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-medium p-6">
        {session?.user.chesscomUsername}'s Chess Tracker ! 
      </h2>
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
        <div className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold mb-4">My Repertory  <Button variant="white">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Opening
        </Button></h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            <CardsOpening />
            <CardsOpening />
            <CardsOpening />
            <CardsOpening />
          </div>
        </div>
      </div>
    
      {documents.length === 0 && (
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" /> Write your first analysis
        </Button>
       
      )}
        <Chessboard />

    </div> );
}
 
export default DocumentPage;

