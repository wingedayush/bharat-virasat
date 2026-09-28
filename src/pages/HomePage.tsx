import { useState, useEffect, useRef } from 'react';
import {
  Compass,
  MapPin,
  Users,
  Video,
  Camera,
  Trophy,
  Route as RouteIcon,
  ArrowRight,
  Sparkles,
  Navigation,
  MessageCircle,
  Landmark,
  Music,
  Eye,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap,
  Shield,
  Layers,
  Ticket,
  ExternalLink
} from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { studentInnovationIdeas, musicalTraditions } from '@/data/innovations';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { Monument3DViewer } from '@/components/Monument3DViewer';
import { MonumentAnimatedBackground } from '@/components/MonumentAnimatedBackground';
import { CinematicHeritageShowcase } from '@/components/CinematicHeritageShowcase';

interface HomePageProps {
  onPlayAudioGuide?: (title: string, script: string, location?: string) => void;
}

// Hero Video Slides (Exact high-definition video assets matching bharatiyavirasat.vercel.app)
const heroSlides = [
  {
    id: 1,
    title: 'Living Heritage of Bharat',
    subtitle: 'Five millennia of timeless sacred architecture, world heritage wonders, and unbroken civilizational wisdom.',
    video: 'https://bharatiyavirasat.vercel.app/assets/newheritagevideo-BnmsLuYQ.mov',
    fallbackImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85',
    tag: 'National Heritage Showcase'
  },
  {
    id: 2,
    title: 'Monolithic Temple Sanctums',
    subtitle: 'From Kailasa basalt mountains to the astronomical solar dials of Konark and Dravidian granite towers.',
    video: 'https://bharatiyavirasat.vercel.app/assets/mainpageslider2-D4AfLJcD.mp4',
    fallbackImg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1920&q=85',
    tag: '32 UNESCO Inscriptions'
  },
  {
    id: 3,
    title: 'Royal Citadels & Hill Forts',
    subtitle: 'Majestic Rajput hilltop fortifications, subterranean stepwells, and monumental Mughal marble gateways.',
    video: 'https://bharatiyavirasat.vercel.app/assets/mainpageslide3-CeVHwcDt.mp4',
    fallbackImg: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=85',
    tag: 'Sovereign Architecture'
  },
  {
    id: 4,
    title: 'Vibrant Festivals & Folk Traditions',
    subtitle: 'Living celebrations of colors, sacred lights, devotional dances, and harvest celebrations across all states.',
    video: 'https://bharatiyavirasat.vercel.app/assets/Festivalvideo-CiXfL-KX.mp4',
    fallbackImg: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1920&q=85',
    tag: 'Living Cultural Spirit'
  }
];

