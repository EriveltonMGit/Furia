import "./globals.css"; // Mantenha a importação global aqui ou no seu layout root

// Importe os componentes que você criou
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import FeaturesSection from "./components/FeaturesSection/FeaturesSection";
import BenefitsSection from "./components/BenefitsSection/BenefitsSection";
import CTASection from "./components/CTASection/CTASection";
import Footer from "./components/Footer/Footer";
import LatestNews from "./components/latest-news";


export default function Home() {
  return (
    <>
      <section className="relative z-30 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <LatestNews />
        <CTASection />
        
      </section>
      {/* O footer estava fora da seção principal  */}
      <Footer />
    </>
  );
}
