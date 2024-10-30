import ProgressRound from "./ProgressRound";

interface CardsEloProps{
  title: string;
  elo: number;
  eloObjectif: number;
}

const CardsElo = ({title, elo, eloObjectif}: CardsEloProps) => {
    return (
      <>
      <div className="w-full flex justify-between max-w-xs sm:max-w-sm md:max-w-md h-40 lg:max-w-lg bg-[#B8D4E3] rounded-lg p-4 m-2">
        <div>
        <h1 className="ml-4 mt-4 text-2xl text-[#0077B6] font-medium">{title}</h1>
        <p className="ml-4 mt-2 font-bold text-[#0077B6] text-xl">{elo} / {eloObjectif} elo</p>
        </div>
        <div>
        <ProgressRound elo={elo} eloGoal={eloObjectif}/>
        </div>
      </div>
   
      </>
    );
  };
  
  export default CardsElo;
  