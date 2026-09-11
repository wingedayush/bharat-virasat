import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  MessageCircle,
  ArrowLeft,
  Lightbulb,
  Key,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  Landmark,
  Music,
  Award,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Compass,
  Cpu,
  Palette,
  ExternalLink,
  ChevronRight,
  Settings2,
} from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import {
  getOpenAIApiKey,
  setOpenAIApiKey,
  hasLiveOpenAI,
  getOpenAIModel,
  setOpenAIModel,
  askOpenAIHeritage,
} from '@/lib/openai';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  hasLiveGemini,
  askGeminiHeritage,
} from '@/lib/gemini';
import { queryHeritageKnowledgeEngine } from '@/lib/heritageKnowledgeEngine';

type ActiveEngine = 'chatgpt' | 'gemini' | 'heritage_engine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  links?: { label: string; path: string }[];
  suggestedFollowUps?: string[];
}

const TOPIC_CHIPS = [
  { id: 'all', label: '🌟 All Topics' },
  { id: 'monument', label: '🏛️ UNESCO Monuments' },
  { id: 'astronomy', label: '🌌 Archaeo-Astronomy' },
  { id: 'craft', label: '🧵 GI Crafts & Silks' },
  { id: 'dance', label: '💃 Classical Dances & Music' },
  { id: 'student', label: '🚀 Student Innovation Ideas' },
  { id: 'travel', label: '🧭 Travel Itinerary' },
];

const SUGGESTIONS_BY_TOPIC: Record<string, string[]> = {
  all: [
    'How do Konark 24 wheels calculate time in minutes?',
    'How was Kailasa Temple at Ellora carved from top to bottom?',
    'Top 5 Student Innovation ideas for heritage preservation',
    'How to spot real Banarasi silk vs powerloom copy?',
    'Why is Delhi Iron Pillar rust-free after 1,600 years?',
    '5-Day Heritage Travel Itinerary for Rajasthan',
  ],
  monument: [
    'Tell me about Group of Monuments at Hampi and musical pillars',
    'What is the history and architecture of Taj Mahal?',
    'How were the Khajuraho temples built by the Chandelas?',
    'Tell me about the Shore Temple at Mahabalipuram',
    'What are the 32 UNESCO World Heritage sites in India?',
  ],
  astronomy: [
    'Explain the solar archaeo-astronomy of Konark Sun Temple',
    'How did ancient Indian astronomers use Jantar Mantar sundials?',
    'Why does the shadow of Brihadeeswarar temple apex fascinate scientists?',
    'What is the metallurgical secret of the 1,600-year rustless Iron Pillar?',
  ],
  craft: [
    'How is Patan Patola double ikat woven identically on both sides?',
    'How to verify real Kashmiri Pashmina vs synthetic imitation?',
    'Which Indian silk is naturally golden without chemical dyes?',
    'Tell me about Jaipur Blue Pottery and Dhokra metal casting',
  ],
  dance: [
    'What are the 9 classical dances of India?',
    'Explain the difference between Kathak and Bharatanatyam',
    'What is Ravanahatha instrument and its relation to violin?',
    'Tell me about Garba and Kalbeliya UNESCO folk dances',
  ],
  student: [
    'What are the best Student Innovation ideas for hackathons?',
    'How can computer vision verify handloom vs machine fakes?',
    'How does blockchain provenance ensure fair artisan pay?',
    'How to model 3D acoustic resonance for ancient temples?',
  ],
  travel: [
    'Suggest a 5-day Golden Triangle heritage travel itinerary',
    'Best South Indian temple trail: Mahabalipuram to Madurai',
    'Which UNESCO monuments can I explore in Maharashtra?',
    'What is the best season to visit Konark and Hampi?',
  ],
};

