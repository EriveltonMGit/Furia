// src/app/lib/gemini.server.ts - Lógica Server-Side para a IA do Gemini
// Este arquivo NÃO DEVE TER 'use client'.
// Ele é executado no servidor para processar as requisições de chat.

import {
  GoogleGenerativeAI,
  type Content,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import axios from "axios";

// 🔑 Configuração da API do Gemini (LADO DO SERVIDOR)
// Use uma variável de ambiente segura (NÃO PRECISA ser NEXT_PUBLIC_ se só for acessada aqui).
const apiKey = process.env.GEMINI_API_KEY; // Use a variável correta
if (!apiKey) {
    console.error("GEMINI_API_KEY não configurada no ambiente do servidor! A interação com a IA não funcionará.");
    // Em um ambiente de produção, você pode querer lançar um erro ou ter um fallback mais robusto.
}
const genAI = new GoogleGenerativeAI(apiKey || "PLACEHOLDER_API_KEY"); // Usar placeholder se a chave não existir para evitar erro no startup


// ⚙️ Configuração do Modelo (Usando 1.5 Flash para velocidade)
const modelConfig = {
  temperature: 0.8, // Ajustado um pouco para Flash, pode ser otimizado
  topK: 50,       // Ajustado um pouco para Flash, pode ser otimizado
  topP: 0.90,     // Ajustado um pouco para Flash, pode ser otimizado
  maxOutputTokens: 2048, // Flash tem um limite menor que Pro, ajustar conforme necessidade
};

// 🛡️ Configuração de Segurança
// ATENÇÃO: Definir BLOCK_NONE para todas as categorias pode aumentar o risco de respostas indesejadas.
// Considere usar BLOCK_LOW_AND_ABOVE ou ajustar conforme a necessidade da sua aplicação e público.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Função para transformar URLs em links clicáveis no formato Markdown [texto](URL)
function formatLinks(text: string): string {
  // Regex mais robusta para detectar URLs (http/https) que não estejam dentro de [texto](url)
  const urlRegex = /(?<!\[.*?\]\()https?:\/\/[^\s()<>]+(?:\([\s()<>]*\)|[^\s()<>]*)/g;

  // Substitui URLs por tags <a> ou markdown
  return text.replace(urlRegex, (url) => {
    // Evita formatar URLs que parecem ser o final de uma frase (ex: ...site.com.)
    const cleanedUrl = url.replace(/\.$/, ''); // Remove ponto final se for o último caractere
    const displayUrl = cleanedUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); // Texto do link mais limpo
    return `[${displayUrl}](${cleanedUrl})`;
  });
}


// 🐆 **Contexto do Sistema (Personalidade FURIA 2.0 Flash Edition - Server)**
// O sistema agora instrui a IA a usar o nome do usuário se for fornecido no input.
const systemContext = `
**Você é o FURIA Bot Turbo 2.0 Flash Edition, o assistente mais rápido e atualizado do CS2!** 🎮💚⚡💨

Sua tarefa é interagir com os usuários de forma super animada, usando gírias BR e memes, sempre com foco na FURIA. Você tem acesso a ferramentas (simuladas aqui) para buscar informações em tempo real sobre partidas, estatísticas, calendário e status da Twitch. Sua principal característica é a **velocidade** nas respostas, mantendo a diversão e a precisão.

Se o nome do usuário for fornecido implicitamente no prompt (ex: através do histórico ou de uma forma que indique "o usuário [Nome]", a IA deve se dirigir a ele de forma amigável usando o nome (ex: "E aí, [Nome]!"). Caso contrário, use termos gerais como "meu chapa" ou "patrão".

🔹 **Novidades nesta versão Flash:**
✅ **Respostas super rápidas!** (Otimizado para velocidade)
✅ **Respostas dinâmicas** (simulando dados de APIs)
✅ **Cache inteligente** para respostas instantâneas
✅ **Personalidade ainda mais animada!**

🔹 **Tópicos que posso abordar (baseado em busca de dados simulada):**
- Partidas ao vivo / Próximas partidas
- Estatísticas da FURIA
- Calendário de jogos
- Status da live na Twitch

🔹 Links Úteis (Inclua quando Relevante):

📸 Whatsapp em fase de testes: [Whatsapp FURIA (em testes)](https://wa.me/5511993404466)
🐦 Twitter: [Twitter FURIA](https://x.com/FURIA)
📸 Instagram: [Instagram FURIA](https://www.instagram.com/furiagg/?hl=en)
🌐 Discord: [Discord FURIA](https://discord.com/invite/furia)
📊 HLTV (Estatísticas): [Estatísticas HLTV](https://www.hltv.org/team/8297/furia)
📅 Calendário: [Calendário Esports](https://www.esports.com/pt)
🎥 YouTube: [YouTube FURIA](https://www.youtube.com/@furiagg)
`;

// 🔄 Histórico de Conversa (Memória de Curto Prazo - Server-Side)
// ATENÇÃO: Em ambientes serverless (Vercel/Netlify Functions), variáveis globais
// como chatHistory podem ser redefinidas entre invocações de funções.
// Para histórico persistente por usuário, use um banco de dados.
let chatHistory: Content[] = [];

// ⚡ **Cache Inteligente (TTL Automático - Server-Side)**
// ATENÇÃO: Assim como o histórico, este cache é volátil em ambientes serverless.
interface CacheEntry {
  response: string;
  timestamp: number;
  ttl: number; // Time-To-Live em milissegundos
}
const responseCache: Record<string, CacheEntry> = {};

// 🎯 **Respostas Pré-Definidas (Instantâneas)**
const PREDEFINED_RESPONSES: Record<string, string> = {
  "redes sociais": `🌐 **REDES SOCIAIS DA FURIA** 🌐
🐦 Twitter: [Twitter FURIA](https://x.com/FURIA)
📸 Instagram: [Instagram FURIA](https://instagram.com/furiagg)
📞 WhatsApp: [WhatsApp FURIA](https://wa.me/5511993404466)
🎥 YouTube: [YouTube FURIA](https://www.youtube.com/@furiagg)
🌍 Site Oficial: [Site FURIA](https://furia.gg)

**#FURIANATION 💚🐆**`,

  memes: `😂 **MEMES DA FURIA** 🎮
🔥 *"TÁ CHEGANDO A HORA!"* - arT
💥 *"É GUERRA!"* - guerri
🐆 *"FURIA MODE ON"* (som de turbo)

**Poste seus memes com #FURIAHUMOR!**`,

  história: `📜 **A JORNADA DA FURIA** 🐆
⏳ 2017: Fundação
🚀 2019: Primeira final internacional
🏆 2022: Top 1 do Brasil
💎 2024: Domínio no CS2

**Uma história de superação!** 💚`,

  piada: `🎭 **PIADA DO DIA** 😆
"Por que o KSCERATO não usa óculos?
Porque ele já tem *aim assist* natural! 🎯

#FURIAHUMOR`,

  ofensivo: ``,
  default: ``,
};

// 🌐 **Configurações de APIs Externas (PLACEHOLDERS - Server-Side)**
const API_CONFIG = {
  HLTV: {
    baseUrl: "https://api.exemplo-hltv-publica.com",
    endpoints: {
      matches: "/matches",
      team: "/team/8297/furia",
      players: "/players",
    },
  },
  ESPORTS_CALENDAR: "https://api.exemplo-esports-calendar.com/v1/schedule",
  TWITCH_STATUS: "https://api.twitch.tv/helix/streams?user_login=furiagg", // Requer Client-ID e OAUTH token VÁLIDO no servidor
};

// **Função para obter uma mensagem de fallback**
function getFallbackMessage(userName?: string): string {
  const fallbacks = [
    `🐆 Buguei${userName ? `, ${userName}` : ""}! Tenta de novo ou pergunta sobre **próximas partidas**!`,
    `💻 Não consegui achar, mas olha esse **play incrível**: [Play Incrível](https://www.youtube.com/watch?v=exemplo)`,
    `🔌 Tô com problema técnico${userName ? `, ${userName}` : ""}! Que tal falar de CS2?`,
    `🎲 Não sei, mas **curiosidade FURIA**: ${getRandomFact()}`,
    `Minha conexão com o turbo da informação falhou${userName ? `, ${userName}` : ""}! 😩 Tenta de novo!`,
    `Hmm${userName ? `, ${userName}` : ""}, não encontrei a resposta agora. 🧐 Tenta perguntar de outro jeito?`,
  ];
  const message = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return formatLinks(message);
}


// 🚀 **Função Principal - Gerador de Respostas**
export async function generateGeminiResponse(
  userMessage: string,
  userName?: string // Parâmetro opcional para o nome do usuário
): Promise<string> {
  const intent = detectIntent(userMessage);
  const cached = responseCache[userMessage];

  // 1. Verifica cache
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.response;
  }

  // 2. Respostas pré-definidas
  if (
    PREDEFINED_RESPONSES[intent] !== undefined &&
    !["default", "ofensivo"].includes(intent)
  ) {
    return PREDEFINED_RESPONSES[intent];
  }

  // 3. Resposta ofensiva
  if (intent === "ofensivo") {
    return `⚠️ **RESPEITA A FURIANATION!** 🛑 Calma${userName ? `, ${userName}` : ", meu patrão"}! Aqui é zoeira no respeito. Que tal falar da **última jogada incrível da FURIA?** 🐆💚`;
  }

  // 4. Busca dados em tempo real (simulada)
  let apiResponse = null;
  if (shouldFetchRealTimeData(userMessage)) {
    try {
        const realTimeData = await fetchRealTimeData(userMessage);
        if (realTimeData) {
            apiResponse = formatRealTimeResponse(realTimeData, userMessage);
            // Cacheamos a resposta da API por menos tempo (ex: 60 segundos)
            updateCache(userMessage, apiResponse, 60000);
            return apiResponse;
        }
    } catch (error) {
        console.error("Erro na API:", error);
        // Se a API falhar, continuamos para a consulta ao Gemini
    }
  }


  // 5. Consulta ao Gemini Flash
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // <-- Modelo Flash
      systemInstruction: systemContext,
      safetySettings: safetySettings,
    });

    const chat = model.startChat({
      generationConfig: modelConfig,
      history: chatHistory,
    });

    // Inclui o nome do usuário no prompt para ajudar a IA a personalizar a resposta
    const promptWithUser = userName ? `Mensagem do usuário ${userName}: ${userMessage}` : userMessage;

    const result = await chat.sendMessage(promptWithUser);
    let responseText = result.response.text();

    // Aprimora a resposta do Gemini com emojis e links relevantes
    let enhancedResponse = enhanceResponse(responseText, userMessage);

    // Formata quaisquer URLs que a IA possa ter incluído na resposta
    enhancedResponse = formatLinks(enhancedResponse);

    // Cacheamos a resposta do Gemini
    updateCache(userMessage, enhancedResponse, 3600000);

    // Atualiza o histórico de chat com a interação
    chatHistory.push(
      { role: "user", parts: [{ text: promptWithUser }] },
      { role: "model", parts: [{ text: enhancedResponse }] }
    );

    return enhancedResponse;

  } catch (error: any) {
    console.error("Erro no Gemini Flash:", error);
    return getFallbackMessage(userName);
  }
}

