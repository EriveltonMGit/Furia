import { NextResponse } from "next/server";
// Verifique o caminho correto para o seu arquivo lib/chat.ts
import { generateChatResponse } from "../../lib/chat"; // ✅ Certifique-se de que este caminho está correto

export async function POST(request: Request) {
  try {
    // ✅ Leia message E userName do corpo da requisição
    const { message, userName } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 });
    }

    // Opcional de segurança: Validar ou re-obter o nome do usuário no backend
    // Se você quiser ser super seguro, em vez de confiar no userName vindo do frontend,
    // você obteria o usuário logado no servidor aqui (ex: usando cookies/sessão)
    // e passaria o nome obtido no backend para generateChatResponse.
    // Ex:
    // import { getCurrentUser } from '../../services/auth.service'; // Ajuste o caminho
    // const serverUser = await getCurrentUser(); // Sua função getCurrentUser precisa funcionar no servidor
    // const finalUserName = serverUser?.name;
    // ... e passaria finalUserName abaixo.
    // Por enquanto, vamos passar o que veio do frontend para seguir o fluxo.

    // Gerar resposta usando o serviço de chat, ✅ passando o userName
    const response = await generateChatResponse(message, userName);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Erro na API de chat:", error);
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 });
  }
}

// Se você tiver um endpoint POST separado para limpar o chat (ex: /api/chat/reset),
// adicione a função POST correspondente aqui e importe clearChatHistory.
/*
import { clearChatHistory } from "../../lib/chat"; // Importe a função

export async function POST(request: Request) { // Exemplo para /api/chat/reset
   // Adicione a lógica para verificar se o usuário está autenticado AQUI antes de limpar o histórico
   try {
      // ... lógica para verificar autenticação ...
      clearChatHistory();
      return NextResponse.json({ success: true }, { status: 200 });
   } catch (error) {
       console.error("Erro ao resetar chat na API:", error);
       return NextResponse.json({ error: "Falha ao resetar chat" }, { status: 500 });
   }
}
*/