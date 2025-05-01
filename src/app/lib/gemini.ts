// src/app/lib/gemini.ts
// Este código já está ajustado para interagir com o nome do usuário.
// Ele aceita o parâmetro 'userName' e o utiliza em saudações, despedidas e no prompt para a IA.

import { GoogleGenerativeAI, type Content, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv'; // Importa dotenv para carregar variáveis de ambiente

dotenv.config(); // Carrega as variáveis do arquivo .env

// 🔑 Configuração da API do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ⚙️ Configuração do Modelo (Turbo Mode)
const modelConfig = {
    temperature: 0.9,     // Respostas criativas
    topK: 60,             // Variedade de respostas
    topP: 0.95,           // Qualidade das escolhas
    maxOutputTokens: 4096, // Respostas longas e completas
};

// 🛡️ Configuração de Segurança
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE, // Ajuste conforme a necessidade
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE, // Ajuste conforme a necessidade
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE, // Ajuste conforme a necessidade
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE, // Ajuste conforme a necessidade
    },
];

// 🐆 **Contexto do Sistema (Personalidade FURIA 2.0) - Ajustado para personalização**
const systemContext = `
**Você é o FURIA Bot Turbo 2.0, o assistente mais atualizado do CS2!** 🎮💚⚡

Sua tarefa é interagir com os usuários de forma super animada, usando gírias BR e memes, sempre com foco na FURIA. Você tem acesso a ferramentas para buscar informações em tempo real sobre partidas, estatísticas, calendário e status da Twitch.

Se o nome do usuário for fornecido na conversa (ex: "[Mensagem do usuário Nome]: ..."), dirija-se a ele de forma amigável usando o nome. Caso contrário, use termos gerais como "meu chapa" ou "patrão".

🔹 **Novidades nesta versão:**
✅ **Dados em tempo real** (partidas, estatísticas, calendário)
✅ **Respostas dinâmicas** com informações de APIs
✅ **Cache inteligente** para respostas rápidas
✅ **Personalidade ainda mais animada!**

🔹 **Quando perguntar sobre:**
- **Partidas ao vivo** → Busco dados em tempo real
- **Estatísticas** → Consulto HLTV e outras APIs
- **Próximos jogos** → Verifico calendário de eSports

🔹 Links Úteis (Sempre Incluir Quando Relevante):
🌐 Site Oficial: https://furia.gg
📸 Whatsapp: https://wa.me/5511993404466
🌐 Discord: https://discord.com/invite/furia
📊 HLTV (Estatísticas): https://www.hltv.org/team/8297/furia
📅 Calendário: https://www.esports.com/pt
🎥 YouTube:** https://www.youtube.com/@FURIAggCS
`;

// 🔄 Histórico de Conversa (Memória de Curto Prazo)
let chatHistory: Content[] = [];

// ⚡ **Cache Inteligente (TTL Automático)**
interface CacheEntry {
    response: string;
    timestamp: number;
    ttl: number; // Time-To-Live em milissegundos
}
const responseCache: Record<string, CacheEntry> = {};

// 🎯 **Respostas Pré-Definidas (Instantâneas) - Ajustado para personalização**
// As respostas pré-definidas base não contêm a saudação/despedida para que possamos adicioná-las dinamicamente
const PREDEFINED_RESPONSES: Record<string, string> = {
    "redes sociais": `🌐 **REDES SOCIAIS DA FURIA** 🌐
🐦 Twitter: https://twitter.com/furiagg
📸 Instagram: https://instagram.com/furiagg
📸 Whatsapp: https://wa.me/5511993404466
🎥 YouTube: https://youtube.com/furiagg
🌍 Site Oficial: https://furia.gg

**#FURIANATION 💚🐆**`,

    "memes": `😂 **MEMES DA FURIA** 🎮
🔥 *"TÁ CHEGANDO A HORA!"* - arT
💥 *"É GUERRA!"* - guerri
🐆 *"FURIA MODE ON"* (som de turbo)

**Poste seus memes com #FURIAHUMOR!**`,

    "história": `📜 **A JORNADA DA FURIA** 🐆
⏳ 2017: Fundação
🚀 2019: Primeira final internacional
🏆 2022: Top 1 do Brasil  
💎 2024: Domínio no CS2  

**Uma história de superação!** 💚`,

    "piada": `🎭 **PIADA DO DIA** 😆
"Por que o KSCERATO não usa óculos?
Porque ele já tem *aim assist* natural! 🎯

#FURIAHUMOR`,

    // A resposta ofensiva é tratada na função principal para usar o nome
    "ofensivo": `⚠️ **RESPEITA A FURIANATION!** 🛑 Aqui é zoeira no respeito. Que tal falar da **última jogada incrível da FURIA?** 🐆💚`,

    // A resposta default é tratada na função principal para adicionar saudação/despedida
    "default": `💚 Não entendi direito, mas aqui vai uma curiosidade: ${getRandomFact()} 🔍 Tente perguntar sobre **partidas, estatísticas ou jogadores!**`
};

