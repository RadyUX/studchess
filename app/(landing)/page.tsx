import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";
import Footer from "./_components/Footer";
import ParticleBackground from "./_components/Background";


export default function Home() {
  return (
    <>
    <ParticleBackground />
    <div className="min-h-full flex flex-col">
    <div className="flex flex-col items-center justify-center md:justify-start
    text-center gap-y-8 flex-1 px-6 pb-20 mt-10">
      <Heading></Heading>
      <Heroes></Heroes>
    
      <Footer />
    </div>
  </div>
  </>  
  );
}