export function HomePage({ onPlayAudioGuide }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selected3DMonument, setSelected3DMonument] = useState<UnescoMonument>(unescoMonumentsList[1]); // Konark Sun Temple default
  const horizontalGalleryRef = useRef<HTMLDivElement>(null);

  // Auto-advance hero video slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Scroll Listener for Sun Wheel (720 deg rotation) and Parallax
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(1, current / totalScroll) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const featuredMonuments = unescoMonumentsList.slice(0, 6);

  const scrollLeftGallery = () => {
    if (horizontalGalleryRef.current) {
      horizontalGalleryRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRightGallery = () => {
    if (horizontalGalleryRef.current) {
      horizontalGalleryRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const gateways = [
    { icon: Shield, title: 'Archaeological Survey of India', desc: '24 Circles, 3,696+ protected monuments & E-Tickets', path: '/asi', color: 'from-amber-600 to-red-600', badge: 'ASI Official' },
    { icon: Layers, title: 'Real 3D Virtual Heritage', desc: 'LiDAR point clouds, procedural PBR textures & solar dial', path: '/3d-view', color: 'from-cyan-500 to-blue-600', badge: '3D WebGL' },
    { icon: Landmark, title: '32 UNESCO Heritage Sites', desc: 'Full-Screen Cinema & Procedural Soundtrack', path: '/unesco', color: 'from-amber-500 to-orange-600', badge: 'Featured' },
    { icon: GraduationCap, title: 'Student Innovation Pass', desc: 'National hackathon showcase & profile badges', path: '/login', color: 'from-amber-500 to-yellow-600', badge: 'Auth Portal' },
    { icon: Camera, title: 'BharatLens AI Camera', desc: 'Live camera GI weave & monument authenticator', path: '/identify', color: 'from-emerald-500 to-teal-600', badge: 'Live AI' },
    { icon: MapPin, title: '22 States & UTs', desc: 'Pan-India traditions, monuments & cuisines', path: '/explore', color: 'from-blue-500 to-indigo-600' },
    { icon: Navigation, title: 'Culture Near Me', desc: 'Live GPS distance to temples & crafts', path: '/near-me', color: 'from-teal-500 to-cyan-600' },
    { icon: Users, title: 'Master Artisans', desc: 'Direct connection & handmade traditions', path: '/artisans', color: 'from-rose-500 to-red-600' },
    { icon: MessageCircle, title: 'Ask Bharat AI', desc: 'AI tutor for history, epigraphy, dance & music', path: '/ask-bharat', color: 'from-violet-500 to-purple-600' },
    { icon: Video, title: 'Culture Reels', desc: 'Bite-sized vertical video heritage stories', path: '/reels', color: 'from-pink-500 to-rose-600' },
    { icon: Trophy, title: 'Heritage Quest', desc: 'Gamified cultural trivia & badge ranks', path: '/quiz', color: 'from-yellow-500 to-amber-600' },
    { icon: RouteIcon, title: 'Heritage Passport', desc: 'Track your personal exploration journey', path: '/journey', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-black text-stone-100 overflow-x-hidden">
      {/* 1. CINEMATIC VIDEO HERO SLIDER (Exact match to bharatiyavirasat.vercel.app/mainheritage & RS slider) */}
      <section className="relative w-full overflow-hidden bg-black min-h-[60vh] sm:min-h-[75vh] md:min-h-[92vh] flex items-center justify-center">
        {/* Video Slides with Crossfade */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={'absolute inset-0 w-full h-full transition-opacity duration-1000 ' + (
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            )}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={slide.fallbackImg}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
            {/* Dark Cinematic Vignette Overlays matching reference */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
          </div>
        ))}

        {/* Hero Slider Navigation Arrows (Exact ❮ and ❯ buttons from reference) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-amber-400 text-stone-950 font-black text-lg flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
          title="Previous Heritage Slide"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-amber-400 text-stone-950 font-black text-lg flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
          title="Next Heritage Slide"
        >
          ❯
        </button>

        {/* Floating Content Box with Grand BharatVirasat Title & Glassmorphic Hero Controls */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-24 pb-16 animate-fade-in pointer-events-auto">
          {/* Civilizational Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/75 border border-amber-500/50 backdrop-blur-md mb-5 shadow-2xl">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-amber-300 text-xs sm:text-sm font-bold tracking-wider uppercase font-serif">
              {heroSlides[currentSlide].tag} • Student Innovation Platform
            </span>
          </div>

          {/* Majestic Hero Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            Bharat<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">Virasat</span>
          </h1>

          {/* Cinematic Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-stone-200 mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Prominent Action CTAs */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/asi')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-600 text-stone-950 font-black text-xs sm:text-sm shadow-2xl shadow-amber-900/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/50 hover:shadow-amber-500/40"
            >
              <Shield className="w-4 h-4 text-stone-950" />
              <span>ASI Official Portal & Passes</span>
            </button>

            <button
              onClick={() => navigate('/3d-view')}
              className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-cyan-950/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-bold text-xs sm:text-sm hover:bg-cyan-500 hover:text-stone-950 transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Real 3D Virtual Heritage</span>
            </button>

            <button
              onClick={() => navigate('/unesco')}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-200 font-semibold text-xs sm:text-sm hover:text-white hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>32 UNESCO Wonders</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm hover:bg-amber-500 hover:text-stone-950 transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Pass</span>
            </button>

            <button
              onClick={() => navigate('/identify')}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-200 font-semibold text-xs sm:text-sm hover:text-white hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Camera className="w-4 h-4 text-teal-400" />
              <span>BharatLens AI Camera</span>
            </button>
          </div>
        </div>

        {/* Slide Indicators at Bottom */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={'h-2 rounded-full transition-all cursor-pointer ' + (
                idx === currentSlide
                  ? 'w-10 bg-amber-400 shadow-lg shadow-amber-400/60'
                  : 'w-2.5 bg-white/40 hover:bg-white/80'
              )}
              title={'Slide ' + (idx + 1)}
            />
          ))}
        </div>
      </section>



      {/* 2. STATS BANNER WITH ROTATING SUN WHEEL (.son animation from reference site) */}
      <section className="bg-stone-950 border-y border-amber-900/40 py-10 relative overflow-hidden">
        {/* Rotating Celestial Sun Wheel (.son spinning 720 degrees as user scrolls) */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-2 border-dashed border-amber-500/20 pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: 'rotate(' + (scrollProgress * 720) + 'deg)' }}
        >
          <div className="absolute inset-4 rounded-full border border-amber-400/15" />
          <div className="absolute inset-12 rounded-full border border-orange-400/20" />
          <div className="absolute inset-0 flex items-center justify-center text-amber-500/15 text-9xl select-none font-serif">
            ☸
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono">32 Sites</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Verified UNESCO Monuments</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-3xl sm:text-5xl font-black text-rose-400 font-mono">22+ States</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Documented Civilizational Zones</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono">500+ Crafts</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">GI-Tagged Indigenous Masterpieces</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="text-3xl sm:text-5xl font-black text-cyan-400 font-mono">5,000 Years</div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Unbroken Living Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC HERITAGE DRONE TOUR & TIME-OF-DAY ATMOSPHERIC SHOWCASE */}
      <CinematicHeritageShowcase onPlayAudioGuide={onPlayAudioGuide} />

      {/* 3. HORIZONTAL GLIDE HERITAGE GALLERY (Inspired by #sonofpage2 & .mynewbox in QS) */}
      <section className="py-20 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="sonleft">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Landmark className="w-4 h-4" />
                <span>Architectural Wonders Panorama</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Glide Through India's Greatest Monuments
              </h2>
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeftGallery}
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRightGallery}
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/unesco')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 ml-2 cursor-pointer"
              >
                <span>View All 32</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={horizontalGalleryRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pt-2 snap-x snap-mandatory"
          >
            {featuredMonuments.map((m, idx) => (
              <div
                key={m.id}
                className="snap-start shrink-0 w-[280px] sm:w-[340px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800/80 hover:border-amber-500/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="aspect-[16/11] overflow-hidden relative bg-stone-950">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      Inscribed {m.yearInscribed}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] font-mono text-stone-300">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-serif text-amber-400 font-bold block drop-shadow">
                      {m.hindiName}
                    </span>
                    <h3 className="text-white font-black text-lg drop-shadow group-hover:text-amber-300 transition-colors">
                      {m.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="text-amber-400 font-semibold">{m.location}</span>
                    <span className="font-mono">{m.region} India</span>
                  </div>

                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                    {m.coreHighlight}
                  </p>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelected3DMonument(m)}
                      className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-amber-500/40 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View 3D</span>
                    </button>

                    <button
                      onClick={() => onPlayAudioGuide?.(m.name, m.audioNarration, m.location)}
                      className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-stone-700 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Audio</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VIBRANT FESTIVALS OF BHARAT (Exact Section matching GS in reference site) */}
      <section className="py-24 bg-black text-white relative overflow-hidden border-b border-stone-800/80">
        {/* Rotating Sun Wheel backdrop */}
        <div 
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-amber-500/10 pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: 'rotate(-' + (scrollProgress * 720) + 'deg)' }}
        >
          <div className="absolute inset-8 rounded-full border border-rose-500/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Living Cultural Celebrations
            </span>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white">
              Festivals of <span className="bg-gradient-to-r from-red-500 via-amber-400 to-blue-500 bg-clip-text text-transparent">Bharat</span>
            </h2>
            <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              India's festivals are not merely calendar events; they are cosmic alignments, spiritual renewal, and expressions of unity that have animated our civilization across millennia.
            </p>
          </div>

          {/* Festival 1: HOLI (Matching #holi-section in reference site) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20 p-6 sm:p-10 rounded-3xl bg-stone-950/80 border border-red-500/30 backdrop-blur-md shadow-2xl">
            <div className="h-[260px] sm:h-[340px] w-full overflow-hidden rounded-3xl relative shadow-2xl border border-red-500/40">
              <img
                src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1080&q=80"
                alt="Holi Festival of Colors"
                className="object-cover h-full w-full hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-red-500 text-white font-bold text-xs">
                  Spring Equinox Renewal
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent">
                🌈 Holi — The Festival of Colors
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                Holi is the joyous festival of colors celebrated at the onset of spring across India. Marking the triumph of devotion and righteous good over evil—epitomized by the legendary story of Bhakta Prahlad—it begins with the Holika Dahan bonfire, purifying the environment of negativity. The next day, communities erupt into an explosion of herbal gulal, water, devotional music, and dance, dissolving all social divides in vibrant harmony.
              </p>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Key Rituals: Holika Dahan bonfire, herbal gulal powder, Thandai, Gujiya, and Mathura Lathmar celebrations.</span>
              </div>
            </div>
          </div>

          {/* Festival 2: DIWALI (Matching #diwali-section in reference site) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-20 p-6 sm:p-10 rounded-3xl bg-stone-950/80 border border-amber-500/30 backdrop-blur-md shadow-2xl">
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                🪔 Deepavali — The Festival of Sacred Lights
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                Deepavali, or the Festival of Lights, commemorates the return of Lord Rama to Ayodhya after 14 years of exile and the defeat of Ravana, as well as the victory of Sri Krishna over Narakasura. Across millions of homes, clay diya lamps are illuminated in continuous rows, illuminating darkness and signifying inner spiritual enlightenment, knowledge, and prosperity with Lakshmi-Ganesh Puja.
              </p>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Key Rituals: Earthen oil diyas, intricate rice-powder rangoli, Govardhan Puja, and familial gatherings.</span>
              </div>
            </div>

            <div className="h-[260px] sm:h-[340px] w-full overflow-hidden rounded-3xl relative shadow-2xl border border-amber-500/40 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1512418490979-92798cec1380?w=1080&q=80"
                alt="Diwali Festival of Lights"
                className="object-cover h-full w-full hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs">
                  Triumph of Light & Dharma
                </span>
              </div>
            </div>
          </div>

          {/* Festival 3: LOHRI & MAKAR SANKRANTI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-10 rounded-3xl bg-stone-950/80 border border-orange-500/30 backdrop-blur-md shadow-2xl">
            <div className="h-[260px] sm:h-[340px] w-full overflow-hidden rounded-3xl relative shadow-2xl border border-orange-500/40">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&q=80"
                alt="Lohri and Makar Sankranti"
                className="object-cover h-full w-full hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-stone-950 font-bold text-xs">
                  Solar Solstice & Harvest
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                🔥 Lohri & Makar Sankranti — The Sun Harvest
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                Celebrated across northern and western India, Lohri and Makar Sankranti mark the northward journey of Surya Dev (Uttarayana) and the winter harvest of sugarcane and mustard crops. Communities gather around towering sacred bonfires, tossing sesame seeds (til), jaggery (gur), and rewri into the flames while singing ancient Punjabi and Vedic folk ballads celebrating agrarian bounty.
              </p>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 flex items-center gap-2">
                <SunIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Key Traditions: Sacred bonfire parikrama, Dhol drumming, flying sky kites, and sesame jaggery sweets.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3D VIRTUAL SANCTUM ARCHAEOLOGICAL VIEWER */}
      <section id="sanctum-3d" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
              <Eye className="w-4 h-4" />
              <span>Interactive 3D Virtual Sanctum</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">
              Examine Ancient Architectural Engineering in Real 3D
            </h2>
            <p className="text-stone-400 text-base max-w-2xl">
              Rotate in 360° with smooth OrbitControls, examine LiDAR laser point clouds, inspect procedural PBR Makrana marble and red sandstone textures, and track the solar sundial shadows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/3d-view')}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 text-stone-950 font-black text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Dedicated 3D Arena</span>
            </button>
            <button
              onClick={() => navigate('/asi')}
              className="px-4 py-2.5 rounded-2xl bg-stone-900 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Book ASI Ticket</span>
            </button>
          </div>
        </div>

        {/* 3D Viewer Container */}
        <div className="rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl bg-stone-900">
          <Monument3DViewer
            monument={selected3DMonument}
            onSelectMonument={(m) => setSelected3DMonument(m)}
            onPlayAudioGuide={onPlayAudioGuide}
          />
        </div>
      </section>

      {/* 5B. ARCHAEOLOGICAL SURVEY OF INDIA (ASI) SPOTLIGHT BANNER */}
      <section className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-y border-amber-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-stone-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Ministry of Culture • Archaeological Survey of India (ASI)</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white">
                  Preserving 3,696+ National Monuments Across 24 Archaeological Circles
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
                  Explore the official heritage framework of India. Book computer-verified E-Tickets via PayGov, discover 45+ site museums with ancient excavated antiquities, inspect epigraphical inscriptions, and review the statutory AMASR Act 1958/2010 preservation guidelines.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => navigate('/asi')}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Open ASI Official Portal</span>
                  </button>

                  <button
                    onClick={() => navigate('/asi')}
                    className="px-5 py-3 rounded-2xl bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>Instant E-Ticket Generator</span>
                  </button>

                  <a
                    href="https://asi.nic.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-stone-900/60 border border-stone-800 hover:text-white text-stone-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Visit asi.nic.in</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-5 space-y-3 text-xs">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Official Heritage Framework:
                </div>
                <div className="space-y-2 text-stone-300">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-stone-400">Headquarters:</span>
                    <span className="font-semibold text-white">Dharohar Bhawan, New Delhi</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-stone-400">Founded:</span>
                    <span className="font-mono text-amber-300">1861 CE (Alexander Cunningham)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-stone-400">Active Circles:</span>
                    <span className="font-mono text-white">24 Regional Jurisdictions</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-stone-400">AMASR Act Buffer:</span>
                    <span className="font-mono text-emerald-400 font-semibold">100m Prohibited | 200m Regulated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Children under 15:</span>
                    <span className="font-mono text-emerald-400 font-bold">100% Free Admission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEXT-GEN DIGITAL HERITAGE TECHNOLOGIES & STUDENT INNOVATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-stone-800/80">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
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

      {/* 7. LIVING FOLK MUSIC & INSTRUMENT TRADITIONS */}
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

      {/* 8. THE 9 GATEWAYS OF BHARATVIRASAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            The 10 Gateways of BharatVirasat
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
                className="group relative overflow-hidden rounded-3xl bg-stone-900/90 border border-stone-800 p-6 text-left hover:border-amber-500/50 transition-all hover:scale-[1.02] shadow-xl cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={'w-12 h-12 rounded-2xl bg-gradient-to-br ' + feature.color + ' flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'}>
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

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
