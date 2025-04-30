"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent } from "../../components/ui/card"
import { Plus, X, LinkIcon, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

interface GamingProfilesFormProps {
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
  updateSocialData: (data: Partial<GamingProfilesFormProps["socialData"]>) => void
}

export function GamingProfilesForm({ socialData, updateSocialData }: GamingProfilesFormProps) {
  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [validationStatus, setValidationStatus] = useState<Record<string, "validating" | "valid" | "invalid" | null>>(
    {},
  )
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: "steamProfile" | "faceitProfile" | "hltv" | "vlr", value: string) => {
    updateSocialData({ [field]: value })
  }

  const addOtherProfile = () => {
    if (newPlatform && newUrl) {
      // Basic URL validation
      if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
        setValidationErrors({
          ...validationErrors,
          otherProfile: "URL inválida. Deve começar com http:// ou https://",
        })
        return
      }

      const updatedProfiles = [...socialData.otherProfiles, { platform: newPlatform, url: newUrl }]

      updateSocialData({ otherProfiles: updatedProfiles })
      setNewPlatform("")
      setNewUrl("")
      setValidationErrors({
        ...validationErrors,
        otherProfile: "",
      })
    } else {
      setValidationErrors({
        ...validationErrors,
        otherProfile: "Plataforma e URL são obrigatórios",
      })
    }
  }

  const removeOtherProfile = (index: number) => {
    const updatedProfiles = [...socialData.otherProfiles]
    updatedProfiles.splice(index, 1)
    updateSocialData({ otherProfiles: updatedProfiles })
  }

  const validateProfile = (type: string, url: string) => {
    if (!url) return

    setValidationStatus({
      ...validationStatus,
      [type]: "validating",
    })

    // In a real app, this would be an API call to validate the profile
    setTimeout(() => {
      // Simulate validation (80% success rate for demo)
      const isValid = Math.random() > 0.2

      setValidationStatus({
        ...validationStatus,
        [type]: isValid ? "valid" : "invalid",
      })

      if (!isValid) {
        setValidationErrors({
          ...validationErrors,
          [type]: "Não foi possível validar este perfil. Verifique a URL e tente novamente.",
        })
      } else {
        setValidationErrors({
          ...validationErrors,
          [type]: "",
        })
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Seus Perfis de Jogos</h3>
      <p className="text-sm text-gray-400">Adicione seus perfis em plataformas de jogos e sites de esports</p>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="steamProfile">Perfil Steam</Label>
            {validationStatus.steam === "validating" && (
              <span className="text-xs text-blue-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />
                Validando...
              </span>
            )}
            {validationStatus.steam === "valid" && (
              <span className="text-xs text-green-400 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Perfil válido
              </span>
            )}
            {validationStatus.steam === "invalid" && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Perfil inválido
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              id="steamProfile"
              placeholder="https://steamcommunity.com/id/seu-perfil"
              value={socialData.steamProfile}
              onChange={(e) => handleInputChange("steamProfile", e.target.value)}
              className="bg-gray-700 border-gray-600 flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => validateProfile("steam", socialData.steamProfile)}
              disabled={!socialData.steamProfile || validationStatus.steam === "validating"}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          {validationErrors.steam && <p className="text-xs text-red-400">{validationErrors.steam}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="faceitProfile">Perfil FACEIT</Label>
            {validationStatus.faceit === "validating" && (
              <span className="text-xs text-blue-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />
                Validando...
              </span>
            )}
            {validationStatus.faceit === "valid" && (
              <span className="text-xs text-green-400 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Perfil válido
              </span>
            )}
            {validationStatus.faceit === "invalid" && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Perfil inválido
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              id="faceitProfile"
              placeholder="https://www.faceit.com/en/players/seu-perfil"
              value={socialData.faceitProfile}
              onChange={(e) => handleInputChange("faceitProfile", e.target.value)}
              className="bg-gray-700 border-gray-600 flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => validateProfile("faceit", socialData.faceitProfile)}
              disabled={!socialData.faceitProfile || validationStatus.faceit === "validating"}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          {validationErrors.faceit && <p className="text-xs text-red-400">{validationErrors.faceit}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hltv">Perfil HLTV</Label>
            {validationStatus.hltv === "validating" && (
              <span className="text-xs text-blue-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />
                Validando...
              </span>
            )}
            {validationStatus.hltv === "valid" && (
              <span className="text-xs text-green-400 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Perfil válido
              </span>
            )}
            {validationStatus.hltv === "invalid" && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Perfil inválido
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              id="hltv"
              placeholder="https://www.hltv.org/profile/seu-perfil"
              value={socialData.hltv}
              onChange={(e) => handleInputChange("hltv", e.target.value)}
              className="bg-gray-700 border-gray-600 flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => validateProfile("hltv", socialData.hltv)}
              disabled={!socialData.hltv || validationStatus.hltv === "validating"}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          {validationErrors.hltv && <p className="text-xs text-red-400">{validationErrors.hltv}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="vlr">Perfil VLR.gg</Label>
            {validationStatus.vlr === "validating" && (
              <span className="text-xs text-blue-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />
                Validando...
              </span>
            )}
            {validationStatus.vlr === "valid" && (
              <span className="text-xs text-green-400 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Perfil válido
              </span>
            )}
            {validationStatus.vlr === "invalid" && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Perfil inválido
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              id="vlr"
              placeholder="https://www.vlr.gg/user/seu-perfil"
              value={socialData.vlr}
              onChange={(e) => handleInputChange("vlr", e.target.value)}
              className="bg-gray-700 border-gray-600 flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => validateProfile("vlr", socialData.vlr)}
              disabled={!socialData.vlr || validationStatus.vlr === "validating"}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
          {validationErrors.vlr && <p className="text-xs text-red-400">{validationErrors.vlr}</p>}
        </div>

        <div className="space-y-4">
          <Label>Outros Perfis</Label>

          {socialData.otherProfiles.length > 0 && (
            <div className="space-y-2">
              {socialData.otherProfiles.map((profile, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{profile.platform}</p>
                      <p className="text-sm text-gray-400 truncate max-w-xs">{profile.url}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeOtherProfile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-1">
              <Input
                placeholder="Plataforma"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="md:col-span-2 flex space-x-2">
              <Input
                placeholder="URL do perfil"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 flex-1"
              />
              <Button variant="outline" onClick={addOtherProfile}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
          {validationErrors.otherProfile && <p className="text-xs text-red-400">{validationErrors.otherProfile}</p>}
        </div>
      </div>

      <Alert className="bg-gray-700 border-gray-600">
        <LinkIcon className="h-4 w-4" />
        <AlertTitle>Por que validamos seus perfis?</AlertTitle>
        <AlertDescription>
          A validação de perfis nos ajuda a confirmar seu engajamento com esports e personalizar sua experiência.
          Utilizamos IA para analisar o conteúdo e verificar a relevância para seu perfil de fã.
        </AlertDescription>
      </Alert>
    </div>
  )
}
