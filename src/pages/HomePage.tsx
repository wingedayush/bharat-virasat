import { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Users,
  Video,
  Camera,
  Trophy,
  Route as RouteIcon,
  GitCompare,
  ArrowRight,
  Sparkles,
  Navigation,
  MessageCircle,
  Landmark,
  Music,
  Eye,
  Volume2,
  ShieldCheck,
  Disc3,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';
import { artisans } from '@/data/artisans';
import { videoReels } from '@/data/quiz';
import { studentInnovationIdeas, musicalTraditions } from '@/data/innovations';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { Monument3DViewer } from '@/components/Monument3DViewer';
import { MonumentAnimatedBackground } from '@/components/MonumentAnimatedBackground';

interface HomePageProps {
  onPlayAudioGuide?: (title: string, script: string, location?: string) => void;
}

export function HomePage({ onPlayAudioGuide }: HomePageProps) {
  const [activeState, setActiveState] = useState(0);
  const [selected3DMonument, setSelected3DMonument] = useState<UnescoMonument>(unescoMonumentsList[1]); // Konark Sun Temple default

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveState((prev) => (prev + 1) % states.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredMonuments = unescoMonumentsList.slice(0, 4);

  const gateways = [
    { icon: Landmark, title: 'UNESCO Heritage Hub', desc: 'All 42 world heritage wonders of India', path: '/unesco', color: 'from-amber-500 to-orange-600', badge: 'Featured' },
    { icon: Camera, title: 'BharatLens AI', desc: 'Real live camera GI weave authenticator', path: '/identify', color: 'from-emerald-500 to-teal-600', badge: 'Live AI' },
    { icon: MapPin, title: '22 States & UTs', desc: 'Pan-India traditions, monuments & cuisines', path: '/explore', color: 'from-blue-500 to-indigo-600' },
    { icon: Navigation, title: 'Culture Near Me', desc: 'Live GPS distance to temples & crafts', path: '/near-me', color: 'from-teal-500 to-cyan-600' },
    { icon: Users, title: 'Master Artisans', desc: 'Direct WhatsApp connection & custom works', path: '/artisans', color: 'from-rose-500 to-red-600' },
    { icon: MessageCircle, title: 'Ask Bharat AI', desc: 'AI curator for history, dance & music', path: '/ask-bharat', color: 'from-violet-500 to-purple-600' },
    { icon: Video, title: 'Culture Reels', desc: 'Bite-sized vertical video heritage stories', path: '/reels', color: 'from-pink-500 to-rose-600' },
    { icon: Trophy, title: 'Heritage Quest', desc: 'Gamified cultural trivia & badge ranks', path: '/quiz', color: 'from-yellow-500 to-amber-600' },
    { icon: RouteIcon, title: 'Heritage Passport', desc: 'Track your personal exploration journey', path: '/journey', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 overflow-hidden">
      {/* Grand Hero Section with Majestic Transition */}
      <section className="relative h-[95vh] overflow-hidden">
        {states.map((state, idx) => (
          <div
            key={state.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeState ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={state.image} alt={state.name} className="w-full h-full object-cover scale-105 transition-transform duration-[6000ms]" />
          </div>
        ))}
        {/* Royal Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
        <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/90" />

        {/* Floating Diya / Sacred Sparks Accent */}
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-amber-400 animate-float-diya blur-[1px]" />
        <div className="absolute top-1/3 right-16 w-3 h-3 rounded-full bg-orange-400 animate-float-diya delay-1000 blur-[1px]" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-yellow-300 animate-float-diya delay-2000 blur-[1px]" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pt-16">
          {/* Royal Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 border border-amber-500/40 backdrop-blur-md mb-6 shadow-xl animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-amber-300 text-xs sm:text-sm font-semibold tracking-wide uppercase font-serif">
              The Digital Sanctuary of Indian Civilization
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white mb-4 tracking-tight leading-none">
            Bharat<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">Virasat</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-200 mb-10 max-w-3xl leading-relaxed drop-shadow-lg font-normal">
            Step into five millennia of timeless civilizational glory. Experience interactive 3D virtual sanctums, real-time camera AI authenticity verification, all 42 UNESCO World Heritage wonders, and the living soul of Indian folk music and master crafts.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/unesco')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-600 text-stone-950 font-black shadow-xl shadow-amber-900/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Landmark className="w-5 h-5" /> Explore All UNESCO Sites
            </button>
            <button
              onClick={() => navigate('/identify')}
              className="px-8 py-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 font-bold hover:bg-stone-800 transition-all flex items-center gap-2 shadow-xl hover:scale-105"
            >
              <Camera className="w-5 h-5" /> Launch Live Camera Lens
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-800 text-stone-300 font-semibold hover:text-white hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              <Compass className="w-5 h-5" /> 22 States & UTs
            </button>
          </div>
        </div>

        {/* State Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {states.slice(0, 8).map((state, idx) => (
            <button
              key={idx}
              onClick={() => setActiveState(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === activeState ? 'w-10 bg-amber-400 shadow-md' : 'w-2 bg-stone-700 hover:bg-stone-500'}`}
              title={state.name}
            />
          ))}
        </div>
      </section>

      {/* Cultural Heritage Stats Banner */}
      <section className="bg-stone-900/90 border-y border-amber-900/40 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">42 Sites</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">UNESCO World Heritage Inscriptions</p>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 font-mono">22+ States</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Documented Civilizational Zones</p>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">500+ Crafts</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">GI-Tagged Indigenous Masterpieces</p>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">5,000 Years</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Unbroken Living Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Virtual Heritage Sanctum Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
              <Eye className="w-4 h-4" />
              <span>Interactive 3D Virtual Sanctum</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
              Examine Ancient Architectural Engineering in 3D
            </h2>
            <p className="text-stone-400 text-base max-w-2xl">
              Rotate, inspect stone geometries, switch dynamic lighting from Golden Hour Aarti to Diya Lantern night, and discover the hidden engineering secrets of India's iconic monuments.
            </p>
          </div>

          {/* Monument Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {unescoMonumentsList.slice(0, 5).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected3DMonument(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selected3DMonument.id === m.id
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-900/30 scale-105'
                    : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {m.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Viewer Container */}
        <div className="rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl bg-stone-900">
          <Monument3DViewer monument={selected3DMonument} />
        </div>
      </section>

      {/* Dedicated UNESCO World Heritage Spotlight */}
      <MonumentAnimatedBackground isFixed={false} className="py-20 border-y border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                <Landmark className="w-4 h-4 text-teal-400" />
                <span>UNESCO World Heritage Monuments</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
                Treasures of Sovereign Architectural Genius
              </h2>
              <p className="text-stone-300 text-base max-w-2xl">
                From the astronomical chariot wheels of Konark to the monolithic rock-cut wonder of Kailasa and imperial Chola granite towers.
              </p>
            </div>

            <button
              onClick={() => navigate('/unesco')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-stone-950 font-black text-xs transition-all shadow-lg hover:scale-105"
            >
              <span>Explore All 32 Documented Sites</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMonuments.map((monument) => (
              <div
                key={monument.id}
                className="group rounded-3xl overflow-hidden bg-stone-900/80 backdrop-blur-md border border-stone-800/80 hover:border-amber-500/60 transition-all shadow-2xl flex flex-col justify-between hover:-translate-y-1 duration-300"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden relative bg-stone-950">
                    <img
                      src={monument.image}
                      alt={monument.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      Inscribed {monument.yearInscribed}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-semibold text-amber-400 block">{monument.stateName}</span>
                      <h3 className="text-white font-bold text-base group-hover:text-amber-300 transition-colors">
                        {monument.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed mb-3">
                      {monument.coreHighlight}
                    </p>
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400">
                      <span className="text-amber-400 font-semibold block mb-0.5">Wonder:</span>
                      {monument.architecturalWonders[0]}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPlayAudioGuide?.(monument.name, monument.audioNarration, monument.location)}
                    className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-stone-700"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Audio Guide</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${monument.coordinates.lat},${monument.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-teal-500 hover:text-stone-950 text-stone-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-stone-700"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS Map</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MonumentAnimatedBackground>

      {/* Flagship Digital Heritage Technologies (No Problem Statement buzzwords!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Digital Heritage Innovations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
              Next-Generation Technologies Protecting Indian Heritage
            </h2>
            <p className="text-stone-400 text-base max-w-2xl">
              Harnessing Computer Vision, Spatial Audio, Decentralized Provenance, and Vernacular Voice AI to preserve ancient wisdom and empower rural traditional master artisans.
            </p>
          </div>

          <button
            onClick={() => navigate('/ask-bharat')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            <span>Ask AI About Heritage Tech</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentInnovationIdeas.slice(0, 3).map((idea) => (
            <div
              key={idea.id}
              className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                    {idea.domain}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                </div>

                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-300 transition-colors">
                  {idea.title}
                </h3>
                <p className="text-amber-400 text-xs font-medium mb-3 italic">
                  "{idea.tagline}"
                </p>

                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {idea.solutionOverview}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <span className="text-[11px] font-bold text-emerald-400 block mb-3">
                  🎯 Demonstrated Impact: {idea.impactMetric}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {idea.technologiesUsed.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[10px] text-stone-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Living Folk Music & Dance Heritage */}
      <section className="bg-stone-900/40 border-y border-stone-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Music className="w-4 h-4" />
              <span>Living Ragas & Folk Rhythms</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
              The Living Soundscape of Bharat
            </h2>
            <p className="text-stone-400 text-base max-w-2xl mx-auto">
              From the bowed coconut Kamaicha of the Thar Desert to the temple Shehnai of Kashi and mystic Baul melodies of Bengal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {musicalTraditions.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-stone-900 border border-stone-800 hover:border-rose-500/50 transition-all shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                  <Music className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {item.stateName} Tradition
                </span>
                <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">{item.description}</p>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400">
                  <strong className="text-white block mb-1">Key Instruments:</strong>
                  {item.instrumentsUsed.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 Gateways Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            The 9 Gateways of BharatVirasat
          </h2>
          <p className="text-stone-400 text-base max-w-xl mx-auto">
            Comprehensive digital tools engineered to celebrate, experience, and safeguard Indian civilization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gateways.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => navigate(feature.path)}
                className="group relative overflow-hidden rounded-3xl bg-stone-900/90 border border-stone-800 p-6 text-left hover:border-amber-500/50 transition-all hover:scale-[1.02] shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-amber-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">{feature.desc}</p>
                <ArrowRight className="w-5 h-5 text-stone-600 absolute bottom-6 right-6 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
