import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 🔥 Configuração Turbo do Modelo
const modelConfig = {
  temperature: 0.9, // Mais criativo e animado
  topK: 60,         // Respostas mais variadas
  topP: 0.95,
  maxOutputTokens: 4096, // Respostas mais completas
};

// 🐆 Contexto do Sistema (Personalidade FURIA)
const systemContext = `
**Você é o FURIA Bot, o assistente mais hypado do CS:GO!** 🎮💚  

🔹 **Estilo de Resposta:**  
- **Super animado!** (Usa muitos emojis 🐆🔥💥)  
- **Gírias BR e memes de e-sports** ("TÁ CHEGANDO A HORA!", "FURIA MODE ON")  
- **Respostas curtas e diretas**, mas cheias de personalidade  
- **Formatação organizada** (negrito, emojis, quebras de linha)  

🔹 **O Que Você Sabe?**  
✅ **Tudo sobre a FURIA** (jogadores, história, estatísticas)  
✅ **Próximas partidas e resultados**  
✅ **Dados de torneios (ESL, IEM, Major)**  
✅ **Redes sociais e links oficiais**  

🔹 **Quando Não Souber Algo:**  
❌ "Putz, essa eu não sei! 😅 Mas olha isso: [fato aleatório da FURIA]"  
❌ "Eita, não tenho essa info. Quer saber sobre [tópico relacionado]?"  

🔹 **Se Alguém For Ofensivo:**  
⚠️ "Eita, calma aí, meu chapa! Aqui é respeito! Que tal falar da FURIA?"  

🔹 **Links Úteis (Sempre Incluir Quando Relevante):**  
🌐 **Site:** https://furia.gg  
🐦 **Twitter:** https://twitter.com/furiagg  
📸 **Instagram:** https://instagram.com/furiagg  
🎥 **YouTube:** https://youtube.com/furiagg  

**Exemplo de Resposta:**  
"🐆 **FURIA DESTRÓI NO INFERNO!** 🔥  
📌 **Placar:** FURIA 16x8 NAVI  
⭐ **MVP:** KSCERATO (28 kills)  
💥 **Play Insana:** yuurih 1v4 clutch!  
📅 **Próximo Jogo:** Amanhã vs Vitality  
🔗 Mais info: https://furia.gg #DIADEFURIA 💚"
`;

// 📜 Histórico de Conversa (Memória de Curto Prazo)
let chatHistory: Content[] = [];

// ⚡ Cache Turbo (Respostas Rápidas)
interface CacheEntry {
  response: string;
  timestamp: number;
}
const responseCache: Record<string, CacheEntry> = {};

// 🎯 Respostas Pré-Definidas (Instantâneas)
const PREDEFINED_RESPONSES: Record<string, string> = {
  // ... (suas respostas existentes)
  
  // 🔥 Novas Respostas Turbo!
  "redes sociais": `🌐 **REDES SOCIAIS OFICIAIS** 🌐  
🐦 Twitter: https://twitter.com/furiagg  
📸 Instagram: https://instagram.com/furiagg  
🎥 YouTube: https://youtube.com/furiagg  
🌍 Site: https://furia.gg  

**Siga a #FURIANATION!** 💚🐆`,

  "memes": `🎮 **MEMES DA FURIA** 🎮  
🔥 "TÁ CHEGANDO A HORA!" - arT  
💥 "É GUERRA!" - guerri  
🐆 "FURIA MODE ON" (som de turbo)  

**Poste seus memes com #FURIANATION!** 😂`,

  "história": `📜 **A JORNADA DA FURIA** 📜  
⏳ 2017: Fundação  
🚀 2019: Primeira final internacional  
🏆 2022: Top 1 do Brasil  
💎 2023: FURIA domina!  

**Uma história de superação!** 🐆💚`,

  "piada": `😂 **PIADA DO DIA** 😂  
"Por que o KSCERATO não usa óculos?  
Porque ele já tem *aimbot* natural! 🎯😆  

#FURIAHUMOR`,

  "ofensivo": `⚠️ **RESPEITA A FURIANATION!** ⚠️  
Calma aí, meu patrão! Aqui é diversão no respeito.  
Que tal falar da **última jogada incrível da FURIA?** 🐆💚`
};

// 🎯 Detecta a Intenção da Mensagem
function detectIntent(message: string): string {
  const msg = message.toLowerCase();
  
  if (/redes|social|twitter|insta|yt|youtube/i.test(msg)) return "social";
  if (/história|fundacao|começo|jornada/i.test(msg)) return "history";
  if (/meme|piada|engraçado|rir/i.test(msg)) return "meme";
  if (/idiota|burro|chato|merda/i.test(msg)) return "offensive";
  
  return "default";
}

// 🚀 Gera a Resposta Turbo
export async function generateGeminiResponse(userMessage: string): Promise<string> {
  const intent = detectIntent(userMessage);
  
  // 🎯 Respostas Instantâneas (Cache)
  if (PREDEFINED_RESPONSES[intent]) {
    return PREDEFINED_RESPONSES[intent];
  }

  // ⏳ Controle de Flood
  const now = Date.now();
  if (now - (responseCache[userMessage]?.timestamp || 0) < 5000) {
    return "🐆 **Calma, turbo!** Muitas mensagens seguidas! 😅";
  }

  try {
    // 🧠 Usa IA para respostas complexas
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction: systemContext });
    const chat = model.startChat({ generationConfig: modelConfig });
    
    const result = await chat.sendMessage(userMessage);
    let response = result.response.text();

    // ✨ Melhora a Resposta
    response = addEmojis(response);
    if (intent === "social") response += "\n🔗 Mais em: https://furia.gg";
    if (!response.includes("🐆")) response = `🐆 ${response} 💚`;

    // 💾 Salva no Cache
    responseCache[userMessage] = { response, timestamp: now };
    
    return response;
  } catch (error) {
    console.error("Erro:", error);
    return getFallbackResponse(userMessage); // Resposta criativa de fallback
  }
}

// 🛠️ Funções Auxiliares
function addEmojis(text: string): string {
  const emojiMap: Record<string, string> = {
    "FURIA": "🐆",
    "vitória": "🏆",
    "jogo": "🎮",
    "incrível": "🔥",
    "dados": "📊"
  };
  
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    text = text.replace(new RegExp(word, "gi"), `${word} ${emoji}`);
  });
  
  return text;
}

function getFallbackResponse(userMessage: string): string {
  const fallbacks = [
    "Putz, buguei! 😅 Quer saber das **próximas partidas** da FURIA?",
    "Eita, não sei essa! Mas olha o **play incrível** do KSCERATO: [link]",
    "Calma, tô recarregando! ⚡ Pergunta de novo ou fala de CS!",
    `Não sei, mas **curiosidade FURIA**: ${getRandomFact()}`
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function getRandomFact(): string {
  const facts = [
    "KSCERATO tem 1.20 de rating em 2024!",
    "A FURIA já ganhou de TODAS as top 5 do mundo!",
    "yuurih fez um ACE contra a NAVI!",
    "arT é o capitão mais explosivo do CS! 🧨"
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}