// src/app/services/verification.service.ts
// src/app/services/verification.service.ts
import { db } from "../config/firebase" // Corrigido o caminho de importação usando alias
import { runTransaction, doc, type Transaction, getDoc } from "firebase/firestore" // Adicione getDoc aqui

export interface VerificationResponse {
  success: boolean
  faceVerified: boolean
  confidence?: number
  reasons?: string[]
  message?: string
}

/**
 * Serviço para verificação facial usando Google Gemini API
 */
export class FaceVerificationService {
  /**
   * Verifica se a face na selfie corresponde à face no documento de identidade
   * Usa diretamente a API Gemini sem necessidade de autenticação
   * @param idDocument - O arquivo de imagem do documento de identidade (RG, CNH, etc.)
   * @param selfie - O arquivo de imagem da selfie
   * @returns Promise com o resultado da verificação
   */
  static async verifyFaceMatch(idDocument: File, selfie: File, userId?: string): Promise<VerificationResponse> {
    try {
      // Validar entradas
      if (!idDocument || !selfie) {
        return {
          success: false,
          faceVerified: false,
          message: "Documento de identidade e selfie são obrigatórios",
        }
      }

      // Validar tipos de arquivo
      const validTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!validTypes.includes(idDocument.type) || !validTypes.includes(selfie.type)) {
        return {
          success: false,
          faceVerified: false,
          message: "Formato de arquivo inválido. Use JPG ou PNG.",
        }
      }

      // Usar diretamente a verificação frontend com Gemini API
      console.log("Usando verificação direta com Gemini API")
      const result = await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)

      // Se houver um userId (usuário autenticado), salva o resultado
      if (userId) {
        await FaceVerificationService.saveVerificationResult(userId, result)
      }

