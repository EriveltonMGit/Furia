import { generateGeminiResponse, clearChatHistory } from "./gemini"

// Função que substitui a implementação anterior
export async function generateChatResponse(message: string): Promise<string> {
  try {
    // Usar o Gemini para gerar a resposta
    const response = await generateGeminiResponse(message)
    return response
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)

    // Fallback para caso de erro
    return "Desculpe, estou enfrentando alguns problemas técnicos. Tente novamente em alguns instantes ou pergunte sobre outro assunto. #DIADEFURIA 🐆"
  }
}

// Função para limpar o histórico de chat (útil para reset)
export { clearChatHistory }
