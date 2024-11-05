"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"

const Error = () => {
    return (  

        <div>
            Something Went Wrong ! 
            <Button><Link href="/">Go back</Link></Button>
        </div>
    );
}
 
export default Error;