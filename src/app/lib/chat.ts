// src/app/lib/chat.ts - Wrapper para a lógica Server-Side do Gemini
// Este arquivo NÃO DEVE TER 'use client'.
// Ele é importado pela rota de API e chama a lógica server-side.

// ✅ Importa as funções do novo arquivo server-side
import { generateGeminiResponse, clearChatHistory as clearServerChatHistory } from "./gemini";

// Função que serve como wrapper para generateGeminiResponse
// É chamada pela rota de API.
export async function generateChatResponse(message: string, userName?: string): Promise<string> {
  try {
    // Chama a lógica server-side para gerar a resposta
    const response = await generateGeminiResponse(message, userName);
    return response;
  } catch (error) {
    console.error("Erro ao gerar resposta no wrapper chat.ts:", error);
    // generateGeminiResponse já trata os erros internos e retorna um fallback.
    // Este catch é para erros ANTES ou DURANTE a chamada a generateGeminiResponse.
    return "Desculpe, estou enfrentando um problema inesperado no serviço de chat. Tente novamente mais tarde. #DIADEFURIA 🐆";
  }
}

// ✅ Exporta a função de limpeza do histórico do lado do SERVIDOR
// Renomeada para deixar claro que limpa o histórico na instância atual do servidor
export function clearChatHistory(): void {
    clearServerChatHistory();
}

// // Se você tiver um endpoint POST separado para limpar o chat (ex: /api/chat/reset),
// // a rota de API chamaria diretamente a função clearChatHistory exportada acima.