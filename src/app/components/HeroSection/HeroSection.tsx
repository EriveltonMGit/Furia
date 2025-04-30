import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import GradualSpacing from "../ui/gradual-spacing";

export default function HeroSection() {
  return (
    <>
      <section className="container  mx-auto py-2 text-center h-full mt-[20vh] z-0">
        <h1 className="font-proelium text-8xl sm:text-3xl md:text-7xl lg:text-8xl font-bold mb-6 top-[15vh] ">
          <GradualSpacing text="Desperte seu Potencial e conquiste o Reconhecimento que você merece" />
        </h1>

        <p className="font-Purista text-xl text-gray-300 max-w-3xl mx-auto mb-10 top-[15vh]">
          Compartilhe seu perfil como fã de esports e receba experiências e
          serviços exclusivos da FURIA, personalizados para você.
        </p>
        <Button
          size="lg"
          className="bg-[#00FF00] hover:bg-[#00CC00] text-white"
          asChild
        >
          <Link href="/register">
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </>
  );
}
