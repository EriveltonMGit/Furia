"use client"

import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { useState } from "react"

interface InterestsFormProps {
  formData: {
    favoriteGames: string[]
    favoriteTeams: string[]
    followedPlayers: string[]
    preferredPlatforms: string[]
  }
  updateFormData: (
    data: Partial<{
      favoriteGames: string[]
      favoriteTeams: string[]
      followedPlayers: string[]
      preferredPlatforms: string[]
    }>,
  ) => void
}

export function InterestsForm({ formData, updateFormData }: InterestsFormProps) {
  const [customGame, setCustomGame] = useState("")
  const [customTeam, setCustomTeam] = useState("")
  const [customPlayer, setCustomPlayer] = useState("")

  const games = [
    "Counter-Strike 2",
    "Valorant",
    "League of Legends",
    "Dota 2",
    "Apex Legends",
    "Fortnite",
    "Rainbow Six Siege",
    "Rocket League",
  ]

  const teams = ["FURIA", "Team Liquid", "Natus Vincere", "G2 Esports", "FaZe Clan", "Cloud9", "LOUD", "paiN Gaming"]

  const players = ["arT", "KSCERATO", "yuurih", "chelo", "drop", "s1mple", "ZywOo", "NiKo"]

  const platforms = ["Twitch", "YouTube", "Steam", "Epic Games", "FACEIT", "HLTV", "VLR.gg", "Discord"]

  const handleGameChange = (game: string, checked: boolean) => {
    if (checked) {
      updateFormData({ favoriteGames: [...formData.favoriteGames, game] })
    } else {
      updateFormData({
        favoriteGames: formData.favoriteGames.filter((g) => g !== game),
      })
    }
  }

  const handleTeamChange = (team: string, checked: boolean) => {
    if (checked) {
      updateFormData({ favoriteTeams: [...formData.favoriteTeams, team] })
    } else {
      updateFormData({
        favoriteTeams: formData.favoriteTeams.filter((t) => t !== team),
      })
    }
  }

  const handlePlayerChange = (player: string, checked: boolean) => {
    if (checked) {
      updateFormData({ followedPlayers: [...formData.followedPlayers, player] })
    } else {
      updateFormData({
        followedPlayers: formData.followedPlayers.filter((p) => p !== player),
      })
    }
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      updateFormData({ preferredPlatforms: [...formData.preferredPlatforms, platform] })
    } else {
      updateFormData({
        preferredPlatforms: formData.preferredPlatforms.filter((p) => p !== platform),
      })
    }
  }

  const addCustomGame = () => {
    if (customGame && !formData.favoriteGames.includes(customGame)) {
      updateFormData({ favoriteGames: [...formData.favoriteGames, customGame] })
      setCustomGame("")
    }
  }

  const addCustomTeam = () => {
    if (customTeam && !formData.favoriteTeams.includes(customTeam)) {
      updateFormData({ favoriteTeams: [...formData.favoriteTeams, customTeam] })
      setCustomTeam("")
    }
  }

  const addCustomPlayer = () => {
    if (customPlayer && !formData.followedPlayers.includes(customPlayer)) {
      updateFormData({ followedPlayers: [...formData.followedPlayers, customPlayer] })
      setCustomPlayer("")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Seus Interesses</h3>
      <p className="text-sm text-gray-400">
        Conte-nos sobre seus interesses em esports para personalizarmos sua experiência
      </p>

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="font-medium">Jogos Favoritos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {games.map((game) => (
              <div key={game} className="flex items-center space-x-2">
                <Checkbox
                  id={`game-${game}`}
                  checked={formData.favoriteGames.includes(game)}
                  onCheckedChange={(checked) => handleGameChange(game, checked as boolean)}
                />
                <Label htmlFor={`game-${game}`} className="text-sm">
                  {game}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outro jogo"
              value={customGame}
              onChange={(e) => setCustomGame(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <button
              onClick={addCustomGame}
              className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              type="button"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Times Favoritos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teams.map((team) => (
              <div key={team} className="flex items-center space-x-2">
                <Checkbox
                  id={`team-${team}`}
                  checked={formData.favoriteTeams.includes(team)}
                  onCheckedChange={(checked) => handleTeamChange(team, checked as boolean)}
                />
                <Label htmlFor={`team-${team}`} className="text-sm">
                  {team}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outro time"
              value={customTeam}
              onChange={(e) => setCustomTeam(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <button
              onClick={addCustomTeam}
              className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              type="button"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Jogadores que Você Segue</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players.map((player) => (
              <div key={player} className="flex items-center space-x-2">
                <Checkbox
                  id={`player-${player}`}
                  checked={formData.followedPlayers.includes(player)}
                  onCheckedChange={(checked) => handlePlayerChange(player, checked as boolean)}
                />
                <Label htmlFor={`player-${player}`} className="text-sm">
                  {player}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outro jogador"
              value={customPlayer}
              onChange={(e) => setCustomPlayer(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <button
              onClick={addCustomPlayer}
              className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              type="button"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Plataformas Preferidas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={formData.preferredPlatforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