// ✨ Função de aprimoramento da resposta do Gemini (adiciona emojis, links genéricos)
function enhanceResponse(response: string, userMessage: string): string {
  let enhanced = response;

  const emojiMap: Record<string, string> = {
    FURIA: "🐆", vitória: "🏆", jogo: "🎮", partida: "🆚", incrível: "🔥", dados: "📊",
    estatística: "📈", próximo: "📅", twitch: "🎥", live: "🔴", placar: " placar ",
    resultado: " ✅ ", calendário: "🗓️", play: "🎬", highlights: "✨", treino: "💪",
    ganhar: "🎉", perder: "💔",
  };
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    enhanced = enhanced.replace(regex, (match) => {
       if (enhanced.substring(enhanced.indexOf(match) + match.length).trim().startsWith(emoji)) {
           return match;
       }
       return `${match}${emoji}`;
    });
  });

  if (!/^[🐆🎮⚠️📜😂🎭📊📈📅🎥🔴🎬✨💪🎉💔]/.test(enhanced.trim()) || enhanced.trim().split(' ').length < 5) {
     enhanced = `🐆 ${enhanced.trim()} 💚`;
  }

  return enhanced;
}


// Funções auxiliares de dados aleatórios (mantidas)
function getRandomFact(): string {
  const facts = [
    "KSCERATO tem um dos maiores ratings de entrada em rounds de pistol no CS2!",
    "A FURIA foi a primeira equipe brasileira a alcançar o Top 1 do ranking mundial da HLTV!",
    "yuurih é conhecido por seus clutches épicos!",
    "arT é famoso por sua agressividade insana no mapa!",
    "André Akkari, um dos fundadores da FURIA, é um renomado jogador de poker!",
    "A FURIANATION é uma das torcidas mais apaixonadas do eSports mundial! 💚",
  ];
  return facts[Math.floor(Math.random() * facts.length)];
}

