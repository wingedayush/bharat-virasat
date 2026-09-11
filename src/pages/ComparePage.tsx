import { useState } from 'react';
import { GitCompare, ArrowLeft, Music, PartyPopper, UtensilsCrossed, Brush, Building2, MapPin } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';

export function ComparePage() {
  const [stateA, setStateA] = useState('punjab');
  const [stateB, setStateB] = useState('kerala');

  const stateAData = states.find((s) => s.id === stateA);
  const stateBData = states.find((s) => s.id === stateB);

  const categories = [
    { icon: Brush, label: 'Crafts', key: 'crafts' as const, color: 'text-amber-400' },
    { icon: Music, label: 'Dance Forms', key: 'dances' as const, color: 'text-rose-400' },
    { icon: PartyPopper, label: 'Festivals', key: 'festivals' as const, color: 'text-emerald-400' },
    { icon: UtensilsCrossed, label: 'Foods', key: 'foods' as const, color: 'text-orange-400' },
    { icon: Building2, label: 'Heritage Sites', key: 'heritageSites' as const, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <GitCompare className="w-8 h-8 text-amber-400" /> Compare Cultures
          </h1>
          <p className="text-stone-400 text-lg">Select two states and see their cultural traditions side by side</p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-stone-500 text-sm mb-2 block">State A</label>
            <select
              value={stateA}
              onChange={(e) => setStateA(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500/50"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-stone-500 text-sm mb-2 block">State B</label>
            <select
              value={stateB}
              onChange={(e) => setStateB(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-500/50"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {stateAData && stateBData && (
          <>
            {/* Header cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { data: stateAData, color: '#0891B2' },
                { data: stateBData, color: '#DC2626' },
              ].map(({ data, color }) => (
                <div key={data.id} className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: color }} />
                    <h2 className="text-white font-bold text-xl mb-1">{data.name}</h2>
                    <p className="text-stone-400 text-sm">{data.tagline}</p>
                    <p className="text-stone-500 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {data.capital}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const itemsA = stateAData[cat.key];
                const itemsB = stateBData[cat.key];
                return (
                  <div key={cat.key} className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden">
                    <div className="px-5 py-3 border-b border-stone-800 flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                      <h3 className="text-white font-semibold text-sm">{cat.label}</h3>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-stone-800">
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {itemsA.map((item: string) => (
                            <span key={item} className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs">{item}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {itemsB.map((item: string) => (
                            <span key={item} className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fun facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2">{stateAData.name} - Did You Know?</h3>
                <p className="text-stone-300 text-sm leading-relaxed">{stateAData.funFact}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-500/20">
                <h3 className="text-red-400 font-semibold text-sm mb-2">{stateBData.name} - Did You Know?</h3>
                <p className="text-stone-300 text-sm leading-relaxed">{stateBData.funFact}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => navigate(`/explore/state/${stateAData.id}`)} className="px-5 py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium border border-stone-700 hover:bg-stone-700 transition-colors">
                Explore {stateAData.name}
              </button>
              <button onClick={() => navigate(`/explore/state/${stateBData.id}`)} className="px-5 py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium border border-stone-700 hover:bg-stone-700 transition-colors">
                Explore {stateBData.name}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
