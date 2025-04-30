import { Card, CardContent } from "../components/ui/card"
import Image from "next/image"

const players = [
  {
    id: 1,
    name: "arT",
    realName: "Andrei Piovezan",
    role: "IGL / Entry Fragger",
    image: "/images/art.jpg",
    stats: {
      rating: "1.08",
      kd: "1.02",
      headshots: "48.2%",
    },
  },
  {
    id: 2,
    name: "KSCERATO",
    realName: "Kaike Cerato",
    role: "Rifler",
    image: "/images/kscerato.jpg",
    stats: {
      rating: "1.21",
      kd: "1.25",
      headshots: "52.7%",
    },
  },
  {
    id: 3,
    name: "yuurih",
    realName: "Yuri Santos",
    role: "Rifler",
    image: "/images/yuurih.jpg",
    stats: {
      rating: "1.18",
      kd: "1.19",
      headshots: "50.1%",
    },
  },
  {
    id: 4,
    name: "chelo",
    realName: "Marcelo Cespedes",
    role: "Rifler",
    image: "/images/chelo.jpg",
    stats: {
      rating: "1.12",
      kd: "1.10",
      headshots: "49.5%",
    },
  },
  {
    id: 5,
    name: "drop",
    realName: "André Abreu",
    role: "AWPer",
    image: "/images/drop.jpg",
    stats: {
      rating: "1.15",
      kd: "1.14",
      headshots: "38.3%",
    },
  },
]

export default function TeamHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {players.map((player) => (
        <Card key={player.id} className="bg-[#111111] border-[#222222] overflow-hidden">
          <div className="h-48 relative">
            <Image src={player.image || "/placeholder.svg"} alt={player.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-xl font-bold text-white">{player.name}</h3>
              <p className="text-sm text-gray-400">{player.realName}</p>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-[#00FF00] mb-2">{player.role}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-400">Rating</p>
                <p className="font-bold">{player.stats.rating}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">K/D</p>
                <p className="font-bold">{player.stats.kd}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">HS%</p>
                <p className="font-bold">{player.stats.headshots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
