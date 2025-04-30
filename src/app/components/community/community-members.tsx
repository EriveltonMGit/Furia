"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Search, UserPlus, UserCheck, UserX } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CommunityMembersProps {
  isLoading: boolean
}

export default function CommunityMembers({ isLoading }: CommunityMembersProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({})

  // Mock data for members
  const members = [
    {
      id: "1",
      name: "Marcos Oliveira",
      username: "@marcos_cs",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Super Fã",
      level: 42,
      joinDate: "Membro desde Jan 2022",
      badges: ["Veterano", "Contribuidor"],
      online: true,
    },
    {
      id: "2",
      name: "Juliana Mendes",
      username: "@ju_furia",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Moderadora",
      level: 78,
      joinDate: "Membro desde Mar 2021",
      badges: ["Moderação", "Elite"],
      online: true,
    },
    {
      id: "3",
      name: "Rafael Costa",
      username: "@rafa_costa",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Fã",
      level: 15,
      joinDate: "Membro desde Nov 2023",
      badges: ["Novato"],
      online: false,
    },
    {
      id: "4",
      name: "Ana Clara",
      username: "@ana_clara",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Super Fã",
      level: 36,
      joinDate: "Membro desde Jun 2022",
      badges: ["Colecionadora", "Participativa"],
      online: true,
    },
    {
      id: "5",
      name: "Pedro Souza",
      username: "@pedro_souza",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Fã",
      level: 23,
      joinDate: "Membro desde Ago 2022",
      badges: ["Estrategista"],
      online: false,
    },
    {
      id: "6",
      name: "Carla Dias",
      username: "@carla_dias",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Super Fã",
      level: 31,
      joinDate: "Membro desde Fev 2022",
      badges: ["Artista", "Criativa"],
      online: true,
    },
    {
      id: "7",
      name: "Bruno Almeida",
      username: "@bruno_almeida",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Fã",
      level: 19,
      joinDate: "Membro desde Out 2022",
      badges: ["Analista"],
      online: false,
    },
    {
      id: "8",
      name: "Lucas Mendonça",
      username: "@lucas_m",
      avatar: "/placeholder.svg?height=64&width=64",
      role: "Super Fã",
      level: 45,
      joinDate: "Membro desde Dez 2021",
      badges: ["Veterano", "Organizador"],
      online: true,
    },
  ]

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))

    toast({
      title: followedUsers[userId] ? "Deixou de seguir" : "Seguindo",
      description: followedUsers[userId] ? "Você deixou de seguir este usuário" : "Você começou a seguir este usuário",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de pesquisa
  }

  const filteredMembers = members.filter((member) => {
    if (activeTab === "online" && !member.online) return false
    if (activeTab === "moderators" && member.role !== "Moderadora") return false
    if (activeTab === "super_fans" && member.role !== "Super Fã") return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return member.name.toLowerCase().includes(query) || member.username.toLowerCase().includes(query)
    }

    return true
  })

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Todos
            </TabsTrigger>
            <TabsTrigger value="online" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Online
            </TabsTrigger>
            <TabsTrigger value="moderators" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Moderadores
            </TabsTrigger>
            <TabsTrigger value="super_fans" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Super Fãs
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSearch} className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar membros..."
            className="pl-10 bg-gray-800 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                  )}
                </div>

                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.username}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-gray-700">{member.role}</Badge>
                  <Badge className="bg-[#00FF00] text-black">Nível {member.level}</Badge>
                </div>

                {member.badges && member.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {member.badges.map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400">{member.joinDate}</p>

                <Button
                  variant={followedUsers[member.id] ? "outline" : "default"}
                  size="sm"
                  className={followedUsers[member.id] ? "bg-gray-700" : "bg-[#00FF00] text-black hover:bg-[#00CC00]"}
                  onClick={() => handleFollow(member.id)}
                >
                  {followedUsers[member.id] ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Seguindo
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Seguir
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserX className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium">Nenhum membro encontrado</h3>
          <p className="text-gray-400">Tente ajustar seus filtros ou termos de pesquisa</p>
        </div>
      )}

      {filteredMembers.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="bg-gray-800 border-gray-700">
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}