export function AskBharatPage() {
  // Engine State
  const [selectedEngine, setSelectedEngine] = useState<ActiveEngine>(() => {
    if (hasLiveOpenAI()) return 'chatgpt';
    if (hasLiveGemini()) return 'gemini';
    return 'heritage_engine';
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Namaste! Welcome to **BharatVirasat AI Heritage Scholar** — powered by **ChatGPT & Indian Civilizational Archives** for Student Innovation.\n\nI am trained to answer questions on **32 UNESCO Monuments, Archaeo-Astronomy, GI-Certified Crafts, Classical Dances, Music, and Travel Circuits**.\n\nHow can I guide your cultural exploration today?',
      source: hasLiveOpenAI()
        ? 'ChatGPT (' + getOpenAIModel() + ')'
        : hasLiveGemini()
        ? 'Gemini 1.5 Flash'
        : 'BharatVirasat Scholar Engine',
      links: [
        { label: '32 UNESCO Monuments', path: '/unesco' },
        { label: '3D Archaeo-Sanctum', path: '/#sanctum-3d' },
        { label: 'Student Innovation Pass', path: '/login' },
      ],
      suggestedFollowUps: [
        'Tell me about Konark Sun Temple 24 sundials',
        'How was Kailasa Temple at Ellora excavated?',
        'Student Innovation ideas for heritage',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Audio Speech Synthesis & Recognition
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [openAIKeyInput, setOpenAIKeyInput] = useState(getOpenAIApiKey());
  const [openAIModelInput, setOpenAIModelInput] = useState(getOpenAIModel());
  const [geminiKeyInput, setGeminiKeyInput] = useState(getGeminiApiKey());
  const [activeSettingsTab, setActiveSettingsTab] = useState<'chatgpt' | 'gemini'>('chatgpt');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hindi mix

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Text-To-Speech Playback
  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural TTS reading
    const cleanText = text
      .replace(/[*#`_>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSettings = () => {
    setOpenAIApiKey(openAIKeyInput);
    setOpenAIModel(openAIModelInput);
    setGeminiApiKey(geminiKeyInput);

    if (openAIKeyInput.trim().length > 15) {
      setSelectedEngine('chatgpt');
    } else if (geminiKeyInput.trim().length > 10) {
      setSelectedEngine('gemini');
    } else {
      setSelectedEngine('heritage_engine');
    }
    setShowSettingsModal(false);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    if (speakingId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // Priority 1: ChatGPT if selected or configured
      if (selectedEngine === 'chatgpt' && hasLiveOpenAI()) {
        const res = await askOpenAIHeritage(
          textToSend,
          messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        );

        if (res.text && res.text.trim().length > 0) {
          const offlineMatch = queryHeritageKnowledgeEngine(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai-' + Date.now(),
              role: 'assistant',
              content: res.text,
              source: 'ChatGPT (' + (res.modelUsed || getOpenAIModel()) + ')',
              links: offlineMatch.links.slice(0, 3),
              suggestedFollowUps: offlineMatch.suggestedFollowUps,
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // Priority 2: Gemini if selected or configured
      if (selectedEngine === 'gemini' && hasLiveGemini()) {
        const res = await askGeminiHeritage(textToSend);

        if (res.text && res.text.trim().length > 0) {
          const offlineMatch = queryHeritageKnowledgeEngine(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai-' + Date.now(),
              role: 'assistant',
              content: res.text,
              source: 'Google Gemini 1.5 Flash',
              links: offlineMatch.links.slice(0, 3),
              suggestedFollowUps: offlineMatch.suggestedFollowUps,
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // Fallback or Native: BharatVirasat Comprehensive Knowledge Engine
      await new Promise((r) => setTimeout(r, 350));
      const res = queryHeritageKnowledgeEngine(textToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: res.content,
          source: 'BharatVirasat Scholar Engine',
          links: res.links,
          suggestedFollowUps: res.suggestedFollowUps,
        },
      ]);
    } catch (e) {
      const res = queryHeritageKnowledgeEngine(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: res.content,
          source: 'BharatVirasat Scholar Engine',
          links: res.links,
          suggestedFollowUps: res.suggestedFollowUps,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeSuggestions = SUGGESTIONS_BY_TOPIC[selectedTopic] || SUGGESTIONS_BY_TOPIC.all;

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-8 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 text-stone-950 font-bold">
              <Bot className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">BharatVirasat AI</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ChatGPT & Gemini
                </span>
              </div>
              <p className="text-xs text-stone-400">
                AI Cultural Scholar for 32 UNESCO Monuments, Crafts, Archaeo-Astronomy & Tech
              </p>
            </div>
          </div>

          {/* Engine Selector & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Engine Pills */}
            <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setSelectedEngine('chatgpt')}
                className={'px-3 py-1.5 rounded-lg font-medium transition-all ' +
                  (selectedEngine === 'chatgpt'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white')}
              >
                ChatGPT
              </button>
              <button
                onClick={() => setSelectedEngine('gemini')}
                className={'px-3 py-1.5 rounded-lg font-medium transition-all ' +
                  (selectedEngine === 'gemini'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white')}
              >
                Gemini
              </button>
              <button
                onClick={() => setSelectedEngine('heritage_engine')}
                className={'px-3 py-1.5 rounded-lg font-medium transition-all ' +
                  (selectedEngine === 'heritage_engine'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white')}
              >
                Scholar AI
              </button>
            </div>

            {/* Settings Modal Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 transition-colors"
              title="Configure API Keys & Models"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            {/* Reset Conversation */}
            <button
              onClick={() => {
                if (speakingId) window.speechSynthesis.cancel();
                setMessages([
                  {
                    id: 'init-fresh',
                    role: 'assistant',
                    content:
                      'Conversation reset. Ask anything about India\'s cultural heritage, 32 UNESCO monuments, archaeo-astronomy, or student innovation!',
                    source: 'BharatVirasat AI',
                    links: [
                      { label: '32 UNESCO Sites', path: '/unesco' },
                      { label: '3D Archaeo-Sanctum', path: '/#sanctum-3d' },
                    ],
                  },
                ]);
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Engine Connection Banner */}
        <div className="py-2.5 flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/60">
          <div className="flex items-center gap-2">
            <span
              className={'w-2 h-2 rounded-full ' +
                (selectedEngine === 'chatgpt' && hasLiveOpenAI()
                  ? 'bg-emerald-400 animate-pulse'
                  : selectedEngine === 'gemini' && hasLiveGemini()
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400')}
            />
            <span className="text-stone-300 font-medium">
              {selectedEngine === 'chatgpt'
                ? hasLiveOpenAI()
                  ? 'Active: OpenAI ChatGPT (' + getOpenAIModel() + ')'
                  : 'Active: ChatGPT Mode (Heritage Engine — add API key for live GPT-4o)'
                : selectedEngine === 'gemini'
                ? hasLiveGemini()
                  ? 'Active: Google Gemini 1.5 Flash'
                  : 'Active: Gemini Mode (Heritage Engine — add API key for live Gemini)'
                : 'Active: BharatVirasat Scholarly Engine (Instant, Offline & Comprehensive)'}
            </span>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="text-amber-400 hover:text-amber-300 text-[11px] underline underline-offset-2"
          >
            {hasLiveOpenAI() || hasLiveGemini() ? 'Manage API Keys' : '+ Connect ChatGPT / Gemini Key'}
          </button>
        </div>

        {/* Category Topic Filters */}
        <div className="py-2.5 overflow-x-auto scrollbar-hide flex gap-2 border-b border-stone-800/40">
          {TOPIC_CHIPS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ' +
                (selectedTopic === topic.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800')}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Prompt Suggestions Carousel */}
        <div className="py-3 overflow-x-auto scrollbar-hide flex gap-2 border-b border-stone-800/60">
          {activeSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/30 text-xs text-stone-300 hover:text-amber-300 transition-all whitespace-nowrap"
            >
              <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={'flex gap-3 ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-1 text-amber-400 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={'max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ' +
                  (msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-medium rounded-tr-sm shadow-lg shadow-amber-950/40'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-sm shadow-md')}
              >
                <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Deep Platform Links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap gap-2">
                    {msg.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(link.path)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800/90 hover:bg-amber-500/20 text-xs text-amber-300 border border-amber-500/30 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-800/50 flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-stone-500 self-center mr-1">Ask next:</span>
                    {msg.suggestedFollowUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(fu)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-stone-800/60 hover:bg-amber-500/10 text-stone-400 hover:text-amber-300 border border-stone-700/60 transition-colors"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}

                {/* Assistant Footer Actions (TTS & Copy) */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-mono text-stone-400">{msg.source || 'AI Scholar'}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={'flex items-center gap-1 transition-colors ' +
                          (speakingId === msg.id
                            ? 'text-amber-400 animate-pulse font-bold'
                            : 'hover:text-stone-300')}
                        title={speakingId === msg.id ? 'Stop audio' : 'Listen to response'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-stone-300 transition-colors flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center flex-shrink-0 mt-1 text-stone-300">
                  <MessageCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-sm p-4 text-sm text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>
                  Consulting Indian Civilizational Archives, 32 UNESCO monuments & archaeo-astronomy...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Speech Recognition */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-2xl p-2.5 focus-within:border-amber-500/50 transition-all shadow-xl"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={'p-2.5 rounded-xl transition-all ' +
                (isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800')}
              title={isListening ? 'Listening... click to stop' : 'Speak your question'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your voice...'
                  : 'Ask ChatGPT about monuments, 3D sanctum, astronomy, crafts, or student ideas...'
              }
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-900/40"
            >
              <Send className="w-4 h-4 text-stone-950" />
            </button>
          </form>

          <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-stone-500">
            <span>
              Supports English, Hindi, and Hinglish • Voice input & Audio read-aloud active
            </span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>

      {/* Unified AI Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-900/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Engine Configuration</h3>
                  <p className="text-xs text-stone-400">Connect OpenAI ChatGPT or Google Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Provider Tabs */}
            <div className="flex border-b border-stone-800 mb-4">
              <button
                onClick={() => setActiveSettingsTab('chatgpt')}
                className={'flex-1 py-2 text-xs font-bold border-b-2 transition-all ' +
                  (activeSettingsTab === 'chatgpt'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-white')}
              >
                🤖 OpenAI ChatGPT
              </button>
              <button
                onClick={() => setActiveSettingsTab('gemini')}
                className={'flex-1 py-2 text-xs font-bold border-b-2 transition-all ' +
                  (activeSettingsTab === 'gemini'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-stone-400 hover:text-white')}
              >
                ⚡ Google Gemini
              </button>
            </div>

            {/* ChatGPT Tab Content */}
            {activeSettingsTab === 'chatgpt' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={openAIKeyInput}
                    onChange={(e) => setOpenAIKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Get an API key from{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 underline"
                    >
                      platform.openai.com
                    </a>
                    . Stored safely in your local browser storage.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    OpenAI Model
                  </label>
                  <select
                    value={openAIModelInput}
                    onChange={(e) => setOpenAIModelInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini (Fast, High Quality & Recommended)</option>
                    <option value="gpt-4o">gpt-4o (Most Intelligent & Comprehensive)</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy Fast)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Gemini Tab Content */}
            {activeSettingsTab === 'gemini' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Get a free Gemini API key from{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 underline"
                    >
                      aistudio.google.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setOpenAIKeyInput('');
                  setOpenAIApiKey('');
                  setGeminiKeyInput('');
                  setGeminiApiKey('');
                  setSelectedEngine('heritage_engine');
                  setShowSettingsModal(false);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Reset All Keys
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 font-bold text-xs shadow hover:scale-105 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
