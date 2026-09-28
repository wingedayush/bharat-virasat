import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Compass,
  Landmark,
  Eye,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';

interface CinematicMonument {
  id: string;
  name: string;
  hindiName: string;
  subtitle: string;
  location: string;
  era: string;
  architecture: string;
  videoUrl?: string;
  cinematicImage: string;
  audioNarration: string;
  hotspots: { title: string; desc: string; x: number; y: number }[];
}

const cinematicMonuments: CinematicMonument[] = [
  {
    id: 'taj-mahal',
    name: 'The Taj Mahal',
    hindiName: 'ताज महल — अमर प्रेम का संगमरमरी काव्य',
    subtitle: 'Mughal Architectural Apex & Makrana Marble Wonder',
    location: 'Agra, Uttar Pradesh',
    era: '1631–1648 CE • Emperor Shah Jahan',
    architecture: 'Mughal Classical with Persian Charbagh & Italianate Pietra Dura',
    cinematicImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=85',
    audioNarration:
      'Welcome to the Taj Mahal in Agra. Commissioned in 1631 by Emperor Shah Jahan, this UNESCO wonder is constructed from crystalline Makrana marble. Notice how its central bulbous dome rises 35 meters above the plinth, flanked by four outward-tilted minarets engineered to fall away from the mausoleum in case of an earthquake.',
    hotspots: [
      { title: 'Double Bulbous Dome', desc: '35m Makrana marble onion dome with acoustic chamber', x: 50, y: 25 },
      { title: 'Pietra Dura Inlays', desc: '28 varieties of semi-precious gems set in floral arabesques', x: 50, y: 56 },
      { title: 'Outward Tilted Minarets', desc: '42m seismic safety engineering tilted outward at 2 degrees', x: 20, y: 48 },
    ],
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर — कालचक्र का प्रस्तर रूप',
    subtitle: 'Astronomical Solar Chariot & 24 Sundial Wheels',
    location: 'Puri District, Odisha',
    era: '1250 CE • Eastern Ganga King Narasimhadeva I',
    architecture: 'Kalinga Architecture with 24 Astronomical Wheels & 7 Horses',
    cinematicImage: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1920&q=85',
    audioNarration:
      'Behold the magnificent Sun Temple of Konark in Odisha, sculpted as the cosmic chariot of the Sun God Surya. Twenty-four colossal stone wheels, each carved with intricate spokes and medallions, act as highly precise solar chronometers calculating the exact time down to minutes using solar shadow casting.',
    hotspots: [
      { title: 'Surya Chakra Sundial', desc: '9.9 foot diameter wheels calculating precise solar time', x: 42, y: 52 },
      { title: 'Seven Solar Horses', desc: 'Symbolizing the 7 days of the week and rainbow spectrum', x: 74, y: 64 },
      { title: 'Pidha Deula Sanctum', desc: 'Stepped pyramidal assembly hall rising above the Jagati plinth', x: 52, y: 28 },
    ],
  },
  {
    id: 'ellora-caves',
    name: 'Kailasa Monolithic Temple',
    hindiName: 'कैलाश मंदिर, एलोरा — शैलकृत वास्तु का शिखर',
    subtitle: '200,000 Tonnes Carved Top-Down from Basalt Mountain',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    era: 'c. 756–773 CE • Rashtrakuta King Krishna I',
    architecture: 'Rock-Cut Dravidian Monolith (Largest Monolithic Sculpture on Earth)',
    cinematicImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=85',
    audioNarration:
      'Step into the jaw-dropping Kailasa Temple at Ellora, Cave 16. Sculptors carved this entire multi-story temple complex vertically top-down from the solid volcanic basalt cliff of the Charanandri Hills, scooping out over 200,000 tonnes of rock without any modern cranes or steel tools.',
    hotspots: [
      { title: 'Top-Down Excavation Scarp', desc: '32m deep vertical canyon trench carved from mountain rock', x: 26, y: 35 },
      { title: 'Mount Meru Vimana', desc: 'Soaring monolithic Dravidian spire carved in situ from solid stone', x: 50, y: 32 },
      { title: 'Dhwaja Stambha Pillars', desc: '15m monolithic victory pillars flanking the sacred courtyard', x: 72, y: 50 },
    ],
  },
  {
    id: 'brihadisvara-temple',
    name: 'The Great Brihadisvara Temple',
    hindiName: 'बृहदीश्वर मंदिर — महान चोल वास्तुकला',
    subtitle: '80-Tonne Monolithic Kumbam & 1000-Year Living Heritage',
    location: 'Thanjavur, Tamil Nadu',
    era: '1010 CE • Chola Emperor Rajaraja I',
    architecture: 'Dravidian Granite Masterpiece with 13-Tiered Vimana',
    cinematicImage: 'https://images.unsplash.com/photo-1686310894901-d326b8722c13?w=1920&q=85',
    audioNarration:
      'You are gazing upon the Brihadisvara Temple in Thanjavur, completed in 1010 CE by Emperor Rajaraja Chola I. Built entirely with interlocking dry-masonry granite blocks, its soaring 66-meter Vimana tower is crowned by an 80-tonne monolithic granite cupola hauled up an earthen ramp by elephants.',
    hotspots: [
      { title: '80-Tonne Monolithic Kumbam', desc: 'Single granite boulder apex cupola atop the 66m tower', x: 50, y: 15 },
      { title: '13-Tiered Vimana', desc: 'Interlocking granite dry-stone masonry built without cement', x: 50, y: 40 },
      { title: 'Colossal Nandi Pavilion', desc: 'Single block monolithic sacred bull facing the sanctum', x: 76, y: 72 },
    ],
  },
  {
    id: 'hampi',
    name: 'Vittala Temple Stone Chariot',
    hindiName: 'हम्पी प्रस्तर रथ — विजयनगर का गौरव',
    subtitle: 'Musical Granite Pillars & Imperial Vijayanagara Capital',
    location: 'Hampi, Karnataka',
    era: '15th–16th Century • Vijayanagara Empire',
    architecture: 'Vijayanagara Imperial Dravidian with Acoustic Pillars',
    cinematicImage: 'https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?w=1920&q=85',
    audioNarration:
      'Welcome to Hampi, capital of the Vijayanagara Empire. Standing before the iconic Vittala Temple Stone Chariot dedicated to Garuda, marvel at the 56 monolithic musical pillars nearby that emit distinct musical notes of classical Indian scales when gently tapped.',
    hotspots: [
      { title: 'Garuda Stone Chariot', desc: 'Carved granite shrine with revolving stone wheel axles', x: 50, y: 55 },
      { title: '56 Musical Pillars', desc: 'Acoustic granite colonnade tuned to classical Sa-Re-Ga-Ma notes', x: 25, y: 45 },
      { title: 'Tungabhadra Granite Hills', desc: 'Surreal boulder landscape sheltering 1,600 surviving monuments', x: 80, y: 30 },
    ],
  },
];

