// components/chatFloat/floating-chat-button.tsx
"use client"; // Já está aqui

import { useState, useEffect } from "react";
import { MessageSquare, X, Loader2 } from "lucide-react"; // Importe Loader2 caso queira usar um loader
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import FloatingChatWindow from "./floating-chat-window";
import { useAuth } from "../../contexts/AuthContext"; // <-- IMPORTE SEU HOOK DE AUTENTICAÇÃO AQUI

interface FloatingChatButtonProps {
  initiallyOpen?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export default function FloatingChatButton({
  initiallyOpen = false,
  position = "bottom-right",
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // <-- USE SEU HOOK DE AUTENTICAÇÃO AQUI -->
  const { isAuthenticated, loading } = useAuth();

  // Posicionamento do botão flutuante
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  // Efeito para mostrar mensagem de boas-vindas após um tempo
  useEffect(() => {
    // Este efeito SÓ deve rodar se o usuário estiver autenticado E se for a primeira carga E o chat não abrir inicialmente
    if (!loading && isAuthenticated && isFirstLoad && !initiallyOpen) {
      const timer = setTimeout(() => {
        setHasUnreadMessages(true);
      }, 5000);

      setIsFirstLoad(false);
      return () => clearTimeout(timer);
    }

    // Se o usuário não está autenticado após carregar, garante que não há mensagens não lidas ou janela aberta
    if (!loading && !isAuthenticated) {
        setHasUnreadMessages(false);
        setIsOpen(false); // Garante que a janela está fechada se o usuário deslogar ou não estiver logado
    }

  }, [isFirstLoad, initiallyOpen, loading, isAuthenticated]); // <-- ADICIONE loading e isAuthenticated como dependências

  // Resetar indicador de mensagens não lidas quando o chat é aberto
  useEffect(() => {
    // Só reseta se o chat abrir E o usuário estiver autenticado
    if (isOpen && isAuthenticated) {
      setHasUnreadMessages(false);
    }
  }, [isOpen, isAuthenticated]); // <-- ADICIONE isAuthenticated como dependência

  // --- LÓGICA DE PROTEÇÃO DA ROTA/COMPONENTE ---
  // Se o estado de autenticação ainda está carregando, não renderiza nada
  if (loading) {
    // Opcional: Você pode retornar um pequeno spinner aqui se o posicionamento não atrapalhar
    return null;
  }

  // Se o usuário NÃO está autenticado após o carregamento, não renderiza nada (nem botão, nem janela)
  if (!isAuthenticated) {
    return null;
  }
  // --- FIM DA LÓGICA DE PROTEÇÃO ---


  // Se chegamos aqui, significa que loading é false E isAuthenticated é true.
  // O usuário está logado, então renderizamos o botão e a janela.
  return (
    <>
      {/* Botão flutuante - Só é renderizado se o usuário está autenticado */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-300",
          positionClasses[position],
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#00FF00] hover:bg-[#00DD00]", // Corrigido um possível typo aqui ]
        )}
        aria-label={isOpen ? "Fechar Chat" : "Abrir Chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 text-black" />
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse"> {/* Adicionado animate-pulse */}
                1
              </span>
            )}
          </div>
        )}
      </Button>

      {/* Janela de chat flutuante - Só é renderizada se o usuário está autenticado */}
      {isAuthenticated && <FloatingChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}