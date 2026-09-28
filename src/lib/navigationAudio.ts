// BharatVirasat - Navigation Audio & Sonic Experience Engine
// Provides synthesized authentic Indian micro-sounds for page transitions
// and optional spoken voice guidance for seamless cultural navigation.

export type NavSoundType = 'temple-bell' | 'sitar' | 'gentle' | 'flute';

interface NavAudioSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  volume: number;
  soundType: NavSoundType;
}

const STORAGE_KEY = 'bharatvirasat_nav_audio_settings';

function loadSettings(): NavAudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return {
        soundEnabled: true,
        voiceEnabled: false,
        volume: 0.6,
        soundType: 'temple-bell',
        ...JSON.parse(raw),
      };
    }
  } catch {
    // fallback
  }
  return {
    soundEnabled: true,
    voiceEnabled: false,
    volume: 0.6,
    soundType: 'temple-bell',
  };
}

let settings: NavAudioSettings = loadSettings();
const listeners = new Set<(s: NavAudioSettings) => void>();

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn({ ...settings }));
}

export function subscribeNavAudioSettings(fn: (s: NavAudioSettings) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getNavAudioSettings(): NavAudioSettings {
  return { ...settings };
}

export function updateNavAudioSettings(partial: Partial<NavAudioSettings>) {
  settings = { ...settings, ...partial };
  saveSettings();
}

// Shared AudioContext for low-latency feedback
let navAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!navAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      navAudioCtx = new AudioCtx();
    }
  }
  if (navAudioCtx && navAudioCtx.state === 'suspended') {
    navAudioCtx.resume().catch(() => {});
  }
  return navAudioCtx;
}

/**
 * Synthesizes an authentic acoustic Indian micro-sound for navigation
 */
export function playNavigationSound(soundType: NavSoundType = settings.soundType, customVol?: number) {
  if (!settings.soundEnabled && customVol === undefined) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const vol = (customVol !== undefined ? customVol : settings.volume) * 0.7;
  const now = ctx.currentTime;

  try {
    if (soundType === 'temple-bell') {
      // Harmonic Temple Bell Chime (432Hz fundamental + 864Hz octave + 1296Hz shimmer)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.45, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      masterGain.connect(ctx.destination);

      // Fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, now);
      osc1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 1.6);

      // Overtone
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(864, now);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.3, now);
      osc2.connect(g2);
      g2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + 1.4);

      // Shimmer
      const osc3 = ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(1296, now);
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.12, now);
      osc3.connect(g3);
      g3.connect(masterGain);
      osc3.start(now);
      osc3.stop(now + 1.0);
    } else if (soundType === 'sitar') {
      // Sitar Pluck Resonance with fast glide & sympathetic buzz
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      masterGain.connect(ctx.destination);

      const sitarOsc = ctx.createOscillator();
      sitarOsc.type = 'sawtooth';
      sitarOsc.frequency.setValueAtTime(293.66, now); // Re / D4
      sitarOsc.frequency.exponentialRampToValueAtTime(329.63, now + 0.15); // Meend to Ga / E4

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(880, now);
      filter.Q.setValueAtTime(4.0, now);

      sitarOsc.connect(filter);
      filter.connect(masterGain);
      sitarOsc.start(now);
      sitarOsc.stop(now + 1.2);

      // Harmonic second string
      const str2 = ctx.createOscillator();
      str2.type = 'sine';
      str2.frequency.setValueAtTime(440, now + 0.05);
      const str2Gain = ctx.createGain();
      str2Gain.gain.setValueAtTime(0.2, now + 0.05);
      str2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      str2.connect(str2Gain);
      str2Gain.connect(masterGain);
      str2.start(now + 0.05);
      str2.stop(now + 0.95);
    } else if (soundType === 'flute') {
      // Melodic Bansuri Rising Two-Note Motif
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.4, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setTargetAtTime(659.25, now + 0.12, 0.06); // E5
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.4);
    } else {
      // Gentle Harmonic Chime
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.4, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.9);
    }
  } catch {
    // ignore audio glitches
  }
}

// Spoken Guide Descriptions for Navigation Routes
export const PAGE_AUDIO_GUIDES: Record<string, { title: string; voiceIntro: string }> = {
  home: {
    title: 'BharatVirasat Home',
    voiceIntro: 'Welcome to BharatVirasat. Celebrating India\'s timeless architectural wonders and living crafts.',
  },
  unesco: {
    title: '32 UNESCO World Heritage Sites',
    voiceIntro: 'Now viewing thirty-two UNESCO World Heritage Sites of India, with 3D models and spoken audio chronicles.',
  },
  asi: {
    title: 'ASI Monument Protection Portal',
    voiceIntro: 'Welcome to the Archaeological Survey of India preservation portal and ticket booking archive.',
  },
  '3d-view': {
    title: '3D Archaeo-Sanctum',
    voiceIntro: 'Entering the 3D Archaeo-Sanctum. Explore monuments in interactive three-dimensional geometry.',
  },
  explore: {
    title: 'Explore India by State',
    voiceIntro: 'Explore India\'s states, regional architecture, and cultural heritage circuits.',
  },
  artisans: {
    title: 'Master Artisans & Heritage Crafts',
    voiceIntro: 'Discover master craftspeople, handloom weavers, and GI-certified artisanal traditions of Bharat.',
  },
  reels: {
    title: 'Heritage Video Shorts',
    voiceIntro: 'Watch captivating heritage stories, temple architecture reels, and ancient secrets.',
  },
  identify: {
    title: 'AI Monument Lens',
    voiceIntro: 'AI Monument Lens. Scan or upload an image to identify any historical monument instantly.',
  },
  'ask-bharat': {
    title: 'Ask Bharat AI Scholar',
    voiceIntro: 'Ask Bharat AI Scholar. Consult our civilizational knowledge engine and ChatGPT scholar.',
  },
  'near-me': {
    title: 'Heritage Monuments Near You',
    voiceIntro: 'Locating historical monuments, ASI protected sites, and cultural landmarks near your coordinates.',
  },
  quiz: {
    title: 'Civilizational Heritage Quiz',
    voiceIntro: 'Test your knowledge on Indian heritage, ancient dynasties, and earn Virasat Points.',
  },
  journey: {
    title: 'Your Heritage Journey',
    voiceIntro: 'View your completed heritage quests, unlocked badges, and traveler achievements.',
  },
  compare: {
    title: 'Monument Architectural Comparison',
    voiceIntro: 'Compare architectural styles, dynasties, and historical epochs side by side.',
  },
  login: {
    title: 'Student Innovation Pass',
    voiceIntro: 'Sign in to access your student innovation pass and heritage research portfolio.',
  },
  team: {
    title: 'Meet Team Wintech',
    voiceIntro: 'Meet Team Wintech, the engineering and architectural team behind BharatVirasat.',
  },
};

/**
 * Triggers both chime sound and optional voice narration when navigating
 */
export function triggerNavigationAudio(routePath: string) {
  // 1. Play subtle harmonic navigation chime
  playNavigationSound();

  // 2. Play voice navigation guide if enabled by user
  if (settings.voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const cleanRoute = routePath.replace(/^#\/?/, '').split('/')[0] || 'home';
    const guide = PAGE_AUDIO_GUIDES[cleanRoute] || PAGE_AUDIO_GUIDES['home'];

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(guide.voiceIntro);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = settings.volume;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang === 'en-IN' || v.name.includes('India')) ||
      voices.find((v) => v.name.includes('Natural') || v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    // Small delay so it begins smoothly after chime
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 280);
  }
}
