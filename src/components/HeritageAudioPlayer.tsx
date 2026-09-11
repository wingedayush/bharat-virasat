import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Mic,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Disc3,
  X,
  Gauge
} from 'lucide-react';

export interface SoundscapeTrack {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  raga: string;
  type: 'drone' | 'flute' | 'bells' | 'shehnai';
}

export const soundscapes: SoundscapeTrack[] = [
  {
    id: 'temple-bells',
    name: 'Sacred Temple Bells & Vedic Drone',
    hindiName: 'मंदिर घंटानाद व ओंकार ध्वनि',
    description: 'Resonant bronze bells ringing at 432 Hz with deep meditative Tanpura harmonics',
    raga: 'Kedar & Bhupali',
    type: 'bells',
  },
  {
    id: 'raga-bhairav',
    name: 'Morning Raga Bhairav (Sitar & Tanpura)',
    hindiName: 'प्रातः राग भैरव',
    description: 'The sublime dawn melody of awakening and inner peace across the Ganges ghats',
    raga: 'Ahir Bhairav',
    type: 'drone',
  },
  {
    id: 'bansuri-flute',
    name: 'Himalayan Bansuri & Mountain Breeze',
    hindiName: 'पहाड़ी बांसुरी व पवन नाद',
    description: 'Bamboo flute melodies echoing through the cedar valleys of the Himalayas',
    raga: 'Pahari',
    type: 'flute',
  },
  {
    id: 'royal-shehnai',
    name: 'Auspicious Shehnai of Kashi',
    hindiName: 'काशी की शहनाई',
    description: 'Celebratory double-reed heritage music echoing through temple courtyards',
    raga: 'Yaman Kalyan',
    type: 'shehnai',
  },
];

interface HeritageAudioPlayerProps {
  currentNarration?: {
    title: string;
    text: string;
    location?: string;
  } | null;
  onClearNarration?: () => void;
}

