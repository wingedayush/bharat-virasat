import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Landmark,
  Search,
  Filter,
  Sparkles,
  Navigation,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  X,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Film,
  Play,
  Pause,
  Maximize2,
  Clock,
  Hammer,
  Quote,
  ScrollText,
  Compass,
  Ticket
} from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { getMonumentHistoryProfile, MonumentHistoricalProfile } from '@/data/monumentHistoricalProfiles';
import { Monument3DViewer } from '@/components/Monument3DViewer';
import { MonumentAnimatedBackground } from '@/components/MonumentAnimatedBackground';

interface UnescoPageProps {
  onPlayAudioGuide?: (title: string, script: string, location?: string) => void;
}

// Procedural Indian Classical Ambient Soundtrack Synthesizer (Tanpura Drone + Sacred Temple Bells)
class CinemaAmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private bellIntervalId: number | null = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Warm Tanpura Drone Harmonics (C#3 root, G#3 fifth, C#4 octave, and meditative harmonic)
      const baseFreqs = [138.59, 207.65, 277.18, 432.0];
      this.oscillators = [];

      baseFreqs.forEach((freq, index) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle slow pitch drifting for natural acoustic acoustic warmth
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + index * 0.07, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        // Warm lowpass filter to remove harshness
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420 + index * 80, this.ctx.currentTime);

        const individualVolume = index === 0 ? 0.4 : index === 1 ? 0.35 : 0.25;
        oscGain.gain.setValueAtTime(individualVolume, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();

        this.oscillators.push(osc);
      });

      // Sacred Temple Bell Chime triggered every 7.5 seconds
      const triggerTempleBell = () => {
        if (!this.ctx || !this.masterGain || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        
        // Bell fundamental and overtones
        const bellFreqs = [528, 1056, 1584];
        bellFreqs.forEach((bFreq, bIdx) => {
          if (!this.ctx || !this.masterGain) return;
          const bellOsc = this.ctx.createOscillator();
          const bellGain = this.ctx.createGain();

          bellOsc.type = 'sine';
          bellOsc.frequency.setValueAtTime(bFreq, now);

          // Exponential decay
          const strikeVol = bIdx === 0 ? 0.08 : 0.035;
          bellGain.gain.setValueAtTime(strikeVol, now);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

          bellOsc.connect(bellGain);
          bellGain.connect(this.masterGain);

          bellOsc.start(now);
          bellOsc.stop(now + 4);
        });
      };

      // Initial gentle bell chime
      setTimeout(() => {
        if (this.isPlaying) triggerTempleBell();
      }, 1000);

      this.bellIntervalId = window.setInterval(triggerTempleBell, 7500);
      this.isPlaying = true;
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + 1.2);
        setTimeout(() => {
          this.oscillators.forEach((osc) => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          this.oscillators = [];
          if (this.ctx) {
            this.ctx.close().catch(() => {});
            this.ctx = null;
          }
        }, 1300);
      } catch {
        this.oscillators = [];
        this.ctx = null;
      }
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  get active(): boolean {
    return this.isPlaying;
  }
}

