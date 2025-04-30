import { Card, CardContent, CardFooter } from "..//components/ui/card"
import { Badge } from "..//components/ui/badge"
import { CalendarDays } from "lucide-react"
import Link from "next/link"

const news = [
  {
    id: 1,
    title: "FURIA se classifica para o IEM Dallas 2025",
    excerpt: "O time brasileiro garantiu sua vaga após uma campanha impressionante nas qualificatórias sul-americanas.",
    date: "2025-04-20",
    category: "Torneio",
  },
  {
    id: 2,
    title: "KSCERATO eleito MVP da Fase de Grupos da ESL Pro League",
    excerpt: "O rifler estrela da FURIA conquistou o prêmio de MVP após uma performance excepcional na fase de grupos.",
    date: "2025-04-15",
    category: "Notícias do Jogador",
  },
  {
    id: 3,
    title: "FURIA anuncia nova parceria com marca de periféricos para jogos",
    excerpt: "A organização assinou um acordo de vários anos com um fabricante líder de periféricos para jogos.",
    date: "2025-04-10",
    category: "Organização",
  },
]

export default function LatestNews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-[85%] mx-auto">
      {news.map((item) => (
        <Card key={item.id} className="bg-[#111111] border-[#222222]">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/30 border-none">
                {item.category}
              </Badge>
              <div className="flex items-center text-sm text-gray-400">
                <CalendarDays className="h-4 w-4 mr-1" />
                {item.date}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.excerpt}</p>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0">
            <Link href="#" className="text-[#00FF00] hover:text-[#00CC00] font-medium">
              Leia mais
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}