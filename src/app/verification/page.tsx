"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentUploader } from "../components/verification/document-uploader";
import { FaceVerification } from "../components/verification/face-verification";
import { VerificationProgress } from "../components/verification/verification-progress";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { FaceVerificationEnhanced } from "../components/verification/face-verification-enhanced";

export default function Verification() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    idDocument: null as File | null,
    selfie: null as File | null,
    addressProof: null as File | null,
    faceVerified: false,
  });
  const [user, setUser] = useState<{ uid: string } | null>(null); // Estado para o ID do usuário
  const [loadingUser, setLoadingUser] = useState(true); // Estado para controlar o carregamento do usuário
  const [verificationStatusMessage, setVerificationStatusMessage] = useState<
    string | null
  >(null);

  const totalSteps = 2;

  useEffect(() => {
    // Simulação de uma chamada de autenticação assíncrona
    // Substitua essa simulação pela sua lógica real de autenticação
    setTimeout(() => {
      const loggedInUserId = "ID_DO_USUARIO_LOGADO"; // Obtenha o ID do usuário real aqui
      setUser({ uid: loggedInUserId });
      setLoadingUser(false);
    }, 500);
  }, []);

  const updateVerificationData = (data: Partial<typeof verificationData>) => {
    setVerificationData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit verification and redirect
      console.log("Verification submitted:", verificationData);
      router.push("/social-connect");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDocumentUploadComplete = (success: boolean) => {
    if (success) {
      console.log("Upload de documentos completo.");
      // Você pode adicionar lógica aqui para avançar automaticamente para o próximo passo
      // ou habilitar o botão "Próximo".
    } else {
      console.log("Falha no upload de documentos.");
      setVerificationStatusMessage("Falha no upload dos documentos.");
    }
  };

  const handleFaceVerificationComplete = (success: boolean) => {
    setVerificationData((prev) => ({ ...prev, faceVerified: success }));
    if (success) {
      console.log("Verificação facial concluída com sucesso!");
      // Você pode adicionar lógica aqui, como exibir uma mensagem de sucesso.
    } else {
      console.log("Falha na verificação facial.");
      setVerificationStatusMessage("Falha na verificação facial.");
    }
  };

  const isStepComplete = () => {
    if (currentStep === 1) {
      return (
        verificationData.idDocument !== null &&
        verificationData.addressProof !== null
      );
    } else if (currentStep === 2) {
      return verificationData.faceVerified;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto py-8">
        <Link
          href="/register"
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o cadastro
        </Link>

        <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">
              Verificação de Identidade
            </CardTitle>
            <CardDescription className="text-gray-400">
              Valide sua identidade para garantir a segurança da sua conta e
              acesso a benefícios exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-900/30 border-blue-800">
              <FileText className="h-4 w-4" />
              <AlertTitle>Seus dados estão protegidos</AlertTitle>
              <AlertDescription>
                Utilizamos criptografia de ponta a ponta e não compartilhamos
                seus documentos com terceiros. Seus documentos são processados
                por IA e armazenados com segurança.
              </AlertDescription>
            </Alert>

            <VerificationProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
            />

            <div className="mt-8">
              {currentStep === 1 && (
                <DocumentUploader
                  verificationData={verificationData}
                  updateVerificationData={updateVerificationData}
                  userId={user?.uid} // Passando userId
                  onVerificationComplete={handleDocumentUploadComplete} // Passando callback
                />
              )}

              {currentStep === 2 && (
                <FaceVerificationEnhanced
                  verificationData={verificationData}
                  updateVerificationData={updateVerificationData}
                />
              )}

              {verificationStatusMessage && (
                <div className="mt-4">
                  <Alert
                    className={
                      verificationStatusMessage.startsWith(
                        "Verificação concluída"
                      )
                        ? "bg-green-900/30 border-green-800"
                        : "bg-red-900/30 border-red-800"
                    }
                  >
                    {verificationStatusMessage.startsWith(
                      "Verificação concluída"
                    ) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {verificationStatusMessage.startsWith(
                        "Verificação concluída"
                      )
                        ? "Sucesso"
                        : "Erro"}
                    </AlertTitle>
                    <AlertDescription>
                      {verificationStatusMessage}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#00FF00] hover:bg-[#3ebd3e]"
              disabled={!isStepComplete()}
            >
              {currentStep === totalSteps ? "Finalizar" : "Próximo"}
              {currentStep === totalSteps ? (
                <CheckCircle2 className="ml-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
