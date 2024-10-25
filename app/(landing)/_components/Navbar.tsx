"use client"
import Logo from "./Logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Navbar = () => {
    const scrolled = useScrollTop()
    return ( 
        <div className={cn("z-50 bg-[#2E2E2E] fixed top-0 items-center flex w-full p-6 mb-10", scrolled && "border-b shadow-sm")}>
            
        <Logo>
        </Logo>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
              <Link href="sign-in">LOGIN</Link>
            </div>
        </div>
    );
}
 
export default Navbar;