import { NextResponse } from "next/server"
import { generateChatResponse } from "../../lib/chat"

export async function POST(request: Request) {
  try {
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
