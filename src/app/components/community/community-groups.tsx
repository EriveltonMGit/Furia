"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import { Search, Users, MessageSquare, Lock, Globe, Plus, UserPlus } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CommunityGroupsProps {
  isLoading: boolean
}

export default function CommunityGroups({ isLoading }: CommunityGroupsProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({})

  // Mock data for groups
  const groups = [
    {
      id: "1",
      name: "Estratégias CS2",
      description:
        "Grupo dedicado a discussões sobre estratégias, táticas e meta do CS2. Compartilhe suas ideias e aprenda com outros jogadores.",
      members: 342,
      posts: 1256,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["CS2", "Estratégia", "Competitivo"],
    },
    {
      id: "2",
      name: "Fãs de KSCERATO",
      description:
        "Grupo para admiradores do talento de KSCERATO. Compartilhe clips, estatísticas e discuta as melhores jogadas.",
      members: 215,
      posts: 876,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["KSCERATO", "Jogador", "Fã Clube"],
    },
    {
      id: "3",
      name: "Análise de Partidas",
      description:
        "Grupo para análise detalhada de partidas da FURIA. Discutimos rounds importantes, decisões táticas e momentos decisivos.",
      members: 189,
      posts: 723,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["Análise", "VOD Review", "Tática"],
    },
    {
      id: "4",
      name: "Moderadores da Comunidade",
      description:
        "Grupo oficial para moderadores da comunidade FURIA. Discussões sobre regras, gestão de conteúdo e suporte aos membros.",
      members: 12,
      posts: 345,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "private",
      tags: ["Moderação", "Oficial", "Staff"],
    },
    {
      id: "5",
      name: "Valorant FURIA",
      description: "Grupo dedicado à divisão de Valorant da FURIA. Discuta sobre o time, agentes, mapas e estratégias.",
      members: 156,
      posts: 512,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["Valorant", "FPS", "Tático"],
    },
    {
      id: "6",
      name: "Colecionadores de Merchandise",
      description:
        "Grupo para colecionadores e entusiastas de produtos oficiais da FURIA. Compartilhe sua coleção e fique por dentro dos lançamentos.",
      members: 98,
      posts: 432,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["Coleção", "Merchandise", "Produtos"],
    },
    {
      id: "7",
      name: "Memes da FURIA",
      description: "O lugar certo para compartilhar e curtir os melhores memes relacionados à FURIA e seus jogadores.",
      members: 287,
      posts: 1876,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["Memes", "Humor", "Entretenimento"],
    },
    {
      id: "8",
      name: "Encontros Presenciais",
      description: "Grupo para organização de encontros presenciais de fãs da FURIA em diversas cidades do Brasil.",
      members: 134,
      posts: 389,
      image: "/placeholder.svg?height=80&width=80",
      privacy: "public",
      tags: ["Eventos", "Presencial", "Encontros"],
    },
  ]

  const handleJoin = (groupId: string) => {
    setJoinedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))

    toast({
      title: joinedGroups[groupId] ? "Grupo abandonado" : "Grupo ingressado",
      description: joinedGroups[groupId] ? "Você saiu deste grupo" : "Você ingressou neste grupo com sucesso",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de pesquisa
  }

  const filteredGroups = groups.filter((group) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 ">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700 p-6">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar grupos..."
            className="pl-10 bg-gray-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <Button className="bg-[#00FF00] hover:bg-[#00CC00] text-black">
          <Plus className="h-4 w-4 mr-2" />
          Criar Grupo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-20 w-20 rounded-lg">
                  <AvatarImage src={group.image || "/placeholder.svg"} alt={group.name} />
                  <AvatarFallback className="rounded-lg">{group.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{group.name}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {group.privacy === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span className="text-xs capitalize">{group.privacy}</span>
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{group.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{group.posts}</span>
                    </div>
                  </div>

                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {group.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-700">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-700 p-6">
              {group.privacy === "private" && !joinedGroups[group.id] ? (
                <Button className="w-full bg-gray-700 hover:bg-gray-600" disabled>
                  <Lock className="h-4 w-4 mr-2" />
                  Grupo Privado
                </Button>
              ) : (
                <Button
                  className={`w-full ${
                    joinedGroups[group.id]
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-[#00FF00] hover:bg-[#00CC00] text-black"
                  }`}
                  onClick={() => handleJoin(group.id)}
                >
                  {joinedGroups[group.id] ? (
                    <>Sair do Grupo</>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Ingressar no Grupo
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium">Nenhum grupo encontrado</h3>
          <p className="text-gray-400">Tente ajustar seus termos de pesquisa ou crie um novo grupo</p>
        </div>
      )}
    </div>
  )
}
