import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div>
        <HeroSection/>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
}
