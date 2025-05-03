// C:\Users\julia\OneDrive\Área de Trabalho\FRONT-FURIA\furia\src\app\components\dashboard\verificationModal.tsx
"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import { DocumentUploader } from "../verification/document-uploader";
import { FaceVerification } from "../verification/face-verification";
import { VerificationProgress } from "../verification/verification-progress";
import { Check } from "lucide-react";

export function VerificationModal() {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [verificationData, setVerificationData] = useState({
        idDocument: null,
        selfie: null,
        addressProof: null,
        faceVerified: false,
    });
    
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5000';

    const updateVerificationData = (data: any) => {
        setVerificationData((prev) => ({ ...prev, ...data }));
    };

    const handleTabChange = (value: string) => {
        setCurrentStep(value === "documents" ? 1 : 2);
    };

    // Obtenha o userId do seu contexto de autenticação (substitua pela sua lógica real)
    const userId = "SEU_USER_ID_AQUI";

    const handleDocumentVerificationComplete = (success: boolean, confidence?: number) => {
        console.log("Verificação de documentos completa:", success, confidence);
        // Aqui você pode atualizar o estado do modal ou fazer outras ações
        // Se a verificação de documentos for bem-sucedida, talvez você queira
        // permitir que o usuário vá para a aba de verificação facial.
    };

    const handleSubmitVerification = async () => {
        const formData = new FormData();
        formData.append('userId', userId);

        if (verificationData.idDocument) {
            formData.append('idDocument', verificationData.idDocument);
        }
        if (verificationData.selfie) {
            formData.append('selfie', verificationData.selfie);
        }
        // Adicione outros campos ao formData conforme necessário

        try {
          const response = await fetch(`${apiUrl}/api/verification/verify-identity`, {
            method: 'POST',
            body: formData,
        });

            if (response.ok) {
                console.log('Verificação enviada com sucesso!');
                setOpen(false);
                // Adicione aqui qualquer outra ação que precise acontecer após o sucesso
            } else {
                console.error('Erro ao enviar verificação:', response.status);
                // Exiba uma mensagem de erro para o usuário se necessário
                const errorData = await response.json();
                console.error('Detalhes do erro:', errorData);
                // Trate os detalhes do erro conforme necessário
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            // Exiba uma mensagem de erro para o usuário
        }
    };

    return (
        <>
            <section className=" overflow-auto ">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flexborder-none  items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                        >
                            <Check className="h-5 w-5 border-none" />
                            Verificar Identidade
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                Verificação de Identidade
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 pb-6">
                            {" "}
                            <VerificationProgress currentStep={currentStep} totalSteps={2} />
                            <Tabs defaultValue="documents" onValueChange={handleTabChange}>
                                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                                    <TabsTrigger
                                        value="face"
                                        disabled={
                                            !verificationData.idDocument ||
                                            !verificationData.addressProof
                                        }
                                    >
                                        Verificação Facial
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="documents">
                                    <DocumentUploader
                                        verificationData={verificationData}
                                        updateVerificationData={updateVerificationData}
                                        userId={userId}
                                        onVerificationComplete={handleDocumentVerificationComplete}
                                    />
                                </TabsContent>

                                <TabsContent value="face">
                                    <FaceVerification
                                        verificationData={verificationData}
                                        updateVerificationData={updateVerificationData}
                                    />
                                </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-2  bottom-0 bg-gray-900 pt-4 pb-2 ">
                                {currentStep === 2 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-white border-gray-600 hover:bg-gray-800"
                                    >
                                        Voltar
                                    </Button>
                                )}
                                <Button
                                    variant={
                                        verificationData.faceVerified ? "default" : "outline"
                                    }
                                    disabled={!verificationData.faceVerified}
                                    className={`${verificationData.faceVerified ? "bg-[#00FF00] hover:bg-[#34a334]" : ""}`}
                                    onClick={handleSubmitVerification}
                                >
                                    {verificationData.faceVerified
                                        ? "Concluir Verificação"
                                        : "Pular"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </section>
        </>
    );
}