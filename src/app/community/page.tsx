// src/app/community/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Search, Users, Calendar, MessageSquare, Hash, Filter, Bell, ChevronDown } from "lucide-react"
import CommunityHeader from "../components/community/community-header"
import DiscussionFeed from "../components/community/discussion-feed"
import CommunityMembers from "../components/community/community-members"
import CommunityEvents from "../components/community/community-events"
import CommunityGroups from "../components/community/community-groups"
import TrendingTopics from "../components/community/trending-topics"
import CreatePostDialog from "../components/community/create-post-dialog"
import { useToast } from "../hooks/use-toast"

// Defina a interface para as props que CommunityPage espera receber
// Usei "any" para simplificar, mas o ideal seria definir a estrutura exata do userData
interface CommunityPageProps {
  userData?: any; // Adiciona a prop userData, tornando-a opcional caso não seja sempre passada
}

// Atualize a assinatura da função CommunityPage para aceitar as props
export default function CommunityPage({ userData }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}" na comunidade`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Se o CommunityHeader precisar de userData, você pode passá-lo aqui */}
      {/* <CommunityHeader userData={userData} /> */}
      <CommunityHeader />


      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Comunidade FURIA</h3>
                <Badge className="bg-[#00FF00] text-black">Online</Badge>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Conecte-se com outros fãs da FURIA, participe de discussões e fique por dentro dos eventos.
              </p>
              <Button
                className="w-full bg-[#00FF00] hover:bg-[#00CC00] text-black"
                onClick={() => setIsCreatePostOpen(true)}
              >
                Criar Publicação
              </Button>
            </Card>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Novas publicações</span>
                  <Badge variant="outline" className="bg-gray-700">
                    12
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Menções</span>
                  <Badge variant="outline" className="bg-gray-700">
                    3
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Eventos</span>
                  <Badge variant="outline" className="bg-gray-700">
                    5
                  </Badge>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <TrendingTopics />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <form onSubmit={handleSearch} className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar na comunidade..."
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Ordenar
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 bg-gray-800 mb-6">
                <TabsTrigger value="feed" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                  <MessageSquare className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black"
                >
                  <Users className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Membros</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                  <Calendar className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Eventos</span>
                </TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
                  <Hash className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Grupos</span>
                </TabsTrigger>
              </TabsList>

              <div className="md:hidden mb-6">
                <TrendingTopics />
              </div>

              <TabsContent value="feed" className="mt-0">
                <DiscussionFeed isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <CommunityMembers isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <CommunityEvents isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="groups" className="mt-0">
                <CommunityGroups isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </div>
  )
}