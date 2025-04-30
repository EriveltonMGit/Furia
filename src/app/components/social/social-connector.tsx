"use client"

import { Button } from "../../components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Twitter, Instagram, Facebook, MessageCircle, Twitch } from "lucide-react"
import { Badge } from "../../components/ui/badge"

interface SocialConnectorProps {
  socialData: {
    twitter: boolean
    instagram: boolean
    facebook: boolean
    discord: boolean
    twitch: boolean
    steamProfile: string
    faceitProfile: string
    hltv: string
    vlr: string
    otherProfiles: { platform: string; url: string }[]
  }
  updateSocialData: (data: Partial<SocialConnectorProps["socialData"]>) => void
}

export function SocialConnector({ socialData, updateSocialData }: SocialConnectorProps) {
  const connectSocial = (platform: "twitter" | "instagram" | "facebook" | "discord" | "twitch") => {
    // In a real app, this would open OAuth flow
    // For demo, we'll just toggle the state
    updateSocialData({ [platform]: !socialData[platform] })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Conecte suas Redes Sociais</h3>
      <p className="text-sm text-gray-400">
        Conecte suas redes sociais para uma experiência personalizada e análise de engajamento
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`bg-gray-800 border-gray-700 ${socialData.twitter ? "ring-2 ring-blue-500" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                Twitter
              </CardTitle>
              {socialData.twitter && <Badge className="bg-blue-600">Conectado</Badge>}
            </div>
            <CardDescription>Conecte sua conta do Twitter para analisarmos seu engajamento com esports</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant={socialData.twitter ? "outline" : "default"}
              className={socialData.twitter ? "" : "bg-blue-600 hover:bg-blue-700"}
              onClick={() => connectSocial("twitter")}
              size="sm"
            >
              {socialData.twitter ? "Desconectar" : "Conectar Twitter"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`bg-gray-800 border-gray-700 ${socialData.instagram ? "ring-2 ring-purple-500" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Instagram className="h-5 w-5 text-purple-400 mr-2" />
                Instagram
              </CardTitle>
              {socialData.instagram && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Conectado</Badge>
              )}
            </div>
            <CardDescription>
              Conecte sua conta do Instagram para analisarmos seu engajamento com esports
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant={socialData.instagram ? "outline" : "default"}
              className={
                socialData.instagram
                  ? ""
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }
              onClick={() => connectSocial("instagram")}
              size="sm"
            >
              {socialData.instagram ? "Desconectar" : "Conectar Instagram"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`bg-gray-800 border-gray-700 ${socialData.facebook ? "ring-2 ring-blue-600" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Facebook className="h-5 w-5 text-blue-500 mr-2" />
                Facebook
              </CardTitle>
              {socialData.facebook && <Badge className="bg-blue-600">Conectado</Badge>}
            </div>
            <CardDescription>
              Conecte sua conta do Facebook para analisarmos seu engajamento com esports
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant={socialData.facebook ? "outline" : "default"}
              className={socialData.facebook ? "" : "bg-blue-600 hover:bg-blue-700"}
              onClick={() => connectSocial("facebook")}
              size="sm"
            >
              {socialData.facebook ? "Desconectar" : "Conectar Facebook"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`bg-gray-800 border-gray-700 ${socialData.discord ? "ring-2 ring-indigo-500" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 text-indigo-400 mr-2" />
                Discord
              </CardTitle>
              {socialData.discord && <Badge className="bg-indigo-600">Conectado</Badge>}
            </div>
            <CardDescription>
              Conecte sua conta do Discord para analisarmos sua participação em comunidades de esports
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant={socialData.discord ? "outline" : "default"}
              className={socialData.discord ? "" : "bg-indigo-600 hover:bg-indigo-700"}
              onClick={() => connectSocial("discord")}
              size="sm"
            >
              {socialData.discord ? "Desconectar" : "Conectar Discord"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`bg-gray-800 border-gray-700 ${socialData.twitch ? "ring-2 ring-purple-600" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Twitch className="h-5 w-5 text-purple-500 mr-2" />
                Twitch
              </CardTitle>
              {socialData.twitch && <Badge className="bg-purple-600">Conectado</Badge>}
            </div>
            <CardDescription>
              Conecte sua conta da Twitch para analisarmos seu engajamento com streams de esports
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant={socialData.twitch ? "outline" : "default"}
              className={socialData.twitch ? "" : "bg-purple-600 hover:bg-purple-700"}
              onClick={() => connectSocial("twitch")}
              size="sm"
            >
              {socialData.twitch ? "Desconectar" : "Conectar Twitch"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
