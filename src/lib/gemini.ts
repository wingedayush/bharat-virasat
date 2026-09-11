// BharatVirasat — Gemini AI Integration & Heritage Knowledge Engine
// Supports both live Google Gemini API and offline semantic analysis

const STORAGE_KEY_GEMINI = 'bharat_virasat_gemini_key';

export function getGeminiApiKey(): string {
  const localKey = localStorage.getItem(STORAGE_KEY_GEMINI);
  if (localKey && localKey.trim().length > 0) return localKey.trim();
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) return envKey.trim();
  return '';
}

export function setGeminiApiKey(key: string): void {
  if (key && key.trim().length > 0) {
    localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI);
  }
}

export function hasLiveGemini(): boolean {
  return getGeminiApiKey().length > 10;
}

export interface GeminiResponse {
  text: string;
  source: 'live_gemini' | 'offline_knowledge';
  error?: string;
}

const HERITAGE_SYSTEM_PROMPT = `You are BharatVirasat AI, a scholarly and passionate curator of Indian Cultural Heritage, GI-tagged crafts, regional arts, folklore, and monuments.
Guidelines:
1. Provide accurate, culturally rich, and engaging answers.
2. Emphasize authentic craft traditions, geographical indication (GI) tags, sustainable rural artisan lineages, and architectural marvels.
3. Be respectful, inspiring, and concise (2-4 paragraphs or formatted bullet points).
4. If appropriate, highlight how to recognize authentic handcrafted items versus machine-made imitations.`;

export async function askGeminiHeritage(userQuery: string, contextSummary?: string): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      text: '',
      source: 'offline_knowledge'
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${HERITAGE_SYSTEM_PROMPT}\n\nContext about BharatVirasat Database:\n${contextSummary || 'Indian Heritage Platform'}\n\nUser Question: ${userQuery}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.warn('Gemini API call returned non-OK status:', res.status, errBody);
      return {
        text: '',
        source: 'offline_knowledge',
        error: `API error (${res.status}). Switched to built-in knowledge engine.`
      };
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate && candidate.trim().length > 0) {
      return {
        text: candidate.trim(),
        source: 'live_gemini'
      };
    }

    return { text: '', source: 'offline_knowledge' };
  } catch (err: any) {
    console.warn('Gemini API fetch error:', err);
    return {
      text: '',
      source: 'offline_knowledge',
      error: err?.message || 'Network error'
    };
  }
}

export interface VisionIdentificationResult {
  craftName: string;
  category: string;
  originState: string;
  confidence: number;
  description: string;
  authenticityClues: string[];
  materials: string[];
  giNumber?: string;
  source: 'live_gemini_vision' | 'pattern_analyzer';
}

export async function identifyImageWithGemini(base64DataUrl: string): Promise<VisionIdentificationResult | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    const match = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) return null;
    const mimeType = match[1];
    const base64Data = match[2];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Analyze this image as an expert Indian cultural craft conservator.
Identify what traditional Indian handicraft, textile, metalwork, sculpture, or art form this is.
Return a clean JSON object ONLY (no markdown formatting, no code ticks, just raw JSON) with this exact schema:
{
  "craftName": "Name of the craft (e.g. Chikankari Embroidery, Blue Pottery, Kanjeevaram Saree, Dhokra Metalcraft, etc.)",
  "category": "textile | pottery | painting | jewelry | woodcraft | metalcraft | leather | stone | other",
  "originState": "State of origin (e.g. Uttar Pradesh, Rajasthan, Tamil Nadu)",
  "confidence": 92,
  "description": "2 sentence description of the visual motifs, technique, and craft identity seen here.",
  "authenticityClues": [
    "Clue 1 to tell real vs fake",
    "Clue 2",
    "Clue 3"
  ],
  "materials": ["Material 1", "Material 2"],
  "giNumber": "GI tag number if known or 'GI Certified'"
}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return null;
    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    // Clean potential markdown wrap
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      craftName: parsed.craftName || 'Traditional Indian Craft',
      category: parsed.category || 'other',
      originState: parsed.originState || 'India',
      confidence: Math.min(99, Math.max(70, Number(parsed.confidence) || 90)),
      description: parsed.description || 'Authentic traditional handicraft exhibiting classic Indian regional styling.',
      authenticityClues: Array.isArray(parsed.authenticityClues) ? parsed.authenticityClues : ['Check hand-stitched irregular knots on reverse', 'Verify natural pigment finish'],
      materials: Array.isArray(parsed.materials) ? parsed.materials : ['Natural fibers', 'Handmade dyes'],
      giNumber: parsed.giNumber,
      source: 'live_gemini_vision'
    };
  } catch (e) {
    console.warn('Gemini vision error:', e);
    return null;
  }
}
