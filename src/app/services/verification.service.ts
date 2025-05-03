import { API_URL } from "../services/auth.service";

interface VerificationResponse {
  success: boolean;
  faceVerified: boolean;
  confidence?: number;
  reasons?: string[];
  message?: string;
}

export const verifyIdentity = async (idDocument: File, selfie: File, token: string): Promise<VerificationResponse> => {
  const formData = new FormData();
  formData.append("idDocument", idDocument);
  formData.append("selfie", selfie);

  try {
    const response = await fetch(`${API_URL}/api/verification/verify-identity`, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao verificar identidade");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na verificação:", error);
    throw new Error("Não foi possível conectar ao servidor de verificação");
  }
};

// Versão para desenvolvimento local (opcional)
export const localFaceVerification = async (idDocument: File, selfie: File): Promise<VerificationResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        faceVerified: Math.random() > 0.5,
        confidence: Math.random(),
        reasons: ["Verificação local simulada"],
        message: "Esta é uma simulação de verificação para desenvolvimento"
      });
    }, 1500);
  });
};