export function UnescoPage({ onPlayAudioGuide }: UnescoPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cultural' | 'natural' | 'mixed'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [active3DMonument, setActive3DMonument] = useState<UnescoMonument | null>(null);
  const [detailMonument, setDetailMonument] = useState<UnescoMonument | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'chronicle' | 'timeline' | 'engineering' | 'lore'>('chronicle');
  
  // Full-Screen Cinema State
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [cinemaIndex, setCinemaIndex] = useState(0);
  const [cinemaAutoPlay, setCinemaAutoPlay] = useState(true);
  const [showTextOverlay, setShowTextOverlay] = useState(true); // "test remove it" -> user toggle for full screen text
  const [isAmbientSoundActive, setIsAmbientSoundActive] = useState(false); // Ambient soundtrack toggle

  const ambientSynthRef = useRef<CinemaAmbientSynthesizer | null>(null);

  // Initialize synthesizer
  useEffect(() => {
    ambientSynthRef.current = new CinemaAmbientSynthesizer();
    return () => {
      if (ambientSynthRef.current) {
        ambientSynthRef.current.stop();
      }
    };
  }, []);

  // Ambient sound toggle handler
  const toggleAmbientSound = () => {
    if (!ambientSynthRef.current) return;
    const newState = ambientSynthRef.current.toggle();
    setIsAmbientSoundActive(newState);
  };

  // Auto-play interval for Cinema Mode
  useEffect(() => {
    if (!isCinemaMode || !cinemaAutoPlay) return;
    const timer = setInterval(() => {
      setCinemaIndex((prev) => (prev + 1) % unescoMonumentsList.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [isCinemaMode, cinemaAutoPlay]);

  // Keyboard navigation & Shortcuts for Cinema Mode
  useEffect(() => {
    if (!isCinemaMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCinemaMode(false);
      if (e.key === 'ArrowRight') setCinemaIndex((prev) => (prev + 1) % unescoMonumentsList.length);
      if (e.key === 'ArrowLeft') setCinemaIndex((prev) => (prev - 1 + unescoMonumentsList.length) % unescoMonumentsList.length);
      if (e.key === ' ') {
        e.preventDefault();
        setCinemaAutoPlay((prev) => !prev);
      }
      // 'H' or 'T' shortcut to hide/show text HUD
      if (e.key === 'h' || e.key === 'H' || e.key === 't' || e.key === 'T') {
        setShowTextOverlay((prev) => !prev);
      }
      // 'M' shortcut for ambient audio soundtrack
      if (e.key === 'm' || e.key === 'M') {
        toggleAmbientSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaMode]);

  const currentCinemaMonument = unescoMonumentsList[cinemaIndex] || unescoMonumentsList[0];
  const currentCinemaHistoryProfile: MonumentHistoricalProfile = useMemo(() => {
    return getMonumentHistoryProfile(currentCinemaMonument?.id || 'taj_mahal');
  }, [currentCinemaMonument]);

  const detailHistoryProfile: MonumentHistoricalProfile = useMemo(() => {
    return getMonumentHistoryProfile(detailMonument?.id || 'taj_mahal');
  }, [detailMonument]);

  const filteredMonuments = useMemo(() => {
    return unescoMonumentsList.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesRegion = selectedRegion === 'all' || m.region.toLowerCase() === selectedRegion.toLowerCase();
      const q = searchQuery.toLowerCase();
      const profile = getMonumentHistoryProfile(m.id);
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.hindiName.includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.stateName.toLowerCase().includes(q) ||
        m.history.toLowerCase().includes(q) ||
        m.coreHighlight.toLowerCase().includes(q) ||
        m.architecturalSignificance.toLowerCase().includes(q) ||
        profile.dynastyAndEra.toLowerCase().includes(q) ||
        profile.rulingMonarchs.some((r) => r.toLowerCase().includes(q));

      return matchesCategory && matchesRegion && matchesSearch;
    });
  }, [selectedCategory, selectedRegion, searchQuery]);

  const categories = [
    { id: 'all', label: 'All 32 Inscribed Sites', count: unescoMonumentsList.length },
    { id: 'cultural', label: '🏛️ Cultural Monuments', count: unescoMonumentsList.filter((m) => m.category === 'cultural').length },
    { id: 'natural', label: '🌿 Natural Biospheres', count: unescoMonumentsList.filter((m) => m.category === 'natural').length },
    { id: 'mixed', label: '🌄 Mixed Heritage', count: unescoMonumentsList.filter((m) => m.category === 'mixed').length },
  ];

  const regions = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];

  return (
    <MonumentAnimatedBackground className="min-h-screen text-stone-100 pt-20 pb-28" isFixed={true}>
      {/* FULL-SCREEN MONUMENT CINEMA EXPERIENCE */}
      {isCinemaMode && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-fade-in select-none">
          {/* Background Fullscreen Image with Smooth Transition */}
          <div 
            className="absolute inset-0 overflow-hidden cursor-pointer"
            onClick={() => {
              if (!showTextOverlay) {
                setShowTextOverlay(true);
              }
            }}
          >
            <img
              key={currentCinemaMonument.id}
              src={currentCinemaMonument.image}
              alt={currentCinemaMonument.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85';
              }}
              className="w-full h-full object-cover transform scale-105 transition-all duration-1000 ease-out"
            />
            {/* Cinematic Gradients for Rich Text Contrast */}
            <div 
              className={'absolute inset-0 transition-opacity duration-500 ' + (
                showTextOverlay 
                  ? 'bg-gradient-to-t from-stone-950 via-stone-950/45 to-black/80 opacity-100' 
                  : 'bg-gradient-to-t from-black/60 via-transparent to-black/40 opacity-60'
              )} 
            />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none" />
          </div>

          {/* Floating Pill when text overlay is hidden */}
          {!showTextOverlay && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 animate-fade-in flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTextOverlay(true);
                }}
                className="px-4 py-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/50 backdrop-blur-md text-xs font-bold shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
                title="Restore monument name, history, and controls (or press 'H')"
              >
                <Eye className="w-4 h-4" />
                <span>Show Monument Details (Press 'H')</span>
              </button>
            </div>
          )}

          {/* Top Cinema HUD */}
          <div className={'relative z-30 p-4 sm:p-6 flex items-center justify-between transition-all duration-500 ' + (
            showTextOverlay 
              ? 'bg-gradient-to-b from-black/85 via-black/50 to-transparent opacity-100 translate-y-0' 
              : 'opacity-40 hover:opacity-100 -translate-y-1'
          )}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 backdrop-blur-md">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                  UNESCO World Heritage Cinema
                </span>
                <h2 className="text-white font-bold text-sm sm:text-base">
                  Living Monuments of Bharat
                </h2>
              </div>
            </div>

            {/* Cinema Control Bar */}
            <div className="flex items-center gap-2">
              {/* Slideshow Index Badge */}
              <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-stone-700 text-amber-300 text-xs font-mono font-bold">
                {cinemaIndex + 1} / {unescoMonumentsList.length}
              </span>

              {/* Ambient Soundtrack Toggle Icon */}
              <button
                onClick={toggleAmbientSound}
                className={'p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md border ' + (
                  isAmbientSoundActive
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/50'
                    : 'bg-black/60 text-stone-300 border-stone-700 hover:bg-stone-800'
                )}
                title={isAmbientSoundActive ? "Mute Ambient Soundtrack (Tanpura & Temple Bells)" : "Play Ambient Soundtrack (Press 'M')"}
              >
                {isAmbientSoundActive ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Ambient: ON 🪔</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-400" />
                    <span className="hidden sm:inline">Ambient: OFF</span>
                  </>
                )}
              </button>

              {/* Text Remove / Show Toggle Icon (User requested feature) */}
              <button
                onClick={() => setShowTextOverlay(!showTextOverlay)}
                className={'p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md border ' + (
                  showTextOverlay
                    ? 'bg-black/60 text-stone-300 border-stone-700 hover:bg-stone-800'
                    : 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-900/40'
                )}
                title={showTextOverlay ? "Hide Text & HUD (Press 'H' or 'T')" : "Show Text & HUD (Press 'H' or 'T')"}
              >
                {showTextOverlay ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-stone-950" />}
                <span className="hidden sm:inline">{showTextOverlay ? 'Hide Text (H)' : 'Show Text (H)'}</span>
              </button>

              {/* AutoPlay Pause/Resume */}
              <button
                onClick={() => setCinemaAutoPlay(!cinemaAutoPlay)}
                className={'p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ' + (
                  cinemaAutoPlay
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-900/40'
                    : 'bg-black/60 text-stone-300 border border-stone-700 hover:bg-stone-800'
                )}
                title={cinemaAutoPlay ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
              >
                {cinemaAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">{cinemaAutoPlay ? 'Auto-Playing' : 'Paused'}</span>
              </button>

              {/* Toggle Browser Fullscreen */}
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen?.().catch(() => {});
                  } else {
                    document.exitFullscreen?.().catch(() => {});
                  }
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-black/60 text-stone-300 border border-stone-700 hover:bg-stone-800 text-xs font-bold transition-colors"
                title="Toggle Browser Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Exit Cinema */}
              <button
                onClick={() => setIsCinemaMode(false)}
                className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1"
                title="Exit Full-Screen Cinema (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows (Left / Right) */}
          <button
            onClick={() => setCinemaIndex((prev) => (prev - 1 + unescoMonumentsList.length) % unescoMonumentsList.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl"
            title="Previous Monument (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCinemaIndex((prev) => (prev + 1) % unescoMonumentsList.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl"
            title="Next Monument (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Monument Dossier HUD (Toggled via showTextOverlay) */}
          <div className={'relative z-20 p-4 sm:p-8 bg-gradient-to-t from-stone-950 via-stone-950/95 to-transparent transition-all duration-500 ' + (
            showTextOverlay 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-8 pointer-events-none'
          )}>
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/40 text-amber-300 font-serif text-xs font-bold">
                      {currentCinemaMonument.hindiName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-800/80 text-stone-300 text-[11px] font-mono">
                      Inscribed {currentCinemaMonument.yearInscribed}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-bold">
                      {currentCinemaMonument.location}
                    </span>
                    {/* Dynasty Badge from Deep History */}
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                      {currentCinemaHistoryProfile.dynastyAndEra}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-md">
                    {currentCinemaMonument.name}
                  </h1>
                </div>

                {/* Action Buttons in Cinema Mode */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onPlayAudioGuide?.(currentCinemaMonument.name, currentCinemaMonument.audioNarration, currentCinemaMonument.location)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-900/30 flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Spoken Guide</span>
                  </button>

                  <button
                    onClick={() => setActive3DMonument(currentCinemaMonument)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>3D Sanctum</span>
                  </button>

                  {/* Deep Historical Dossier Button */}
                  <button
                    onClick={() => {
                      setDetailMonument(currentCinemaMonument);
                      setActiveDossierTab('chronicle');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 flex items-center gap-1.5 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <span>Deep History & Secrets</span>
                  </button>
                </div>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm max-w-4xl line-clamp-2 leading-relaxed drop-shadow">
                {currentCinemaMonument.coreHighlight}
              </p>

              {/* Quick Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-2 pb-1">
                {unescoMonumentsList.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setCinemaIndex(idx)}
                    className={'relative shrink-0 w-16 sm:w-20 h-11 sm:h-13 rounded-xl overflow-hidden border transition-all ' + (
                      idx === cinemaIndex
                        ? 'border-amber-400 ring-2 ring-amber-500/50 scale-105'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    )}
                    title={m.name}
                  >
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Viewer Full Modal */}
      {active3DMonument && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-stone-900 border border-amber-500/40 shadow-2xl">
            <div className="p-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <div>
                  <h3 className="text-white font-bold text-base">{active3DMonument.name} — 3D Virtual Sanctum</h3>
                  <p className="text-xs text-amber-400 font-mono">{active3DMonument.location}</p>
                </div>
              </div>
              <button
                onClick={() => setActive3DMonument(null)}
                className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors"
                title="Close 3D View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 sm:p-4">
              <Monument3DViewer
                monument={active3DMonument}
                onClose={() => setActive3DMonument(null)}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* FULL EXPANDED HISTORICAL DOSSIER MODAL (Dynasties, Timelines, Engineering Secrets, Sacred Lore) */}
      {detailMonument && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-stone-900 border border-amber-500/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    UNESCO Inscribed Civilizational Dossier
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">{detailMonument.name}</h3>
                  <p className="text-xs text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {detailMonument.location} • Inscribed {detailMonument.yearInscribed}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailMonument(null)}
                className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Navigation Tabs */}
            <div className="bg-stone-950/80 px-4 sm:px-6 pt-3 border-b border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
              <button
                onClick={() => setActiveDossierTab('chronicle')}
                className={'pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ' + (
                  activeDossierTab === 'chronicle'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📜 Imperial Chronicle & Dynasty</span>
              </button>

              <button
                onClick={() => setActiveDossierTab('timeline')}
                className={'pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ' + (
                  activeDossierTab === 'timeline'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⏳ Chronology Timeline</span>
              </button>

              <button
                onClick={() => setActiveDossierTab('engineering')}
                className={'pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ' + (
                  activeDossierTab === 'engineering'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                )}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>🏛️ Engineering & Architecture</span>
              </button>

              <button
                onClick={() => setActiveDossierTab('lore')}
                className={'pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ' + (
                  activeDossierTab === 'lore'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                )}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>🪔 Sacred Lore & World Accounts</span>
              </button>
            </div>

            {/* Modal Body Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-hide flex-1">
              {/* TAB 1: IMPERIAL CHRONICLE & DYNASTIC HISTORY */}
              {activeDossierTab === 'chronicle' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Photo Banner with Historical Quick Stats */}
                  <div className="aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden relative shadow-lg">
                    <img
                      src={detailMonument.image}
                      alt={detailMonument.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />
                    <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-amber-300 font-serif">{detailMonument.hindiName}</span>
                        <h4 className="text-white font-black text-lg sm:text-xl drop-shadow">{detailMonument.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                          {detailHistoryProfile.centuryPeriod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynastic Lineage & Ruling Monarchs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        👑 Imperial Dynasty & Era
                      </span>
                      <p className="text-sm font-semibold text-white">
                        {detailHistoryProfile.dynastyAndEra}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                      <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                        🏛️ Patron Monarchs & Rulers
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-stone-200">
                        {detailHistoryProfile.rulingMonarchs.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Core Highlight Callout */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Core UNESCO Civilizational Highlight
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                      {detailMonument.coreHighlight}
                    </p>
                  </div>

                  {/* Deep Comprehensive Narrative History */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      In-Depth Historical Chronicle & Dynastic Evolution
                    </h4>
                    <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line space-y-3">
                      {detailHistoryProfile.comprehensiveHistory}
                    </div>
                  </div>

                  {/* Architectural Significance */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-teal-400" />
                      Architectural & Artistic Significance
                    </h4>
                    <p className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {detailMonument.architecturalSignificance}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: CHRONOLOGY TIMELINE */}
              {activeDossierTab === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Historical Milestones & Architectural Epochs
                    </h4>
                    <p className="text-xs text-stone-400">
                      Chronological progression through centuries of construction, imperial zenith, preservation, and modern heritage stewardship.
                    </p>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative border-l-2 border-amber-500/40 ml-4 pl-6 space-y-6">
                    {detailHistoryProfile.chronologyTimeline.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Pin Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-stone-950 border-2 border-amber-400 group-hover:scale-125 transition-transform" />
                        
                        {/* Milestone Card */}
                        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 group-hover:border-amber-500/50 transition-colors shadow-lg space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                              {item.yearOrEra}
                            </span>
                            <span className="text-white font-bold text-xs">{item.title}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                            {item.narrative}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ENGINEERING & ARCHITECTURAL SECRETS */}
              {activeDossierTab === 'engineering' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Structural Joinery, Acoustics & Ancient Physics
                    </h4>
                    <p className="text-xs text-stone-400">
                      How ancient Indian guild masters (Sthapathis and Shilpis) solved complex structural engineering without modern hydraulic equipment.
                    </p>
                  </div>

                  {/* Engineering Secrets List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Hammer className="w-4 h-4" />
                      Engineering Innovations & Masonry Secrets
                    </h5>
                    <div className="space-y-2.5">
                      {detailHistoryProfile.engineeringSecrets.map((secret, sIdx) => (
                        <div key={sIdx} className="p-4 rounded-2xl bg-stone-950 border border-teal-500/20 text-xs sm:text-sm text-stone-300 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/40">
                            {sIdx + 1}
                          </span>
                          <p className="leading-relaxed">{secret}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4 Architectural Wonders from UNESCO Documentation */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Documented Architectural Marvels
                    </h5>
                    <div className="space-y-2.5">
                      {detailMonument.architecturalWonders.map((wonder, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5 border border-amber-500/30">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{wonder}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SACRED LORE & TRAVELER ACCOUNTS */}
              {activeDossierTab === 'lore' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Sacred Lore & Consecration Legends */}
                  <div className="p-5 rounded-2xl bg-stone-950 border border-purple-500/30 space-y-2">
                    <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Sacred Lore, Cosmic Alignments & Temple Legends
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {detailHistoryProfile.sacredLoreAndLegends}
                    </p>
                  </div>

                  {/* Eyewitness Traveler Chronicles */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Quote className="w-4 h-4" />
                      World Traveler Eyewitness Accounts
                    </h5>
                    {detailHistoryProfile.travelerAccounts && detailHistoryProfile.travelerAccounts.length > 0 ? (
                      <div className="space-y-3">
                        {detailHistoryProfile.travelerAccounts.map((t, tIdx) => (
                          <div key={tIdx} className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-400">{t.traveler} ({t.origin})</span>
                              <span className="font-mono text-stone-400">{t.period}</span>
                            </div>
                            <blockquote className="text-xs sm:text-sm text-stone-200 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                              "{t.quote}"
                            </blockquote>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic bg-stone-950 p-4 rounded-2xl border border-stone-800">
                        Historical travelogue records documented in royal edicts and temple epigraphs.
                      </p>
                    )}
                  </div>

                  {/* Archaeological Survey of India (ASI) Rediscovery Lore */}
                  <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <h5 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-teal-400" />
                      Archaeological Excavation & Preservation History
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {detailHistoryProfile.archaeologicalExcavationLore}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => {
                  const m = detailMonument;
                  setDetailMonument(null);
                  setActive3DMonument(m);
                }}
                className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span className="truncate">3D Sanctum</span>
              </button>

              <button
                onClick={() => {
                  setDetailMonument(null);
                  navigate('/asi');
                }}
                className="py-3 px-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span className="truncate">ASI E-Ticket</span>
              </button>

              <button
                onClick={() => {
                  onPlayAudioGuide?.(detailMonument.name, detailMonument.audioNarration, detailMonument.location);
                }}
                className="py-3 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="truncate">Voice Story</span>
              </button>

              <a
                href={'https://www.google.com/maps/dir/?api=1&destination=' + detailMonument.coordinates.lat + ',' + detailMonument.coordinates.lng}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-2xl bg-stone-800 hover:bg-teal-500 hover:text-stone-950 text-stone-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span className="truncate">GPS Route</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-amber-900/30 bg-radial from-amber-950/20 via-transparent to-transparent py-16 px-4 sm:px-6 backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Living Monument Panorama • Official UNESCO Treasury of Bharat</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Monuments of <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">Bharat</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Explore 32 comprehensively documented UNESCO World Heritage sites of India — from the monolithic rock-cut Kailasa Temple and Konark astronomical sundials to royal Maratha hill forts and ancient university campuses.
          </p>

          {/* Full Screen Cinema Mode & Soundtrack CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => {
                setIsCinemaMode(true);
                setCinemaIndex(0);
              }}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-2xl shadow-amber-900/50 hover:scale-105 transition-all cursor-pointer border border-amber-400/40"
            >
              <Film className="w-5 h-5 text-stone-950" />
              <span>Enter Full-Screen Monument Cinema (पूर्ण स्क्रीन दृश्य)</span>
            </button>

            {/* Ambient Soundscape quick button on home page */}
            <button
              onClick={toggleAmbientSound}
              className={'inline-flex items-center gap-2 px-6 py-4 rounded-2xl backdrop-blur-md transition-all font-bold text-sm border cursor-pointer ' + (
                isAmbientSoundActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-400/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-stone-700'
              )}
            >
              {isAmbientSoundActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Ambient Soundtrack ON 🪔</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span>Play Ambient Soundscape</span>
                </>
              )}
            </button>

            <a
              href="#monuments-grid"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-bold text-sm border border-stone-700 backdrop-blur-md transition-all"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Browse All 32 Monuments</span>
            </a>
          </div>

          {/* Civilizational Counter Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">32 Sites</div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Documented UNESCO Jewels</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">Dynasties & Eras</div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Full Historical Lineage</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Interactive 3D</div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">WebGL Virtual Sanctums</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">Soundtrack & Audio</div>
              <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Ambient Music & Voice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <section id="monuments-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by monument name, dynasty (e.g. Chola, Mughal, Vijayanagara, Chandela, Maratha, Pallava, Maurya)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 focus:border-amber-500 focus:outline-none text-sm text-stone-100 placeholder-stone-500 shadow-xl transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className={'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ' + (
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-900/30'
                    : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                )}
              >
                <span>{cat.label}</span>
                <span className={'px-1.5 py-0.5 rounded-full text-[10px] ' + (selectedCategory === cat.id ? 'bg-stone-950/20 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300')}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
            <span className="text-stone-400 font-semibold px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Region:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region.toLowerCase())}
                className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ' + (
                  selectedRegion === region.toLowerCase()
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/40'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-400">
          <span>Showing <strong className="text-amber-400">{filteredMonuments.length}</strong> heritage treasures</span>
          <span>Click "Open Complete Historical Dossier" for dynasty & engineering secrets, or "3D View"</span>
        </div>

        {/* Monuments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonuments.map((monument) => {
            const profile = getMonumentHistoryProfile(monument.id);
            return (
              <div
                key={monument.id}
                className="group rounded-3xl overflow-hidden bg-stone-900/80 backdrop-blur-md border border-stone-800/90 hover:border-amber-500/60 transition-all shadow-2xl flex flex-col justify-between hover:shadow-amber-500/10 hover:-translate-y-1 duration-300"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-stone-950">
                    <img
                      src={monument.image}
                      alt={monument.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        Inscribed {monument.yearInscribed}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {monument.category}
                      </span>
                    </div>

                    {/* Hindi Name & Dynasty in Corner */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-amber-400 font-serif text-xs font-semibold drop-shadow-md">
                          {monument.hindiName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-amber-500/30 text-stone-300 text-[10px] font-medium">
                          {profile.dynastyAndEra}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md group-hover:text-amber-300 transition-colors">
                        {monument.name}
                      </h3>
                    </div>
                  </div>

                  {/* Monument Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {monument.location}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono shrink-0 ml-2">
                        {monument.region} India
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {monument.coreHighlight}
                    </p>

                    <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-1 text-xs">
                      <p className="text-[11px] text-stone-300 line-clamp-2">
                        <strong className="text-amber-400">Rulers:</strong> {profile.rulingMonarchs.join(', ')} ({profile.centuryPeriod})
                      </p>
                    </div>

                    {/* Read Complete Historical Record Button */}
                    <button
                      onClick={() => {
                        setDetailMonument(monument);
                        setActiveDossierTab('chronicle');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] text-amber-300 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Open Complete Historical Dossier</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                  {/* 3D View Button */}
                  <button
                    onClick={() => setActive3DMonument(monument)}
                    className="py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md hover:scale-105 cursor-pointer"
                    title="Open 3D Virtual Sanctum"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>3D View</span>
                  </button>

                  {/* Audio Guide Button */}
                  <button
                    onClick={() => onPlayAudioGuide?.(monument.name, monument.audioNarration, monument.location)}
                    className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-stone-700 cursor-pointer"
                    title="Listen to Spoken Audio Story"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Audio</span>
                  </button>

                  {/* GPS Directions */}
                  <a
                    href={'https://www.google.com/maps/dir/?api=1&destination=' + monument.coordinates.lat + ',' + monument.coordinates.lng}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-teal-500 hover:text-stone-950 text-stone-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-stone-700 cursor-pointer"
                    title="Open in Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </MonumentAnimatedBackground>
  );
}
