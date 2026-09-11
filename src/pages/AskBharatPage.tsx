import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, MessageCircle, ArrowLeft, Lightbulb, Key, ShieldCheck, Check, Copy, RefreshCw, Landmark, Music, Award, HelpCircle } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';
import { artisans } from '@/data/artisans';
import { studentInnovationIdeas, unescoWorldHeritageSites, musicalTraditions } from '@/data/innovations';
import { askGeminiHeritage, getGeminiApiKey, setGeminiApiKey, hasLiveGemini } from '@/lib/gemini';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: 'live_gemini' | 'offline_knowledge';
  links?: { label: string; path: string }[];
}

const suggestions = [
  'What are the best Student Innovation ideas for Indian Heritage?',
  'Tell me about major UNESCO World Heritage monuments in India',
  'What are the classical and folk dances of India?',
  'Tell me about traditional Indian musical instruments like Ravanahatha',
  'Which Indian silk is naturally golden without any dyes?',
  'How to verify real Lucknow Chikankari vs machine counterfeit?',
  'Tell me about Patan Patola double ikat weaving technique',
  'What crafts and monuments can I explore in Rajasthan and Kashmir?',
];

function generateComprehensiveHeritageAnswer(rawQuery: string): { content: string; links: { label: string; path: string }[] } {
  const q = rawQuery.toLowerCase().trim();
  const links: { label: string; path: string }[] = [];

  // 1. Student Innovation & Technology Queries
  if (
    q.includes('student') ||
    q.includes('innovation') ||
    q.includes('idea') ||
    q.includes('project') ||
    q.includes('hackathon') ||
    q.includes('technology') ||
    q.includes('solution')
  ) {
    links.push({ label: 'Scan with BharatLens', path: '/identify' });
    links.push({ label: 'My Heritage Passport', path: '/journey' });
    links.push({ label: 'Explore Cultural Map', path: '/explore' });

    let ideasList = studentInnovationIdeas
      .map(
        (idea, idx) =>
          `**${idx + 1}. ${idea.title}**\n*Domain:* \`${idea.domain}\`\n*The Problem:* ${idea.problemSolved}\n*Innovation Solution:* ${idea.solutionOverview}\n*Demonstrated Impact:* ${idea.impactMetric}\n`
      )
      .join('\n');

    return {
      content:
        `### 🚀 Student Innovation Ideas for Indian Cultural Heritage\n\n` +
        `Here are 5 impactful innovation blueprints bridging ancient civilizational heritage with modern engineering:\n\n` +
        ideasList +
        `\n💡 *Tip for Hackathons & Competitions:* Focus on measurable artisan economic upliftment, tamper-proof provenance, and accessible mobile interfaces that work offline in rural areas.`,
      links,
    };
  }

  // 2. UNESCO World Heritage & Monuments Queries
  if (
    q.includes('unesco') ||
    q.includes('monument') ||
    q.includes('fort') ||
    q.includes('temple') ||
    q.includes('architecture') ||
    q.includes('taj mahal') ||
    q.includes('hampi') ||
    q.includes('konark') ||
    q.includes('ellora') ||
    q.includes('khajuraho')
  ) {
    // Check specific monument
    const matchedSite = unescoWorldHeritageSites.find(
      (s) =>
        q.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(q) ||
        (q.includes('taj') && s.id.includes('taj')) ||
        (q.includes('konark') && s.id.includes('konark')) ||
        (q.includes('hampi') && s.id.includes('hampi')) ||
        (q.includes('ellora') && s.id.includes('ellora')) ||
        (q.includes('khajuraho') && s.id.includes('khajuraho'))
    );

    if (matchedSite) {
      links.push({ label: `Explore ${matchedSite.stateName}`, path: `/explore/state/${matchedSite.stateId}` });
      links.push({ label: 'Find Monuments Near Me', path: '/near-me' });

      return {
        content:
          `### 🏛️ ${matchedSite.name} (UNESCO World Heritage Site)\n\n` +
          `**State of Origin:** ${matchedSite.stateName} • **Year Inscribed:** ${matchedSite.yearInscribed} (${matchedSite.category.toUpperCase()})\n\n` +
          `**Architectural Style:** ${matchedSite.architecturalStyle}\n\n` +
          `**History & Wonder:** ${matchedSite.description}\n\n` +
          `**Civilizational Significance:** ${matchedSite.historicalSignificance}`,
        links,
      };
    }

    links.push({ label: 'Explore Monuments Near Me', path: '/near-me' });
    links.push({ label: 'Cultural State Map', path: '/explore' });

    let sitesOverview = unescoWorldHeritageSites
      .slice(0, 5)
      .map((s) => `• **${s.name} (${s.stateName}, ${s.yearInscribed})**: ${s.architecturalStyle}. ${s.description.slice(0, 110)}...`)
      .join('\n');

    return {
      content:
        `### 🏛️ UNESCO World Heritage Sites of India\n\n` +
        `India is home to **42 UNESCO World Heritage Sites** (34 cultural, 7 natural, 1 mixed), reflecting millennia of architectural mastery:\n\n` +
        sitesOverview +
        `\n\n• **Konark Sun Temple (Odisha)**: Colossal 24-wheeled stone chariot functioning as precision sundials.\n` +
        `• **Ellora Caves (Maharashtra)**: Kailasa Temple, the largest top-down monolithic rock carving on Earth.\n` +
        `• **Hampi (Karnataka)**: Capital of the Vijayanagara Empire with musical stone pillars.\n` +
        `• **Great Living Chola Temples (Tamil Nadu)**: 1,000-year-old Brihadeeswarar Temple with an 80-tonne granite capstone.`,
      links,
    };
  }

  // 3. Folk Dance & Classical Dance Queries
  if (
    q.includes('dance') ||
    q.includes('nritya') ||
    q.includes('kathak') ||
    q.includes('bharatanatyam') ||
    q.includes('garba') ||
    q.includes('bhangra') ||
    q.includes('ghoomar') ||
    q.includes('odissi') ||
    q.includes('bihu') ||
    q.includes('chhau')
  ) {
    links.push({ label: 'Watch Dance Reels', path: '/reels' });
    links.push({ label: 'Explore All States', path: '/explore' });

    return {
      content:
        `### 💃 Classical & Folk Dances of India\n\n` +
        `India\'s dance traditions are categorized into ancient **Sangeet Natak Akademi Classical Dances** and vibrant **Regional Folk Dances**:\n\n` +
        `**Classical Traditions:**\n` +
        `1. **Bharatanatyam (Tamil Nadu)**: The oldest classical dance; characterized by fixed upper torso, bent legs (Aramandi), and geometric footwork.\n` +
        `2. **Kathak (Uttar Pradesh)**: Storytelling dance derived from "Katha kahe so Kathak", famous for rapid pirouettes (Chakkars) and rhythmic footwork.\n` +
        `3. **Kathakali (Kerala)**: Grand classical dance-drama featuring elaborate Paccha green makeup and dramatic eye-expression mudras.\n` +
        `4. **Odissi (Odisha)**: Fluid temple dance famed for the Tribhangi (three-bend posture) reflecting classical temple sculptures.\n` +
        `5. **Sattriya (Assam)**: 500-year-old monastic classical dance originated by saint Srimanta Sankardev in Majuli island.\n` +
        `6. **Manipuri Raas Leela (Manipur)**: Gentle, devotional dance celebrating Radha and Krishna in cylindrical embroidered Potloi skirts.\n\n` +
        `**Celebrated Folk Dances (UNESCO Inscribed):**\n` +
        `• **Garba of Gujarat (UNESCO 2023)**: Joyous devotional circular dance celebrating Goddess Amba during Navratri.\n` +
        `• **Kalbeliya (Rajasthan, UNESCO)**: Mesmerizing serpent-like movements danced in black swirling skirts by the desert Kalbeliya community.\n` +
        `• **Chhau (Bengal, Odisha, Jharkhand, UNESCO)**: Acrobat martial dance using grand hand-painted mythological masks.\n` +
        `• **Bhangra & Giddha (Punjab)**: High-energy harvest celebration dances to the thunderous beats of the Dhol.`,
      links,
    };
  }

  // 4. Music & Traditional Musical Instruments Queries
  if (
    q.includes('music') ||
    q.includes('instrument') ||
    q.includes('sitar') ||
    q.includes('tabla') ||
    q.includes('shehnai') ||
    q.includes('sarangi') ||
    q.includes('mridangam') ||
    q.includes('veena') ||
    q.includes('ravanahatha') ||
    q.includes('song') ||
    q.includes('baul')
  ) {
    links.push({ label: 'Explore Indian States', path: '/explore' });
    links.push({ label: 'Culture Reels', path: '/reels' });

    let musicList = musicalTraditions
      .map((m) => `• **${m.name} (${m.stateName})**: ${m.description}\n  *Key Instruments:* ${m.instrumentsUsed.join(', ')}`)
      .join('\n\n');

    return {
      content:
        `### 🎵 Indian Musical Traditions & Ancient Instruments\n\n` +
        `Indian music is bifurcated into two classical systems: **Hindustani (North India)** and **Carnatic (South India)**, supported by rich regional folk chordophones and drums:\n\n` +
        musicList +
        `\n\n**Iconic Instruments of India:**\n` +
        `• **Ravanahatha (Rajasthan)**: Ancient 2-stringed bowed coconut lute, considered by musicologists as the ancestor of the modern violin.\n` +
        `• **Shehnai (Varanasi)**: Auspicious quadruple-reed pipe mastered by Bharat Ratna Ustad Bismillah Khan.\n` +
        `• **Mridangam (South India)**: The primary rhythmic backbone of Carnatic concerts, tuned using black iron-powder paste (Karanai).\n` +
        `• **Pepa & Gogona (Assam)**: Buffalo horn trumpet and bamboo jaw harp essential for Rongali Bihu melodies.\n` +
        `• **Ghumot (Goa)**: Eco-friendly terracotta pot drum recognized as Goa\'s heritage instrument.`,
      links,
    };
  }

  // 5. Specific Craft Match
  const matchedCraft = crafts.find(
    (c) =>
      q.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase() === q ||
      (c.tags && c.tags.some((t) => q.includes(t))) ||
      q.includes(c.district.toLowerCase())
  );

  if (matchedCraft) {
    links.push({ label: `View ${matchedCraft.name} Profile`, path: `/craft/${matchedCraft.id}` });
    links.push({ label: `Explore ${matchedCraft.stateName}`, path: `/explore/state/${matchedCraft.stateId}` });
    const linkedArtisan = artisans.find((a) => a.craftId === matchedCraft.id);
    if (linkedArtisan) {
      links.push({ label: `Meet Master Artisan ${linkedArtisan.name}`, path: `/artisans/${linkedArtisan.id}` });
    }

    let fakeGuide = '';
    if (q.includes('fake') || q.includes('real') || q.includes('original') || q.includes('identify') || q.includes('spot') || q.includes('test')) {
      fakeGuide = `\n\n🛡️ **How to Spot Originals vs Machine Fakes:**\n${matchedCraft.originalVsImitation}`;
    }

    return {
      content:
        `### 🧵 ${matchedCraft.name} (${matchedCraft.category.toUpperCase()})\n\n` +
        `**Origin:** ${matchedCraft.district}, ${matchedCraft.stateName} • **GI Tag:** ${matchedCraft.giStatus ? matchedCraft.giNumber : 'Traditional Heritage'}\n\n` +
        `📜 **Heritage & History:**\n${matchedCraft.history}\n\n` +
        `🔨 **Handcrafted Making Process:**\n${matchedCraft.makingProcess}\n\n` +
        `🧶 **Materials Used:** ${matchedCraft.materials.join(', ')}\n` +
        `💰 **Authentic Price Range:** ${matchedCraft.priceRange}\n` +
        `📍 **Where to Source Directly:** ${matchedCraft.whereToBuy.join(' • ')}` +
        fakeGuide,
      links,
    };
  }

  // 6. Specific State Match
  const matchedState = states.find(
    (s) =>
      q.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase() === q ||
      q.includes(s.capital.toLowerCase())
  );

  if (matchedState) {
    links.push({ label: `Explore ${matchedState.name} Heritage`, path: `/explore/state/${matchedState.id}` });
    const stateCrafts = crafts.filter((c) => c.stateId === matchedState.id);
    if (stateCrafts.length > 0) {
      links.push({ label: `View ${stateCrafts[0].name}`, path: `/craft/${stateCrafts[0].id}` });
    }

    return {
      content:
        `### 🗺️ Cultural Heritage of ${matchedState.name} ("${matchedState.tagline}")\n\n` +
        `${matchedState.description}\n\n` +
        `🎨 **Signature GI Crafts:** ${matchedState.crafts.join(', ')}\n` +
        `💃 **Classical & Folk Dances:** ${matchedState.dances.join(', ')}\n` +
        `🎉 **Major Festivals:** ${matchedState.festivals.join(', ')}\n` +
        `🍛 **Traditional Delicacies:** ${matchedState.foods.join(', ')}\n` +
        `🏛️ **Key Heritage Sites:** ${matchedState.heritageSites.join(', ')}\n\n` +
        (matchedState.musicInstruments ? `🎵 **Musical Instruments:** ${matchedState.musicInstruments.join(', ')}\n\n` : '') +
        `💡 **Did You Know?** ${matchedState.funFact}`,
      links,
    };
  }

  // 7. Silk Heritage Query
  if (q.includes('silk') || q.includes('saree') || q.includes('textile')) {
    const silkCrafts = crafts.filter((c) => c.materials.some((m) => m.toLowerCase().includes('silk')));
    silkCrafts.slice(0, 4).forEach((c) => links.push({ label: c.name, path: `/craft/${c.id}` }));

    return {
      content:
        `### 👑 The Imperial Silk Heritage of India\n\n` +
        `India is the only country in the world producing all four commercial varieties of silk: **Mulberry, Eri, Tasar, and Muga**:\n\n` +
        `1. **Assam Muga Silk (GI-26)**: The world\'s only naturally golden-amber silk. The silkworms feed outdoors on Som trees; it requires zero chemical dyes and becomes shinier with every wash.\n` +
        `2. **Kanchipuram Silk (GI-1, Tamil Nadu)**: Woven with pure mulberry silk twisted with pure silver zari coated with 22k gold, featuring the interlocking Korvai technique.\n` +
        `3. **Banarasi Silk Brocade (GI-200, UP)**: Mughal-era imperial weaves adorned with golden Zari floral borders (Kinkhab).\n` +
        `4. **Patan Patola Double Ikat (GI-232, Gujarat)**: Mathematical masterpiece where both warp and weft threads are individually tie-dyed before weaving for 100% identical front-and-back designs.`,
      links,
    };
  }

  // 8. General Conversational / Hindi Greeting
  links.push({ label: 'Explore 22 States & UTs', path: '/explore' });
  links.push({ label: 'Scan with BharatLens', path: '/identify' });
  links.push({ label: 'Heritage Quiz & Badges', path: '/quiz' });

  return {
    content:
      `Namaste! I am your **BharatVirasat AI Heritage Curator**.\n\n` +
      `Our platform celebrates **Student Innovation** in preserving and showcasing India\'s rich civilizational traditions:\n\n` +
      `• **UNESCO Monuments & Temples**: Discover the Taj Mahal, Konark Sun Temple, Ellora Kailasa, Hampi, and Chola Temples.\n` +
      `• **GI-Certified Crafts**: Explore authentic making techniques, verified price ranges, and test tips to avoid machine fakes.\n` +
      `• **Folk Dances & Music**: From Kathak and Bharatanatyam to Garba, Bhangra, and the ancient Ravanahatha violin.\n` +
      `• **Student Innovations**: Explore cutting-edge AI vision, blockchain provenance, and multilingual audio solutions for artisans.\n\n` +
      `*Type any question above — in English or Hindi (transliterated) — to explore!*`,
    links,
  };
}

