"use client"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import FloatingChatWindow from "./floating-chat-window"

interface FloatingChatButtonProps {
  initiallyOpen?: boolean
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export default function FloatingChatButton({
  initiallyOpen = false,
  position = "bottom-right",
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  // Posicionamento do botão flutuante
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  // Efeito para mostrar mensagem de boas-vindas após um tempo
  useEffect(() => {
    if (isFirstLoad && !initiallyOpen) {
      const timer = setTimeout(() => {
        setHasUnreadMessages(true)
      }, 5000)

      setIsFirstLoad(false)
      return () => clearTimeout(timer)
    }
  }, [isFirstLoad, initiallyOpen])

  // Resetar indicador de mensagens não lidas quando o chat é aberto
  useEffect(() => {
    if (isOpen) {
      setHasUnreadMessages(false)
    }
  }, [isOpen])

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-300",
          positionClasses[position],
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#00FF00] hover:bg-[#00DD00]",
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 text-black" />
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            )}
          </div>
        )}
      </Button>

      {/* Janela de chat flutuante */}
      <FloatingChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
