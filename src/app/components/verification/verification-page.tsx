"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { FaceVerificationEnhanced } from "./face-verification-enhanced";
import { DocumentUploader } from "../../components/verification/document-uploader";
import { FaceVerificationService, updateVerificationStatus } from "../../services/verification.service";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"; // Importe os componentes de alerta
import { Check, AlertCircle } from "lucide-react"; // Importe os ícones

export function VerificationPage() {
    const [verificationData, setVerificationData] = useState({
        idDocument: null as File | null,
        selfie: null as File | null,
        addressProof: null as File | null,
        faceVerified: false,
    });
    const [user, setUser] = useState<{ uid: string } | null>({ uid: 'ID_DO_USUARIO_LOGADO' }); // ⚠️ Substitua pela sua lógica real de obter o ID do usuário
    const [verificationStatusMessage, setVerificationStatusMessage] = useState<string | null>(null); // ✅ Estado para mensagens

    const updateVerificationData = (data: Partial<typeof verificationData>) => {
        setVerificationData((prev) => ({ ...prev, ...data }));
    };

    const handleVerifyDocuments = async (idDocument: File, selfie: File, userId: string) => {
        try {
            const verificationResult = await FaceVerificationService.verifyFaceMatch(idDocument, selfie, userId);
            return verificationResult;
        } catch (error: any) {
            console.error("Erro na verificação facial:", error);
            return { faceVerified: false, error: error.message || "Erro ao verificar a face." };
        }
    };

    const handleVerificationComplete = (success: boolean, confidence?: number) => {
        if (success) {
            setVerificationStatusMessage(`Verificação concluída com sucesso! Nível de confiança: ${(confidence! * 100).toFixed(1)}%`);
            // Você pode adicionar lógica adicional aqui, como redirecionar o usuário
        } else {
            setVerificationStatusMessage("Falha na verificação dos documentos.");
        }
    };

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
                                user={user}
                                onVerificationComplete={handleVerificationComplete} // ✅ Passe a função de callback
                            />
                            {verificationStatusMessage && ( // ✅ Renderize a mensagem de status
                                <div className="mt-4">
                                    <Alert className={verificationStatusMessage.startsWith("Verificação concluída") ? "bg-green-900/30 border-green-800" : "bg-red-900/30 border-red-800"}>
                                        {verificationStatusMessage.startsWith("Verificação concluída") ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4" />
                                        )}
                                        <AlertTitle>{verificationStatusMessage.startsWith("Verificação concluída") ? "Sucesso" : "Erro"}</AlertTitle>
                                        <AlertDescription>{verificationStatusMessage}</AlertDescription>
                                    </Alert>
                                </div>
                            )}
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
    );
}