// 🌐 **Configurações de APIs Externas**
// **ATENÇÃO**: Verifique se estas URLs de API são públicas, ativas e não requerem autenticação ou chaves adicionais
// A URL da API da HLTV oficial geralmente NÃO é pública/aberta. Você pode precisar usar APIs de terceiros que agregam dados da HLTV.
// A API do Twitch requer autenticação (Client-ID e potencialmente Access Token).
const API_CONFIG = {
    HLTV: {
        // Esta URL é um EXEMPLO e pode não funcionar para dados em tempo real sem uma API key ou ser uma API de terceiros
        baseUrl: "https://api.exemplo-hltv-publica.com", // <-- Substitua pela URL de uma API real
        endpoints: {
            matches: "/matches",
            team: "/team/8297/furia",
            players: "/players", // Exemplo
        },
        // Exemplo se a API HLTV precisar de chave: apiKey: process.env.HLTV_API_KEY,
    },
    ESPORTS_CALENDAR: "https://api.exemplo-esports-calendar.com/v1/schedule", // <-- Substitua pela URL de uma API real
    TWITCH_STATUS: "https://api.twitch.tv/helix/streams?user_login=furiagg", // Requer autenticação OAuth e Client-ID
};

// **Função para obter saudação personalizada**
function getPersonalizedGreeting(userName?: string): string {
    if (userName) {
        // Exemplo: "E aí, [Nome do Usuário]! " ou "Beleza, [Nome do Usuário]? "
        const greetings = [`E aí, ${userName}!`, `Fala, ${userName}!`, `Beleza, ${userName}?`];
        return greetings[Math.floor(Math.random() * greetings.length)];
    } else {
        // Saudação genérica se o nome não estiver disponível
        const genericGreetings = ["E aí, meu chapa!", "Fala, patrão!", "Beleza?"];
        return genericGreetings[Math.floor(Math.random() * genericGreetings.length)];
    }
}

// **Função para obter despedida personalizada**
function getPersonalizedClosing(userName?: string): string {
    if (userName) {
        // Exemplo: "Qualquer coisa, só chamar, [Nome]!"
        return `Qualquer coisa, só chamar, ${userName}!`;
    } else {
        return `Qualquer coisa, só chamar, meu chapa!`;
    }
}


