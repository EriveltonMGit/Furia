import Link from "next/link";
import { Button } from "../ui/button"; // Importe do local correto na sua pasta ui

export default function CTASection() {
  return (
    <section className="container mx-auto py-16 text-center">
      <div className="bg-gradient-to-r from-[#1f2937] to-[#1f2937] rounded-xl p-12">
        <h3 className="text-3xl font-bold mb-4 font-Purista">
          Pronto para se Conectar?
        </h3>
        <p className="text-xl mb-8 max-w-2xl mx-auto font-Purista">
          Junte-se à comunidade de fãs da FURIA e tenha acesso a
          experiências exclusivas personalizadas para você.
        </p>
        <Button
          size="lg"
          className="bg-white text-[#00FF00] hover:bg-gray-100"
          asChild
        >
          <Link href="/register">Criar Meu Perfil</Link>
        </Button>
      </div>
    </section>
  );
}