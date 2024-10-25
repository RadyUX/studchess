import { Button } from "@/components/ui/button";
import Logo from "./Logo";


const Footer = () => {
    return ( 
        <footer className="mt-[250px] flex items-center w-full p-6 bg-[#2E2E2E] z-50">
            <Logo></Logo>
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant="ghost">Privacy Policy</Button>
                <Button variant="ghost">Terms & Conditions</Button>
            </div>
        </footer>
     );
}
 
export default Footer;