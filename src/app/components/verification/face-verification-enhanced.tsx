// src/app/components/verification/face-verification-enhanced.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Camera, Check, XCircle } from "lucide-react";

interface FaceVerificationEnhancedProps {
    verificationData: {
        idDocument: File | null;
        selfie: File | null;
        addressProof: File | null;
        faceVerified: boolean;
    };
    updateVerificationData: (data: Partial<FaceVerificationEnhancedProps["verificationData"]>) => void;
}

export function FaceVerificationEnhanced({ verificationData, updateVerificationData }: FaceVerificationEnhancedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraActive(true);
                setError(null);
            } catch (err: any) {
                setError("Erro ao acessar a câmera.");
                console.error("Erro ao acessar a câmera:", err);
            }
        };

        if (!verificationData.selfie && !isCameraActive && !error) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [verificationData.selfie, isCameraActive, error]);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;canvas.height = video.videoHeight;
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataURL = canvas.toDataURL("image/png");
            setCapturedImage(imageDataURL);

            // Converter Data URL para Blob (File)
            fetch(imageDataURL)
                .then(res => res.blob())
                .then(blob => {
                    const selfieFile = new File([blob], "selfie.png", { type: "image/png" });
                    updateVerificationData({ selfie: selfieFile });
                    setIsCameraActive(false); // Desativa a câmera após a captura
                });
        }
    };

    const retakeImage = () => {
        setCapturedImage(null);
        updateVerificationData({ selfie: null, faceVerified: false });
        setIsCameraActive(true);
        setError(null);
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraActive(true);
                setError(null);
            } catch (err: any) {
                setError("Erro ao acessar a câmera.");
                console.error("Erro ao acessar a câmera:", err);
            }
        };
        startCamera();
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Verificação Facial (Selfie)</h3>
            <p className="text-sm text-gray-400">Tire uma foto clara do seu rosto para confirmar sua identidade.</p>

            <div className="relative w-full aspect-video bg-gray-800 rounded-md overflow-hidden">
                {isCameraActive && !capturedImage && !error && (
                    <video ref={videoRef} className="object-cover w-full h-full" autoPlay />
                )}

                {capturedImage && (
                    <img src={capturedImage} alt="Selfie Capturada" className="object-cover w-full h-full" />
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 text-red-500">
                        <XCircle className="mr-2 h-6 w-6" />
                        {error}
                    </div>
                )}

                {!verificationData.selfie && !error && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                        <Button onClick={captureImage} disabled={!isCameraActive}>
                            <Camera className="mr-2 h-4 w-4" />
                            Capturar
                        </Button>
                    </div>
                )}

                {verificationData.selfie && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-around">
                        <Button variant="outline" onClick={retakeImage}>
                            <Camera className="mr-2 h-4 w-4" />
                            Retirar
                        </Button>
                        {/* Mensagem de selfie capturada - pode ser removida se o feedback no DocumentUploader for suficiente */}
                        {/* <div className="flex items-center text-green-500">
                            <Check className="mr-2 h-4 w-4" />
                            Selfie Capturada
                        </div> */}
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}