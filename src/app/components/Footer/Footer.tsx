import Link from "next/link";

export default function Footer() {
  return (
<footer className="bg-gradient-to-t from-black via-gray-900 to-gray-900 py-12 text-gray-400">
<div className="container mx-auto px-4">
        {/* Topo do footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-8">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <img src="/img/logo.png" alt="FURIA Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-white">FURIA</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold mb-2">Sobre</h4>
              <Link href="/about" className="hover:text-white">Quem Somos</Link>
              <Link href="/team" className="hover:text-white">Nosso Time</Link>
              <Link href="/careers" className="hover:text-white">Carreiras</Link>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold mb-2">Suporte</h4>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/contact" className="hover:text-white">Contato</Link>
              <Link href="/support" className="hover:text-white">Ajuda</Link>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold mb-2">Legal</h4>
              <Link href="/privacy" className="hover:text-white">Privacidade</Link>
              <Link href="/terms" className="hover:text-white">Termos</Link>
              <Link href="/cookies" className="hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Rodapé final */}
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} FURIA Fan Chat. Projeto de fãs, sem afiliação oficial com FURIA Esports.
        </div>
      </div>
    </footer>
  );
}
