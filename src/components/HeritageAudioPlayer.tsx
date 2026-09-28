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
  Gauge,
  Compass,
  Bell,
  Music2,
  Radio
} from 'lucide-react';
import {
  playNavigationSound,
  getNavAudioSettings,
  updateNavAudioSettings,
  subscribeNavAudioSettings,
  NavSoundType
} from '@/lib/navigationAudio';

export interface SoundscapeTrack {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  raga: string;
  type: 'bells' | 'drone' | 'flute' | 'shehnai' | 'sitar' | 'santoor' | 'rudraveena' | 'rain-monsoon';
}

export const soundscapes: SoundscapeTrack[] = [
  {
    id: 'temple-bells',
    name: 'Sacred Temple Bells & Vedic Tanpura',
    hindiName: 'मंदिर घंटानाद व वैदिक तानपुरा',
    description: 'Resonant bronze bells ringing at 432 Hz with deep meditative Tanpura harmonics',
    raga: 'Kedar & Bhupali (432 Hz)',
    type: 'bells',
  },
  {
    id: 'bansuri-flute',
    name: 'Himalayan Bansuri & Mountain Echoes',
    hindiName: 'पहाड़ी बांसुरी व पवन नाद',
    description: 'Bamboo flute melodies with microtonal slides echoing across cedar valleys',
    raga: 'Pahari & Shivranjani',
    type: 'flute',
  },
  {
    id: 'sitar-yaman',
    name: 'Twilight Sitar & Sympathetic Tarab',
    hindiName: 'संध्या सितार व यमन राग',
    description: 'Intricate sitar resonance with sympathetic vibration strings and tranquil drone',
    raga: 'Yaman Kalyan',
    type: 'sitar',
  },
  {
    id: 'santoor-kashmir',
    name: 'Kashmiri Santoor Shimmering Cascades',
    hindiName: 'कश्मीरी संतूर की झंकार',
    description: 'One hundred struck strings generating sparkling melodic waves and tranquil reverbs',
    raga: 'Kirwani & Pahari',
    type: 'santoor',
  },
  {
    id: 'rudra-veena',
    name: 'Dhrupad Rudra Veena Meditation',
    hindiName: 'रुद्र वीणा ध्यान संगीत',
    description: 'Deep subterranean acoustic frequencies and ancient meditative temple resonance',
    raga: 'Bhairav & Asavari',
    type: 'rudraveena',
  },
  {
    id: 'monsoon-megh',
    name: 'Monsoon Rain & Courtyard Flute',
    hindiName: 'मेघ मल्हार व वर्षा नाद',
    description: 'Gentle monsoon rainfall on stone courtyards paired with soothing bamboo melodies',
    raga: 'Megh Malhar',
    type: 'rain-monsoon',
  },
  {
    id: 'raga-bhairav',
    name: 'Ganges Dawn Raga (Sitar & Drone)',
    hindiName: 'प्रातः राग भैरव',
    description: 'The sublime dawn melody of awakening and inner peace across the Ganges ghats',
    raga: 'Ahir Bhairav',
    type: 'drone',
  },
  {
    id: 'royal-shehnai',
    name: 'Auspicious Shehnai of Kashi',
    hindiName: 'काशी की शहनाई',
    description: 'Celebratory double-reed heritage music echoing through temple courtyards',
    raga: 'Bilawal & Kafi',
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
  const [speechProgress, setSpeechProgress] = useState<number>(0);

  // Navigation Audio Settings State
  const [navSettings, setNavSettings] = useState(getNavAudioSettings());

  useEffect(() => {
    return subscribeNavAudioSettings((updated) => setNavSettings(updated));
  }, []);

  // Words breakdown of current narrative
  const [words, setWords] = useState<string[]>([]);

  // Web Audio References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const soundIntervalRef = useRef<number | null>(null);

  // Canvas visualizer reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Speech Utterance reference
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    if (noiseSourceRef.current) {
      try {
        (noiseSourceRef.current as AudioBufferSourceNode).stop();
        noiseSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      noiseSourceRef.current = null;
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
      soundIntervalRef.current = window.setInterval(strikeBell, 4600);
    } else if (track.type === 'flute') {
      // Bansuri (Gentle Indian Scale Notes Generator with warm drone)
      const scale = [220, 246.9, 277.2, 329.6, 369.9, 440, 493.8, 554.4];
      let noteIdx = 0;

      const fluteOsc = ctx.createOscillator();
      const fluteGain = ctx.createGain();
      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(scale[0], ctx.currentTime);
      fluteGain.gain.setValueAtTime(0.14, ctx.currentTime);

      const fluteFilter = ctx.createBiquadFilter();
      fluteFilter.type = 'lowpass';
      fluteFilter.frequency.setValueAtTime(1400, ctx.currentTime);

      fluteOsc.connect(fluteGain);
      fluteGain.connect(fluteFilter);
      fluteFilter.connect(dest);
      fluteOsc.start();
      oscs.push(fluteOsc);

      // Warm background mountain drone
      const baseDrone = ctx.createOscillator();
      const baseGain = ctx.createGain();
      baseDrone.type = 'triangle';
      baseDrone.frequency.setValueAtTime(110, ctx.currentTime);
      baseGain.gain.setValueAtTime(0.08, ctx.currentTime);
      baseDrone.connect(baseGain);
      baseGain.connect(dest);
      baseDrone.start();
      oscs.push(baseDrone);

      soundIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % scale.length;
        fluteOsc.frequency.setTargetAtTime(scale[noteIdx], audioCtxRef.current.currentTime, 0.28);
      }, 1600);
    } else if (track.type === 'sitar') {
      // Sitar with sympathetic resonance (Raga Yaman)
      const ragaYaman = [146.83, 164.81, 185.0, 207.65, 220.0, 246.94, 277.18];
      let sitarNoteIdx = 0;

      const sitarDrone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      sitarDrone.type = 'sawtooth';
      sitarDrone.frequency.setValueAtTime(146.83, ctx.currentTime);
      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(600, ctx.currentTime);

      sitarDrone.connect(droneGain);
      droneGain.connect(droneFilter);
      droneFilter.connect(dest);
      sitarDrone.start();
      oscs.push(sitarDrone);

      // Pluck sequence function
      const playSitarPluck = () => {
        if (!audioCtxRef.current || !ambientGainRef.current) return;
        const now = audioCtxRef.current.currentTime;
        sitarNoteIdx = (sitarNoteIdx + 1) % ragaYaman.length;
        const freq = ragaYaman[sitarNoteIdx];

        const pluck = audioCtxRef.current.createOscillator();
        const pluckGain = audioCtxRef.current.createGain();
        pluck.type = 'sawtooth';
        pluck.frequency.setValueAtTime(freq, now);
        pluck.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.18);

        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 2.5, now);
        filter.Q.setValueAtTime(3.5, now);

        pluckGain.gain.setValueAtTime(0.18, now);
        pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        pluck.connect(filter);
        filter.connect(pluckGain);
        pluckGain.connect(ambientGainRef.current);
        pluck.start(now);
        pluck.stop(now + 1.45);
      };

      playSitarPluck();
      soundIntervalRef.current = window.setInterval(playSitarPluck, 1400);
    } else if (track.type === 'santoor') {
      // Kashmiri Santoor (100 hammered strings arpeggiating in Raga Kirwani)
      const santoorScale = [261.63, 293.66, 311.13, 349.23, 392.0, 415.3, 493.88, 523.25];
      let sIdx = 0;

      // Base background tanpura
      const base = ctx.createOscillator();
      const bGain = ctx.createGain();
      base.type = 'triangle';
      base.frequency.setValueAtTime(130.81, ctx.currentTime);
      bGain.gain.setValueAtTime(0.06, ctx.currentTime);
      base.connect(bGain);
      bGain.connect(dest);
      base.start();
      oscs.push(base);

      const strikeSantoor = () => {
        if (!audioCtxRef.current || !ambientGainRef.current) return;
        const now = audioCtxRef.current.currentTime;
        sIdx = (sIdx + Math.floor(Math.random() * 2) + 1) % santoorScale.length;
        const freq = santoorScale[sIdx];

        const strk = audioCtxRef.current.createOscillator();
        const strkGain = audioCtxRef.current.createGain();
        strk.type = 'triangle';
        strk.frequency.setValueAtTime(freq, now);

        strkGain.gain.setValueAtTime(0.15, now);
        strkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        strk.connect(strkGain);
        strkGain.connect(ambientGainRef.current);
        strk.start(now);
        strk.stop(now + 0.9);
      };

      strikeSantoor();
      soundIntervalRef.current = window.setInterval(strikeSantoor, 700);
    } else if (track.type === 'rudraveena') {
      // Deep Ancient Dhrupad Rudra Veena (Subterranean Frequencies)
      const veenaFreqs = [55.0, 82.5, 110.0, 165.0];
      veenaFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.09 / (idx + 1), ctx.currentTime);
        osc.connect(gain);
        gain.connect(filter);
        filter.connect(dest);
        osc.start();
        oscs.push(osc);
      });
    } else if (track.type === 'rain-monsoon') {
      // Monsoon Rain Ambient + Raga Megh Malhar Flute
      // Synthesize pink/white noise buffer for gentle temple rainfall
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(800, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.18, ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(dest);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;

      // Soft flute motif in Megh Malhar
      const meghScale = [220, 246.9, 293.66, 329.6, 392.0];
      let mIdx = 0;
      const mFlute = ctx.createOscillator();
      const mGain = ctx.createGain();
      mFlute.type = 'sine';
      mFlute.frequency.setValueAtTime(meghScale[0], ctx.currentTime);
      mGain.gain.setValueAtTime(0.09, ctx.currentTime);
      mFlute.connect(mGain);
      mGain.connect(dest);
      mFlute.start();
      oscs.push(mFlute);

      soundIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        mIdx = (mIdx + 1) % meghScale.length;
        mFlute.frequency.setTargetAtTime(meghScale[mIdx], audioCtxRef.current.currentTime, 0.35);
      }, 2200);
    } else if (track.type === 'drone') {
      // Classical Tanpura Drone (Sa-Pa-Sa-Kharja)
      const notes = [136.1, 144.0, 204.1, 272.2];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

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

    const wordsList = text.split(/\s+/).filter(Boolean);
    const textToSpeak = wordsList.slice(startWordOffset).join(' ');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;
    utterance.volume = isMuted ? 0 : voiceVolume;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'en-IN' || v.name.includes('India')) ||
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
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
    }
  };

  const handleRewind10 = () => {
    const newIdx = Math.max(0, currentWordIndex - 10);
    setCurrentWordIndex(newIdx);
    if (currentNarration) {
      startVoiceNarration(currentNarration.text, newIdx);
    }
  };

  const handleForward10 = () => {
    if (!currentNarration) return;
    const newIdx = Math.min(words.length - 1, currentWordIndex + 10);
    setCurrentWordIndex(newIdx);
    startVoiceNarration(currentNarration.text, newIdx);
  };

  const handleCycleSpeed = () => {
    const speeds = [0.8, 1.0, 1.25, 1.5];
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

      const numBars = 14;
      const barWidth = 3;
      const gap = 3;

      for (let i = 0; i < numBars; i++) {
        const height = isActive
          ? Math.max(4, Math.sin(phase + i * 0.45) * 12 + 13)
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
    // POSITIONED ON THE LEFT SIDE
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      {/* Expanded Studio Drawer */}
      {isExpanded && (
        <div className="mb-3 p-5 rounded-3xl bg-stone-900/95 backdrop-blur-2xl border border-amber-500/40 shadow-2xl w-[calc(100vw-32px)] sm:w-[440px] max-h-[85vh] overflow-y-auto text-stone-200 animate-fade-in origin-bottom-left">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
                <Disc3 className={`w-5 h-5 ${isPlayingSoundscape || isNarrating ? 'animate-spin-slow' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sonic Heritage Studio</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-amber-400 font-mono">Traditional Indian Audio & Navigation</p>
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

              {/* Voice Controls */}
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

          {/* 🧭 NAVIGATION AUDIO CONTROLS SECTION */}
          <div className="mb-4 p-3.5 rounded-2xl bg-stone-950/80 border border-amber-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Navigation Audio
                </span>
              </div>
              <button
                onClick={() => playNavigationSound(navSettings.soundType, 0.85)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono transition-colors"
                title="Test navigation audio chime"
              >
                Test Chime
              </button>
            </div>

            <p className="text-[10px] text-stone-400 mb-2.5">
              Acoustic chimes and spoken voice guides as you navigate monuments and pages.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => {
                  const next = !navSettings.soundEnabled;
                  updateNavAudioSettings({ soundEnabled: next });
                  if (next) playNavigationSound(navSettings.soundType, 0.8);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  navSettings.soundEnabled
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium">Nav Chimes</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${navSettings.soundEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                  {navSettings.soundEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => {
                  const next = !navSettings.voiceEnabled;
                  updateNavAudioSettings({ voiceEnabled: next });
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  navSettings.voiceEnabled
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium">Voice Guide</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${navSettings.voiceEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500'}`}>
                  {navSettings.voiceEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Chime Sound Motif Picker */}
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Navigation Chime Motif:</label>
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                {(['temple-bell', 'sitar', 'flute', 'gentle'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      updateNavAudioSettings({ soundType: type });
                      playNavigationSound(type, 0.8);
                    }}
                    className={`py-1 px-1 rounded-lg border text-center capitalize transition-colors ${
                      navSettings.soundType === type
                        ? 'bg-amber-500/30 border-amber-500 text-amber-300 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {type === 'temple-bell' ? '🔔 Bell' : type === 'sitar' ? '🪕 Sitar' : type === 'flute' ? '🪈 Flute' : '✨ Gentle'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🎵 AMBIENT INDIAN SOUNDSCAPES SECTION */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Ambient Traditional Soundscapes</span>
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
                      <p className="text-[10px] text-amber-400 font-medium">{track.raga}</p>
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
                <Pause className="w-4 h-4" /> Pause Ambient Music
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play Ambient Indian Soundscape
              </>
            )}
          </button>
        </div>
      )}

      {/* Floating Pill / Mini Controller (LEFT SIDE) */}
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
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer px-1 hidden sm:block"
          title="Open Sonic Heritage Studio"
        >
          <canvas ref={canvasRef} width={90} height={30} className="block" />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors pr-1 hidden sm:flex items-center gap-1"
        >
          <span>Sonic Studio</span>
        </button>

        {/* Expand / Collapse Drawer Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          title={isExpanded ? 'Minimize Audio Studio' : 'Expand Sonic Heritage Studio'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
