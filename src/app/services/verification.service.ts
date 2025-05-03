import { API_URL } from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

interface VerificationResponse {
  success: boolean;
  faceVerified: boolean;
  message?: string;
}

export const verifyIdentity = async (idDocument: File, selfie: File): Promise<VerificationResponse> => {
  const { user } = useAuth();
  const token = user?.token;

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

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

// Serviço para verificação local (opcional - apenas para teste básico)
export const localFaceVerification = async (idDocument: File, selfie: File): Promise<VerificationResponse> => {
  return new Promise((resolve) => {
    // Simulação de verificação local (apenas para desenvolvimento)
    setTimeout(() => {
      // Esta é uma simulação - em produção sempre use o backend
      resolve({
        success: true,
        faceVerified: Math.random() > 0.5, // 50% de chance de ser verdadeiro
        message: "Verificação local simulada"
      });
    }, 1500);
  });
};