      return result
    } catch (error) {
      console.error("Erro no serviço de verificação facial:", error)
      return {
        success: false,
        faceVerified: false,
        message: "Falha ao processar a verificação facial",
      }
    }
  }

  /**
   * Realiza a verificação facial diretamente no frontend usando a API Gemini
   * Requer NEXT_PUBLIC_GEMINI_API_KEY definido nas variáveis de ambiente
   */
  static async verifyFaceMatchFrontend(idDocument: File, selfie: File): Promise<VerificationResponse> {
    try {
      // Verificar se a chave da API Gemini está disponível
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!GEMINI_API_KEY) {
        return {
          success: false,
          faceVerified: false,
          message: "Chave da API Gemini não configurada",
        }
      }

      console.log("Iniciando verificação com Gemini API")

      // Converter arquivos para base64
      const [idDocumentBase64, selfieBase64] = await Promise.all([
        FaceVerificationService.fileToBase64(idDocument),
        FaceVerificationService.fileToBase64(selfie),
      ])

      // Preparar requisição para a API Gemini
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

      const prompt = `Analise as duas imagens fornecidas:
                1. A primeira imagem é um documento de identidade oficial (RG, CNH ou passaporte).
                2. A segunda imagem é uma selfie tirada no momento.

                Verifique se:
                - As características faciais (rosto) correspondem entre as imagens
                - A pessoa na selfie parece ser a mesma do documento
                - Não há indícios de fraude ou manipulação nas imagens

                Retorne um JSON com a seguinte estrutura:
                \`\`\`json
                {
                    "match": boolean (true se houver correspondência),
                    "confidence": number (0 a 1, nível de confiança),
                    "reasons": string[] (razões para a decisão)
                }
                \`\`\``

      const requestData = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: idDocument.type,
                  data: idDocumentBase64.split(",")[1], // Remove o prefixo data:image/...
                },
              },
              {
                inline_data: {
                  mime_type: selfie.type,
                  data: selfieBase64.split(",")[1], // Remove o prefixo data:image/...
                },
              },
            ],
          },
        ],
      }

      console.log("Enviando requisição para Gemini API")

      // Chamar API Gemini
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          faceVerified: false,
          message: `Erro na API Gemini: ${errorData.error?.message || response.statusText}`,
        }
      }

      const data = await response.json()
      let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      console.log("Resposta da Gemini API:", resultText)

      // Analisar resultado
      try {
        // Tentar extrair o JSON da resposta (removendo backticks e quebras de linha)
        const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch && jsonMatch[1]) {
          resultText = jsonMatch[1].trim()
        }
        const result = JSON.parse(resultText)
        const isMatch = result.match === true

        return {
          success: true,
          faceVerified: isMatch,
          message: isMatch ? "Verificação concluída com sucesso" : "As faces não correspondem",
          confidence: result.confidence,
          reasons: result.reasons,
        }
      } catch (e) {
        console.error("Erro ao parsear resposta do Gemini:", e, "Texto da resposta:", resultText)

        // Se não conseguir parsear o JSON, tenta analisar o texto
        const isMatch =
          resultText.toLowerCase().includes("correspondência") ||
          resultText.toLowerCase().includes("match") ||
          resultText.toLowerCase().includes("mesma pessoa")

        // Extrair pontuação de confiança se disponível
        let confidence = 0
        const confidenceMatch = resultText.match(/(\d+\.\d+)/)
        if (confidenceMatch && confidenceMatch[1]) {
          confidence = Number.parseFloat(confidenceMatch[1])
        }

        return {
          success: true,
          faceVerified: isMatch,
          message: isMatch ? "Verificação concluída com sucesso" : "As faces não correspondem",
          confidence,
        }
      }
    } catch (error) {
      console.error("Erro na verificação facial frontend:", error)
      return {
        success: false,
        faceVerified: false,
        message: "Falha ao processar a verificação facial",
      }
    }
  }

  /**
   * Converte um objeto File para string base64
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  static async saveVerificationResult(userId: string, result: VerificationResponse): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verification/save-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          faceVerified: result.faceVerified,
          confidence: result.confidence,
          verificationDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        console.error("Erro ao salvar resultado da verificação")
        throw new Error("Falha ao salvar resultado da verificação")
      }
      return
    } catch (error) {
      console.error("Erro ao enviar resultado para o backend:", error)
      throw error
    }
  }
}

export const updateVerificationStatus = async (
  userId: string,
  data: {
    status: "pending" | "verified" | "rejected"
    faceVerified: boolean
    confidence?: number
  },
): Promise<void> => {
  try {
    if (!userId) {
      console.error("ID do usuário não fornecido para atualização de status")
      throw new Error("ID do usuário é obrigatório")
    }

    console.log("Atualizando status de verificação para o usuário:", userId)

    const userRef = doc(db, "users", userId)
    const profileRef = doc(db, "profiles", userId)

    const updateData = {
      verification_status: data.status,
      face_verified: data.faceVerified,
      verification_confidence: data.confidence,
      verification_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Atualiza tanto o usuário quanto o perfil em uma transação
    await runTransaction(db, async (transaction: Transaction) => {
      transaction.update(userRef, {
        verificationStatus: data.status,
        faceVerified: data.faceVerified,
        verificationDate: new Date().toISOString(),
      })

      transaction.update(profileRef, updateData)
    })

    console.log("Status de verificação atualizado com sucesso para:", userId)
  } catch (error) {
    console.error("Erro ao atualizar status de verificação:", error)
    throw new Error("Falha ao atualizar o status de verificação")
  }
}
export const getUserVerificationData = async (
  userId: string,
): Promise<{
  verification_status?: string
  face_verified?: boolean
  verification_confidence?: number
  verification_date?: string
} | null> => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      return {
        verification_status: userData.verificationStatus, // Use o campo correto do seu documento 'users'
        face_verified: userData.faceVerified, // Use o campo correto do seu documento 'users'
        verification_confidence: userData.verificationConfidence, // Use o campo correto
        verification_date: userData.verificationDate, // Use o campo correto
      }
    } else {
      console.log("Usuário não encontrado!")
      return null
    }
  } catch (error) {
    console.error("Erro ao buscar dados de verificação do usuário:", error)
    return null
  }
}

// Funções exportadas para compatibilidade com a implementação existente
export const verifyIdentity = async (
  idDocument: File,
  selfie: File,
  userId?: string,
): Promise<VerificationResponse> => {
  try {
    const result = await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)

    // Se tiver userId, salva o resultado no banco
    if (userId) {
      await FaceVerificationService.saveVerificationResult(userId, result)
    }

    return result
  } catch (error) {
    console.error("Error in verifyIdentity:", error)
    return {
      success: false,
      faceVerified: false,
      message: "Erro ao verificar documentos",
    }
  }
}

export const verifyIdentityFrontend = async (idDocument: File, selfie: File): Promise<VerificationResponse> => {
  return await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)
}
