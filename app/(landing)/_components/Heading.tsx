"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link'
const Heading = () => {
    return ( 
        <div className="max-w-3xl space-y-4">
            <h1 className="mb-10 text-5xl sm:text-5xl md:text-6xl font bold">
            <span className=" text-[100px] ">STUD'<b className="text-[#0077B6] border-b-[10px]  border-white">Chess</b></span>  <br /><br /> Your Personal <b className="text-[#0077B6]">Chess ♟</b> Learning Tracker 
            </h1>
            <h3 className=" text-base sm:text-xl md:text-3xl font mb-10  medium">
            Your ally to improve in chess
            </h3>
            <Button variant='white' className="p-6 text-[18px]">
                <b><Link href='sign-up'>Enter Stud'Chess</Link></b>
                <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
        </div>
     );
}
 
export default Heading;