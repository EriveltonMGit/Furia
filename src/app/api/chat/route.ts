import { NextResponse } from "next/server";
// ✅ Importa generateChatResponse do arquivo chat.ts (que agora importa de gemini.server.ts)
import { generateChatResponse } from "../../lib/chat";

// Controle de taxa de requisições por IP (mantido na rota de API, pois é server-side)
// ATENÇÃO: Este controle de taxa é por instância do servidor. Em ambientes serverless
// com múltiplas instâncias, o controle de taxa precisaria ser implementado
// usando um armazenamento compartilhado (ex: Redis).
const ipRequestCounts: Record<string, { count: number; timestamp: number }> = {}
const MAX_REQUESTS_PER_MINUTE = 10
const MINUTE_IN_MS = 60 * 1000

export async function POST(request: Request) {
  // Obter IP do cliente (em produção, você precisaria configurar isso corretamente).
  // A forma mais comum é usar o cabeçalho 'x-forwarded-for'.
  // ATENÇÃO: 'x-forwarded-for' pode ser manipulado pelo cliente. Para segurança robusta,
  // confie em soluções de infraestrutura ou verifique outros cabeçalhos providos pelo seu provedor de hospedagem.
  // ✅ Removido 'request.ip' que não existe no tipo Request padrão.
  const ip = request.headers.get("x-forwarded-for") || "unknown-ip";


  // --- Início do Controle de Taxa (por instância) ---
  const now = Date.now();
  if (!ipRequestCounts[ip]) {
    ipRequestCounts[ip] = { count: 0, timestamp: now };
  }

  // Resetar contador se passou mais de um minuto
  if (now - ipRequestCounts[ip].timestamp > MINUTE_IN_MS) {
    ipRequestCounts[ip] = { count: 0, timestamp: now };
  }

  // Incrementar contador
  ipRequestCounts[ip].count++;

  // Verificar se excedeu o limite
  if (ipRequestCounts[ip].count > MAX_REQUESTS_PER_MINUTE) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      {
        error: "Muitas requisições. Tente novamente em alguns minutos.",
      },
      { status: 429 }, // Status code 429: Too Many Requests
    );
  }
  // --- Fim do Controle de Taxa ---


  try {
    // ✅ Leia message E userName do corpo da requisição
    const { message, userName } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 });
    }

    // Opcional de segurança: Validar ou re-obter o nome do usuário no backend AQUI
    // Se você quiser ser super seguro, em vez de confiar no userName vindo do frontend,
    // você obteria o usuário logado no servidor aqui (ex: usando cookies/sessão)
    // e passaria o nome obtido no backend para generateChatResponse.
    // Ex:
    // import { getServerSession } from 'next-auth'; // Exemplo com NextAuth.js
    // const session = await getServerSession();
    // const serverUserName = session?.user?.name;
    // ... e passaria serverUserName abaixo.
    // Por enquanto, vamos passar o que veio do frontend para seguir o fluxo.

    // Gerar resposta usando o serviço de chat, ✅ passando o userName
    // generateChatResponse agora roda no servidor, chamando gemini.server.ts
    const response = await generateChatResponse(message, userName);

    return NextResponse.json({ response });

  } catch (error) {
    console.error("Erro na API de chat:", error);
    // Retorna um erro genérico. A mensagem de fallback da IA já foi tratada em generateChatResponse.
    return NextResponse.json({ error: "Erro interno do servidor ao processar a solicitação de chat." }, { status: 500 });
  }
}

// Se você tiver um endpoint POST separado para limpar o chat (ex: /api/chat/reset),
// adicione a função POST correspondente aqui e importe clearChatHistory.
// Exemplo de endpoint para resetar histórico no lado do servidor:
/*
// ✅ Importe a função de limpeza AGORA SERVER-SIDE
import { clearChatHistory } from "../../lib/chat";

// Exemplo para a rota POST /api/chat/reset
export async function POST(request: Request) {
   // Adicione a lógica para verificar se o usuário está autenticado AQUI antes de limpar o histórico
   // Isso é CRUCIAL, senão qualquer um pode limpar o histórico GLOBAL (ou o de outro usuário se vc implementar histórico por usuário)
   console.log("Tentando resetar histórico de chat...");
   try {
      // ... lógica para verificar autenticação no SERVIDOR ...
       // Se autenticado e autorizado:
      clearChatHistory(); // Chama a função server-side
      console.log("Histórico de chat resetado com sucesso via API.");
      return NextResponse.json({ success: true }, { status: 200 });
   } catch (error) {
       console.error("Erro ao resetar chat na API:", error);
       return NextResponse.json({ error: "Falha ao resetar chat no servidor" }, { status: 500 });
   }
}
*/