export function HeritageAudioPlayer({ currentNarration, onClearNarration }: HeritageAudioPlayerProps) {
  // Ambient Soundscape State
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SoundscapeTrack>(soundscapes[0]);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Voice Narration State
  const [isNarrating, setIsNarrating] = useState(false);
  const [isNarrationPaused, setIsNarrationPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [voiceVolume, setVoiceVolume] = useState<number>(1.0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [speechProgress, setSpeechProgress] = useState<number>(0); // 0 to 100

  // Words breakdown of current narrative
  const [words, setWords] = useState<string[]>([]);

  // Web Audio References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const soundIntervalRef = useRef<number | null>(null);

  // Canvas visualizer reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Speech Utterance reference
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Split narration into words whenever currentNarration changes
  useEffect(() => {
    if (currentNarration && currentNarration.text) {
      const split = currentNarration.text.split(/\s+/).filter(Boolean);
      setWords(split);
      setCurrentWordIndex(0);
      setSpeechProgress(0);
      setIsExpanded(true); // Automatically open the player so user sees the transcript
      startVoiceNarration(currentNarration.text, 0);
    } else {
      stopVoiceNarration();
      setWords([]);
    }
  }, [currentNarration]);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;

      const master = ctx.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      const ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(ambientVolume, ctx.currentTime);
      ambientGain.connect(master);
      ambientGainRef.current = ambientGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Stop ambient oscillators
  const stopAmbientSoundscape = () => {
    if (soundIntervalRef.current) {
      window.clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    activeOscillatorsRef.current = [];
    setIsPlayingSoundscape(false);
  };

  // Synthesize rich authentic Indian soundscapes via Web Audio API
  const startAmbientSoundscape = (track: SoundscapeTrack) => {
    stopAmbientSoundscape();
    initAudio();
    const ctx = audioCtxRef.current;
    const dest = ambientGainRef.current;
    if (!ctx || !dest) return;

    const oscs: OscillatorNode[] = [];

    if (track.type === 'bells') {
      // Harmonic Tanpura Drone (Sa-Pa-Sa: 136.1 Hz, 204.1 Hz, 272.2 Hz)
      const droneFreqs = [136.1, 204.1, 272.2];
      droneFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06 / (idx + 1), ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(dest);
        osc.start();
        oscs.push(osc);
      });

      // Periodic Bell Strike (Bronze Temple Bell at 432 Hz)
      const strikeBell = () => {
        if (!audioCtxRef.current || !ambientGainRef.current) return;
        const now = audioCtxRef.current.currentTime;

        // Fundamental 432 Hz
        const bell = audioCtxRef.current.createOscillator();
        const bellGain = audioCtxRef.current.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(432, now);
        bellGain.gain.setValueAtTime(0.35, now);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
        bell.connect(bellGain);
        bellGain.connect(ambientGainRef.current);
        bell.start(now);
        bell.stop(now + 4.1);

        // Overtone 864 Hz
        const overtone = audioCtxRef.current.createOscillator();
        const otGain = audioCtxRef.current.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(864, now);
        otGain.gain.setValueAtTime(0.15, now);
        otGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        overtone.connect(otGain);
        otGain.connect(ambientGainRef.current);
        overtone.start(now);
        overtone.stop(now + 2.9);
      };

      strikeBell();
      soundIntervalRef.current = window.setInterval(strikeBell, 5000);
    } else if (track.type === 'drone') {
      // Classical Tanpura Drone (Sa-Pa-Sa-Kharja)
      const notes = [136.1, 144.0, 204.1, 272.2];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Sub-LFO vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.18 + idx * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        oscs.push(lfo);

        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        osc.connect(gain);
        gain.connect(dest);
        osc.start();
        oscs.push(osc);
      });
    } else if (track.type === 'flute') {
      // Bansuri (Gentle Indian Scale Notes Generator)
      const scale = [220, 247.5, 277.2, 330, 370, 440];
      let noteIdx = 0;

      const fluteOsc = ctx.createOscillator();
      const fluteGain = ctx.createGain();
      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(scale[0], ctx.currentTime);
      fluteGain.gain.setValueAtTime(0.12, ctx.currentTime);
      fluteOsc.connect(fluteGain);
      fluteGain.connect(dest);
      fluteOsc.start();
      oscs.push(fluteOsc);

      // Warm background drone
      const baseDrone = ctx.createOscillator();
      const baseGain = ctx.createGain();
      baseDrone.type = 'triangle';
      baseDrone.frequency.setValueAtTime(110, ctx.currentTime);
      baseGain.gain.setValueAtTime(0.07, ctx.currentTime);
      baseDrone.connect(baseGain);
      baseGain.connect(dest);
      baseDrone.start();
      oscs.push(baseDrone);

      soundIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        noteIdx = (noteIdx + Math.floor(Math.random() * 2) + 1) % scale.length;
        fluteOsc.frequency.setTargetAtTime(scale[noteIdx], audioCtxRef.current.currentTime, 0.25);
      }, 1800);
    } else {
      // Shehnai (Auspicious Double-Reed Harmonic Resonance)
      const fundamental = 261.6;
      [1, 2, 3, 4].forEach((h) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(fundamental * h, ctx.currentTime);
        gain.gain.setValueAtTime(0.035 / h, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(fundamental * h, ctx.currentTime);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(dest);
        osc.start();
        oscs.push(osc);
      });
    }

    activeOscillatorsRef.current = oscs;
    setIsPlayingSoundscape(true);
  };

  const toggleSoundscape = () => {
    if (isPlayingSoundscape) {
      stopAmbientSoundscape();
    } else {
      startAmbientSoundscape(selectedTrack);
    }
  };

  // Update volume
  useEffect(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      ambientGainRef.current.gain.setTargetAtTime(isMuted ? 0 : ambientVolume, audioCtxRef.current.currentTime, 0.05);
    }
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 1, audioCtxRef.current.currentTime, 0.05);
    }
  }, [ambientVolume, isMuted]);

  // Robust Voice Guide Narration (SpeechSynthesis)
  const startVoiceNarration = (text: string, startWordOffset: number = 0) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Prepare text from offset
    const wordsList = text.split(/\s+/).filter(Boolean);
    const textToSpeak = wordsList.slice(startWordOffset).join(' ');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;
    utterance.volume = isMuted ? 0 : voiceVolume;
    utterance.pitch = 1.0;

    // Pick natural Indian English or gentle clear voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'en-IN' || v.name.includes('India')) ||
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Live word boundary tracking for interactive transcript highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        // estimate word index
        const spokenSoFar = textToSpeak.substring(0, charIdx);
        const wordCount = spokenSoFar.split(/\s+/).length;
        const totalIdx = startWordOffset + wordCount;
        setCurrentWordIndex(totalIdx);
        const progress = Math.min(100, Math.round((totalIdx / wordsList.length) * 100));
        setSpeechProgress(progress);
      }
    };

    utterance.onstart = () => {
      setIsNarrating(true);
      setIsNarrationPaused(false);
    };

    utterance.onend = () => {
      setIsNarrating(false);
      setIsNarrationPaused(false);
      setSpeechProgress(100);
      setCurrentWordIndex(wordsList.length);
    };

    utterance.onerror = () => {
      setIsNarrating(false);
      setIsNarrationPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseVoiceNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsNarrationPaused(true);
    }
  };

  const resumeVoiceNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsNarrationPaused(false);
    }
  };

  const stopVoiceNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      setIsNarrationPaused(false);
      setSpeechProgress(0);
      setCurrentWordIndex(0);
    }
  };

  // Rewind 10 words / ~5 seconds
  const handleRewind10 = () => {
    if (!currentNarration) return;
    const newIdx = Math.max(0, currentWordIndex - 12);
    setCurrentWordIndex(newIdx);
    startVoiceNarration(currentNarration.text, newIdx);
  };

  // Fast forward 10 words
  const handleForward10 = () => {
    if (!currentNarration) return;
    const newIdx = Math.min(words.length - 1, currentWordIndex + 12);
    setCurrentWordIndex(newIdx);
    startVoiceNarration(currentNarration.text, newIdx);
  };

  // Change Speech Speed
  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(speechRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setSpeechRate(nextSpeed);
    if (isNarrating && currentNarration) {
      startVoiceNarration(currentNarration.text, currentWordIndex);
    }
  };

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isActive = (isPlayingSoundscape || isNarrating) && !isMuted;

      const numBars = 16;
      const barWidth = 3;
      const gap = 3;

      for (let i = 0; i < numBars; i++) {
        const height = isActive
          ? Math.max(4, Math.sin(phase + i * 0.45) * 12 + 14)
          : 4;

        const x = i * (barWidth + gap) + 4;
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#fbbf24');
        grad.addColorStop(1, '#ea580c');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      if (isActive) phase += 0.14;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingSoundscape, isNarrating, isMuted]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded Studio Drawer */}
      {isExpanded && (
        <div className="mb-3 p-5 rounded-3xl bg-stone-900/95 backdrop-blur-2xl border border-amber-500/40 shadow-2xl w-80 sm:w-[420px] text-stone-200 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Disc3 className={`w-5 h-5 ${isPlayingSoundscape || isNarrating ? 'animate-spin-slow' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sonic Heritage Studio</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-amber-400 font-mono">Web Audio Synthesizer & Voice Narration</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isMuted ? 'bg-rose-500/20 text-rose-400' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute All'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Minimize Drawer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ACTIVE VOICE AUDIO GUIDE PANEL */}
          {currentNarration ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-950 border border-amber-500/30 mb-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Audio Guide Story
                  </span>
                </div>
                {onClearNarration && (
                  <button
                    onClick={() => {
                      stopVoiceNarration();
                      onClearNarration();
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800"
                    title="Close Audio Guide"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h5 className="text-sm font-bold text-white mb-0.5">{currentNarration.title}</h5>
              {currentNarration.location && (
                <p className="text-[10px] text-amber-400 font-mono mb-2">{currentNarration.location}</p>
              )}

              {/* Live Interactive Transcript Box */}
              <div className="h-24 overflow-y-auto p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 leading-relaxed scrollbar-hide mb-3 select-none">
                {words.map((w, idx) => (
                  <span
                    key={idx}
                    className={`transition-all duration-150 rounded px-0.5 ${
                      idx === currentWordIndex
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : idx < currentWordIndex
                        ? 'text-stone-400'
                        : 'text-stone-200'
                    }`}
                  >
                    {w}{' '}
                  </span>
                ))}
              </div>

              {/* Progress Slider */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                  <span>Reading Progress</span>
                  <span className="text-amber-400 font-mono font-bold">{speechProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${speechProgress}%` }}
                  />
                </div>
              </div>

              {/* Voice Controls: Rewind, Play/Pause, Forward, Speed */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRewind10}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Rewind 10 words"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (isNarrating) {
                        if (isNarrationPaused) {
                          resumeVoiceNarration();
                        } else {
                          pauseVoiceNarration();
                        }
                      } else {
                        startVoiceNarration(currentNarration.text, currentWordIndex);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  >
                    {isNarrating && !isNarrationPaused ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> {isNarrationPaused ? 'Resume' : 'Listen'}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleForward10}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Skip forward 10 words"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCycleSpeed}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-[11px] font-mono font-bold text-amber-300 hover:bg-stone-700 transition-colors flex items-center gap-1"
                  title="Playback Speed"
                >
                  <Gauge className="w-3 h-3" />
                  <span>{speechRate}x</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 text-center mb-4">
              <p className="text-xs text-stone-400">
                Click <strong>"Audio Guide"</strong> on any UNESCO monument card to hear its historical story with spoken subtitles!
              </p>
            </div>
          )}

          {/* AMBIENT INDIAN SOUNDSCAPES SECTION */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                Ambient Traditional Soundscapes
              </label>
              <span className="text-[10px] text-amber-400 font-mono">432 Hz Synthesizer</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {soundscapes.map((track) => {
                const isSelected = selectedTrack.id === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedTrack(track);
                      if (isPlayingSoundscape) {
                        startAmbientSoundscape(track);
                      }
                    }}
                    className={`p-2.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-100 leading-tight mb-0.5">{track.name}</p>
                      <p className="text-[10px] text-amber-400">{track.raga}</p>
                    </div>

                    {isSelected && isPlayingSoundscape && (
                      <div className="flex items-end gap-0.5 h-3 mt-2">
                        <span className="w-1 bg-amber-400 rounded-full animate-sound-1" />
                        <span className="w-1 bg-amber-400 rounded-full animate-sound-2" />
                        <span className="w-1 bg-amber-400 rounded-full animate-sound-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ambient Volume Slider */}
          <div className="mb-4 bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-400 text-[11px]">Ambient Volume</span>
              <span className="text-amber-400 font-mono font-bold text-[11px]">
                {isMuted ? 'Muted' : `${Math.round(ambientVolume * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : ambientVolume}
              onChange={(e) => {
                setIsMuted(false);
                setAmbientVolume(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Master Ambient Play/Pause Toggle Button */}
          <button
            onClick={toggleSoundscape}
            className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isPlayingSoundscape
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 hover:scale-[1.02]'
            }`}
          >
            {isPlayingSoundscape ? (
              <>
                <Pause className="w-4 h-4" /> Pause Ambient Soundscape
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play Ambient Indian Soundscape
              </>
            )}
          </button>
        </div>
      )}

      {/* Floating Pill / Mini Controller */}
      <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-xl p-2 rounded-full border border-amber-500/40 shadow-2xl hover:border-amber-400 transition-all">
        {/* Toggle Ambient Sound or Voice */}
        <button
          onClick={() => {
            if (currentNarration) {
              if (isNarrating && !isNarrationPaused) {
                pauseVoiceNarration();
              } else {
                startVoiceNarration(currentNarration.text, currentWordIndex);
              }
            } else {
              toggleSoundscape();
            }
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPlayingSoundscape || isNarrating
              ? 'bg-amber-500 text-stone-950 animate-pulse-gold shadow-lg shadow-amber-900/40'
              : 'bg-stone-800 text-stone-300 hover:text-amber-400'
          }`}
          title={
            isPlayingSoundscape || isNarrating
              ? 'Pause Audio'
              : 'Play Ambient Indian Soundscape'
          }
        >
          {isPlayingSoundscape || isNarrating ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Live Canvas Audio Wave Visualizer */}
        <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer px-1" title="Open Studio Drawer">
          <canvas ref={canvasRef} width={105} height={32} className="block" />
        </div>

        {/* Expand / Collapse Drawer Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          title={isExpanded ? 'Minimize Audio Studio' : 'Expand Audio Studio'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