export function AskBharatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        `Namaste! Welcome to **BharatVirasat AI** — built for Student Innovation to showcase and preserve India's cultural heritage, UNESCO monuments, crafts, dances, and musical traditions.\n\n` +
        `How can I help you explore India's living heritage today?`,
      source: hasLiveGemini() ? 'live_gemini' : 'offline_knowledge',
      links: [
        { label: 'Student Innovation Ideas', path: '/explore' },
        { label: 'UNESCO Monuments Near Me', path: '/near-me' },
        { label: 'Live Camera Lens Scanner', path: '/identify' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(hasLiveGemini());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput);
    setIsLiveActive(hasLiveGemini());
    setShowKeyModal(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // 1. Live Gemini 1.5 Flash if key is configured
      if (hasLiveGemini()) {
        const liveRes = await askGeminiHeritage(
          textToSend,
          `BharatVirasat is a Student Innovation platform showcasing Indian Cultural Heritage: 22 states, 16 GI crafts, UNESCO monuments (Taj Mahal, Konark, Hampi, Ellora, Chola temples), folk dances (Kathak, Bharatanatyam, Garba, Chhau), and traditional musical instruments (Ravanahatha, Shehnai, Mridangam). Answer knowledgeably and inspiringly.`
        );

        if (liveRes.text && liveRes.text.trim().length > 0) {
          const offlineMatch = generateComprehensiveHeritageAnswer(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: 'assistant',
              content: liveRes.text,
              source: 'live_gemini',
              links: offlineMatch.links.slice(0, 3),
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // 2. Multi-tier Offline Comprehensive Heritage Knowledge Engine
      await new Promise((r) => setTimeout(r, 350));
      const offlineResult = generateComprehensiveHeritageAnswer(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: offlineResult.content,
          source: 'offline_knowledge',
          links: offlineResult.links,
        },
      ]);
    } catch (e) {
      const offlineResult = generateComprehensiveHeritageAnswer(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: offlineResult.content,
          source: 'offline_knowledge',
          links: offlineResult.links,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-8 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-900/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">BharatVirasat Help AI</h1>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    isLiveActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isLiveActive ? '● Gemini 1.5 Flash Connected' : '● Built-in Heritage Knowledge Engine Active'}
                </span>
              </div>
              <p className="text-xs text-stone-400">Student Innovation Curator for Monuments, Crafts, Dances, & Music</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLiveActive ? 'AI Key Set' : 'Connect Gemini API'}</span>
            </button>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'init-fresh',
                    role: 'assistant',
                    content: 'Conversation reset. What would you like to explore about India\'s cultural heritage or student innovation ideas?',
                    source: hasLiveGemini() ? 'live_gemini' : 'offline_knowledge',
                    links: [
                      { label: 'Explore UNESCO Sites', path: '/near-me' },
                      { label: 'View Crafts', path: '/explore' },
                    ],
                  },
                ]);
              }}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="py-3 overflow-x-auto scrollbar-hide flex gap-2 border-b border-stone-800/60">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/30 text-xs text-stone-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-sm shadow-lg shadow-amber-950/40'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-sm shadow-md'
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Deep Links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap gap-2">
                    {msg.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(link.path)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800/90 hover:bg-amber-500/20 text-xs text-amber-300 border border-amber-500/30 transition-colors"
                      >
                        <span>{link.label} &rarr;</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Assistant Metadata / Copy */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {msg.source === 'live_gemini'
                        ? 'Generated by Gemini 1.5 Flash'
                        : 'Source: BharatVirasat Comprehensive Knowledge Engine'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-stone-300 transition-colors flex items-center gap-1"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-stone-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-sm p-4 text-sm text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Consulting cultural records, UNESCO archives, and music traditions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl p-2 focus-within:border-amber-500/50 transition-all shadow-xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about student innovation ideas, UNESCO monuments, dances, music, crafts, or states..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-900/40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-stone-500">
            <span>Powered by BharatVirasat Knowledge Base + Gemini 1.5 AI. Supports English and Hindi.</span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-900/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Connect Google Gemini API</h3>
                <p className="text-xs text-stone-400">Unlock live free-form AI generative capabilities</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              BharatVirasat AI is equipped with a rich, built-in offline knowledge base covering 22 states, UNESCO monuments, dances, music, and student innovation ideas. To enable live free-form generation, enter your Google Gemini API key below.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-stone-500">
                Stored privately in your browser's <code className="text-amber-400">localStorage</code>. Never shared with third parties.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              {getGeminiApiKey() && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput('');
                    setGeminiApiKey('');
                    setIsLiveActive(false);
                    setShowKeyModal(false);
                  }}
                  className="px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear Key
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
