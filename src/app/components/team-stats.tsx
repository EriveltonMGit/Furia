import { Progress } from "../components/ui/progress" // Note: This import exists but the component is commented out in the original code.

export default function TeamStats() {
  // Mock data for team statistics
  const teamStats = {
    winRate: 68,
    mapsPlayed: 124,
    topMaps: [
      { name: "Inferno", winRate: 78 }, // Keep name as is (data)
      { name: "Mirage", winRate: 72 }, // Keep name as is (data)
      { name: "Nuke", winRate: 65 }, // Keep name as is (data)
      { name: "Ancient", winRate: 62 }, // Keep name as is (data)
      { name: "Vertigo", winRate: 58 }, // Keep name as is (data)
    ],
    recentResults: [
      { opponent: "Team Liquid", result: "W", score: "16-10" }, // Keep opponent name, result (W/L), score as is (data/common format)
      { opponent: "Natus Vincere", result: "L", score: "12-16" },
      { opponent: "G2 Esports", result: "W", score: "16-14" },
      { opponent: "Astralis", result: "W", score: "16-7" },
      { opponent: "FaZe Clan", result: "L", score: "13-16" },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          {/* Translated "Win Rate" */}
          <span className="text-sm">Taxa de Vitórias</span>
          {/* Keep win rate value as is */}
          <span className="font-bold">{teamStats.winRate}%</span>
        </div>
        {/* <Progress value={teamStats.winRate} className="h-2 bg-[#222222]" indicatorClassName="bg-[#00FF00]" /> */}
        {/* Translated "Based on {teamStats.mapsPlayed} maps played" */}
        <p className="text-xs text-gray-400 mt-1">Baseado em {teamStats.mapsPlayed} mapas jogados</p>
      </div>

      <div>
        {/* Translated "Top Maps" */}
        <h4 className="text-sm font-medium mb-3">Mapas Principais</h4>
        <div className="space-y-3">
          {teamStats.topMaps.map((map, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                 {/* Keep map name as is (data) */}
                <span className="text-sm">{map.name}</span>
                 {/* Keep win rate value as is */}
                <span className="text-sm font-medium">{map.winRate}%</span>
              </div>
              {/* <Progress value={map.winRate} className="h-1.5 bg-[#222222]" indicatorClassName="bg-[#00FF00]" /> */}
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Translated "Recent Results" */}
        <h4 className="text-sm font-medium mb-3 ">Resultados Recentes</h4>
        <div className="space-y-2 ">
          {teamStats.recentResults.map((match, index) => (
            <div key={index} className="flex justify-between items-center text-sm border ">
               {/* Keep opponent name as is (data) */}
              <span className="truncate max-w-[120px]">{match.opponent}</span>
              <div className="flex items-center justify-between  0 w-[30%]">
                 {/* Keep result (W/L) and score as is (data/common format) */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                    match.result === "W" ? "bg-[#00FF00] text-black" : "bg-red-500 text-white"
                  }`}
                >
                  {match.result}
                </span>
                <span>{match.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}