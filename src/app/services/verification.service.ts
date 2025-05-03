import { API_URL } from "./auth.service"

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
   * @param idDocument - O arquivo de imagem do documento de identidade (RG, CNH, etc.)
   * @param selfie - O arquivo de imagem da selfie
   * @param token - Token JWT de autenticação
   * @returns Promise com o resultado da verificação
   */
  static async verifyFaceMatch(idDocument: File, selfie: File, token: string): Promise<VerificationResponse> {
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

      // Criar FormData
      const formData = new FormData()
      formData.append("idDocument", idDocument)
      formData.append("selfie", selfie)

      console.log("Enviando requisição para:", `${API_URL}/api/verification/verify-identity`)
      console.log("Token:", token)

      // Enviar requisição para o backend
      const response = await fetch(`${API_URL}/api/verification/verify-identity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include", // Importante para cookies de sessão
      })

      console.log("Status da resposta:", response.status)

      // Tratar resposta
      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            faceVerified: false,
            message: "Sessão expirada. Por favor, faça login novamente.",
          }
        }

        if (response.status === 404) {
          console.error("Endpoint de verificação não encontrado")
          // Se o endpoint não for encontrado, tente a verificação frontend
          return await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)
        }

        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          faceVerified: false,
          message: errorData.message || "Erro ao verificar identidade",
        }
      }

      const data = await response.json()
      return {
        success: true,
        faceVerified: data.faceVerified,
        message: data.message,
        confidence: data.confidence,
      }
    } catch (error) {
      console.error("Erro no serviço de verificação facial:", error)
      // Se ocorrer um erro na comunicação com o backend, tente a verificação frontend
      return await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)
    }
  }

  /**
   * Realiza a verificação facial diretamente no frontend usando a API Gemini
   * Este é um método de fallback caso o serviço backend esteja indisponível
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
      {
        "match": boolean (true se houver correspondência),
        "confidence": number (0 a 1, nível de confiança),
        "reasons": string[] (razões para a decisão)
      }`

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
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || ""

      // Analisar resultado
      try {
        // Tentar parsear o JSON retornado pelo Gemini
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
        console.error("Erro ao parsear resposta do Gemini:", e)

        // Se não conseguir parsear o JSON, tenta analisar o texto
        const isMatch = resultText.includes("correspondência") || resultText.includes("match")

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
}

// Funções exportadas para compatibilidade com a nova implementação
export const verifyIdentity = async (idDocument: File, selfie: File, token: string): Promise<VerificationResponse> => {
  return await FaceVerificationService.verifyFaceMatch(idDocument, selfie, token)
}

export const verifyIdentityFrontend = async (idDocument: File, selfie: File): Promise<VerificationResponse> => {
  return await FaceVerificationService.verifyFaceMatchFrontend(idDocument, selfie)
}
