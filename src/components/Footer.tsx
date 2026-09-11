import { Compass, Heart } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';

export function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-amber-900/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Bharat<span className="text-amber-400">Virasat</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              Discover, experience, and preserve the rich cultural heritage of India.
              From crafts to festivals, artisans to architecture — explore the soul of Bharat.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/explore')} className="text-stone-400 hover:text-amber-400 transition-colors">Cultural Map</button></li>
              <li><button onClick={() => navigate('/artisans')} className="text-stone-400 hover:text-amber-400 transition-colors">Artisan Stories</button></li>
              <li><button onClick={() => navigate('/reels')} className="text-stone-400 hover:text-amber-400 transition-colors">Culture Reels</button></li>
              <li><button onClick={() => navigate('/identify')} className="text-stone-400 hover:text-amber-400 transition-colors">Identify Object</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Engage</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/quiz')} className="text-stone-400 hover:text-amber-400 transition-colors">Heritage Quiz</button></li>
              <li><button onClick={() => navigate('/journey')} className="text-stone-400 hover:text-amber-400 transition-colors">My Journey</button></li>
              <li><button onClick={() => navigate('/compare')} className="text-stone-400 hover:text-amber-400 transition-colors">Compare Cultures</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex items-center justify-between flex-wrap gap-4">
          <p className="text-stone-500 text-sm">Made with <Heart className="w-3 h-3 inline text-red-500" /> for Indian Heritage</p>
          <p className="text-stone-500 text-sm">BharatVirasat &copy; 2026 &bull; Preserving India's Living Heritage</p>
        </div>
      </div>
    </footer>
  );
}