interface CinematicHeritageShowcaseProps {
  onPlayAudioGuide?: (title: string, script: string, location?: string) => void;
}

export function CinematicHeritageShowcase({ onPlayAudioGuide }: CinematicHeritageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'noon' | 'sunset' | 'night'>('sunset');
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; desc: string } | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMonument = cinematicMonuments[currentIndex];

  // Auto-advance cinematic camera transitions every 9 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cinematicMonuments.length);
      setActiveHotspot(null);
    }, 9000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Ambient floating particles & celestial golden light streaks on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Floating sacred golden diya embers
    const embers: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
    }[] = [];

    for (let i = 0; i < 45; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.0,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Rotating subtle sacred Surya Chakra mandala in background
      ctx.save();
      ctx.translate(width * 0.5, height * 0.45);
      ctx.rotate(t * 0.03);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
      ctx.lineWidth = 1.5;

      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, r * 90, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let sp = 0; sp < 24; sp++) {
        const ang = (sp * Math.PI * 2) / 24;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 270, Math.sin(ang) * 270);
        ctx.stroke();
      }
      ctx.restore();

      // Render floating golden embers
      embers.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(t + p.pulse) * 0.35;
        p.pulse += 0.025;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const alpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = p.size * 6;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePlayAudio = () => {
    if (onPlayAudioGuide) {
      onPlayAudioGuide(activeMonument.name, activeMonument.audioNarration, activeMonument.location);
      setIsAudioActive(true);
    }
  };

  // Color grading filter based on selected time of day
  const getTimeFilter = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'sepia(30%) saturate(125%) hue-rotate(330deg) brightness(1.05)';
      case 'noon':
        return 'contrast(108%) saturate(110%) brightness(1.1)';
      case 'sunset':
        return 'sepia(45%) saturate(150%) hue-rotate(345deg) contrast(112%) brightness(1.02)';
      case 'night':
        return 'contrast(125%) brightness(0.65) saturate(135%) hue-rotate(200deg)';
    }
  };

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 bg-stone-950 border-b border-amber-900/40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Cinematic Heritage Theatre</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Cinematic Journey Through <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">Bharat</span>
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Experience India's timeless architectural marvels with dynamic solar time lighting, interactive archaeological hotspots, and spoken chronicles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/3d-view')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-stone-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
            >
              <Layers className="w-4 h-4" />
              <span>Enter 3D Sanctum</span>
            </button>
            <button
              onClick={() => navigate('/unesco')}
              className="px-4 py-2.5 rounded-2xl bg-stone-900 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Landmark className="w-4 h-4" />
              <span>All 32 Wonders</span>
            </button>
          </div>
        </div>

        {/* Cinematic Theatre Screen */}
        <div className="relative w-full h-[480px] sm:h-[580px] md:h-[640px] rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black group">
          {/* Dynamic Background Image with Smooth Ken-Burns Zoom Animation */}
          {cinematicMonuments.map((monument, idx) => (
            <div
              key={monument.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={monument.cinematicImage}
                alt={monument.name}
                style={{ filter: getTimeFilter() }}
                className="w-full h-full object-cover animate-kenburns scale-105 transition-transform duration-10000"
              />
            </div>
          ))}

          {/* Canvas Sacred Golden Particles & Mandala Overlay */}
          <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

          {/* Dark Atmospheric Vignette & Gradients */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/30" />
          <div className="absolute inset-0 z-20 pointer-events-none bg-radial from-transparent via-transparent to-black/60" />

          {/* Interactive Screen Hotspot Pins */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {activeMonument.hotspots.map((hs, hIdx) => (
              <div
                key={hIdx}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  onClick={() => setActiveHotspot(hs)}
                  className="group relative flex items-center justify-center cursor-pointer"
                  title={hs.title}
                >
                  <span className="w-8 h-8 rounded-full bg-amber-500/30 animate-ping absolute" />
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white hover:scale-125 transition-transform">
                    {hIdx + 1}
                  </span>
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-stone-950/90 text-amber-300 text-[11px] font-bold whitespace-nowrap border border-amber-500/40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {hs.title}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Active Hotspot Detail Card Modal */}
          {activeHotspot && (
            <div className="absolute top-16 right-4 sm:right-6 z-40 max-w-xs p-4 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl text-stone-200 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Archaeological Detail
                </span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{activeHotspot.title}</h4>
              <p className="text-xs text-stone-300 leading-relaxed">{activeHotspot.desc}</p>
            </div>
          )}

          {/* Top Floating Controls: Monument Badge, Time of Day, Autoplay Toggle */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/40 text-xs font-bold text-amber-300 shadow-xl">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{activeMonument.location}</span>
              <span className="text-stone-400 hidden sm:inline">• {activeMonument.era}</span>
            </div>

            {/* Time of Day Lighting Toggle */}
            <div className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-md p-1 rounded-2xl border border-stone-800 shadow-xl">
              {(
                [
                  { id: 'dawn', label: 'Dawn', icon: Sun },
                  { id: 'noon', label: 'Noon', icon: Sun },
                  { id: 'sunset', label: 'Golden Hour', icon: Sun },
                  { id: 'night', label: 'Night Aarti', icon: Moon },
                ] as const
              ).map((time) => {
                const Icon = time.icon;
                return (
                  <button
                    key={time.id}
                    onClick={() => setTimeOfDay(time.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      timeOfDay === time.id
                        ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden md:inline">{time.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Floating Info & Controls */}
          <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-amber-400 text-xs sm:text-sm font-serif font-bold block mb-0.5 drop-shadow">
                {activeMonument.hindiName}
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-1">
                {activeMonument.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium drop-shadow max-w-lg mb-3">
                {activeMonument.subtitle}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio Chronicle</span>
                </button>

                <button
                  onClick={() => navigate('/3d-view')}
                  className="px-4 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D Geometry</span>
                </button>
              </div>
            </div>

            {/* Carousel Navigation and Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev - 1 + cinematicMonuments.length) % cinematicMonuments.length);
                  setActiveHotspot(null);
                }}
                className="w-10 h-10 rounded-2xl bg-stone-900/90 border border-stone-700 hover:border-amber-400 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xl"
                title="Previous Monument"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center hover:bg-amber-400 transition-transform hover:scale-105 cursor-pointer shadow-xl"
                title={isPlaying ? 'Pause Cinematic Auto-Tour' : 'Play Cinematic Auto-Tour'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev + 1) % cinematicMonuments.length);
                  setActiveHotspot(null);
                }}
                className="w-10 h-10 rounded-2xl bg-stone-900/90 border border-stone-700 hover:border-amber-400 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xl"
                title="Next Monument"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicators along Bottom */}
          <div className="absolute bottom-2 left-6 right-6 z-30 flex items-center gap-1.5">
            {cinematicMonuments.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setActiveHotspot(null);
                }}
                className={`h-1 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-12 bg-amber-400 shadow-md shadow-amber-400/80' : 'w-4 bg-white/30 hover:bg-white/60'
                }`}
                title={cinematicMonuments[idx].name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
