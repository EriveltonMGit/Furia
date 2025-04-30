import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Calendar, Clock, MapPin, Video } from "lucide-react"

interface upcomingMatches {
  userData: {
    name: string
    email: string
    profileCompletion: number
    verificationStatus: string
    fanLevel: string
    fanPoints: number
    memberSince: string
    interests: string[]
    socialConnections: string[]
    upcomingEvents: Array<{ id: number; name: string; date: string; location: string }>
    exclusiveOffers: Array<{ id: number; name: string; expires: string; code?: string }>
    recentActivity: Array<{ id: number; type: string; description: string; date: string }>
  }
}

export function UpcomingEvents({ userData }: UpcomingEventsProps) {
  // Mock data for events
  const allEvents = [
    {
      id: 1,
      name: "FURIA vs Liquid - ESL Pro League",
      description: "FURIA enfrenta Team Liquid na fase de grupos da ESL Pro League Season 19.",
      date: "15/05/2025",
      time: "18:00",
      location: "São Paulo, Brasil",
      type: "match",
      image: "/placeholder.svg?height=200&width=400",
      attending: true,
    },
    {
      id: 2,
      name: "Meet & Greet com Jogadores FURIA",
      description: "Encontro virtual exclusivo com os jogadores da FURIA CS:GO.",
      date: "22/05/2025",
      time: "19:30",
      location: "Online",
      type: "meet_greet",
      image: "/placeholder.svg?height=200&width=400",
      attending: true,
    },
    {
      id: 3,
      name: "FURIA Fan Day 2025",
      description: "Dia especial para fãs com atividades, competições e encontro com jogadores.",
      date: "05/06/2025",
      time: "10:00",
      location: "FURIA Arena, São Paulo",
      type: "fan_event",
      image: "/placeholder.svg?height=200&width=400",
      attending: false,
    },
    {
      id: 4,
      name: "FURIA vs NAVI - BLAST Premier",
      description: "FURIA enfrenta Natus Vincere na fase de grupos do BLAST Premier Spring Finals.",
      date: "12/06/2025",
      time: "15:30",
      location: "Lisboa, Portugal",
      type: "match",
      image: "/placeholder.svg?height=200&width=400",
      attending: false,
    },
    {
      id: 5,
      name: "Workshop de Táticas CS2 com arT",
      description: "Workshop exclusivo sobre táticas de CS2 com o capitão da FURIA.",
      date: "18/06/2025",
      time: "20:00",
      location: "Online",
      type: "workshop",
      image: "/placeholder.svg?height=200&width=400",
      attending: false,
    },
    {
      id: 6,
      name: "FURIA Community Tournament",
      description: "Torneio da comunidade FURIA com premiação e participação de jogadores profissionais.",
      date: "25/06/2025",
      time: "14:00",
      location: "Online",
      type: "tournament",
      image: "/placeholder.svg?height=200&width=400",
      attending: false,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Eventos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eventos que Você Vai Participar</CardTitle>
            <CardDescription>Seus próximos eventos confirmados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allEvents
                .filter((event) => event.attending)
                .map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div className="bg-[#00FF00] p-2 rounded-md text-center min-w-[60px]">
                      <span className="text-xs">{event.date.split("/")[1]}</span>
                      <p className="text-xl font-bold leading-none">{event.date.split("/")[0]}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{event.name}</h3>
                        {event.type === "match" && <Badge className="bg-blue-600">Partida</Badge>}
                        {event.type === "meet_greet" && <Badge className="bg-purple-600">Meet & Greet</Badge>}
                        {event.type === "fan_event" && <Badge className="bg-green-600">Evento de Fãs</Badge>}
                        {event.type === "workshop" && <Badge className="bg-yellow-600">Workshop</Badge>}
                        {event.type === "tournament" && <Badge className="bg-red-600">Torneio</Badge>}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-medium">Próximos Eventos</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents
          .filter((event) => !event.attending)
          .map((event) => (
            <Card key={event.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="h-48 bg-gray-700 relative">
                <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  {event.type === "match" && <Badge className="bg-blue-600">Partida</Badge>}
                  {event.type === "meet_greet" && <Badge className="bg-purple-600">Meet & Greet</Badge>}
                  {event.type === "fan_event" && <Badge className="bg-green-600">Evento de Fãs</Badge>}
                  {event.type === "workshop" && <Badge className="bg-yellow-600">Workshop</Badge>}
                  {event.type === "tournament" && <Badge className="bg-red-600">Torneio</Badge>}
                </div>
                <div className="absolute bottom-0 left-0 bg-[#00FF00#00FF00] px-3 py-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{event.date}</span>
                </div>
              </div>
              <CardContent className="p-4 border  h-[55%] flex items-center justify-between flex-col">
                <h3 className="font-medium text-lg mb-2">{event.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{event.description}</p>

                <div className="flex items-center justify-between text-sm  text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    {event.location === "Online" ? (
                      <>
                        <Video className="h-3 w-3 mr-1" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-[#00FF00] hover:bg-[#39a139]">Participar</Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
