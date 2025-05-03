"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Camera, Check, RefreshCw, AlertCircle, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FaceVerificationService } from "../../services/verification.service"

interface FaceVerificationProps {
  verificationData: {
    idDocument: File | null
    selfie: File | null
    addressProof: File | null
    faceVerified: boolean
  }
  updateVerificationData: (data: Partial<FaceVerificationProps["verificationData"]>) => void
}

export function FaceVerificationEnhanced({ verificationData, updateVerificationData }: FaceVerificationProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setVerificationError("Não foi possível acessar a câmera. Verifique as permissões do navegador.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)

        // Convert data URL to File object
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.png", { type: "image/png" })
            updateVerificationData({ selfie: file })
          }
        }, "image/png")

        stopCamera()
      }
    }
  }, [stopCamera, updateVerificationData])

  const resetCapture = useCallback(() => {
    setCapturedImage(null)
    updateVerificationData({ selfie: null })
    setConfidenceScore(null)
    setVerificationError(null)
    startCamera()
  }, [startCamera, updateVerificationData])

  const verifyFace = useCallback(async () => {
    setIsVerifying(true)
    setVerificationError(null)
    setVerificationProgress(10)

    if (!verificationData.idDocument || !verificationData.selfie) {
      setVerificationError("Por favor, envie o documento de identidade e capture a selfie.")
      setIsVerifying(false)
      setVerificationProgress(0)
      return
    }

    try {
      setVerificationProgress(30)

      // Verificação direta sem autenticação
      setVerificationProgress(50)
      const result = await FaceVerificationService.verifyFaceMatch(verificationData.idDocument, verificationData.selfie)

      setVerificationProgress(90)

      if (result.success) {
        updateVerificationData({ faceVerified: result.faceVerified })
        if (result.confidence) {
          setConfidenceScore(result.confidence)
        }

        if (!result.faceVerified) {
          setVerificationError(result.message || "A foto não corresponde ao documento enviado.")
        }
      } else {
        setVerificationError(result.message || "Falha na verificação facial.")
      }
    } catch (error) {
      console.error("Erro ao verificar face:", error)
      setVerificationError("Ocorreu um erro durante a verificação. Tente novamente.")
    } finally {
      setVerificationProgress(100)
      setIsVerifying(false)

      // Reset progress after a delay
      setTimeout(() => {
        setVerificationProgress(0)
      }, 1000)
    }
  }, [verificationData, updateVerificationData])

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Verificação Facial</h3>
      <p className="text-sm text-gray-400">Tire uma selfie para verificarmos que você é a pessoa nos documentos</p>

      <div className="flex flex-col items-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={startCamera}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 py-2 px-4"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Iniciar Câmera
                      </Button>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!stream ? "hidden" : ""}`}
                  />
                </div>

                {stream && (
                  <Button
                    onClick={captureImage}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00FF00] text-white shadow hover:bg-[#38a838] h-10 py-2 px-4 w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar Foto
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Selfie capturada"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={resetCapture}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Nova Foto
                  </Button>

                  <Button
                    onClick={verifyFace}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00FF00] text-white shadow hover:bg-[#34a334] h-10 py-2 px-4 flex-1"
                    disabled={isVerifying || verificationData.faceVerified || !verificationData.idDocument}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : verificationData.faceVerified ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Verificado
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verificar
                      </>
                    )}
                  </Button>
                </div>

                {isVerifying && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Processando verificação</span>
                      <span>{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden canvas for capturing image */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {verificationError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na verificação</AlertTitle>
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
        )}

        {verificationData.faceVerified && (
          <Alert className="mt-4 bg-green-900/30 border-green-800">
            <Check className="h-4 w-4" />
            <AlertTitle>Verificação concluída</AlertTitle>
            <AlertDescription>
              Sua identidade foi verificada com sucesso!
              {confidenceScore !== null && (
                <div className="mt-2">
                  <span className="text-sm">Nível de confiança: </span>
                  <span className="font-medium">{(confidenceScore * 100).toFixed(1)}%</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Alert className="bg-gray-700 border-gray-600">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Dicas para uma boa foto</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Certifique-se de estar em um ambiente bem iluminado</li>
            <li>Olhe diretamente para a câmera</li>
            <li>Não use óculos escuros, chapéus ou máscaras</li>
            <li>Mantenha uma expressão neutra</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
