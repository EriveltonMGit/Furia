// src/app/lib/chat.ts
// Importa a função principal e a função de limpar histórico do gemini.ts
// ✅ Certifique-se de que o caminho para gemini.ts está correto
import { generateGeminiResponse, clearChatHistory } from "./gemini";

// Função que serve como wrapper para generateGeminiResponse
// ✅ AGORA ACEITA O PARÂMETRO OPCIONAL userName
export async function generateChatResponse(message: string, userName?: string): Promise<string> {
  try {
    // Usar o Gemini para gerar a resposta, ✅ PASSANDO O userName RECEBIDO
    const response = await generateGeminiResponse(message, userName);
    return response;
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);

    // O fallback em gemini.ts já lida com a mensagem de erro genérica
    // Então, apenas retornamos essa mensagem de erro
    return "Desculpe, estou enfrentando alguns problemas técnicos. Tente novamente em alguns instantes ou pergunte sobre outro assunto. #DIADEFURIA 🐆";
  }
}

