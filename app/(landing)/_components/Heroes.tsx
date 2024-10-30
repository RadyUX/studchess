import { Pencil } from "lucide-react";
import Image from "next/image"


const Heroes = () => {
    return ( 
    <div className="flex flex-col items-center justify-center max-w-5xl">
        <div className="flex flex-col items-center">
            <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
                <Image src='/chess.png' fill className="object-contain" alt="chess" />
            </div>
            <div className="flex justify-between gap-16">
                <h1 className="font-bold text-xl">📃 Write Your Own Analysis</h1>
                <h1 className="font-bold text-xl">🔨 Build Your Repertory</h1>
                <h1 className="font-bold text-xl">🔥 Follow Your Progress</h1>
            </div>


        </div>


    </div> );
}
 
export default Heroes;