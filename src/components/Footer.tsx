import { Compass, Heart, Users, ExternalLink } from 'lucide-react';
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
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Heritage & 3D</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/asi')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">🏛️ ASI Portal & Circles</button></li>
              <li><button onClick={() => navigate('/3d-view')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">🌐 Real 3D Monument View</button></li>
              <li><button onClick={() => navigate('/unesco')} className="text-stone-400 hover:text-amber-400 transition-colors">32 UNESCO Inscriptions</button></li>
              <li><button onClick={() => navigate('/explore')} className="text-stone-400 hover:text-amber-400 transition-colors">Cultural Map of India</button></li>
              <li><button onClick={() => navigate('/artisans')} className="text-stone-400 hover:text-amber-400 transition-colors">Master Artisans</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">ASI E-Services</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/asi')} className="text-stone-400 hover:text-amber-400 transition-colors">Monument E-Tickets</button></li>
              <li><button onClick={() => navigate('/asi')} className="text-stone-400 hover:text-amber-400 transition-colors">Site Museums Directory</button></li>
              <li><button onClick={() => navigate('/team')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">👥 Team Wintech</button></li>
              <li><button onClick={() => navigate('/quiz')} className="text-stone-400 hover:text-amber-400 transition-colors">Heritage Quiz</button></li>
              <li><a href="https://asi.nic.in" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1">Official asi.nic.in &nearr;</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-stone-400">
            <span>Crafted with pride by <strong className="text-white font-semibold">Team Wintech</strong></span>
            <span className="hidden sm:inline">&bull;</span>
            <span>Led by <a href="https://github.com/wingedayush" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-bold hover:underline inline-flex items-center gap-1">Ayush Raj (@wingedayush) <ExternalLink className="w-3 h-3" /></a></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/team')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-stone-950 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Meet Team Wintech</span>
            </button>
            <p className="text-stone-500 text-xs">BharatVirasat &copy; 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
