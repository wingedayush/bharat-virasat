// BharatVirasat — OpenAI ChatGPT Integration & Heritage AI Engine
// Direct browser-safe client supporting GPT-4o, GPT-4o-mini, and GPT-3.5-turbo

const STORAGE_KEY_OPENAI = 'bharat_virasat_openai_key';
const STORAGE_KEY_OPENAI_MODEL = 'bharat_virasat_openai_model';

export function getOpenAIApiKey(): string {
  const localKey = localStorage.getItem(STORAGE_KEY_OPENAI);
  if (localKey && localKey.trim().length > 0) return localKey.trim();
  const envKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  if (envKey && envKey.trim().length > 0) return envKey.trim();
  return '';
}

export function setOpenAIApiKey(key: string): void {
  if (key && key.trim().length > 0) {
    localStorage.setItem(STORAGE_KEY_OPENAI, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_OPENAI);
  }
}

export function hasLiveOpenAI(): boolean {
  return getOpenAIApiKey().length > 15;
}

export function getOpenAIModel(): string {
  return localStorage.getItem(STORAGE_KEY_OPENAI_MODEL) || 'gpt-4o-mini';
}

export function setOpenAIModel(model: string): void {
  localStorage.setItem(STORAGE_KEY_OPENAI_MODEL, model);
}

export interface OpenAIResponse {
  text: string;
  source: 'live_chatgpt' | 'offline_knowledge';
  modelUsed?: string;
  error?: string;
}

export const OPENAI_HERITAGE_SYSTEM_PROMPT = `You are BharatVirasat ChatGPT, the official AI Heritage & Cultural Scholar for the BharatVirasat platform (a national Student Innovation initiative).
Your expertise spans:
1. All 32+ UNESCO World Heritage Sites of India (Hampi, Konark Sun Temple, Ellora, Ajanta, Taj Mahal, Khajuraho, Brihadeeswarar, Rani ki Vav, Sanchi Stupa, etc.).
2. Ancient Archaeo-Astronomy, Temple Engineering & Science (solar wheel chronometry at Konark, monolithic top-down basalt rock excavation at Kailasa, 1,000-year rust-resistant metallurgical chemistry of Delhi Iron Pillar, resonant acoustic granite pillars of Vittala temple).
3. Indian Classical & Folk Performing Arts:
   - 9 Classical Dances: Bharatanatyam, Kathak, Kathakali, Odissi, Kuchipudi, Manipuri, Mohiniyattam, Sattriya, Chhau.
   - Folk Dances: Garba, Bhangra, Kalbeliya, Ghoomar, Lavani, Bihu, Rouf, Yakshagana.
   - Classical Music Traditions: Hindustani (Gharanas, Khayal, Dhrupad) and Carnatic (Kritis, Ragas, Talas) and iconic instruments (Ravanahatha, Sitar, Sarangi, Shehnai, Mridangam, Tabla, Veena).
4. GI-Certified Handlooms & Crafts: Banarasi, Kanchipuram, Patan Patola, Pashmina, Chikankari, Blue Pottery, Madhubani, Dhokra metal casting, Bidriware, Channapatna toys, and practical methods to detect authentic handloom vs powerloom counterfeits.
5. Student Innovation & Technology: AI computer vision for landmark and craft detection, blockchain provenance tags, 3D photogrammetry sanctums, spatial acoustics preservation, and rural artisan empowerment.
6. Multi-day travel itineraries and cultural exploration guides across all 28 states & 8 UTs.

Communication Style:
- Warm, scholarly, and culturally respectful (often starting with "Namaste" or "Pranam").
- Fluent in English, Hindi (Devanagari or Romanized Hinglish).
- Structure responses clearly with engaging headers, bullet points, and actionable insights.
- Provide practical historical context, architectural marvels, and scientific rationale behind ancient Indian civilizational heritage.`;

export async function askOpenAIHeritage(
  userQuery: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  contextSummary?: string
): Promise<OpenAIResponse> {
  const apiKey = getOpenAIApiKey();
  const model = getOpenAIModel();

  if (!apiKey) {
    return {
      text: '',
      source: 'offline_knowledge',
      error: 'OpenAI API key not configured. Using BharatVirasat built-in heritage engine.',
    };
  }

  try {
    const formattedMessages = [
      {
        role: 'system',
        content: `${OPENAI_HERITAGE_SYSTEM_PROMPT}\n\nPlatform Context:\n${contextSummary || 'BharatVirasat — Indian Heritage & Student Innovation Platform'}\nAnswer thoughtfully and accurately.`,
      },
      ...history.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: 'user',
        content: userQuery,
      },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      let errMessage = `OpenAI Error (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) {
          errMessage = errJson.error.message;
        }
      } catch (e) {
        // fallback
      }

      console.warn('OpenAI API Error:', res.status, errMessage);
      return {
        text: '',
        source: 'offline_knowledge',
        error: errMessage,
      };
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (reply && reply.trim().length > 0) {
      return {
        text: reply.trim(),
        source: 'live_chatgpt',
        modelUsed: data.model || model,
      };
    }

    return {
      text: '',
      source: 'offline_knowledge',
      error: 'Empty response received from OpenAI.',
    };
  } catch (err: any) {
    console.warn('OpenAI fetch failure:', err);
    return {
      text: '',
      source: 'offline_knowledge',
      error: err?.message || 'Network error connecting to OpenAI',
    };
  }
}
