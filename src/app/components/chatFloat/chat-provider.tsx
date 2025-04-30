"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import FloatingChatButton from "./floating-chat-button"

type ChatContextType = {
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  isOpen: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)
  const toggleChat = () => setIsOpen((prev) => !prev)

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <ChatContext.Provider value={{ openChat, closeChat, toggleChat, isOpen }}>
      {children}
      <FloatingChatButton initiallyOpen={isOpen} />
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
