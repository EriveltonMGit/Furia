"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MessageSquare, Calendar, Trophy, Users, Send, ArrowLeft, Info, Clock, BarChart2 } from "lucide-react"
import Link from "next/link"
import ChatMessage from "../components/chat-message"
import LiveMatchStatus from "../components/live-match-status" // Verifique se estes componentes existem e funcionam
import TeamStats from "../components/team-stats" // Verifique se estes componentes existem e funcionam
import { ScrollArea } from "../components/ui/scroll-area"
import type { Message } from "../types/chat"

// ✅ Importe o hook de autenticação
import { useAuth } from '../contexts/AuthContext'; // AJUSTE O CAMINHO SE NECESSÁRIO

export default function ChatPage() {
  // ✅ Use o hook de autenticação para obter os dados do usuário
  const { user, loading, isAuthenticated } = useAuth(); // 'loading' e 'isAuthenticated' podem ser úteis para mostrar um estado de carregamento ou redirecionar, mas focaremos no 'user' aqui.


  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Bem-vindo ao Chat de Fãs da FURIA CS:GO! Pergunte sobre horários de partidas, estatísticas de jogadores ou discuta estratégias com outros fãs. Digite `ajuda` para ver a lista completa de comandos disponíveis.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingMessageId = useRef<string | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // ✅ Obtenha o nome do usuário logado (será undefined se user for null)
    const userName = user?.name; // Usa optional chaining para acessar 'name' com segurança

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      // O conteúdo exibido na bolha do chat pode ser apenas a mensagem,
      // ou você pode adicionar o nome aqui se quiser que ele apareça acima da mensagem.
      // Por exemplo: content: userName ? `${userName}: ${input}` : input,
      content: input, // Mantém o conteúdo limpo para enviar para a IA
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
      content: "Digitando...",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, typingMessage])
    setIsTyping(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // ✅ Envie o nome do usuário no corpo da requisição para o endpoint /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userName: userName, // ✅ Adiciona o nome do usuário aqui
        }),
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
            role: "assistant", // Role "assistant" para respostas do bot
            content: data.response,
            timestamp: new Date().toISOString(),
          })
      )
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)

      // Remover a mensagem de digitação e adicionar mensagem de erro
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingId)
          .concat({
            id: typingId,
            role: "system", // Role "system" para mensagens de erro ou informativas do sistema
            content: "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente.",
            timestamp: new Date().toISOString(),
          })
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
          content: "Bem-vindo ao Chat de Fãs da FURIA CS:GO! Pergunte sobre horários de partidas, estatísticas de jogadores ou discuta estratégias com outros fãs. Digite `ajuda` para ver a lista completa de comandos disponíveis.",
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Erro ao resetar chat:", error)
    }
  }

  // Opcional: Mostrar um loader ou mensagem enquanto a autenticação carrega
  if (loading) {
      return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Carregando usuário...</div>;
  }

  // Opcional: Redirecionar se não estiver autenticado (se esta página for protegida)
  // Embora você já use ProtectedRoute, é uma garantia extra.
  // if (!isAuthenticated) {
  //    // Renderize null ou um loader curto antes do redirecionamento que deve ser feito pelo ProtectedRoute
  //    return null;
  // }


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col ">
      {/* Cabeçalho */}
      <header className="border-b border-[#222222] py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-[#00FF00]">Chat de Fãs da FURIA</h1>
             {/* ✅ Exibir nome do usuário logado */}
            {user && <span className="ml-2 text-sm text-gray-400">Olá, {user.name}!</span>}
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#00FF00] mr-2"></div>
            <span className="text-sm">1.243 fãs online</span> {/* Este valor é estático */}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Barra Lateral */}
        <div className="w-full md:w-64 lg:w-80">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-[#111111]">
              <TabsTrigger value="chat" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                <MessageSquare className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger value="matches" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                <Calendar className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                <Trophy className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black"
              >
                <Users className="h-5 w-5" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0 ">
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 mb-6">
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <Info className="h-4 w-4 mr-2 text-[#00FF00]" />
                  Guia do Chat
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Pergunte sobre próximas partidas</li>
                  <li>• Obtenha estatísticas dos jogadores</li>
                  <li>• Discuta estratégias e jogadas</li>
                  <li>• Compartilhe suas opiniões com outros fãs</li>
                </ul>
              </div>

              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <Clock className="h-4 w-4 mr-2 text-[#00FF00]" />
                  Tópicos Recentes {/* Este conteúdo é estático */}
                </h3>
                <ul className="text-sm space-y-3">
                  <li className="pb-2 border-b border-[#222222]">
                    <a href="#" className="hover:text-[#00FF00]">
                      Nova estratégia de AWP da FURIA
                    </a>
                    <p className="text-xs text-gray-400">23 fãs discutindo</p>
                  </li>
                  <li className="pb-2 border-b border-[#222222]">
                    <a href="#" className="hover:text-[#00FF00]">
                      Previsões para o IEM Dallas
                    </a>
                    <p className="text-xs text-gray-400">47 fãs discutindo</p>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#00FF00]">
                      Estilo de jogo agressivo do arT
                    </a>
                    <p className="text-xs text-gray-400">31 fãs discutindo</p>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="matches" className="mt-0">
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <h3 className="text-lg font-medium mb-4">Partida Ao Vivo</h3>
                {/* ✅ Estes componentes (LiveMatchStatus, TeamStats) precisariam usar useAuth
                     internamente ou receber o status/dados do usuário via props se eles
                     forem exibir informações sensíveis do usuário ou interagir com APIs autenticadas */}
                <LiveMatchStatus />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <h3 className="flex items-center text-lg font-medium mb-4">
                  <BarChart2 className="h-4 w-4 mr-2 text-[#00FF00]" />
                  Estatísticas do Time
                </h3>
                <TeamStats />
              </div>
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <h3 className="text-lg font-medium mb-4">Comunidade de Fãs</h3>
                <p className="text-gray-400 mb-4">Conecte-se com outros fãs da FURIA e participe da conversa.</p>
                <Button className="w-full bg-[#00FF00] text-black hover:bg-[#00CC00]">Entrar na Comunidade Discord</Button> {/* Link estático */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Área do Chat */}
        <div className="flex-1 bg-[#111111] rounded-lg border border-[#222222] flex flex-col">
          <div className="p-4 border-b border-[#222222]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Chat FURIA CS:GO</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetChat} // Esta função precisa chamar clearChatHistory do gemini.ts (via API)
                className="text-xs bg-transparent border-gray-700 hover:bg-gray-800"
              >
                Limpar Chat
              </Button>
            </div>
            <p className="text-sm text-gray-400">Converse com outros fãs e receba as últimas atualizações</p> {/* Este texto é estático */}
          </div>

          <ScrollArea className="flex-1 p-4 ">
            <div className="space-y-4">
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

          <div className="p-4 border-t border-[#222222] ">
            <form onSubmit={handleSendMessage} className="flex gap-2 ">
              <Input
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
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}