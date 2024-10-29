"use client"
import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import { useSession } from "next-auth/react";
const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) =>{
    const { data: session } = useSession();
  
    if(session?.user){
        redirect('/main')
    }
    return (
        <div className="h-full">
            <Navbar></Navbar>
            <main className="h-full pt-40">
                {children}
            </main>
        </div>
    )
}

export default LandingLayout