import { useState, useRef, useEffect } from 'react';
import { Video, MapPin, ChevronUp, ChevronDown, Play, Pause, Heart, Share2, Volume2, VolumeX, Sparkles, Bookmark, Check } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { videoReels } from '@/data/quiz';

export function ReelsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set(['reel-1', 'reel-3']));
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [shareToast, setShareToast] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reel = videoReels[activeIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
          setIsPlaying(false);
        });
      }
    }
  }, [activeIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const goUp = () => {
    setActiveIndex((prev) => (prev - 1 + videoReels.length) % videoReels.length);
    setIsPlaying(true);
  };

  const goDown = () => {
    setActiveIndex((prev) => (prev + 1) % videoReels.length);
    setIsPlaying(true);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/reels`;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const categoryColors: Record<string, string> = {
    craft: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    festival: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dance: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    food: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    history: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  };

  const isCurrentLiked = liked.has(reel.id);
  const isCurrentSaved = bookmarked.has(reel.id);
  const likesCount = (reel.likes || 1200) + (isCurrentLiked ? 1 : 0);

  return (
    <div className="min-h-screen bg-stone-950 pt-16 pb-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-4 relative flex flex-col items-center">
        {/* Title Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Video className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">Culture Reels</h1>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {activeIndex + 1} / {videoReels.length}
          </span>
        </div>

        {/* Reel Card Container */}
        <div
          onClick={togglePlay}
          className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl cursor-pointer select-none group"
        >
          {/* Video Player */}
          {reel.videoUrl ? (
            <video
              ref={videoRef}
              src={reel.videoUrl}
              poster={reel.thumbnail}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              autoPlay
            />
          ) : (
            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
          )}

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/40 pointer-events-none" />

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${
                categoryColors[reel.category] || 'bg-stone-800 text-white'
              }`}
            >
              {reel.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
                {reel.duration}
              </div>
            </div>
          </div>

          {/* Play/Pause Center Indicator */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white pointer-events-none shadow-2xl border border-white/20">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          )}

          {/* Right Action Rail */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20 pointer-events-auto">
            {/* Like */}
            <button
              onClick={(e) => toggleLike(reel.id, e)}
              className="flex flex-col items-center gap-1 group/btn"
            >
              <div
                className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                  isCurrentLiked
                    ? 'bg-rose-500 text-white scale-110'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
              >
                <Heart className={`w-5 h-5 ${isCurrentLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {likesCount}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => toggleBookmark(reel.id, e)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                  isCurrentSaved
                    ? 'bg-amber-500 text-stone-950 scale-110 font-bold'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isCurrentSaved ? 'fill-stone-950' : ''}`} />
              </div>
              <span className="text-[11px] text-white drop-shadow-md">Save</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-white drop-shadow-md">Share</span>
            </button>
          </div>

          {/* Bottom Caption & Deep Links */}
          <div className="absolute bottom-4 left-4 right-16 z-10 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/explore/state/${reel.stateId}`);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:underline mb-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{reel.stateName}</span>
            </button>

            <h2 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-md">
              {reel.title}
            </h2>

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3 drop-shadow">
              {reel.topic}
            </p>

            {reel.craftId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/craft/${reel.craftId}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-lg shadow-amber-950/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Featured Craft &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="w-full flex items-center justify-between mt-3 px-2">
          <button
            onClick={goUp}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Previous Reel</span>
          </button>

          <button
            onClick={goDown}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition-colors"
          >
            <span>Next Reel</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Share Toast */}
        {shareToast && (
          <div className="fixed bottom-8 bg-emerald-500 text-stone-950 px-4 py-2 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce z-50">
            <Check className="w-4 h-4" />
            <span>Reel link copied to clipboard!</span>
          </div>
        )}
      </div>
    </div>
  );
}
