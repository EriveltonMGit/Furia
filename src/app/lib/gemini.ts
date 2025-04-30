import { GoogleGenerativeAI, type Content } from "@google/generative-ai"

// Inicializar a API do Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Configuração do modelo
const modelConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
}

// Contexto do sistema para o modelo
const systemContext = `
Você é o assistente oficial do chat de fãs da FURIA Esports, especializado em CS:GO.
Seu nome é "FURIA Bot" e você deve:

1. Responder em português brasileiro com um tom amigável e entusiasmado
2. Usar emojis e formatação para tornar as respostas visualmente atraentes
3. Conhecer detalhes sobre:
   - Jogadores da FURIA (arT, KSCERATO, yuurih, chelo, drop)
   - Calendário de partidas e resultados recentes
   - Estatísticas da equipe e jogadores
   - História da organização FURIA
   - Competições de CS:GO

4. Responder a comandos específicos como:
   - "próxima partida" - informações sobre o próximo jogo
   - "escalação" - lineup atual do time
   - "estatísticas" - dados de desempenho
   - "mapas" - performance por mapa
   - nomes de jogadores - informações sobre jogadores específicos

5. Usar hashtags como #DIADEFURIA e #FURIANATION
6. Manter respostas concisas mas informativas
7. Quando não souber algo específico, sugerir perguntar sobre tópicos que você conhece

Mantenha o estilo visual com emojis e formatação consistente com o exemplo:
"🏆 FURIA ESPORTS | CS:GO
📅 Próxima partida: vs Team Liquid (15/05)
🔥 #DIADEFURIA #FURIANATION"
`

// Histórico de chat para contexto
let chatHistory: Content[] = []

// Cache simples para respostas comuns
interface CacheEntry {
  response: string
  timestamp: number
}
const responseCache: Record<string, CacheEntry> = {}
const CACHE_TTL = 1000 * 60 * 60 // 1 hora em milissegundos

// Controle de taxa de requisições
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 segundo entre requisições

// Modelos disponíveis em ordem de preferência
const AVAILABLE_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"]

// Respostas pré-definidas para perguntas comuns
const PREDEFINED_RESPONSES: Record<string, string> = {
  "próxima partida": `🏆 **PRÓXIMA PARTIDA DA FURIA** 🏆

📅 Data: 15 de Maio de 2023
⏰ Horário: 15:00 (Horário de Brasília)
🆚 Adversário: Team Liquid
🏟️ Evento: ESL Pro League Season 17
🗺️ Formato: Melhor de 3 (Bo3)

Não perca! Vai ser 🔥 #DIADEFURIA #FURIANATION`,

  escalação: `🐆 **LINEUP ATUAL DA FURIA CS:GO** 🐆

👑 Andrei "arT" Piovezan (Capitão/AWPer)
🔫 Kaike "KSCERATO" Cerato (Rifler)
💪 Yuri "yuurih" Santos (Rifler)
🎯 André "drop" Abreu (Rifler)
🧠 Rafael "saffee" Costa (AWPer)
👨‍💼 Nicholas "guerri" Nogueira (Coach)

#DIADEFURIA #FURIANATION 🔥`,

  estatísticas: `📊 **ESTATÍSTICAS DA FURIA EM 2023** 📊

🏆 Vitórias: 68%
🗺️ Mapa mais forte: Mirage (76% de vitórias)
⭐ MVP do time: KSCERATO (1.24 rating)
💥 Melhor performance: Vitória contra Natus Vincere (16-7)
🔫 Melhor jogador por K/D: yuurih (1.18)

#DIADEFURIA #FURIANATION 🔥`,

  mapas: `🗺️ **PERFORMANCE DA FURIA POR MAPA** 🗺️

🔥 Mirage: 76% de vitórias
🔥 Inferno: 72% de vitórias
🔥 Nuke: 65% de vitórias
🔥 Vertigo: 60% de vitórias
🔥 Ancient: 58% de vitórias
🔥 Overpass: 55% de vitórias
🔥 Anubis: 50% de vitórias

#DIADEFURIA #FURIANATION 🔥`,
}