// 🚀 **Função Principal - Gerador de Respostas - AJUSTADO para personalização**
// ✅ ACEITA O PARÂMETRO OPCIONAL userName
export async function generateGeminiResponse(userMessage: string, userName?: string): Promise<string> {
    const intent = detectIntent(userMessage);

    // 🔍 Verifica se já tem no cache (e se ainda é válido)
    const cached = responseCache[userMessage];
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
        // Retorna resposta do cache, adicionando saudação e despedida
        const cachedResponse = cached.response;
        return `${getPersonalizedGreeting(userName)} ${cachedResponse} ${getPersonalizedClosing(userName)}`;
    }

    // 🎯 Respostas Instantâneas (Pré-Definidas)
    // Trata respostas pré-definidas, adicionando saudação/despedida, exceto default e ofensivo.
    if (PREDEFINED_RESPONSES[intent] && intent !== 'default' && intent !== 'ofensivo') {
        return `${getPersonalizedGreeting(userName)} ${PREDEFINED_RESPONSES[intent]} ${getPersonalizedClosing(userName)}`;
    }

    // Resposta ofensiva (tratamento específico para não usar "meu chapa" se tiver nome)
    if (intent === 'ofensivo') {
        return `⚠️ **RESPEITA A FURIANATION!** 🛑 Calma${userName ? `, ${userName}` : ', meu patrão'}! Aqui é zoeira no respeito. Que tal falar da **última jogada incrível da FURIA?** 🐆💚`;
    }

    // 🔄 Busca Dados em Tempo Real (Se necessário e não encontrou no cache/pré-definido)
    // Esta lógica agora tenta buscar dados ANTES de chamar a IA,
    // o que é diferente da abordagem de Function Calling.
    try {
         // Verifica se a intenção detectada ou a mensagem sugere a necessidade de dados em tempo real
        if (shouldFetchRealTimeData(userMessage)) { // Remove await, a função é síncrona agora
            const realTimeData = await fetchRealTimeData(userMessage);
            if (realTimeData) {
                 // Se encontrou dados, formata, adiciona saudação/despedida e retorna IMEDIATAMENTE
                const response = formatRealTimeResponse(realTimeData, userMessage);
                updateCache(userMessage, response, 60000); // Cache menor (1min) para dados dinâmicos
                // Não atualiza chatHistory aqui, pois a resposta veio da API, não da IA principal
                return `${getPersonalizedGreeting(userName)} ${response} ${getPersonalizedClosing(userName)}`;
            }
             // Se precisava buscar, mas a busca falhou ou não encontrou dados, continua para a IA
             console.log("API call needed but failed or no data found. Falling back to AI.");
        }
    } catch (error) {
        console.error("Erro durante a busca de API:", error);
        // Continua para a IA em caso de erro na chamada de API
        console.log("API call failed. Falling back to AI.");
    }


    // 🧠 Usa Gemini para respostas complexas (Se não encontrou no cache, pré-definido, ou API)
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            systemInstruction: systemContext,
             safetySettings: safetySettings,
            // Se você *ainda* quisesse usar Function Calling como fallback, adicionaria tools aqui.
            // Mas sua nova abordagem é chamar APIs DIRETAMENTE e só usar a IA para o resto.
        });
        // Mantém o histórico de conversa para a IA usar como contexto
        const chat = model.startChat({ generationConfig: modelConfig, history: chatHistory });

        // **Inclui o nome do usuário no prompt para a IA (opcional, mas ajuda a guiar a resposta)**
        // Isso ajuda a IA a ver o nome no contexto da conversa.
        const promptWithUserName = userName ? `[Mensagem do usuário ${userName}]: ${userMessage}` : userMessage;


        let result = await chat.sendMessage(promptWithUserName);
        let response = result.response.text();

        // ✨ Melhora a Resposta (Emojis, Links, Formatação)
        response = enhanceResponse(response, userMessage); // A IA pode usar o nome se incluído no prompt
        updateCache(userMessage, response, 3600000); // Cache de 1h para respostas gerais

        // 📜 Atualiza Histórico (Apenas se a resposta veio da IA)
        // Adiciona o prompt formatado no histórico também para o contexto futuro
        chatHistory.push({ role: 'user', parts: [{ text: promptWithUserName }] });
        chatHistory.push({ role: 'model', parts: [{ text: response }] });


        // Adiciona saudação e despedida à resposta gerada pela IA
        return `${getPersonalizedGreeting(userName)} ${response} ${getPersonalizedClosing(userName)}`;

    } catch (error) {
        console.error("Erro no Gemini:", error);
        // O fallback já usa o nome, então chamamos diretamente
        return getFallbackResponse(userMessage, userName); // ✅ AQUI ESTÁ A LINHA 244 QUE CHAMA getFallbackResponse
    }
}

// 🧹 Limpa o Histórico (Função Exportada)
export function clearChatHistory(): void {
    chatHistory = [];
    // Opcional: Limpar o cache também se desejar que buscas antigas sejam re-feitas
    // responseCache = {};
    console.log("Histórico de chat limpo.");
}