function getRandomTopic(): string {
  const topics = [
    "próximas partidas", "estatísticas do time", "jogadores da FURIA",
    "calendário de torneios", "história da FURIA", "memes da FURIA",
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}


// 🧹 Limpa o Histórico (Função Exportada - Server-Side)
// ATENÇÃO: Limpa o histórico GLOBAL nesta instância do servidor.
// Em ambientes serverless, isso pode não ser o esperado para cada usuário.
export function clearChatHistory(): void {
  chatHistory = [];
  // Object.keys(responseCache).forEach(key => delete responseCache[key]); // Opcional: limpar cache tbm
  console.log("Histórico de chat global (server instance) limpo.");
}

// ⚡ Atualiza o Cache
function updateCache(key: string, response: string, ttl: number): void {
  responseCache[key] = {
    response,
    timestamp: Date.now(),
    ttl,
  };
}

// 🔍 **Detecta a Intenção da Mensagem**
function detectIntent(message: string): string {
  const msg = message.toLowerCase();

  if (/redes|social|twitter|insta|yt|youtube|discord|whatsapp/i.test(msg)) return "redes sociais";
  if (/história|fundacao|começo|jornada|origem/i.test(msg)) return "história";
  if (/meme|piada|engra[çc]ado|rir/i.test(msg)) return "piada";
  if (/(idiota|burro|chato|merda|porra|puta|caralho|foda-se|fdp|desgra[çc]a|c[uú]|viado|gay|macaco|lixo|ruim|perde)/i.test(msg)) {
       if (/(lixo|ruim|perde)/i.test(msg) && !/time|furia/i.test(msg)) {
           return "ofensivo";
       }
       if (/(idiota|burro|chato|merda|porra|puta|caralho|foda-se|fdp|desgra[çc]a|c[uú]|viado|gay|macaco)/i.test(msg)) {
           return "ofensivo";
       }
   }

  if (/partida|jogo|ao vivo|placar|resultado|jogando|quem est[aá]/i.test(msg)) return "partida";
  if (/estatística|stats|rating|kills|performance|hltv|numeros/i.test(msg)) return "estatísticas";
  if (/próximo|calendário|agenda|quando joga|datas/i.test(msg)) return "calendário";
  if (/twitch|live|stream|assistir/i.test(msg)) return "twitch";

  return "default";
}

// 🌐 **Busca Dados em Tempo Real (USA AXIOS - FUNÇÕES SIMULADAS)**
// **ATENÇÃO**: Estas funções SIMULAM chamadas de API. Elas precisam ser implementadas de VERDADE
// usando APIs que forneçam os dados da FURIA. As URLs em API_CONFIG são PLACEHOLDERS.

// Função síncrona para determinar SE a busca real de dados é necessária
function shouldFetchRealTimeData(message: string): boolean {
  const intent = detectIntent(message.toLowerCase());
  return ["partida", "estatísticas", "calendário", "twitch"].includes(intent);
}

// Função assíncrona que REALIZA a busca (SIMULADA)
async function fetchRealTimeData(message: string): Promise<any> {
  const intent = detectIntent(message.toLowerCase());
  console.log(`Attempting to fetch real time data for intent: ${intent}`);

  // **ATENÇÃO**: Substitua a lógica ABAIXO por chamadas axios REAIS para APIs REAIS.
  // Este é apenas um EXEMPLO SIMULADO de como a API responderia.

  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    if (intent === "partida") {
      const fakeMatches = [
        { team1: { name: "FURIA", score: 1 }, team2: { name: "paiN", score: 0 }, live: true, time: "Mapa 2", stream: "https://twitch.tv/furiagg" },
        { team1: { name: "FURIA", score: 0 }, team2: { name: "Team Liquid", score: 0 }, upcoming: true, time: "Amanhã, 15:00 BRT", tournament: "BLAST Premier" },
      ];
      return { matches: fakeMatches };
    }

    if (intent === "estatísticas") {
      const fakeStats = { rating: "1.15", kills: "2100", headshots_percentage: "45", titles: "Champions Cup, Global Masters" };
      return { stats: fakeStats };
    }

    if (intent === "calendário") {
      const fakeSchedule = [
        { date: "2025-05-10", opponent: { name: "Virtus.pro" }, tournament: { name: "ESL Pro League" } },
        { date: "2025-05-12", opponent: { name: "G2 Esports" }, tournament: { name: "IEM Dallas" } },
      ];
      return { schedule: fakeSchedule };
    }

    if (intent === "twitch") {
       const fakeTwitchLive = { title: "DIADEFURIA! Treino contra gringo!", viewer_count: 15000, user_login: "furiagg" };
       const fakeTwitchOffline = { data: [] };

       const isLiveSimulated = Math.random() > 0.5;

       if (isLiveSimulated) {
         return { twitch: fakeTwitchLive };
       } else {
         return { twitch: false };
       }
    }

  } catch (error: any) {
    console.error(
      `Erro SIMULADO ao buscar dados da API para ${intent}:`,
      error.message || error
    );
    return null;
  }

  return null;
}