/**
 * Gera uma resposta usando o modelo Gemini
 */
export async function generateGeminiResponse(userMessage: string): Promise<string> {
  try {
    // Verificar cache para mensagens idênticas
    const normalizedMessage = userMessage.toLowerCase().trim()

    // Verificar respostas pré-definidas
    for (const [keyword, response] of Object.entries(PREDEFINED_RESPONSES)) {
      if (normalizedMessage.includes(keyword.toLowerCase())) {
        console.log(`Usando resposta pré-definida para: ${keyword}`)
        return response
      }
    }

    // Verificar cache
    if (responseCache[normalizedMessage]) {
      const cacheEntry = responseCache[normalizedMessage]
      // Verificar se o cache ainda é válido
      if (Date.now() - cacheEntry.timestamp < CACHE_TTL) {
        console.log("Usando resposta em cache")
        return cacheEntry.response
      } else {
        // Cache expirado, remover
        delete responseCache[normalizedMessage]
      }
    }

    // Controle de taxa - esperar se a última requisição foi muito recente
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
      console.log(`Aguardando ${waitTime}ms antes da próxima requisição`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    // Atualizar o tempo da última requisição
    lastRequestTime = Date.now()

    // Tentar cada modelo disponível em ordem
    let response = ""
    let modelUsed = ""
    let success = false

    for (const modelName of AVAILABLE_MODELS) {
      try {
        console.log(`Tentando usar o modelo: ${modelName}`)

        // Obter o modelo
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemContext,
        })

        // Criar o chat
        const chat = model.startChat({
          generationConfig: modelConfig,
        })

        // Se temos histórico, enviar mensagens anteriores para manter contexto
        if (chatHistory.length > 0) {
          for (const message of chatHistory) {
            if (message.role === "user") {
              const text = message.parts[0]?.text
              if (text) {
                await chat.sendMessage(text)
              }
            }
          }
        }

        // Enviar a mensagem atual do usuário
        const result = await chat.sendMessage(userMessage)
        response = result.response.text()
        modelUsed = modelName
        success = true

        // Sair do loop se tivermos uma resposta bem-sucedida
        break
      } catch (modelError) {
        console.error(`Erro ao usar o modelo ${modelName}:`, modelError)
        // Continuar para o próximo modelo
      }
    }

    // Se nenhum modelo funcionou
    if (!success) {
      throw new Error("Todos os modelos falharam")
    }

    console.log(`Resposta gerada com sucesso usando o modelo: ${modelUsed}`)

    // Adicionar a mensagem do usuário e a resposta ao histórico
    chatHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    })

    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    })

    // Limitar o histórico para evitar tokens excessivos
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(chatHistory.length - 10)
    }

    // Adicionar ao cache
    responseCache[normalizedMessage] = {
      response,
      timestamp: Date.now(),
    }

    return response
  } catch (error) {
    console.error("Erro ao gerar resposta com Gemini:", error)

    // Resposta de fallback para perguntas comuns sobre a FURIA
    if (userMessage.toLowerCase().includes("próxima partida") || userMessage.toLowerCase().includes("proximo jogo")) {
      return PREDEFINED_RESPONSES["próxima partida"]
    } else if (
      userMessage.toLowerCase().includes("escalação") ||
      userMessage.toLowerCase().includes("jogadores") ||
      userMessage.toLowerCase().includes("lineup")
    ) {
      return PREDEFINED_RESPONSES["escalação"]
    } else if (userMessage.toLowerCase().includes("estatística")) {
      return PREDEFINED_RESPONSES["estatísticas"]
    } else if (userMessage.toLowerCase().includes("mapa")) {
      return PREDEFINED_RESPONSES["mapas"]
    }

    return "Desculpe, estou com muitas mensagens no momento. Tente novamente em alguns instantes ou pergunte sobre a próxima partida, escalação, estatísticas ou mapas. 🐆 #DIADEFURIA"
  }
}

/**
 * Limpa o histórico de chat
 */
export function clearChatHistory(): void {
  chatHistory = []
}