// 🔍 **Detecta a Intenção da Mensagem**
function detectIntent(message: string): string {
    const msg = message.toLowerCase();

    if (/redes|social|twitter|insta|yt|youtube/i.test(msg)) return "redes sociais";
    if (/história|fundacao|começo|jornada/i.test(msg)) return "história";
    if (/meme|piada|engraçado|rir/i.test(msg)) return "piada";
    // Verifica por termos ofensivos ignorando acentos e caixa
    if (/(idiota|burro|chato|merda|porra|puta|caralho|foda-se|fdp|desgra[çc]a)/i.test(msg)) return "ofensivo";
    if (/partida|jogo|ao vivo|placar|resultado/i.test(msg)) return "partida";
    if (/estatística|stats|rating|kills|performance/i.test(msg)) return "estatísticas";
    if (/próximo|calendário|agenda|quando joga/i.test(msg)) return "calendário";
    if (/twitch|live|stream/i.test(msg)) return "twitch"; // Adicionada intenção para Twitch

    return "default";
}

// 🌐 **Busca Dados em Tempo Real (USA AXIOS)**
// Função síncrona para determinar se A BUSCA é necessária
function shouldFetchRealTimeData(message: string): boolean {
     const intent = detectIntent(message.toLowerCase());
     return ['partida', 'estatísticas', 'calendário', 'twitch'].includes(intent);
}

// Função assíncrona que REALIZA a busca
async function fetchRealTimeData(message: string): Promise<any> {
    const intent = detectIntent(message.toLowerCase());
    console.log(`Attempting to fetch real time data for intent: ${intent}`);

    try {
        // 📅 Busca Partidas ao Vivo ou Próximas
        if (intent === 'partida') {
            // **ATENÇÃO**: Substitua pela URL de uma API real de partidas que inclua a FURIA
            const response = await axios.get(`${API_CONFIG.HLTV.baseUrl}${API_CONFIG.HLTV.endpoints.matches}`);
            // console.log("HLTV Matches API response:", response.data); // Log para depuração
            const furiaMatches = response.data.filter((match: any) => // ✅ Tipo 'any'
                match.team1?.name === 'FURIA' || match.team2?.name === 'FURIA'
            );
            return { matches: furiaMatches };
        }

        // 📊 Busca Estatísticas da Equipa/Jogadores
        if (intent === 'estatísticas') {
             // **ATENÇÃO**: Substitua pela URL de uma API real de estatísticas
            const response = await axios.get(`${API_CONFIG.HLTV.baseUrl}${API_CONFIG.HLTV.endpoints.team}`);
            // console.log("HLTV Team API response:", response.data); // Log para depuração
            return { stats: response.data };
        }

        // 🗓️ Busca Calendário de Jogos
        if (intent === 'calendário') {
             // **ATENÇÃO**: Substitua pela URL de uma API real de calendário
            const response = await axios.get(API_CONFIG.ESPORTS_CALENDAR, {
                params: { team: 'FURIA', game: 'cs2' } // Parâmetros de exemplo
            });
            // console.log("Esports Calendar API response:", response.data); // Log para depuração
            return { schedule: response.data.events }; // Ajuste '.events' se a estrutura da API for diferente
        }

        // 🎥 Verifica se a FURIA está transmitindo na Twitch
        if (intent === 'twitch') {
             // **ATENÇÃO**: Substitua pela URL de uma API real de status da Twitch (ou use o SDK oficial)
             // **REQUER AUTENTICAÇÃO**: Você precisará de um Client-ID e possivelmente um Access Token VÁLIDO.
            const response = await axios.get(API_CONFIG.TWITCH_STATUS, {
                headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID || '' } // ✅ Adicionado default ''
            });
             // console.log("Twitch API response:", response.data); // Log para depuração
             // A API Helix retorna um array 'data'. Queremos o primeiro stream encontrado.
            return { twitch: response.data.data[0] };
        }

    } catch (error: any) { // ✅ Tipo 'any'
        console.error(`Erro ao buscar dados da API para ${intent}:`, error.message || error);
        return null; // Retorna null em caso de erro na API
    }
    return null; // Retorna null se a intenção não corresponder a nenhuma busca implementada
}

