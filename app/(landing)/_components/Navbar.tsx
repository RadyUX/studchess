"use client"
import Logo from "./Logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession, signOut} from "next-auth/react";
const Navbar = () => {
    
    const { data: session, status } = useSession();
    const scrolled = useScrollTop()
    
    if (status === "loading") {
        return <p>Loading...</p>;
      }
    
      if (!session) {
        return (<><div className={cn("z-50 bg-[#2E2E2E] fixed top-0 items-center flex w-full p-6 mb-10", scrolled && "border-b shadow-sm")}>
            <Logo></Logo>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <p>have an account ?</p>
            <Link href="/sign-in">LOGIN</Link> 
           </div>
           </div>
          
           </>);
      }

    return ( 
        <div>
        
  
        {session && (
          <div className={cn("z-50 bg-[#2E2E2E] fixed top-0 items-center flex w-full p-6 mb-10", scrolled && "border-b shadow-sm")}>
               <Logo></Logo>
            <h1>Bienvenue, {session.user.name}!</h1>
            <p>Email: {session.user.email}</p>
            <p>Elo Bullet: {session.user.eloBullet || "N/A"}</p>
            <p>Elo Blitz: {session.user.eloBlitz || "N/A"}</p>
            <p>Elo Rapid: {session.user.eloRapid || "N/A"}</p>
            <p>Pseudo Chess.com: {session.user.chesscomUsername || "N/A"}</p>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
               <button onClick={() => signOut()}>Se déconnecter</button>
           </div>
          </div>
        )}
      </div>
    );
}
 
export default Navbar;