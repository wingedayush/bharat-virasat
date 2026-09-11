import { useState } from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { states } from '@/data/states';
import { crafts } from '@/data/crafts';

const regions = [
  { id: 'all', label: 'All India' },
  { id: 'north', label: 'North' },
  { id: 'south', label: 'South' },
  { id: 'east', label: 'East' },
  { id: 'west', label: 'West' },
  { id: 'central', label: 'Central' },
  { id: 'northeast', label: 'Northeast' },
];

export function ExplorePage() {
  const [region, setRegion] = useState('all');
  const [search, setSearch] = useState('');

  const filteredStates = states.filter((s) => {
    const matchRegion = region === 'all' || s.region === region;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.crafts.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchRegion && matchSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Explore India's Heritage</h1>
          <p className="text-stone-400 text-lg">Navigate from state to district to village — discover the crafts, food, and festivals of each region.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Search states or crafts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  region === r.id
                    ? 'bg-amber-500 text-stone-900'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-amber-500/30'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => {
            const stateCrafts = crafts.filter((c) => c.stateId === state.id);
            return (
              <button
                key={state.id}
                onClick={() => navigate(`/explore/state/${state.id}`)}
                className="group relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all text-left"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={state.image} alt={state.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-medium" style={{ backgroundColor: state.color + '30', color: state.color }}>
                    {state.region.toUpperCase()}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-xl mb-1 group-hover:text-amber-400 transition-colors">{state.name}</h3>
                  <p className="text-amber-400/80 text-sm font-medium mb-2">{state.tagline}</p>
                  <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 mb-3">{state.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {state.crafts.slice(0, 3).map((craft) => (
                      <span key={craft} className="px-2 py-1 rounded-md bg-stone-800 text-stone-300 text-xs">{craft}</span>
                    ))}
                    {state.crafts.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-stone-800 text-stone-400 text-xs">+{state.crafts.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {state.capital}
                    </span>
                    <span className="text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