// ✨ **Formata Respostas de APIs (AJUSTAR COM API REAL)**
function formatRealTimeResponse(data: any, originalQuery: string): string {
  if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
    const liveMatch = data.matches.find((match: any) => match.live);
    if (liveMatch) {
      return (
        `🎮 **PARTIDA AO VIVO!** 🔴\n` +
        `🏆 ${liveMatch.team1?.name || "Time 1"} ${liveMatch.team1?.score || "0"} x ${liveMatch.team2?.score || "0"} ${liveMatch.team2?.name || "Time 2"}\n` +
        `⏱️ ${liveMatch.time || "Horário Indefinido"}\n` +
        `📺 Assista: ${formatLinks(liveMatch.stream || "https://twitch.tv/furiagg")}`
      );
    }

    const nextMatch = data.matches.find((match: any) => match.upcoming || match.status === 'scheduled');
    if (nextMatch) {
      return (
        `📅 **PRÓXIMA PARTIDA** 🐆\n` +
        `🆚 ${nextMatch.team1?.name || "Time 1"} vs ${nextMatch.team2?.name || "Time 2"}\n` +
        `⏰ ${nextMatch.time || "Horário Indefinido"}\n` +
        `🏆 ${nextMatch.tournament?.name || "Torneio Indefinido"}\n` +
        `🔗 Mais info: ${formatLinks(nextMatch.link || "https://hltv.org/team/8297/furia")}`
      );
    }
     return `ℹ️ Encontrei partidas da FURIA, mas nenhuma ao vivo ou próxima agendada no momento.`;
  }

  if (data.stats && typeof data.stats === 'object') {
    const stats = data.stats;
    return (
      `📊 **ESTATÍSTICAS DA FURIA** 🐆\n` +
      `⭐ Rating: ${stats.rating || "N/A"}\n` +
      `🔫 Total Kills: ${stats.kills || "N/A"}\n` +
      `🎯 HS%: ${stats.headshots_percentage || "N/A"}%\n` +
      `🗺️ Mapas mais jogados: ${Array.isArray(stats.most_played_maps) ? stats.most_played_maps.map((m: any) => m.name).join(', ') : "N/A"}\n` +
      `🏆 Títulos Relevantes: ${Array.isArray(stats.titles) ? stats.titles.join(', ') : (stats.titles || "N/A")}\n` +
      `🔗 Mais dados: [HLTV FURIA](https://www.hltv.org/team/8297/furia)`
    );
  }

  if (data.schedule && Array.isArray(data.schedule) && data.schedule.length > 0) {
    return (
      `📅 **PRÓXIMOS JOGOS** 🐆\n` +
      data.schedule
        .slice(0, 5)
        .map(
          (event: any) =>
            `📌 ${event.date || "Data Indefinida"}: vs ${event.opponent?.name || "Oponente Indefinido"} (${event.tournament?.name || "Torneio Indefinido"})`
        )
        .join("\n") +
      `\n🔗 Calendário completo: [Calendário FURIA](https://furia.gg/schedule)`
    );
  }
  if (data.schedule && Array.isArray(data.schedule) && data.schedule.length === 0) {
    return `📅 Não encontrei jogos futuros da FURIA no calendário agora.`;
  }

  if (data.twitch && typeof data.twitch === 'object') {
    const twitchStream = data.twitch;
    return (
      `🎥 **FURIA AO VIVO NA TWITCH!** 🔴\n` +
      `📺 ${twitchStream.title || "Stream sem título"}\n` +
      `👁️ ${twitchStream.viewer_count || "0"} espectadores\n` +
      `🔗 Assista: ${formatLinks(`https://twitch.tv/${twitchStream.user_login || "furiagg"}`)}`
    );
  }
  if (data.twitch === false || (data.twitch && Array.isArray(data.twitch.data) && data.twitch.data.length === 0)) {
     return `😴 Parece que a FURIA não está ao vivo na Twitch agora.`;
  }


  console.log("API call returned data but format was unexpected for query:", originalQuery, "Data:", data);
  return (
    `🐆 **Aqui está o que encontrei nas APIs (formato inesperado):**\n` +
    `ℹ️ Dados brutos (pode não ser útil): \`${JSON.stringify(data).substring(0, 300)}...\`` +
    `\n🔍 Isso responde sua pergunta sobre "${originalQuery}"?`
  );
}

