import { NextResponse } from "next/server"
import { generateChatResponse } from "../../../lib/chat"

// Controle de taxa de requisições por IP
const ipRequestCounts: Record<string, { count: number; timestamp: number }> = {}
const MAX_REQUESTS_PER_MINUTE = 10
const MINUTE_IN_MS = 60 * 1000

export async function POST(request: Request) {
  try {
    // Obter IP do cliente (em produção, você precisaria configurar isso corretamente)
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip"

    // Verificar limite de requisições por IP
    const now = Date.now()
    if (!ipRequestCounts[ip]) {
      ipRequestCounts[ip] = { count: 0, timestamp: now }
    }

    // Resetar contador se passou mais de um minuto
    if (now - ipRequestCounts[ip].timestamp > MINUTE_IN_MS) {
      ipRequestCounts[ip] = { count: 0, timestamp: now }
    }

    // Incrementar contador
    ipRequestCounts[ip].count++

    // Verificar se excedeu o limite
    if (ipRequestCounts[ip].count > MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        {
          error: "Muitas requisições. Tente novamente em alguns minutos.",
        },
        { status: 429 },
      )
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 })
    }

    // Gerar resposta usando o serviço de chat
    const response = await generateChatResponse(message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Erro na API de chat:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}
