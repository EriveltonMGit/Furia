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

  const updateVerificationData = (data: any) => {
    setVerificationData((prev) => ({ ...prev, ...data }));
  };

  const handleTabChange = (value: string) => {
    setCurrentStep(value === "documents" ? 1 : 2);
  };

  return (
    <>
      <section className=" overflow-auto ">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flexborder-none  items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
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
              {/* Adicionei pb-6 para padding bottom */}
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
                  />
                </TabsContent>

                <TabsContent value="face">
                  <FaceVerification
                    verificationData={verificationData}
                    updateVerificationData={updateVerificationData}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2  bottom-0 bg-gray-900 pt-4 pb-2 ">
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
                  onClick={() => setOpen(false)}
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
