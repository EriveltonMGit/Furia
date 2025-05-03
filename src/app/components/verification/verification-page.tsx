// src/app/verification/verification-page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { FaceVerificationEnhanced } from "./face-verification-enhanced";
import { DocumentUploader } from "../../components/verification/document-uploader";
import { FaceVerificationService, updateVerificationStatus } from "../../services/verification.service";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { CheckCircle, AlertTriangle, Hourglass } from "lucide-react"; // Importe ícones de status

// Defina um tipo para o status de verificação
type VerificationStatus = "initial" | "pending" | "verified" | "failed";

export function VerificationPage() {
    const [verificationData, setVerificationData] = useState({
        idDocument: null as File | null,
        selfie: null as File | null,
        addressProof: null as File | null,
        faceVerified: false,
    });
    const [user, setUser] = useState<{ uid: string } | null>({ uid: 'ID_DO_USUARIO_LOGADO' }); // ⚠️ Substitua pela sua lógica real de obter o ID do usuário
    const [verificationStatusMessage, setVerificationStatusMessage] = useState<string | null>(null);
    const [overallVerificationStatus, setOverallVerificationStatus] = useState<VerificationStatus>("initial"); // Novo estado para o status geral

    const updateVerificationData = (data: Partial<typeof verificationData>) => {
        setVerificationData((prev) => ({ ...prev, ...data }));
    };

    const handleVerificationComplete = async (success: boolean, confidence?: number) => {
        if (success && user?.uid) {
            setVerificationStatusMessage(`Verificação concluída com sucesso! Nível de confiança: ${(confidence! * 100).toFixed(1)}%`);
            try {
                await updateVerificationStatus(user.uid, {
                    status: "verified",
                    faceVerified: true,
                    confidence: confidence
                });
                console.log("Status de verificação atualizado pelo VerificationPage.");
                setOverallVerificationStatus("verified"); // Define o status para verificado após a atualização bem-sucedida
            } catch (error) {
                console.error("Erro ao atualizar o status de verificação:", error);
                setVerificationStatusMessage("Erro ao atualizar o status de verificação.");
                setOverallVerificationStatus("failed"); // Define o status para falha se a atualização falhar
            }
        } else if (!success) {
            setVerificationStatusMessage("Falha na verificação dos documentos.");
            setOverallVerificationStatus("failed"); // Define o status para falha se a verificação inicial falhar
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Verificação de Identidade</h2>
                <p className="text-gray-500">Siga os passos para verificar sua identidade.</p>

                {/* Feedback visual do status geral */}
                <div className="mt-4 flex items-center space-x-2">
                    {overallVerificationStatus === "initial" && <></>} {/* Pode adicionar algo aqui se quiser */}
                    {overallVerificationStatus === "pending" && (
                        <div className="flex items-center text-blue-500">
                            <Hourglass className="h-5 w-5 animate-spin mr-1" />
                            <span>Verificando...</span>
                        </div>
                    )}
                    {overallVerificationStatus === "verified" && (
                        <div className="flex items-center text-green-500">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Verificação Concluída!</span>
                        </div>
                    )}
                    {overallVerificationStatus === "failed" && (
                        <div className="flex items-center text-red-500">
                            <AlertTriangle className="h-5 w-5 mr-1" />
                            <span>Verificação Falhou</span>
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
                    <DocumentUploader
                        verificationData={verificationData}
                        updateVerificationData={updateVerificationData}
                        userId={user?.uid}
                        onVerificationComplete={(success, confidence) => {
                            // Handle the verification complete event here
                            console.log("Verification complete:", success, confidence);
                            // You might want to update the UI or perform other actions based on the result
                        }}
                    />
                    {verificationStatusMessage && (
                        <div className="mt-4">
                            <Alert className={verificationStatusMessage.startsWith("Verificação concluída") ? "bg-green-900/30 border-green-800" : "bg-red-900/30 border-red-800"}>
                                {verificationStatusMessage.startsWith("Verificação concluída") ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4" />
                                )}
                                <AlertTitle>{verificationStatusMessage.startsWith("Verificação concluída") ? "Sucesso" : "Erro"}</AlertTitle>
                                <AlertDescription>{verificationStatusMessage}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}