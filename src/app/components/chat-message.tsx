import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { cn } from "../lib/utils"
import type { Message } from "../types/chat"
import { Bot, User } from "lucide-react"
import TypingIndicator from "./typing-indicator"

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
}

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isSystem) {
    return (
      <div className="bg-[#1A1A1A] rounded-lg p-3 text-sm text-gray-300 border-l-2 border-[#00FF00]  ">
        {message.content}
      </div>
    )
  }

  // Função para formatar o conteúdo com quebras de linha
  const formatContent = (content: string) => {
    if (!content) return ""

    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar>
          <AvatarImage src="/img/logo.png" alt="FURIA Bot" />
          <AvatarFallback className="bg-[#00FF00]/20 text-[#00FF00] flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[80%] rounded-lg p-3 ", isUser ? "bg-[#00FF00] text-black" : "bg-[#1A1A1A] text-white")}>
        <div className="mb-1 ">
          <span className="font-medium">{isUser ? "Você" : "FURIA Bot"}</span>
          <span className="text-xs ml-2 opacity-70">{timestamp}</span>
        </div>
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p className="text-sm whitespace-pre-wrap ">{formatContent(message.content)}</p>
        )}
      </div>
      {isUser && (
        <Avatar>
          <AvatarImage src="" alt="Você" />
          <AvatarFallback className="bg-[#333333] flex items-center justify-center">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
