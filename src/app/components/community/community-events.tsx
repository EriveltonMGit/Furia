"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, MapPin, Clock, Users, CalendarPlus, CalendarX, ExternalLink } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CommunityEventsProps {
  isLoading: boolean
}

export default function CommunityEvents({ isLoading }: CommunityEventsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({})

  // Mock data for events
  const events = [
    {
      id: "1",
      title: "FURIA vs NAVI - BLAST Premier Watch Party",
      description:
        "Vamos nos reunir para assistir FURIA enfrentar Natus Vincere na BLAST Premier Spring Finals. Teremos comentários ao vivo, sorteios e muito mais!",
      date: "2025-05-10",
      time: "15:30",
      location: "Arena FURIA, São Paulo",
      type: "presencial",
      capacity: "150/200",
      organizer: "Comunidade FURIA",
      image: "/placeholder.svg?height=200&width=400",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Workshop de Táticas CS2 com arT",
      description:
        "Workshop exclusivo online sobre táticas de CS2 com o capitão da FURIA. Aprenda sobre liderança, tomada de decisões e estratégias competitivas.",
      date: "2025-05-18",
      time: "20:00",
      location: "Online (Discord)",
      type: "online",
      capacity: "85/100",
      organizer: "FURIA Esports",
      image: "/placeholder.svg?height=200&width=400",
      status: "upcoming",
    },
    {
      id: "3",
      title: "FURIA Community Tournament",
      description:
        "Torneio da comunidade FURIA com premiação e participação de jogadores profissionais como convidados especiais.",
      date: "2025-05-25",
      time: "14:00",
      location: "Online (Faceit)",
      type: "online",
      capacity: "32/32 equipes",
      organizer: "Comunidade FURIA",
      image: "/placeholder.svg?height=200&width=400",
      status: "upcoming",
    },
    {
      id: "4",
      title: "Meet & Greet com Jogadores FURIA",
      description:
        "Encontro virtual exclusivo com os jogadores da FURIA CS:GO. Faça perguntas, conheça os bastidores e interaja com seus ídolos.",
      date: "2025-06-05",
      time: "19:00",
      location: "Online (Zoom)",
      type: "online",
      capacity: "120/200",
      organizer: "FURIA Esports",
      image: "/placeholder.svg?height=200&width=400",
      status: "upcoming",
    },
    {
      id: "5",
      title: "IEM Cologne 2025 Watch Party",
      description:
        "Evento presencial para assistir aos jogos da FURIA na IEM Cologne 2025. Ambiente com telão, food trucks e atividades temáticas.",
      date: "2025-07-15",
      time: "13:00",
      location: "Shopping Vila Olímpia, São Paulo",
      type: "presencial",
      capacity: "180/300",
      organizer: "Comunidade FURIA",
      image: "/placeholder.svg?height=200&width=400",
      status: "upcoming",
    },
    {
      id: "6",
      title: "FURIA Fan Day 2024",
      description:
        "Dia especial para fãs com atividades, competições e encontro com jogadores. O evento contou com sessões de autógrafos e experiências exclusivas.",
      date: "2024-12-10",
      time: "10:00",
      location: "FURIA Arena, São Paulo",
      type: "presencial",
      capacity: "500/500",
      organizer: "FURIA Esports",
      image: "/placeholder.svg?height=200&width=400",
      status: "past",
    },
    {
      id: "7",
      title: "Workshop de Aim Training",
      description:
        "Workshop online sobre técnicas de treino de mira com KSCERATO. Foram compartilhadas rotinas de treino e configurações recomendadas.",
      date: "2025-01-20",
      time: "19:00",
      location: "Online (Discord)",
      type: "online",
      capacity: "150/150",
      organizer: "FURIA Esports",
      image: "/placeholder.svg?height=200&width=400",
      status: "past",
    },
    {
      id: "8",
      title: "Major Rio 2024 Viewing Party",
      description:
        "Evento presencial para assistir à final do Major Rio 2024. Contou com telão, comentaristas convidados e área de convivência.",
      date: "2024-11-24",
      time: "15:00",
      location: "Arena FURIA, São Paulo",
      type: "presencial",
      capacity: "300/300",
      organizer: "Comunidade FURIA",
      image: "/placeholder.svg?height=200&width=400",
      status: "past",
    },
  ]

  const handleRegister = (eventId: string) => {
    setRegisteredEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))

    toast({
      title: registeredEvents[eventId] ? "Inscrição cancelada" : "Inscrição confirmada",
      description: registeredEvents[eventId]
        ? "Você cancelou sua inscrição neste evento"
        : "Você se inscreveu com sucesso neste evento",
    })
  }

  const filteredEvents = events.filter((event) => {
    if (activeTab === "upcoming" && event.status !== "upcoming") return false
    if (activeTab === "past" && event.status !== "past") return false
    if (activeTab === "registered" && !registeredEvents[event.id]) return false
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Próximos
            </TabsTrigger>
            <TabsTrigger value="registered" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Inscritos
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              Passados
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button className="bg-[#00FF00] hover:bg-[#00CC00] text-black">
          <CalendarPlus className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-48">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className={event.type === "online" ? "bg-blue-600" : "bg-purple-600"}>
                    {event.type === "online" ? "Online" : "Presencial"}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 bg-[#00FF00] text-black px-3 py-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-400">{event.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.capacity}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 col-span-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-700 p-6">
              {event.status === "upcoming" ? (
                <Button
                  className={`w-full ${
                    registeredEvents[event.id]
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-[#00FF00] hover:bg-[#00CC00] text-black"
                  }`}
                  onClick={() => handleRegister(event.id)}
                >
                  {registeredEvents[event.id] ? (
                    <>
                      <CalendarX className="h-4 w-4 mr-2" />
                      Cancelar Inscrição
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Inscrever-se
                    </>
                  )}
                </Button>
              ) : (
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium">
            {activeTab === "registered" ? "Você não está inscrito em nenhum evento" : "Nenhum evento encontrado"}
          </h3>
          <p className="text-gray-400">
            {activeTab === "registered"
              ? "Inscreva-se em eventos para vê-los aqui"
              : "Fique atento para novos eventos em breve"}
          </p>
        </div>
      )}
    </div>
  )
}
