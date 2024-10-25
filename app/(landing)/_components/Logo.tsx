import Image from "next/image"
import { cn } from "@/lib/utils"

const Logo = () => {
    return ( 
        <div className="hidden md:flex items-center gap-x-2">
                <p className={cn("font-semibold")}>STUD'CHESS</p>
               <Image src='/logo.svg' height={40} width={40} alt="logo" />
                
        </div>
     );
}
 
export default Logo;