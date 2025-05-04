"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "../../lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Send } from "lucide-react"
import ChatMessage from "../chat-message"
import type { Message } from "../../types/chat"

interface FloatingChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export default function FloatingChatWindow({ isOpen, onClose }: FloatingChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content:
        "Bem-vindo ao Chat da FURIA! Como posso ajudar você hoje? Pergunte sobre jogos, jogadores ou notícias do time!",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingMessageId = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Focar no input quando o chat é aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Adicionar mensagem de "digitando"
    const typingId = (Date.now() + 1).toString()
    typingMessageId.current = typingId

    const typingMessage: Message = {
      id: typingId,
      role: "assistant",
      content: "...",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, typingMessage])
    setIsTyping(true)

    try {
      // Simular um pequeno atraso antes de enviar a requisição para melhor UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Usar a API em vez da função direta
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Falha na resposta da API")
      }

      const data = await response.json()

      // Remover a mensagem de digitação e adicionar a resposta real
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingId)
          .concat({
            id: typingId,
            role: "assistant",
            content: data.response,
            timestamp: new Date().toISOString(),
          }),
      )
    } catch (error) {
      console.error("Error generating response:", error)

      // Remover a mensagem de digitação e adicionar mensagem de erro
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingId)
          .concat({
            id: typingId,
            role: "system",
            content: "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente.",
            timestamp: new Date().toISOString(),
          }),
      )
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      typingMessageId.current = null
    }
  }

  const handleResetChat = async () => {
    try {
      await fetch("/api/chat/reset", { method: "POST" })

      setMessages([
        {
          id: "1",
          role: "system",
          content:
            "Bem-vindo ao Chat da FURIA! Como posso ajudar você hoje? Pergunte sobre jogos, jogadores ou notícias do time!",
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error resetting chat:", error)
    }
  }

  return (
    <div
    className={cn(
     "fixed z-40 bg-[#111111]/70 rounded-lg shadow-xl flex flex-col transition-all duration-300 transform backdrop-blur-sm",
      "bottom-[9rem] right-6 w-[calc(100vw-2rem)] h-[80vh] max-w-[340px] max-h-[600px]", // Mobile
      "md:bottom-10 md:right-[5rem] md:w-[330px] md:h-[500px]", // Desktop: afasta mais do lado direito
      isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    )}
  >
  
      {/* Cabeçalho */}
      <div className="p-3 border-b border-[#0A0A0A] bg-[#0A0A0A] rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#ffffff] flex items-center justify-center mr-2 relative overflow-hidden">
            <img src="/img/logo.png" alt="FURIA" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-white">FURIA Bot</h3>
            <p className="text-xs text-gray-400">Assistente oficial</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleResetChat} className="h-7 text-xs hover:bg-[#222222]">
            Limpar
          </Button>
        </div>
      </div>

      {/* Área de mensagens */}
      <ScrollArea className="flex-1 p-3 ">
        <div className="space-y-3 ">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              message={message}
              isTyping={isTyping && typingMessageId.current === message.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Área de input */}
      <div className="p-3 border-t border-[#222222]">
        <form onSubmit={handleSendMessage} className="flex gap-2 ">
          <Input
            ref={inputRef}
            placeholder={isTyping ? "FURIA Bot está digitando..." : "Digite sua mensagem..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#00FF00]"
            disabled={isLoading || isTyping}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#00FF00] text-black hover:bg-[#00CC00]"
            disabled={isLoading || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
