"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { FileText, Upload, X, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

interface DocumentUploaderProps {
  verificationData: {
    idDocument: File | null
    selfie: File | null
    addressProof: File | null
    faceVerified: boolean
  }
  updateVerificationData: (data: Partial<DocumentUploaderProps["verificationData"]>) => void
}

export function DocumentUploader({ verificationData, updateVerificationData }: DocumentUploaderProps) {
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [addressPreview, setAddressPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idDocument" | "addressProof") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [type]: "Formato inválido. Use JPG, PNG ou PDF.",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        [type]: "Arquivo muito grande. Máximo 5MB.",
      })
      return
    }

    // Clear errors
    setErrors({
      ...errors,
      [type]: "",
    })

    // Update state
    updateVerificationData({ [type]: file })

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "idDocument") {
          setIdPreview(e.target?.result as string)
        } else {
          setAddressPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, just show an icon
      if (type === "idDocument") {
        setIdPreview("pdf")
      } else {
        setAddressPreview("pdf")
      }
    }
  }

  const removeFile = (type: "idDocument" | "addressProof") => {
    updateVerificationData({ [type]: null })
    if (type === "idDocument") {
      setIdPreview(null)
    } else {
      setAddressPreview(null)
    }
    setErrors({
      ...errors,
      [type]: "",
    })
  }

  return (
    <div className="space-y-6 border">
      <h3 className="text-lg font-medium">Upload de Documentos</h3>
      <p className="text-sm text-gray-400">Faça o upload dos documentos necessários para verificar sua identidade</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Documento de Identidade</h4>
          <p className="text-sm text-gray-400">RG, CNH ou Passaporte (frente e verso em uma única imagem)</p>

          {!verificationData.idDocument ? (
            <Card className="border-dashed border-2 border-gray-600 bg-gray-800/50">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400 mb-2">Arraste e solte ou clique para fazer upload</p>
                <Button variant="outline" className="relative" size="sm">
                  Selecionar Arquivo
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, "idDocument")}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Documento enviado</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile("idDocument")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {idPreview && idPreview !== "pdf" ? (
                  <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={idPreview || "/placeholder.svg"}
                      alt="Documento de identidade"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-2">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="text-sm truncate">{verificationData.idDocument?.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {errors.idDocument && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{errors.idDocument}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Comprovante de Residência</h4>
          <p className="text-sm text-gray-400">
            Conta de luz, água, telefone ou internet (emitido nos últimos 3 meses)
          </p>

          {!verificationData.addressProof ? (
            <Card className="border-dashed border-2 border-gray-600 bg-gray-800/50">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400 mb-2">Arraste e solte ou clique para fazer upload</p>
                <Button variant="outline" className="relative" size="sm">
                  Selecionar Arquivo
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, "addressProof")}
                    accept="image/jpeg,image/png,application/pdf"
                  />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium">Documento enviado</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile("addressProof")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {addressPreview && addressPreview !== "pdf" ? (
                  <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={addressPreview || "/placeholder.svg"}
                      alt="Comprovante de residência"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center mt-2">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="text-sm truncate">{verificationData.addressProof?.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {errors.addressProof && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{errors.addressProof}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Alert className="bg-gray-700 border-gray-600">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Certifique-se de que os documentos estão legíveis e que todas as informações estão visíveis. Documentos
          ilegíveis ou incompletos podem atrasar o processo de verificação.
        </AlertDescription>
      </Alert>
    </div>
  )
}
