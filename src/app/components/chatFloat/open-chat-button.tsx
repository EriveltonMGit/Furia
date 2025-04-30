"use client"

import { Button, type ButtonProps } from "../ui/button"
import { MessageSquare } from "lucide-react"
import { useChat } from "./chat-provider"

interface OpenChatButtonProps extends ButtonProps {
  label?: string
  showIcon?: boolean
}

export default function OpenChatButton({
  label = "Abrir Chat",
  showIcon = true,
  className,
  ...props
}: OpenChatButtonProps) {
  const { openChat } = useChat()

  return (
    <Button onClick={openChat} className={className} {...props}>
      {showIcon && <MessageSquare className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  )
}
