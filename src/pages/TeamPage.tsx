import {
  Users,
  Code2,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  GraduationCap,
  Database,
  Compass,
  ArrowRight,
  Eye,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { teamWintech } from '@/data/teamData';
import { navigate } from '@/hooks/useRouter';
import { MonumentAnimatedBackground } from '@/components/MonumentAnimatedBackground';

export function TeamPage() {
  const leadMember = teamWintech.find((m) => m.isLead) || teamWintech[0];
  const domainMembers = teamWintech.filter((m) => !m.isLead);

  return (
    <MonumentAnimatedBackground className="min-h-screen text-stone-100 pt-24 pb-28 px-4 sm:px-6" isFixed={true}>
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Core Engineering Division • Team Wintech</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Meet the Builders of <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">BharatVirasat</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Engineered by <strong className="text-white">Team Wintech</strong> to preserve, celebrate, and present India's unbroken civilizational heritage through modern web architecture, interactive 3D WebGL, and vernacular intelligence.
          </p>
        </div>

        {/* Team Lead Spotlight Card: Ayush Raj */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900/90 to-amber-950/40 border-2 border-amber-500/50 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-l from-amber-500 to-orange-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-bl-2xl shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Team Lead & Systems Architect</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 font-black text-3xl shadow-xl shrink-0 border border-amber-300/40">
              AR
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{leadMember.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    Project Leader
                  </span>
                </div>
                <p className="text-amber-400 font-semibold text-sm sm:text-base mt-1">
                  {leadMember.role}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Core Focus: <span className="text-stone-200">{leadMember.focus}</span>
                </p>
              </div>

              {/* Key Contributions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {leadMember.keyContributions.map((task, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-stone-300 font-medium leading-snug">{task}</span>
                  </div>
                ))}
              </div>

              {/* GitHub Link */}
              {leadMember.github && (
                <div className="pt-2">
                  <a
                    href={leadMember.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <Code2 className="w-4 h-4 text-stone-950" />
                    <span>View GitHub Profile: @wingedayush</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-stone-600" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Domain Leads Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <span>Domain Engineering Specialists</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">Team Wintech Roster</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl backdrop-blur-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-800 group-hover:bg-amber-500/20 text-stone-300 group-hover:text-amber-400 border border-stone-700 group-hover:border-amber-500/40 flex items-center justify-center font-bold text-base transition-colors">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      Core Team
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">{member.role}</p>
                    <p className="text-[11px] text-stone-400 mt-2 font-mono bg-stone-950/70 p-2 rounded-xl border border-stone-800/80">
                      <span className="text-stone-500">Focus:</span> {member.focus}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-stone-800/80">
                    <p className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">Key Contributions:</p>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {member.keyContributions.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px]">
                          <span className="text-amber-500 text-xs mt-0.5">•</span>
                          <span className="leading-snug text-stone-300">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-800/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>Team Wintech</span>
                  <span className="text-amber-400/80 font-mono">Verified Credential</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation & Platform Credentials Card */}
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
              <GraduationCap className="w-4 h-4" />
              <span>National Student Innovation Platform</span>
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white">Explore Student Innovation Pass & Portal</h4>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Access the verified Student Innovation Pass, digital certifications, and ASI monument research archives.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Open Student Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/3d-view')}
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>View 3D Heritage</span>
            </button>
          </div>
        </div>

      </div>
    </MonumentAnimatedBackground>
  );
}
