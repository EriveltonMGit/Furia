import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Clock, Copy, Gift, ShoppingBag, Tag, Ticket } from "lucide-react"

interface ExclusiveOffersProps {
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

export function ExclusiveOffers({ userData }: ExclusiveOffersProps) {
  // Mock data for offers
  const allOffers = [
    {
      id: 1,
      name: "Desconto de 20% na nova camisa",
      description: "Utilize este código para obter 20% de desconto na nova camisa oficial da FURIA.",
      expires: "30/05/2025",
      code: "FURIA20",
      type: "merchandise",
      discount: "20%",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Acesso antecipado ao novo merchandise",
      description: "Acesso exclusivo à nova coleção de produtos FURIA antes do lançamento oficial.",
      expires: "15/06/2025",
      type: "early_access",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Ingresso VIP para ESL Pro League",
      description: "Ingresso VIP com acesso aos bastidores e meet & greet com os jogadores.",
      expires: "10/05/2025",
      code: "FURIAVIP",
      type: "event",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Frete grátis na loja oficial",
      description: "Frete grátis para qualquer compra na loja oficial da FURIA.",
      expires: "31/05/2025",
      code: "FRETEGRATIS",
      type: "merchandise",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Sessão de treino virtual com jogadores",
      description: "Participe de uma sessão de treino virtual exclusiva com jogadores da FURIA.",
      expires: "20/06/2025",
      type: "experience",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Desconto de 15% em periféricos",
      description: "15% de desconto em periféricos selecionados na loja oficial.",
      expires: "15/07/2025",
      code: "GEAR15",
      type: "merchandise",
      discount: "15%",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ofertas Exclusivas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Seus Benefícios</CardTitle>
            <CardDescription>Ofertas exclusivas para fãs verificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <Tag className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Descontos Exclusivos</h3>
                <p className="text-sm text-gray-400">Acesso a descontos especiais em produtos oficiais</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <Ticket className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Ingressos Antecipados</h3>
                <p className="text-sm text-gray-400">Compre ingressos antes da venda geral</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <Gift className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Experiências VIP</h3>
                <p className="text-sm text-gray-400">Acesso a experiências exclusivas com o time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-medium">Ofertas Disponíveis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {allOffers.map((offer) => (
          <Card key={offer.id} className="bg-gray-800 border border-[#00FF00] overflow-hidden">
            <div className="h-32 bg-gray-700 relative">
              <img src={offer.image || "/placeholder.svg"} alt={offer.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                {offer.type === "merchandise" && (
                  <Badge className="bg-blue-600">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Produto
                  </Badge>
                )}
                {offer.type === "event" && (
                  <Badge className="bg-purple-600">
                    <Ticket className="h-3 w-3 mr-1" />
                    Evento
                  </Badge>
                )}
                {offer.type === "experience" && (
                  <Badge className="bg-green-600">
                    <Gift className="h-3 w-3 mr-1" />
                    Experiência
                  </Badge>
                )}
                {offer.type === "early_access" && (
                  <Badge className="bg-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Acesso Antecipado
                  </Badge>
                )}
              </div>
              {offer.discount && (
                <div className="absolute bottom-0 left-0 bg-[#00FF00] px-2 py-1">
                  <span className="font-bold">{offer.discount}</span>
                </div>
              )}
            </div>
            <CardContent className="p-4  h-full  items-center justify-between flex-col ">
              <h3 className="font-medium text-lg mb-2">{offer.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{offer.description}</p>

              <div className="flex items-center text-sm text-gray-400 mb-4 ">
                <Clock className="h-3 w-3 mr-1" />
                <span>Expira em {offer.expires}</span>
              </div>

              {offer.code && (
                <div className="bg-gray-700 p-2 rounded  flex justify-between items-center mb-4">
                  <code className="text-sm font-mono">{offer.code}</code>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              )}

              <Button className="w-full bg-[#00FF00] hover:bg-[#37a537]">Resgatar Oferta</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
