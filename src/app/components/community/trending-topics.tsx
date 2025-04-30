import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { TrendingUp, Hash, FlameIcon as Fire } from "lucide-react"

export default function TrendingTopics() {
  // Mock data for trending topics
  const trendingTopics = [
    { id: 1, name: "ESL Pro League", count: 156, hot: true },
    { id: 2, name: "KSCERATO", count: 124, hot: true },
    { id: 3, name: "Nova Camisa", count: 98, hot: false },
    { id: 4, name: "IEM Dallas", count: 87, hot: false },
    { id: 5, name: "arT Clutch", count: 76, hot: true },
    { id: 6, name: "Valorant", count: 65, hot: false },
    { id: 7, name: "Próximo Major", count: 54, hot: false },
    { id: 8, name: "Treino", count: 43, hot: false },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-[#00FF00]" />
          Tópicos em Alta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Badge
              key={topic.id}
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600 cursor-pointer flex items-center"
            >
              <Hash className="h-3 w-3 mr-1" />
              {topic.name}
              {topic.hot && <Fire className="h-3 w-3 ml-1 text-orange-500" />}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
