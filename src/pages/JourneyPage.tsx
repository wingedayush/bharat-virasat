import { useState } from 'react';
import { Trophy, MapPin, Brush, Users, Star, Award, TrendingUp, Share2, Check, Sparkles, Shield, Compass, ChevronRight } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';
import { artisans } from '@/data/artisans';
import { badges } from '@/data/quiz';
import { useProgress } from '@/hooks/useProgress';

export function JourneyPage() {
  const { progress } = useProgress();
  const [copied, setCopied] = useState(false);

  const statesExplored = Object.values(progress.states).filter((s) => s.explorationPercentage > 0).length;
  const totalCrafts = crafts.length;
  const totalArtisans = artisans.length;

  const getRank = (points: number, stateCount: number) => {
    if (points >= 150 && stateCount >= 8) return { title: 'Grand Custodian of Bharat Heritage', tier: 'Master Level', color: 'from-amber-400 to-yellow-500' };
    if (points >= 80 || stateCount >= 5) return { title: 'Virasat Heritage Guardian', tier: 'Senior Scholar', color: 'from-orange-400 to-amber-500' };
    if (points >= 30 || stateCount >= 2) return { title: 'Cultural Explorer', tier: 'Voyager Level', color: 'from-teal-400 to-emerald-500' };
    return { title: 'Heritage Initiate', tier: 'Discovery Level', color: 'from-stone-400 to-stone-300' };
  };

  const rank = getRank(progress.totalPoints, statesExplored);

  const journeyStats = [
    { icon: MapPin, label: 'States Explored', value: statesExplored, total: states.length, color: 'text-amber-400' },
    { icon: Brush, label: 'Crafts Discovered', value: progress.craftsViewed.length, total: totalCrafts, color: 'text-rose-400' },
    { icon: Users, label: 'Artisan Stories Read', value: progress.artisansViewed.length, total: totalArtisans, color: 'text-emerald-400' },
    { icon: Trophy, label: 'Quiz Points', value: progress.totalPoints, total: 200, color: 'text-blue-400' },
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-amber-500';
    if (percentage >= 10) return 'bg-orange-500';
    return 'bg-stone-700';
  };

  const handleSharePassport = () => {
    const text = `🇮🇳 My BharatVirasat Cultural Passport:\n` +
      `🏅 Rank: ${rank.title} (${rank.tier})\n` +
      `🗺️ States Explored: ${statesExplored}/${states.length}\n` +
      `🧵 Crafts Discovered: ${progress.craftsViewed.length}/${totalCrafts}\n` +
      `🏆 Heritage Quiz Points: ${progress.totalPoints}\n` +
      `🎖️ Badges Earned: ${progress.badges.length}/${badges.length}\n\n` +
      `Explore India's living crafts and heritage at: ${window.location.origin}/#/journey`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Cultural Exploration Log
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              My Heritage <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Journey</span>
            </h1>
            <p className="text-stone-400 text-sm sm:text-base">
              Track your state discoveries, craft inspections, and earned honors across India.
            </p>
          </div>

          <button
            onClick={handleSharePassport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/40"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Passport Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Heritage Passport</span>
              </>
            )}
          </button>
        </div>

        {/* Digital Passport Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-amber-500/40 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                  BHARATVIRASAT CULTURAL PASSPORT
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{rank.title}</h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              {rank.tier}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800">
            <div>
              <span className="text-xs text-stone-500 block">States Visited</span>
              <strong className="text-white text-lg">{statesExplored} / {states.length}</strong>
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Crafts Learned</span>
              <strong className="text-white text-lg">{progress.craftsViewed.length} / {totalCrafts}</strong>
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Artisans Discovered</span>
              <strong className="text-white text-lg">{progress.artisansViewed.length} / {totalArtisans}</strong>
            </div>
            <div>
              <span className="text-xs text-stone-500 block">Scholar Points</span>
              <strong className="text-amber-400 text-lg font-mono">{progress.totalPoints} pts</strong>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {journeyStats.map((stat) => {
            const Icon = stat.icon;
            const percentage = Math.min(100, Math.round((stat.value / stat.total) * 100));
            return (
              <div key={stat.label} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-stone-300 text-xs font-medium mb-2">{stat.label}</p>
                <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
                  <div className={`h-full ${getProgressColor(percentage)} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-stone-500 text-[11px] mt-1.5 font-mono">{percentage}% of target</p>
              </div>
            );
          })}
        </div>

        {/* Earned Badges Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Heritage Honors & Badges</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {progress.badges.length} of {badges.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const isEarned = progress.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isEarned
                      ? 'bg-stone-900/90 border-amber-500/40 shadow-md'
                      : 'bg-stone-900/40 border-stone-800/80 opacity-50 grayscale'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-stone-950 font-bold"
                    style={{ backgroundColor: isEarned ? badge.color : '#44403c' }}
                  >
                    <Trophy className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                      {isEarned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          Earned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Exploration Checklist */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>State Exploration Index</span>
            </h2>
            <button
              onClick={() => navigate('/explore')}
              className="text-xs text-amber-400 hover:underline"
            >
              Open Interactive Map &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {states.map((state) => {
              const stateProgress = progress.states[state.id];
              const pct = stateProgress?.explorationPercentage || 0;

              return (
                <div
                  key={state.id}
                  onClick={() => navigate(`/explore/state/${state.id}`)}
                  className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-950 flex-shrink-0">
                      <img src={state.image} alt={state.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {state.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {pct > 0 ? `${pct}% Explored` : 'Unvisited'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
