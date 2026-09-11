import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Maximize2, Volume2, VolumeX, Copy, Check, ExternalLink } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { askOpenAIHeritage, hasLiveOpenAI, getOpenAIModel } from '@/lib/openai';
import { askGeminiHeritage, hasLiveGemini } from '@/lib/gemini';
import { queryHeritageKnowledgeEngine } from '@/lib/heritageKnowledgeEngine';

interface QuickMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  links?: { label: string; path: string }[];
}

export function GlobalAIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<QuickMsg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! I am your **BharatVirasat AI Heritage Scholar** powered by ChatGPT & Indian civilizational archives.\n\nAsk me anything about monuments, 3D sanctums, ancient astronomy, or craft authenticity!',
      source: hasLiveOpenAI() ? 'ChatGPT' : hasLiveGemini() ? 'Gemini' : 'Heritage Engine',
      links: [
        { label: '32 UNESCO Sites', path: '/unesco' },
        { label: '3D Archaeo-Sanctum', path: '/#sanctum-3d' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_>-]/g, '').slice(0, 450);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
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

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: QuickMsg = {
      id: "user-" + Date.now(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // 1. Try ChatGPT if configured
      if (hasLiveOpenAI()) {
        const chatGptRes = await askOpenAIHeritage(
          textToSend,
          messages.slice(-4).map((m) => ({ role: m.role, content: m.content }))
        );
        if (chatGptRes.text && chatGptRes.text.length > 0) {
          const offlineMatch = queryHeritageKnowledgeEngine(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: "ai-" + Date.now(),
              role: 'assistant',
              content: chatGptRes.text,
              source: "ChatGPT (" + getOpenAIModel() + ")",
              links: offlineMatch.links.slice(0, 2),
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // 2. Try Gemini if configured
      if (hasLiveGemini()) {
        const geminiRes = await askGeminiHeritage(textToSend);
        if (geminiRes.text && geminiRes.text.length > 0) {
          const offlineMatch = queryHeritageKnowledgeEngine(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: "ai-" + Date.now(),
              role: 'assistant',
              content: geminiRes.text,
              source: 'Gemini 1.5 Flash',
              links: offlineMatch.links.slice(0, 2),
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // 3. Built-in Comprehensive Heritage Engine
      await new Promise((r) => setTimeout(r, 300));
      const res = queryHeritageKnowledgeEngine(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-" + Date.now(),
          role: 'assistant',
          content: res.content,
          source: 'BharatVirasat AI Engine',
          links: res.links.slice(0, 2),
        },
      ]);
    } catch (e) {
      const res = queryHeritageKnowledgeEngine(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-" + Date.now(),
          role: 'assistant',
          content: res.content,
          source: 'BharatVirasat AI Engine',
          links: res.links.slice(0, 2),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-bold text-sm shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-semibold tracking-wide">Ask Heritage AI</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-950/20 text-stone-950 font-extrabold">
            ChatGPT
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] max-h-[85vh] bg-stone-950 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">BharatVirasat AI</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    ChatGPT
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Cultural & Architectural Scholar</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/ask-bharat');
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Expand to Full Page"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-stone-900/40 border-b border-stone-800/60 flex gap-1.5 overflow-x-auto scrollbar-hide text-xs">
            <button
              onClick={() => handleSend('Tell me about Konark Sun Temple 24 sundial wheels')}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-[11px] whitespace-nowrap transition-colors"
            >
              ☀️ Konark Sundial
            </button>
            <button
              onClick={() => handleSend('How was Kailasa Temple Ellora carved?')}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-[11px] whitespace-nowrap transition-colors"
            >
              ⛰️ Kailasa Rock
            </button>
            <button
              onClick={() => handleSend('Top 5 student innovation ideas for heritage')}
              className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-[11px] whitespace-nowrap transition-colors"
            >
              🚀 Student Ideas
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={"flex flex-col " + (m.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={"max-w-[88%] rounded-xl p-3 " +
                    (m.role === 'user'
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                      : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none shadow')
                  }
                >
                  <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                    {m.content}
                  </div>

                  {m.links && m.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-800 flex flex-wrap gap-1.5">
                      {m.links.map((link, lIdx) => (
                        <button
                          key={lIdx}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(link.path);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] transition-colors"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {m.role === 'assistant' && (
                    <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-stone-500">
                      <span>{m.source || 'AI Scholar'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeak(m.id, m.content)}
                          className="hover:text-amber-400 transition-colors"
                          title="Listen to response"
                        >
                          {speakingId === m.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-stone-300 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs bg-stone-900 border border-stone-800 rounded-xl p-3 max-w-[80%]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Thinking with Indian heritage archives...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-stone-900/90 border-t border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or Hindi..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
