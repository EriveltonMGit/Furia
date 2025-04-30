"use client"

import { Progress } from "../components/ui/progress" // Note: This import exists but the component is commented out in the original code.
import { Badge } from "../components/ui/badge"
import Image from "next/image"

export default function LiveMatchStatus() {
  // Mock data for a live match
  const liveMatch = {
    tournament: "ESL Pro League Season 19", // Keep as is (data)
    opponent: "Team Vitality", // Keep as is (data)
    map: "Inferno", // Keep as is (data)
    score: {
      furia: 13,
      opponent: 11,
    },
    round: 24,
    totalRounds: 30,
    players: [
      { name: "arT", kills: 18, deaths: 14, assists: 5 },
      { name: "KSCERATO", kills: 22, deaths: 12, assists: 7 },
      { name: "yuurih", kills: 19, deaths: 13, assists: 4 },
      { name: "chelo", kills: 15, deaths: 15, assists: 6 },
      { name: "drop", kills: 17, deaths: 14, assists: 3 },
    ],
  }

  // const roundProgress = (liveMatch.round / liveMatch.totalRounds) * 100 // Keep as is (calculation)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Translated "LIVE" to "AO VIVO" */}
        <Badge className="bg-red-500 animate-pulse">AO VIVO</Badge>
        {/* Keep tournament name as is (data) */}
        <span className="text-sm text-gray-400">{liveMatch.tournament}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 relative mr-2">
            {/* Keep image src and alt as is */}
            <Image src="/img/logo.png" alt="FURIA" fill className="object-contain" />
          </div>
          <div>
            {/* Keep team name as is */}
            <p className="font-bold text-[10px]">FURIA</p>
            {/* Keep score as is */}
            <p className="text-2xl font-bold text-[#00FF00]">{liveMatch.score.furia}</p>
          </div>
        </div>
        <div className="text-center">
          {/* Keep map name as is (data) */}
          <p className="text-sm text-gray-400 mb-1">{liveMatch.map}</p>
          <Badge variant="outline" className="bg-[#222222]">
            {/* Translated "Round" */}
            Rodada {liveMatch.round}
          </Badge>
        </div>
        <div className="flex items-center">
          <div>
            {/* Keep opponent name as is (data) */}
            <p className="font-bold text-right text-[10px]">{liveMatch.opponent}</p>
            {/* Keep score as is */}
            <p className="text-2xl font-bold text-right">{liveMatch.score.opponent}</p>
          </div>
          <div className="h-10 w-10 relative ml-2">
             {/* Keep image src and alt as is */}
            <Image src="/img/Vitality.webp" alt={liveMatch.opponent} fill className="object-contain" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          {/* Translated "Round" */}
          <span>Rodada {liveMatch.round}</span>
          {/* Translated "Round" */}
          <span>Rodada {liveMatch.totalRounds}</span>
        </div>
        {/* <Progress value={roundProgress} className="h-2 bg-[#222222]" indicatorClassName="bg-[#00FF00]" /> */}
      </div>

      <div className="mt-6">
        {/* Translated "FURIA Player Stats" */}
        <h4 className="text-sm font-medium mb-2">Estatísticas dos Jogadores da FURIA</h4>
        <div className="space-y-2">
          {liveMatch.players.map((player, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              {/* Keep player name as is (data) */}
              <span className="w-24 truncate">{player.name}</span>
              <div className="flex gap-4">
                {/* Keep KDA labels as is (common abbreviations) and stats (data) */}
                <span className="text-[#00FF00]">{player.kills}</span>
                <span className="text-red-500">{player.deaths}</span>
                <span className="text-yellow-500">{player.assists}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end text-xs text-gray-400 mt-1">
          {/* Keep KDA labels as is (common abbreviations) */}
          <span className="mr-4">K</span>
          <span className="mr-4">D</span>
          <span>A</span>
        </div>
      </div>
    </div>
  )
}