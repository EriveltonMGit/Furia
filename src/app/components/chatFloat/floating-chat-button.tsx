// components/chatFloat/floating-chat-button.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import FloatingChatWindow from "./floating-chat-window";
import { useAuth } from "../../contexts/AuthContext";

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

  const { isAuthenticated, loading } = useAuth();

  // Posicionamento base do botão flutuante (desktop/tablet)
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  // Efeito para mostrar mensagem de boas-vindas após um tempo
  useEffect(() => {
    if (!loading && isAuthenticated && isFirstLoad && !initiallyOpen) {
      const timer = setTimeout(() => {
        setHasUnreadMessages(true);
      }, 5000);

      setIsFirstLoad(false);
      return () => clearTimeout(timer);
    }

    if (!loading && !isAuthenticated) {
        setHasUnreadMessages(false);
        setIsOpen(false);
    }

  }, [isFirstLoad, initiallyOpen, loading, isAuthenticated]);

  // Resetar indicador de mensagens não lidas quando o chat é aberto
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setHasUnreadMessages(false);
    }
  }, [isOpen, isAuthenticated]);

  // --- LÓGICA DE PROTEÇÃO DA ROTA/COMPONENTE ---
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }
  // --- FIM DA LÓGICA DE PROTEÇÃO ---

  // Determina classes de posicionamento responsivas
  let responsivePositionClasses = positionClasses[position];

  // Se a posição começar com 'bottom', adiciona uma classe bottom maior para mobile
  if (position.startsWith("bottom")) {
      // Isso adiciona 'bottom-20' para mobile e 'md:bottom-4' para md e acima.
      // O 'bottom-4' original de positionClasses[position] será sobrescrito por 'bottom-20' em mobile
      // e por 'md:bottom-4' em md+.
      responsivePositionClasses = cn(responsivePositionClasses, "bottom-20 md:bottom-4");
  }
  // Posições 'top' não precisam de ajuste para o rodapé.

  return (
    <>
      {/* Botão flutuante - Só é renderizado se o usuário está autenticado */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-300",
          // Usa as classes de posição dinâmicas/responsivas
          responsivePositionClasses,
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#00FF00] hover:bg-[#00DD00]",
        )}
        aria-label={isOpen ? "Fechar Chat" : "Abrir Chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 text-black" />
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                1
              </span>
            )}
          </div>
        )}
      </Button>

      {/* Janela de chat flutuante - Só é renderizada se o usuário está autenticado */}
      {/* A janela de chat em si pode precisar de ajustes de posicionamento em mobile
          para não ficar por baixo do rodapé, mas isso é um ajuste diferente. */}
      {isAuthenticated && <FloatingChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}