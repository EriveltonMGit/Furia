// // components/whatsappFloat/floating-whatsapp-button.tsx
// "use client";

// // Mantemos estes imports caso você adicione lógica que precise deles no futuro
// import { useState, useEffect } from "react";

// // ✅ Importe o ícone do WhatsApp do react-icons/fa (Font Awesome)
// // REMOVA A IMPORTAÇÃO QUE DAVA ERRO DO LUCIDE-REACT SE AINDA ESTIVER LÁ
// import { FaWhatsapp } from 'react-icons/fa';

// import { Button } from "../ui/button"; // Componente Button do seu projeto
// import { cn } from "../../lib/utils"; // Função utilitária para classes
// import Link from "next/link"; // Use next/link para navegação no Next.js

// // Importe seu hook de autenticação se o botão for protegido
// import { useAuth } from "../../contexts/AuthContext"; // <-- AJUSTE O CAMINHO SE NECESSÁRIO

// interface FloatingWhatsappButtonProps {
//   phoneNumber: string; // O número de telefone do WhatsApp com código do país (ex: 5511999998888)
//   position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
//   showAuthenticatedOnly?: boolean; // Opcional: controlar se só aparece para logados
//   // Propriedade className opcional mantida para ajuste de posição no layout
//   className?: string;
// }

// export default function FloatingWhatsappButton({
//   phoneNumber,
//   position = "bottom-right",
//   showAuthenticatedOnly = false,
//   className, // Receba a propriedade className
// }: FloatingWhatsappButtonProps) {
//   // Use o hook de autenticação APENAS se showAuthenticatedOnly for true
//   const { isAuthenticated, loading } = showAuthenticatedOnly ? useAuth() : { isAuthenticated: true, loading: false };


//   // Posicionamento do botão flutuante (as mesmas classes do seu exemplo)
//   const positionClasses = {
//     "bottom-right": "bottom-4 right-4",
//     "bottom-left": "bottom-4 left-4",
//     "top-right": "top-4 right-4",
//     "top-left": "top-4 left-4",
//   };

//   // --- LÓGICA DE PROTEÇÃO (Opcional) ---
//   if (showAuthenticatedOnly && loading) {
//     return null;
//   }

//   if (showAuthenticatedOnly && !isAuthenticated) {
//     return null;
//   }
//   // --- FIM DA LÓGICA DE PROTEÇÃO ---


//   // Se chegamos aqui, o botão deve ser exibido.
//   // Construa o URL do WhatsApp
//   const whatsappUrl = `https://wa.me/${phoneNumber}`;

//   return (
//     
//     <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
//      
//       <Button
//         className={cn(
//           "fixed z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-300", // Classes existentes (layout, tamanho, forma, sombra, transição)
//           "bg-[#25D366] hover:bg-[#1DA851] text-white", // Classes existentes (cores)
//           positionClasses[position], // Classe de posição padrão (bottom-4 right-4 etc)
//           className // ✅ Classe extra passada do componente pai para ajustar a posição fixa (ex: !bottom-20)
//         )}
//         aria-label="Chat via WhatsApp" // Rótulo de acessibilidade
//       >
//         {/* ✅ Use o componente do react-icons/fa para o ícone */}
//         {/* O ícone herdará a cor text-white e será dimensionado pelas classes da Button */}
//         <FaWhatsapp className="h-6 w-6" /> {/* Ícone do WhatsApp, tamanho definido pela Button */}
//       </Button>
//     </Link>
//   );
// }