// src/components/Footer.tsx
"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTwitch,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-900 py-12 text-gray-400">
      <div className="container mx-auto px-4 space-y-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-8 gap-6">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="FURIA Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-white">FURIA</span>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Sobre</h4>
              <Link href="/about" className="block hover:text-white">Quem Somos</Link>
              <Link href="/team" className="block hover:text-white">Nosso Time</Link>
              <Link href="/careers" className="block hover:text-white">Carreiras</Link>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold">Suporte</h4>
              <Link href="/faq" className="block hover:text-white">FAQ</Link>
              <Link href="/contact" className="block hover:text-white">Contato</Link>
              <Link href="/support" className="block hover:text-white">Ajuda</Link>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold">Legal</h4>
              <Link href="/privacy" className="block hover:text-white">Privacidade</Link>
              <Link href="/terms" className="block hover:text-white">Termos</Link>
              <Link href="/cookies" className="block hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Social + small print */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} FURIA CS:GO. Projeto de fãs, sem afiliação oficial com FURIA Esports.
          </p>

          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/furiaesports"
              target="_blank"
              rel="noreferrer"
              aria-label="FURIA Esports no Facebook"
            >
              <FaFacebookF className="h-5 w-5 hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/furia"
              target="_blank"
              rel="noreferrer"
              aria-label="FURIA Esports no Instagram"
            >
              <FaInstagram className="h-5 w-5 hover:text-white transition-colors" />
            </a>
            <a
              href="https://twitter.com/furia"
              target="_blank"
              rel="noreferrer"
              aria-label="FURIA Esports no Twitter"
            >
              <FaTwitter className="h-5 w-5 hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.youtube.com/c/FURIAesports"
              target="_blank"
              rel="noreferrer"
              aria-label="FURIA Esports no YouTube"
            >
              <FaYoutube className="h-5 w-5 hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.twitch.tv/furiagg"
              target="_blank"
              rel="noreferrer"
              aria-label="FURIA Esports na Twitch"
            >
              <FaTwitch className="h-5 w-5 hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}