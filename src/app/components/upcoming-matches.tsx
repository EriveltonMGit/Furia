import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import Image from "next/image"

const upcomingMatches = [
  {
    id: 1,
    tournament: "ESL Pro League Season 19", // Keep as is (data)
    opponent: "Team Liquid", // Keep as is (data)
    date: "2025-05-02T18:00:00Z",
    opponentLogo: "/images/team-liquid.png",
    format: "BO3", // Keep as is (common abbreviation)
  },
  {
    id: 2,
    tournament: "BLAST Premier Spring Finals", // Keep as is (data)
    opponent: "Natus Vincere", // Keep as is (data)
    date: "2025-05-10T15:30:00Z",
    opponentLogo: "/images/navi.png",
    format: "BO3", // Keep as is (common abbreviation)
  },
  {
    id: 3,
    tournament: "IEM Dallas 2025", // Keep as is (data)
    opponent: "G2 Esports", // Keep as is (data)
    date: "2025-05-18T20:00:00Z",
    opponentLogo: "/images/g2.png",
    format: "BO3", // Keep as is (common abbreviation)
  },
]

export default function UpcomingMatches() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {upcomingMatches.map((match) => {
        const matchDate = new Date(match.date)
        // MODIFICATION: Change locale to "pt-BR" for date formatting
        const formattedDate = matchDate.toLocaleDateString("pt-BR", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        // MODIFICATION: Change locale to "pt-BR" for time formatting
        const formattedTime = matchDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })

        return (
          <Card key={match.id} className="bg-[#111111] border-[#222222] overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b border-[#222222]">
                <Badge variant="outline" className="bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/20">
                  {/* Keep tournament name as is (data) */}
                  {match.tournament}
                </Badge>
                <p className="text-sm text-gray-400 mt-2">
                  {/* Date and time format will now be in Portuguese locale */}
                  {formattedDate} • {formattedTime}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 relative mr-4">
                      {/* Keep image src and alt as is */}
                      <Image src="/images/furia-logo.png" alt="FURIA" fill className="object-contain" />
                    </div>
                    {/* Keep team name as is */}
                    <span className="font-bold">FURIA</span>
                  </div>
                  {/* Keep "VS" as is (common abbreviation) */}
                  <span className="text-[#00FF00] font-bold">VS</span>
                  <div className="flex items-center">
                    {/* Keep opponent name as is (data) */}
                    <span className="font-bold mr-4">{match.opponent}</span>
                    <div className="h-12 w-12 relative">
                      {/* Keep image src and alt as is (using opponent name from data) */}
                      <Image
                        src={match.opponentLogo || "/placeholder.svg"}
                        alt={match.opponent}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                   {/* Keep format as is (common abbreviation) */}
                  <Badge className="bg-[#333333] hover:bg-[#444444]">{match.format}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}