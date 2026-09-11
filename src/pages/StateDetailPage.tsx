import { useEffect } from 'react';
import { MapPin, ArrowLeft, Sparkles, Building2, UtensilsCrossed, Music, PartyPopper, Brush } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';
import { useProgress } from '@/hooks/useProgress';

export function StateDetailPage({ stateId }: { stateId: string }) {
  const state = states.find((s) => s.id === stateId);
  const { recordCraftView } = useProgress();

  useEffect(() => {
    if (state) {
      recordCraftView(state.id, `state-${state.id}`);
    }
  }, [state, recordCraftView]);

  if (!state) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <p className="text-stone-400">State not found.</p>
      </div>
    );
  }

  const stateCrafts = crafts.filter((c) => c.stateId === stateId);

  const sections = [
    { icon: Brush, title: 'Traditional Crafts', items: state.crafts, color: 'text-amber-400' },
    { icon: Music, title: 'Dance Forms', items: state.dances, color: 'text-rose-400' },
    { icon: PartyPopper, title: 'Festivals', items: state.festivals, color: 'text-emerald-400' },
    { icon: UtensilsCrossed, title: 'Traditional Foods', items: state.foods, color: 'text-orange-400' },
    { icon: Building2, title: 'Heritage Sites & Monuments', items: state.heritageSites, color: 'text-blue-400' },
  ];

  if (state.unescoSites && state.unescoSites.length > 0) {
    sections.push({ icon: Building2, title: 'UNESCO Inscriptions', items: state.unescoSites, color: 'text-teal-400' });
  }

  if (state.musicInstruments && state.musicInstruments.length > 0) {
    sections.push({ icon: Music, title: 'Traditional Musical Instruments', items: state.musicInstruments, color: 'text-purple-400' });
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={state.image} alt={state.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/30" />
        <button
          onClick={() => navigate('/explore')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 backdrop-blur-sm text-white text-sm hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="mb-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: state.color + '20', color: state.color }}>
            {state.region.toUpperCase()}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{state.name}</h1>
        <p className="text-amber-400 text-lg font-medium mb-4">{state.tagline}</p>
        <p className="text-stone-300 text-lg leading-relaxed mb-6 max-w-3xl">{state.description}</p>

        <div className="flex items-center gap-4 mb-8 text-sm text-stone-400">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Capital: {state.capital}</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> {state.crafts.length} crafts</span>
        </div>

        {/* Fun Fact */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 font-semibold text-sm mb-1">Did You Know?</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{state.funFact}</p>
            </div>
          </div>
        </div>

        {/* Cultural Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${section.color}`} />
                  <h3 className="text-white font-semibold">{section.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-sm">{item}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Crafts from this state */}
        {stateCrafts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Crafts from {state.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stateCrafts.map((craft) => (
                <button
                  key={craft.id}
                  onClick={() => navigate(`/craft/${craft.id}`)}
                  className="group flex gap-4 p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all text-left"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={craft.image} alt={craft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors mb-1">{craft.name}</h3>
                    <p className="text-stone-400 text-sm mb-2 line-clamp-2">{craft.history}</p>
                    <div className="flex gap-2">
                      {craft.giStatus && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">GI Tagged</span>}
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-xs">{craft.category}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