// ✨ **Formata Respostas de APIs**
function formatRealTimeResponse(data: any, originalQuery: string): string { // ✅ Tipo 'any'
    // 🎮 Partida Ao Vivo ou Próxima
    if (data.matches && data.matches.length > 0) {
        const liveMatch = data.matches.find((match: any) => match.live); // ✅ Tipo 'any'
        if (liveMatch) {
            return `🎮 **PARTIDA AO VIVO!** 🔴\n` +
                   `🏆 ${liveMatch.team1?.name || 'Time 1'} ${liveMatch.team1?.score || '0'} x ${liveMatch.team2?.score || '0'} ${liveMatch.team2?.name || 'Time 2'}\n` + // ✅ Acesso seguro a propriedades
                   `⏱️ ${liveMatch.time || 'Horário Indefinido'}\n` + // ✅ Acesso seguro
                   `📺 Assista: ${liveMatch.stream || 'https://twitch.tv/furiagg'}`; // ✅ Acesso seguro
        }

        const nextMatch = data.matches.find((match: any) => match.upcoming); // ✅ Tipo 'any'
        if (nextMatch) {
            return `📅 **PRÓXIMA PARTIDA** 🐆\n` +
                   `🆚 ${nextMatch.team1?.name || 'Time 1'} vs ${nextMatch.team2?.name || 'Time 2'}\n` + // ✅ Acesso seguro a propriedades
                   `⏰ ${nextMatch.time || 'Horário Indefinido'}\n` + // ✅ Acesso seguro
                   `🏆 ${nextMatch.tournament || 'Torneio Indefinido'}\n` + // ✅ Acesso seguro
                   `🔗 Mais info: https://hltv.org/team/8297/furia`; // ✅ Acesso seguro e link fallback
        }
        // Se houver matches, mas nenhum ao vivo ou próximo
        return `ℹ️ Encontrei partidas da FURIA, mas nenhuma ao vivo ou próxima no momento.`;
    }

    // 📊 Estatísticas
    if (data.stats) {
         // ✅ Acesso seguro a propriedades - Ajuste nomes das propriedades (.rating, .kills, etc.) conforme a API real retornar
        return `📊 **ESTATÍSTICAS DA FURIA** 🐆\n` +
               `⭐ Rating: ${data.stats.rating || 'N/A'}\n` +
               `🔫 Total Kills: ${data.stats.kills || 'N/A'}\n` +
               `🎯 HS%: ${data.stats.headshots_percentage || 'N/A'}%\n` + // Exemplo: A API pode usar 'headshots_percentage'
               `🏆 Títulos Relevantes: ${data.stats.titles || 'N/A'}\n` +
               `🔗 Mais dados: https://www.hltv.org/team/8297/furia`;
    }

    // 🗓️ Calendário
    if (data.schedule && data.schedule.length > 0) {
        return `📅 **PRÓXIMOS JOGOS** 🐆\n` +
               data.schedule.slice(0, 5).map((event: any) => // ✅ Tipo 'any'
                   `📌 ${event.date || 'Data Indefinida'}: vs ${event.opponent?.name || 'Oponente Indefinido'} (${event.tournament?.name || 'Torneio Indefinido'})` // ✅ Acesso seguro
               ).join('\n') +
               `\n🔗 Calendário completo: https://furia.gg/schedule`; // Link de exemplo
    }
     if (data.schedule && data.schedule.length === 0) {
         return `📅 Não encontrei jogos futuros da FURIA no calendário agora.`;
     }


    // 🎥 Twitch
    if (data.twitch) {
         // ✅ Acesso seguro a propriedades - Ajuste nomes (.title, .viewer_count) conforme a API real retornar
        return `🎥 **FURIA AO VIVO NA TWITCH!** 🔴\n` +
               `📺 ${data.twitch.title || 'Stream sem título'}\n` +
               `👁️ ${data.twitch.viewer_count || '0'} espectadores\n` + // ✅ Correção de sintaxe e acesso seguro
               `🔗 Assista: https://twitch.tv/${data.twitch.user_login || 'furiagg'}`; // ✅ Acesso seguro
    }
     if (data.twitch === false) { // Se fetchRealTimeData retornar { twitch: false } para indicar que não está live
          return `😴 Parece que a FURIA não está ao vivo na Twitch agora.`;
     }


    // Fallback se a API retornou dados, mas o formato não correspondeu ao esperado
    console.log("API call returned data but format was unexpected:", data);
    return `🐆 **Aqui está o que encontrei nas APIs:**\n` +
           `ℹ️ Dados brutos (pode não ser útil): ${JSON.stringify(data).substring(0, 200)}...` + // Limita o tamanho para não poluir
           `\n🔍 Isso responde sua pergunta sobre "${originalQuery}"?`;
}

