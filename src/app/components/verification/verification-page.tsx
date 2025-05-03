// src/app/components/verification/verification-page.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { DocumentUploader } from "../../components/verification/document-uploader"
import { updateVerificationStatus, getUserVerificationData } from "../../services/verification.service"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { CheckCircle, AlertTriangle, Hourglass, Clock } from "lucide-react"
import { Badge } from "../../components/ui/badge"

type VerificationStatus = "initial" | "pending" | "verified" | "rejected" | "failed"

export function VerificationPage() {
  const [verificationData, setVerificationData] = useState({
    idDocument: null as File | null,
    selfie: null as File | null,
    addressProof: null as File | null,
    faceVerified: false,
  })
  const [user, setUser] = useState<{
    uid: string
    verification_status?: string
    face_verified?: boolean
    verification_confidence?: number
    verification_date?: string
  } | null>({ uid: "ID_DO_USUARIO_LOGADO" }) // ⚠️ Substitua pela sua lógica real de obter o ID do usuário
  const [verificationStatusMessage, setVerificationStatusMessage] = useState<string | null>(null)
  const [overallVerificationStatus, setOverallVerificationStatus] = useState<VerificationStatus>("initial")
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const [verificationDate, setVerificationDate] = useState<string | null>(null)

  // Função para formatar timestamps ou strings de data
  const formatTimestampOrDateString = (timestampOrDateString: any): string => {
    if (timestampOrDateString) {
      // Tenta formatar timestamp do Firebase
      if (typeof timestampOrDateString === "object" && timestampOrDateString._seconds !== undefined) {
        try {
          const date = new Date(timestampOrDateString._seconds * 1000)
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("pt-BR")
          }
        } catch (e) {
          console.error("Erro ao formatar timestamp Firebase:", timestampOrDateString, e)
        }
      }

      // Tenta formatar como string de data padrão
      try {
        const date = new Date(timestampOrDateString)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("pt-BR")
        }
      } catch (e) {
        console.error("Erro ao formatar data string:", timestampOrDateString, e)
      }
    }
    return "N/A"
  }

  // Efeito para carregar o status de verificação do usuário quando o componente montar
  useEffect(() => {
    const fetchUserVerificationStatus = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserVerificationData(user.uid)
          if (userData) {
            setUser((prev) =>
              prev
                ? {
                    ...prev,
                    ...userData,
                  }
                : { uid: user.uid, ...userData },
            )

            // Atualiza o estado com base nos dados do usuário
            if (userData.verification_status === "verified" || userData.face_verified === true) {
              setOverallVerificationStatus("verified")
              setConfidenceScore(userData.verification_confidence || null)
              setVerificationDate(userData.verification_date || null)
              setVerificationStatusMessage(
                `Verificação concluída com sucesso! Nível de confiança: ${userData.verification_confidence ? (userData.verification_confidence * 100).toFixed(1) + "%" : "N/A"}`,
              )
            } else if (userData.verification_status === "pending") {
              setOverallVerificationStatus("pending")
              setVerificationStatusMessage("Sua verificação está em análise.")
            } else if (userData.verification_status === "rejected") {
              setOverallVerificationStatus("rejected")
              setVerificationStatusMessage("Sua verificação foi rejeitada. Por favor, tente novamente.")
            } else {
              setOverallVerificationStatus("initial")
              setVerificationStatusMessage(null) // Limpa a mensagem se não houver status específico
            }
          }
        } catch (error) {
          console.error("Erro ao buscar status de verificação:", error)
          setVerificationStatusMessage("Erro ao carregar o status de verificação.")
          setOverallVerificationStatus("failed")
        }
      }
    }

    fetchUserVerificationStatus()
  }, [user?.uid])

  const updateVerificationData = (data: Partial<typeof verificationData>) => {
    setVerificationData((prev) => ({ ...prev, ...data }))
  }

  const handleVerificationComplete = async (success: boolean, confidence?: number) => {
    if (success && user?.uid) {
      setConfidenceScore(confidence || null)
      setVerificationDate(new Date().toISOString())
      setVerificationStatusMessage(
        `Verificação concluída com sucesso! Nível de confiança: ${confidence ? (confidence * 100).toFixed(1) + "%" : "N/A"}`,
      )

      try {
        // Usar o UID do usuário autenticado
        await updateVerificationStatus(user.uid, {
          status: "verified",
          faceVerified: true,
          confidence: confidence,
        })
        console.log("Status de verificação atualizado pelo VerificationPage para o usuário:", user.uid)
        setOverallVerificationStatus("verified")

        // Atualiza o objeto user com os novos dados
        setUser((prev) =>
          prev
            ? {
                ...prev,
                verification_status: "verified",
                face_verified: true,
                verification_confidence: confidence,
                verification_date: new Date().toISOString(),
              }
            : null,
        )
      } catch (error) {
        console.error("Erro ao atualizar o status de verificação:", error)
        setVerificationStatusMessage("Erro ao atualizar o status de verificação.")
        setOverallVerificationStatus("failed")
      }
    } else if (!success) {
      setVerificationStatusMessage("Falha na verificação dos documentos.")
      setOverallVerificationStatus("failed")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Verificação de Identidade</h2>
        <p className="text-gray-500">Siga os passos para verificar sua identidade.</p>
        {/* Status de verificação */}
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="text-sm mr-2">Status de Verificação:</span>
            <Badge
              className={
                overallVerificationStatus === "verified" ||
                user?.verification_status === "verified" ||
                user?.face_verified === true
                  ? "bg-green-600"
                  : overallVerificationStatus === "pending" || user?.verification_status === "pending"
                    ? "bg-yellow-600"
                    : overallVerificationStatus === "rejected" || user?.verification_status === "rejected"
                      ? "bg-red-600"
                      : overallVerificationStatus === "failed"
                        ? "bg-red-600"
                        : "bg-gray-600"
              }
            >
              {overallVerificationStatus === "verified" ||
              user?.verification_status === "verified" ||
              user?.face_verified === true ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verificado
                </>
              ) : overallVerificationStatus === "pending" || user?.verification_status === "pending" ? (
                <>
                  <Hourglass className="h-3 w-3 mr-1" />
                  Pendente
                </>
              ) : overallVerificationStatus === "rejected" || user?.verification_status === "rejected" ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Rejeitado
                </>
              ) : overallVerificationStatus === "failed" ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Falhou
                </>
              ) : (
                "Não Verificado"
              )}
            </Badge>
          </div>

          {/* Detalhes da verificação se estiver verificado */}
          {(overallVerificationStatus === "verified" ||
            user?.verification_status === "verified" ||
            user?.face_verified === true) && (
            <div className="text-xs text-gray-400 space-y-1 mt-2">
              <div className="flex items-center">
                <span className="mr-2">Confiança:</span>
                <span>
                  {confidenceScore || user?.verification_confidence
                    ? `${((confidenceScore || user?.verification_confidence || 0) * 100).toFixed(0)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span className="mr-2">Verificado em:</span>
                <span>{formatTimestampOrDateString(verificationDate || user?.verification_date)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Enviar Documentos</TabsTrigger>
          {/* <TabsTrigger value="face">Verificação Facial (Avançado)</TabsTrigger> */}
        </TabsList>
        {/* <TabsContent value="face">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verificação Facial Avançada</CardTitle>
                            <CardDescription>Siga as instruções para realizar a verificação facial.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FaceVerificationEnhanced />
                        </CardContent>
                    </Card>
                </TabsContent> */}
        <TabsContent value="documents" className="space-y-6">
          {/* Não mostrar o uploader se já estiver verificado */}
          {overallVerificationStatus === "verified" ||
          user?.verification_status === "verified" ||
          user?.face_verified === true ? (
            <Alert className="bg-green-900/30 border-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Verificação Concluída</AlertTitle>
              <AlertDescription>
                Sua identidade já foi verificada com sucesso. Não é necessário enviar documentos novamente.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <DocumentUploader
                verificationData={verificationData}
                updateVerificationData={updateVerificationData}
                userId={user?.uid}
                onVerificationComplete={handleVerificationComplete}
              />
              {verificationStatusMessage && (
                <div className="mt-4">
                  <Alert
                    className={
                      verificationStatusMessage.startsWith("Verificação concluída")
                        ? "bg-green-900/30 border-green-800"
                        : verificationStatusMessage.includes("análise")
                          ? "bg-yellow-900/30 border-yellow-800"
                          : "bg-red-900/30 border-red-800"
                    }
                  >
                    {verificationStatusMessage.startsWith("Verificação concluída") ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : verificationStatusMessage.includes("análise") ? (
                      <Hourglass className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {verificationStatusMessage.startsWith("Verificação concluída")
                        ? "Sucesso"
                        : verificationStatusMessage.includes("análise")
                          ? "Em Análise"
                          : "Erro"}
                    </AlertTitle>
                    <AlertDescription>{verificationStatusMessage}</AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
