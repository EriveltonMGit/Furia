import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Star } from "lucide-react"

interface FanEngagementProps {
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

export function FanEngagement({ userData }: FanEngagementProps) {
  // Mock data for engagement metrics
  const engagementData = {
    socialEngagement: 78,
    eventAttendance: 65,
    merchandisePurchases: 42,
    contentInteraction: 89,
    communityParticipation: 56,
    totalEngagementScore: 72,
    engagementHistory: [
      { month: "Jan", score: 65 },
      { month: "Fev", score: 68 },
      { month: "Mar", score: 62 },
      { month: "Abr", score: 70 },
      { month: "Mai", score: 72 },
      { month: "Jun", score: 78 },
    ],
    topEngagementSources: [
      { source: "Twitter", percentage: 35 },
      { source: "Eventos ao vivo", percentage: 25 },
      { source: "Twitch", percentage: 20 },
      { source: "Compras", percentage: 15 },
      { source: "Discord", percentage: 5 },
    ],
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Engajamento de Fã</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pontuação de Engajamento</CardTitle>
            <CardDescription>Seu nível de interação com a FURIA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gray-700 rounded-full mb-2">
                  <div className="text-3xl font-bold text-[#00FF00]">{engagementData.totalEngagementScore}</div>
                </div>
                <p className="text-sm text-gray-400">Pontuação Total</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Redes Sociais</span>
                    <span className="text-sm font-medium">{engagementData.socialEngagement}%</span>
                  </div>
                  <Progress value={engagementData.socialEngagement} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Eventos</span>
                    <span className="text-sm font-medium">{engagementData.eventAttendance}%</span>
                  </div>
                  <Progress value={engagementData.eventAttendance} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Compras</span>
                    <span className="text-sm font-medium">{engagementData.merchandisePurchases}%</span>
                  </div>
                  <Progress value={engagementData.merchandisePurchases} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Conteúdo</span>
                    <span className="text-sm font-medium">{engagementData.contentInteraction}%</span>
                  </div>
                  <Progress value={engagementData.contentInteraction} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nível de Fã</CardTitle>
            <CardDescription>Seu status na comunidade FURIA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{userData.fanPoints}</span>
                </div>
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#00FF00"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      userData?.fanPoints !== undefined 
                        ? (251.2 * (100 - userData.fanPoints / 20)) / 100 
                        : 0
                    }
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="text-center">
                <Badge className="bg-[#00FF00] mb-2">
                  <Star className="h-3 w-3 mr-1" />
                  {userData.fanLevel}
                </Badge>
                <p className="text-sm text-gray-400">Próximo nível: 1500 pontos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Histórico de Engajamento</CardTitle>
            <CardDescription>Sua evolução nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-end justify-between px-2">
              {engagementData.engagementHistory.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-10 bg-[#00FF00] rounded-t" style={{ height: `${item.score * 0.6}%` }}></div>
                  <span className="text-xs mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fontes de Engajamento</CardTitle>
            <CardDescription>De onde vem seu engajamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementData.topEngagementSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{source.source}</span>
                    <span className="text-sm font-medium">{source.percentage}%</span>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