// 🛠️ **Funções Auxiliares**
function enhanceResponse(response: string, userMessage: string): string {
    const emojiMap: Record<string, string> = {
        "FURIA": "🐆", "vitória": "🏆", "jogo": "🎮", "partida": "🆚", "incrível": "🔥",
        "dados": "📊", "estatística": "📈", "próximo": "📅", "twitch": "🎥", "live": "🔴",
        "placar": " স্কোর ", // Exemplo: Adicionar emoji para placar
        "resultado": " ✅ ", // Exemplo: Adicionar emoji para resultado
        "calendário": "🗓️" // Exemplo: Adicionar emoji para calendário
    };
    Object.entries(emojiMap).forEach(([word, emoji]) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        response = response.replace(regex, `${word} ${emoji}`);
    });

    // Adiciona links relevantes baseados na intenção do usuário ou conteúdo da resposta
    if (userMessage.includes('jogo') || userMessage.includes('partida') || response.includes('PARTIDA AO VIVO') || response.includes('PRÓXIMA PARTIDA')) {
        if (!response.includes("furia.gg/live") && !response.includes("hltv.org")) // Evita duplicar se a formatação já incluiu
           response += `\n🔗 Acompanhe mais: https://furia.gg/live ou em nosso canal do youtube https://www.youtube.com/@FURIAggCS`; // Link de exemplo
    }

    if (userMessage.includes('estatística') || response.includes('ESTATÍSTICAS DA FURIA')) {
         if (!response.includes("hltv.org/team/8297/furia")) // Evita duplicar
           response += `\n📊 Mais stats: https://www.hltv.org/team/8297/furia`; // Link HLTV
    }

     if (userMessage.includes('calendário') || response.includes('PRÓXIMOS JOGOS')) {
         if (!response.includes("furia.gg/schedule")) // Evita duplicar
             response += `\n📅 Calendário Oficial: https://furia.gg/schedule`; // Link de exemplo
     }

     if (userMessage.includes('twitch') || userMessage.includes('live') || response.includes('FURIA AO VIVO NA TWITCH')) {
         if (!response.includes("twitch.tv/furiagg")) // Evita duplicar
             response += `\n📺 Assista agora: https://www.twitch.tv/furiatv`; // Link Twitch
     }


    if (!response.includes("🐆")) response = `🐆 ${response} 💚`; // Garante o emoji FURIA no início se não tiver

    return response;
}

function updateCache(key: string, response: string, ttl: number): void {
    responseCache[key] = {
        response,
        timestamp: Date.now(),
        ttl
    };
}

// Função de fallback - CORRIGIDA NO CÓDIGO QUE VOCÊ ENVIOU
function getFallbackResponse(userMessage: string, userName?: string): string {
    const fallbacks = [
        `🐆 Buguei${userName ? `, ${userName}` : ''}! Tenta de novo ou pergunta sobre **próximas partidas**!`, // Usa nome
        "💻 Não consegui achar, mas olha esse **play incrível**: https://www.youtube.com/watch?v=8aIcU-_5W34", // Link de exemplo
        `🔌 Tô com problema técnico${userName ? `, ${userName}` : ''}! Que tal falar de CS2?`, // Usa nome
        `🎲 Não sei, mas **curiosidade FURIA**: ${getRandomFact()}`,
        `Minha conexão com o turbo da informação falhou${userName ? `, ${userName}` : ''}! 😩 Tenta de novo!`, // Usa nome
        `Hmm${userName ? `, ${userName}` : ''}, não encontrei a resposta agora. 🧐 Tenta perguntar de outro jeito?` // Usa nome
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function getRandomFact(): string {
    const facts = [
        "KSCERATO tem 1.25 de rating em 2024!",
        "A FURIA já ganhou de TODAS as top 5 do mundo!",
        "yuurih fez um ACE contra a NAVI no Major!",
        "arT é o capitão mais agressivo do CS2! 🧨",
        "FURIA tem a maior torcida do Brasil! 💚"
    ];
    return facts[Math.floor(Math.random() * facts.length)];;
}

