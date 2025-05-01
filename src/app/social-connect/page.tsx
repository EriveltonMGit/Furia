"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle2, Share2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SocialConnector } from "../components/social/social-connector"
import { GamingProfilesForm } from "../components/social/gaming-profiles-form"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

export default function SocialConnect() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [socialData, setSocialData] = useState({
    twitter: false,
    instagram: false,
    facebook: false,
    discord: false,
    twitch: false,
    steamProfile: "",
    faceitProfile: "",
    hltv: "",
    vlr: "",
    otherProfiles: [] as { platform: string; url: string }[],
  })

  const totalSteps = 2

  const updateSocialData = (data: Partial<typeof socialData>) => {
    setSocialData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit social data and redirect
      console.log("Social data submitted:", socialData)
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = () => {
    if (currentStep === 1) {
      // At least one social network connected
      return (
        socialData.twitter || socialData.instagram || socialData.facebook || socialData.discord || socialData.twitch
      )
    } else if (currentStep === 2) {
      // At least one gaming profile added
      return (
        socialData.steamProfile !== "" ||
        socialData.faceitProfile !== "" ||
        socialData.hltv !== "" ||
        socialData.vlr !== "" ||
        socialData.otherProfiles.length > 0
      )
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto py-8">
        <Link href="/verification" className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para verificação
        </Link>

        <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Conecte suas Redes Sociais</CardTitle>
            <CardDescription className="text-gray-400">
              Vincule suas redes sociais e perfis de jogos para uma experiência personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-900/30 border-blue-800">
              <Share2 className="h-4 w-4" />
              <AlertTitle>Por que conectar suas redes?</AlertTitle>
              <AlertDescription>
                Ao conectar suas redes sociais, podemos analisar seu engajamento com esports e a FURIA, oferecendo
                experiências e conteúdos personalizados para seu perfil de fã.
              </AlertDescription>
            </Alert>

            <div className="flex items-center mb-8">
              <div className={`h-1 flex-1 ${currentStep === 1 ? "bg-[#00FF00]" : "bg-gray-600"}`}></div>
              <div className={`h-1 flex-1 ${currentStep === 2 ? "bg-[#00FF00]" : "bg-gray-600"}`}></div>
            </div>

            <div className="mt-8">
              {currentStep === 1 && <SocialConnector socialData={socialData} updateSocialData={updateSocialData} />}

              {currentStep === 2 && <GamingProfilesForm socialData={socialData} updateSocialData={updateSocialData} />}
            </div>
          </CardContent>
         
        </Card>
      </div>
    </div>
  )
}
