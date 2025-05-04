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
  // Mock data for offers com imagens reais da FURIA
  const allOffers = [
    {
      id: 1,
      name: "Moletom FURIA Spray It Preto",
      description: "Moletom exclusivo da coleção FURIA 2025 com estampa especial.",
      expires: "30/05/2025",
      code: "FURIA20",
      type: "merchandise",
      discount: "20%",
      image: "https://furiagg.fbitsstatic.net/img/p/moletom-furia-spray-it-preto-150199/337029-2.jpg?w=468&h=468&v=no-value",
    },
    {
      id: 2,
      name: "Camiseta FURIA 2025",
      description: "Nova camiseta oficial da temporada 2025.",
      expires: "15/06/2025",
      code: "FURIASHIRT",
      type: "merchandise",
      image: "https://furiagg.fbitsstatic.net/img/p/camiseta-furia-adidas-preta-150263/337479-1.jpg?w=1280&h=1280&v=202503281012",
    },
    {
      id: 3,
      name: "Mochila Furia",
      description: "Mochila confeccionada em nylon impermeável, ideal para o dia a dia.",
      expires: "10/05/2025",
      code: "FURIAPRO",
      type: "merchandise",
      discount: "15%",
      image: "https://furiagg.fbitsstatic.net/img/p/sacochila-furia-preta-150267/337499-1.jpg?w=1280&h=1280&v=202504101318",
    },
    {
      id: 4,
      name: "Calça Furia x Zor Preta",
      description: "Calça de sarja nas cores preta e cinza chumbo.",
      expires: "31/05/2025",
      code: "FURIACAP",
      type: "merchandise",
      image: "https://furiagg.fbitsstatic.net/img/p/calca-furia-x-zor-preta-150236/337291-1.jpg?w=1280&h=1280&v=no-value",
    },
    {
      id: 5,
      name: "Calça Jogger Furia Preta",
      description: "Calça jogger em tactel",
      expires: "20/06/2025",
      code: "FURIAKIT",
      type: "merchandise",
      discount: "25%",
      image: "https://furiagg.fbitsstatic.net/img/p/calca-jogger-furia-preta-150198/337022-1.jpg?w=1280&h=1280&v=no-value",
    },
    {
      id: 6,
      name: "Camiseta Furia | Adidas Preta",
      description: "Jersey com tecido desenvolvido para proporcionar alta respirabilidade",
      expires: "15/07/2025",
      code: "FURIAHOOD",
      type: "merchandise",
      image: "https://furiagg.fbitsstatic.net/img/p/camiseta-furia-adidas-preta-150263/337479-1.jpg?w=1280&h=1280&v=202503281012",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Loja FURIA</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ofertas Exclusivas</CardTitle>
            <CardDescription>Produtos oficiais com descontos especiais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <Tag className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Descontos Limitados</h3>
                <p className="text-sm text-gray-400">Ofertas especiais por tempo limitado</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <ShoppingBag className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Produtos Exclusivos</h3>
                <p className="text-sm text-gray-400">Itens disponíveis apenas na loja oficial</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="bg-[#00FF00]/20 p-3 rounded-full mb-3">
                  <Gift className="h-6 w-6 text-[#00FF00]" />
                </div>
                <h3 className="font-medium mb-1">Frete Especial</h3>
                <p className="text-sm text-gray-400">Condições especiais de entrega</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-medium">Produtos em Destaque</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allOffers.map((offer) => (
          <Card key={offer.id} className="bg-gray-800 border border-[#00FF00] overflow-hidden hover:shadow-lg hover:shadow-[#00FF00]/20 transition-shadow">
            <div className="h-64 bg-gray-700 relative">
              <img 
                src={offer.image} 
                alt={offer.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-600">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Loja
                </Badge>
              </div>
              {offer.discount && (
                <div className="absolute bottom-0 left-0 bg-[#00FF00] px-3 py-1">
                  <span className="font-bold text-gray-900">{offer.discount} OFF</span>
                </div>
              )}
            </div>
            <CardContent className="p-4 h-full flex flex-col">
              <h3 className="font-medium text-lg mb-2">{offer.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{offer.description}</p>

              <div className="flex items-center text-sm text-gray-400 mb-4">
                <Clock className="h-3 w-3 mr-1" />
                <span>Oferta válida até {offer.expires}</span>
              </div>

              {offer.code && (
                <div className="bg-gray-700 p-2 rounded flex justify-between items-center mb-4">
                  <code className="text-sm font-mono">{offer.code}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => {
                      navigator.clipboard.writeText(offer.code!);
                      // Adicione aqui uma notificação se quiser
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              )}

              <Button className="w-full bg-[#00FF00] hover:bg-[#37a537] text-gray-900 font-medium">
                Comprar Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}