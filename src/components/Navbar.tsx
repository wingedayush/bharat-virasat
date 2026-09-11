import { Compass, MapPin, Users, Trophy, Route as RouteIcon, GitCompare, Video, Camera, Sparkles, Navigation, Landmark } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { useProgress } from '@/hooks/useProgress';

const navItems = [
  { label: 'Home', path: '/', icon: Compass },
  { label: 'UNESCO', path: '/unesco', icon: Landmark, highlight: true },
  { label: 'Explore', path: '/explore', icon: MapPin },
  { label: 'Artisans', path: '/artisans', icon: Users },
  { label: 'Reels', path: '/reels', icon: Video },
  { label: 'Identify', path: '/identify', icon: Camera },
  { label: 'Ask AI', path: '/ask-bharat', icon: Sparkles },
  { label: 'Near Me', path: '/near-me', icon: Navigation },
  { label: 'Quiz', path: '/quiz', icon: Trophy },
  { label: 'Journey', path: '/journey', icon: RouteIcon },
  { label: 'Compare', path: '/compare', icon: GitCompare },
];

export function Navbar() {
  const { progress } = useProgress();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              Bharat<span className="text-amber-400">Virasat</span>
            </span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    item.highlight
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 shadow-sm'
                      : 'text-stone-300 hover:text-amber-400 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-stone-700">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">{progress.totalPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
