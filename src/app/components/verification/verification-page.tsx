"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { FaceVerificationEnhanced } from "./face-verification-enhanced"
import { DocumentUploader } from "./document-uploader"
import { FaceVerificationService } from "../../services/verification.service"
import { useAuth } from "../../contexts/AuthContext"

export function VerificationPage() {
  const [verificationData, setVerificationData] = useState({
    idDocument: null as File | null,
    selfie: null as File | null,
    addressProof: null as File | null,
    faceVerified: false,
  })

  const { user, getToken } = useAuth()

  const updateVerificationData = (data: Partial<typeof verificationData>) => {
    setVerificationData((prev) => ({ ...prev, ...data }))
  }

  const handleVerifyDocuments = async (idDocument: File, selfie: File) => {
    const token = getToken?.() || user?.token

    if (token) {
      return await FaceVerificationService.verifyFaceMatch(idDocument, selfie, token)
    } else {
      return await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Verificação de Identidade</CardTitle>
          <CardDescription>
            Complete o processo de verificação para acessar todos os recursos da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="face">Verificação Facial</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <DocumentUploader
                verificationData={verificationData}
                updateVerificationData={updateVerificationData}
                onVerifyDocuments={handleVerifyDocuments}
              />
            </TabsContent>

            <TabsContent value="face" className="space-y-6">
              <FaceVerificationEnhanced
                verificationData={verificationData}
                updateVerificationData={updateVerificationData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
