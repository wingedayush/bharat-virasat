import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, History, Hammer, ShoppingBag, Shield, User, Building2, UtensilsCrossed, PartyPopper, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { crafts } from '@/data/crafts';
import { artisans } from '@/data/artisans';
import { useProgress } from '@/hooks/useProgress';

export function CraftDetailPage({ craftId }: { craftId: string }) {
  const craft = crafts.find((c) => c.id === craftId);
  const artisan = craft?.artisanId ? artisans.find((a) => a.id === craft.artisanId) : null;
  const [activeTab, setActiveTab] = useState<'history' | 'process' | 'buying' | 'authenticity'>('history');
  const [activeImage, setActiveImage] = useState(0);
  const { recordCraftView } = useProgress();

  useEffect(() => {
    if (craft) {
      recordCraftView(craft.stateId, craft.id);
    }
  }, [craft, recordCraftView]);

  if (!craft) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex items-center justify-center">
        <p className="text-stone-400">Craft not found.</p>
      </div>
    );
  }

  const gallery = craft.gallery.length > 0 ? craft.gallery : [craft.image];

  const tabs = [
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'process' as const, label: 'How It\'s Made', icon: Hammer },
    { id: 'buying' as const, label: 'Know Before You Buy', icon: ShoppingBag },
    { id: 'authenticity' as const, label: 'Authenticity', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-stone-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(`/explore/state/${craft.stateId}`)}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {craft.stateName}
        </button>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
              <img src={gallery[activeImage]} alt={craft.name} className="w-full h-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 mt-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-amber-500' : 'border-stone-800'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium capitalize">{craft.category}</span>
              {craft.giStatus && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">GI Tagged {craft.giNumber}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{craft.name}</h1>
            <p className="text-stone-400 mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {craft.stateName} &middot; {craft.district} &middot; {craft.village}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-stone-300 text-sm"><span className="text-stone-500">Materials:</span> {craft.materials.join(', ')}</p>
              </div>
              <div className="flex items-start gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-stone-300 text-sm"><span className="text-stone-500">Price Range:</span> {craft.priceRange}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-amber-500 text-stone-900' : 'bg-stone-900 text-stone-400 border border-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 min-h-[200px]">
              {activeTab === 'history' && (
                <p className="text-stone-300 leading-relaxed text-sm">{craft.history}</p>
              )}
              {activeTab === 'process' && (
                <p className="text-stone-300 leading-relaxed text-sm">{craft.makingProcess}</p>
              )}
              {activeTab === 'buying' && (
                <div>
                  <p className="text-stone-300 leading-relaxed text-sm mb-3">{craft.originalVsImitation}</p>
                  <h4 className="text-white font-semibold text-sm mb-2">Where to Buy:</h4>
                  <ul className="space-y-1">
                    {craft.whereToBuy.map((place) => (
                      <li key={place} className="text-stone-400 text-sm flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" /> {place}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'authenticity' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">How to Identify Original</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed text-sm">{craft.originalVsImitation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Artisan */}
        {artisan && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-amber-400" /> Meet the Artisan</h2>
            <button
              onClick={() => navigate(`/artisans/${artisan.id}`)}
              className="group flex gap-4 p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all text-left w-full"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors mb-1">{artisan.name}</h3>
                <p className="text-stone-400 text-sm mb-2">{artisan.village} &middot; {artisan.yearsOfExperience} years of experience</p>
                <p className="text-stone-500 text-sm line-clamp-2">{artisan.learningStory}</p>
              </div>
            </button>
          </div>
        )}

        {/* Related */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Nearby Places</h3>
            </div>
            <ul className="space-y-1.5">
              {craft.nearbyPlaces.map((place) => (
                <li key={place} className="text-stone-400 text-sm flex items-center gap-1.5"><MapPin className="w-3 h-3 text-stone-600" /> {place}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">Related Food</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {craft.relatedFood.map((food) => (
                <span key={food} className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-sm">{food}</span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <PartyPopper className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold text-sm">Related Festivals</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {craft.relatedFestival.map((fest) => (
                <span key={fest} className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-sm">{fest}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Traditions */}
        <div className="mt-6 p-5 rounded-2xl bg-stone-900 border border-stone-800">
          <h3 className="text-white font-semibold text-sm mb-3">Similar Traditions in Other States</h3>
          <div className="flex flex-wrap gap-2">
            {craft.similarTraditions.map((trad) => (
              <span key={trad} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm">{trad}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
