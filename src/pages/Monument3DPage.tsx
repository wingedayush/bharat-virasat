import { useState } from 'react';
import {
  Layers,
  Landmark,
  Compass,
  Sparkles,
  Ticket,
  ChevronRight,
  Info,
  Calendar,
  MapPin,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { Monument3DViewer } from '@/components/Monument3DViewer';
import { navigate } from '@/hooks/useRouter';

interface Monument3DPageProps {
  onPlayAudioGuide?: (title: string, text: string, location?: string) => void;
}

export function Monument3DPage({ onPlayAudioGuide }: Monument3DPageProps) {
  const [selectedMonument, setSelectedMonument] = useState<UnescoMonument>(unescoMonumentsList[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pt-16 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                <span className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real 3D Virtual Heritage Reconstructions</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-stone-400 hidden sm:inline">WebGL Three.js PBR Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                <span>Interactive 3D Heritage Sanctum</span>
                <span className="px-2.5 py-0.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
                  LiDAR Ready
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
                Explore architectural masterpieces of Bharat in full photorealistic 3D, inspect laser LiDAR point clouds,
                control Archaeo-sun daylight shadows, and examine archaeological field hotspots.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/asi')}
                className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Landmark className="w-4 h-4" />
                <span>ASI Portal & Tickets</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition-colors"
                title="Share 3D Model Link"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Monument Selector Carousel / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-hide">
            {unescoMonumentsList.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMonument(m)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedMonument.id === m.id
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40 scale-[1.02]'
                    : 'bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Landmark className={`w-3.5 h-3.5 ${selectedMonument.id === m.id ? 'text-stone-950' : 'text-amber-400'}`} />
                <span>{m.name}</span>
                <span
                  className={`text-[10px] font-mono ${
                    selectedMonument.id === m.id ? 'text-stone-800' : 'text-stone-500'
                  }`}
                >
                  ({m.stateName})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Exploration Arena */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Full-width Upgraded 3D Monument Viewer */}
        <Monument3DViewer
          monument={selectedMonument}
          onSelectMonument={(m) => setSelectedMonument(m)}
          onPlayAudioGuide={onPlayAudioGuide}
        />

        {/* Selected Monument Architectural Profile & Historical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-stone-900/80 border border-amber-900/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    UNESCO Inscribed {selectedMonument.yearInscribed} • {selectedMonument.category.toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">{selectedMonument.name}</h2>
                  <div className="text-sm text-amber-500/90 font-serif">{selectedMonument.hindiName}</div>
                </div>

                <button
                  onClick={() => navigate('/asi')}
                  className="px-4 py-2 rounded-2xl bg-amber-500 text-stone-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book ASI Pass</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400 mb-6 pb-4 border-b border-stone-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedMonument.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedMonument.region} India</span>
                </span>
              </div>

              <p className="text-stone-300 text-sm leading-relaxed mb-6">{selectedMonument.history}</p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Architectural & Engineering Wonders:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMonument.architecturalWonders.map((wonder, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800 text-xs text-stone-200 flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{wonder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info & Telemetry Sidebar */}
          <div className="space-y-6">
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Architectural Telemetry</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Typology:</span>
                  <span className="text-amber-300 font-mono font-semibold">{selectedMonument.modelPreset}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400">State / Region:</span>
                  <span className="text-stone-200">{selectedMonument.stateName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400">UNESCO Criteria:</span>
                  <span className="text-amber-400 font-mono font-bold">{selectedMonument.unescoCriteria}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Coordinates:</span>
                  <span className="text-stone-200 font-mono text-[11px]">
                    {selectedMonument.coordinates.lat.toFixed(4)}°N, {selectedMonument.coordinates.lng.toFixed(4)}°E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">ASI Protection:</span>
                  <span className="text-emerald-400 font-semibold">Centrally Protected Monument</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onPlayAudioGuide) {
                      onPlayAudioGuide(selectedMonument.name, selectedMonument.audioNarration, selectedMonument.location);
                    }
                  }}
                  className="w-full py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Heritage Audio Story</span>
                </button>
              </div>
            </div>

            {/* Visual Render Features Banner */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-stone-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5 uppercase font-mono">
                <Layers className="w-4 h-4" />
                <span>3D Render Capabilities</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Full 360° Drag & Touch OrbitControls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Realistic Procedural Stone & Marble PBR Textures</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>ASI Laser LiDAR Point Cloud Telemetry Mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Archaeo-Astronomy 24-Hour Sun & Shadow Dial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Interactive 3D Archaeological Hotspot Pins</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
