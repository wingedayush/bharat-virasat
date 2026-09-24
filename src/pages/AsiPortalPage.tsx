import { useState, useMemo } from 'react';
import {
  Landmark,
  Search,
  Filter,
  Ticket,
  Calendar,
  Clock,
  Shield,
  MapPin,
  Building,
  Award,
  Sparkles,
  Download,
  Printer,
  Compass,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Camera,
  Layers,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  User,
  Users,
  QrCode,
  Info,
  Maximize2
} from 'lucide-react';
import {
  asiCircles,
  asiMuseums,
  asiConservationProjects,
  asiEpigraphyRecords,
  asiTicketPricingList,
  amasrActSummary,
  AsiCircle,
  AsiTicketPricing
} from '@/data/asiData';
import { unescoMonumentsList, UnescoMonument } from '@/data/unescoMonuments';
import { Monument3DViewer } from '@/components/Monument3DViewer';
import { navigate } from '@/hooks/useRouter';

type AsiTab = 'monuments' | 'tickets' | '3d-view' | 'museums' | 'conservation' | 'epigraphy' | 'rules';

interface GeneratedTicket {
  ticketId: string;
  monumentName: string;
  circle: string;
  visitDate: string;
  slot: string;
  visitorName: string;
  idProof: string;
  nationality: 'Indian' | 'SAARC/BIMSTEC' | 'Foreign Tourist';
  adultCount: number;
  childCount: number;
  domeAccess: boolean;
  audioGuide: boolean;
  totalAmount: number;
  bookedAt: string;
  qrPayload: string;
}

export function AsiPortalPage() {
  const [activeTab, setActiveTab] = useState<AsiTab>('monuments');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selected3DMonument, setSelected3DMonument] = useState<UnescoMonument>(unescoMonumentsList[0]);

  // E-Ticketing Form State
  const [ticketMonumentId, setTicketMonumentId] = useState<string>('taj-mahal');
  const [visitDate, setVisitDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('Morning (06:00 AM - 12:00 PM)');
  const [visitorName, setVisitorName] = useState<string>('Ayush Sharma');
  const [idType, setIdType] = useState<string>('Aadhaar Card');
  const [idNumber, setIdNumber] = useState<string>('XXXX-XXXX-4819');
  const [nationality, setNationality] = useState<'Indian' | 'SAARC/BIMSTEC' | 'Foreign Tourist'>('Indian');
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(1);
  const [domeAccess, setDomeAccess] = useState<boolean>(true);
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [generatedTicket, setGeneratedTicket] = useState<GeneratedTicket | null>(null);

  // Filtered Circles
  const filteredCircles = useMemo(() => {
    return asiCircles.filter((circle) => {
      const matchSearch =
        circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.keyMonuments.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRegion = selectedRegion === 'all' || circle.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [searchQuery, selectedRegion]);

  // Current selected ticket monument details
  const currentPricing = useMemo(() => {
    return asiTicketPricingList.find((p) => p.monumentId === ticketMonumentId) || asiTicketPricingList[0];
  }, [ticketMonumentId]);

  // Calculate simulated ticket total
  const calculatedTotal = useMemo(() => {
    let rate = currentPricing.indianRate;
    if (nationality === 'SAARC/BIMSTEC') rate = currentPricing.saarcBimstecRate;
    if (nationality === 'Foreign Tourist') rate = currentPricing.foreignRate;

    let total = rate * adultCount;
    // Children under 15 enter free under AMASR Act
    if (domeAccess && currentPricing.domeFee) {
      total += currentPricing.domeFee * adultCount;
    }
    if (includeAudio) {
      total += 100 * adultCount; // ₹100 per audio guide
    }
    return total;
  }, [currentPricing, nationality, adultCount, domeAccess, includeAudio]);

  // Generate Simulated Official ASI E-Ticket
  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketId = `ASI-GOI-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: GeneratedTicket = {
      ticketId: newTicketId,
      monumentName: currentPricing.monumentName,
      circle: currentPricing.circle,
      visitDate,
      slot: timeSlot,
      visitorName,
      idProof: `${idType}: ${idNumber}`,
      nationality,
      adultCount,
      childCount,
      domeAccess,
      audioGuide: includeAudio,
      totalAmount: calculatedTotal,
      bookedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      qrPayload: `GOI-ASI-TICKET:${newTicketId}|${currentPricing.monumentId}|${visitDate}|VALID`
    };
    setGeneratedTicket(newTicket);
  };

  return (
    <div
      className={`min-h-screen bg-stone-950 text-stone-100 pt-16 pb-20 ${
        fontSize === 'large' ? 'text-base' : fontSize === 'larger' ? 'text-lg' : 'text-sm'
      }`}
    >
      {/* 1. OFFICIAL GOVERNMENT OF INDIA & ASI NATIONAL BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 p-2 flex items-center justify-center shadow-lg">
              <Landmark className="w-9 h-9 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-amber-400/90 font-bold flex items-center gap-2">
                <span>Government of India</span>
                <span>•</span>
                <span>Ministry of Culture</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Archaeological Survey of India</span>
                <span className="text-amber-400 font-serif font-normal text-lg hidden lg:inline">
                  (भारतीय पुरातत्व सर्वेक्षण)
                </span>
              </h1>
              <p className="text-xs text-stone-400">
                Preserving 3,696+ Centrally Protected Monuments, Epigraphy & Excavated Heritage since 1861
              </p>
            </div>
          </div>

          {/* Language & Accessibility Bar */}
          <div className="flex items-center gap-3 bg-stone-950/70 p-2 rounded-2xl border border-stone-800 shadow-md">
            {/* Language Selector */}
            <div className="flex items-center rounded-xl bg-stone-900 p-0.5 border border-stone-800 text-xs font-semibold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  lang === 'en' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  lang === 'hi' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Font Resize */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-stone-400 font-mono">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded border ${
                  fontSize === 'normal' ? 'border-amber-400 text-amber-300' : 'border-stone-800'
                }`}
                title="Default Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded border ${
                  fontSize === 'large' ? 'border-amber-400 text-amber-300' : 'border-stone-800'
                }`}
                title="Large Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-1.5 py-0.5 rounded border ${
                  fontSize === 'larger' ? 'border-amber-400 text-amber-300' : 'border-stone-800'
                }`}
                title="Largest Font Size"
              >
                A+
              </button>
            </div>

            {/* Link to Official ASI Portal */}
            <a
              href="https://asi.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
              title="Visit official asi.nic.in website"
            >
              <span>asi.nic.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2. OFFICIAL STATISTICS SUMMARY COUNTER */}
        <div className="border-t border-stone-800/80 bg-stone-950/40 py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="border-r border-stone-800/80 last:border-none">
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">3,696+</span>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                Protected Monuments
              </div>
            </div>
            <div className="border-r border-stone-800/80 last:border-none">
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">24</span>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                Archaeological Circles
              </div>
            </div>
            <div className="border-r border-stone-800/80 last:border-none">
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">32</span>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                UNESCO World Heritage
              </div>
            </div>
            <div className="border-r border-stone-800/80 last:border-none">
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">45+</span>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                On-Site Museums
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">1861 CE</span>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                Foundation Era
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-hide">
          <button
            onClick={() => setActiveTab('monuments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'monuments'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Circles & Monuments</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'tickets'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>ASI E-Ticketing Portal</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              PayGov
            </span>
          </button>

          <button
            onClick={() => setActiveTab('3d-view')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === '3d-view'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Real 3D Virtual Heritage</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              LiDAR
            </span>
          </button>

          <button
            onClick={() => setActiveTab('museums')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'museums'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Site Museums & Antiquities</span>
          </button>

          <button
            onClick={() => setActiveTab('conservation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'conservation'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Science & Excavations</span>
          </button>

          <button
            onClick={() => setActiveTab('epigraphy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'epigraphy'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Epigraphy & Inscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AMASR Act & Guidelines</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA PER TAB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* ============================================================== */}
        {/* TAB 1: CIRCLES & MONUMENTS DIRECTORY */}
        {/* ============================================================== */}
        {activeTab === 'monuments' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search circles, protected monuments (Taj Mahal, Qutub, Kailasa...), states..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-2xl pl-10 pr-4 py-3 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-1 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 shrink-0 text-xs">
                {['all', 'North', 'South', 'East', 'West', 'Central'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-colors capitalize ${
                      selectedRegion === r ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="group bg-gradient-to-b from-stone-900/90 to-stone-950 border border-amber-900/30 hover:border-amber-500/60 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {circle.region} Region • Estd. {circle.establishedYear}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                          {circle.name}
                        </h3>
                        <div className="text-xs text-amber-500/80 font-serif">{circle.hindiName}</div>
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-stone-800 text-amber-400 border border-stone-700">
                        {circle.monumentCount} Monuments
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed mb-4">{circle.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Key Centrally Protected Monuments:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {circle.keyMonuments.map((m, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-stone-950/70 border border-stone-800 px-2.5 py-1 rounded-xl text-stone-300"
                          >
                            🏛️ {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 text-[11px] text-stone-400 space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{circle.officeAddress}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <button
                        onClick={() => {
                          setActiveTab('tickets');
                          const matchPricing = asiTicketPricingList.find((p) => p.circle === circle.name);
                          if (matchPricing) setTicketMonumentId(matchPricing.monumentId);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Passes</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('3d-view')}
                        className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>3D View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ASI E-TICKETING PORTAL & DIGITAL PASS GENERATOR */}
        {/* ============================================================== */}
        {activeTab === 'tickets' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-stone-900/90 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Official Monument E-Ticketing Booking Portal</h2>
                  <p className="text-xs text-stone-400">
                    Direct computerized entry pass reservation under Archaeological Survey of India (PayGov Portal)
                  </p>
                </div>
              </div>

              <form onSubmit={handleBookTicket} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Monument */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Select Centrally Protected Monument
                    </label>
                    <select
                      value={ticketMonumentId}
                      onChange={(e) => setTicketMonumentId(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {asiTicketPricingList.map((p) => (
                        <option key={p.monumentId} value={p.monumentId}>
                          {p.monumentName} ({p.circle}) — Indian: ₹{p.indianRate} | Foreigner: ₹{p.foreignRate}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visit Date */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Date of Visit
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Visiting Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Morning (06:00 AM - 12:00 PM)">Morning (06:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 06:00 PM)">Afternoon (12:00 PM - 06:00 PM)</option>
                      <option value="Sunset / Evening Light Show (06:00 PM - 08:30 PM)">
                        Sunset / Evening Light Show (06:00 PM - 08:30 PM)
                      </option>
                    </select>
                  </div>

                  {/* Visitor Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Primary Visitor Full Name
                    </label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Enter legal name matching photo ID"
                      required
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Visitor Nationality */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Nationality Category
                    </label>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Indian">Indian Citizen (₹{currentPricing.indianRate})</option>
                      <option value="SAARC/BIMSTEC">SAARC / BIMSTEC Citizen (₹{currentPricing.saarcBimstecRate})</option>
                      <option value="Foreign Tourist">Foreign Tourist (₹{currentPricing.foreignRate})</option>
                    </select>
                  </div>

                  {/* ID Proof Type */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Government ID Type
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID">Voter ID Card</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Student ID">Student Identity Card</option>
                    </select>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Photo ID Number
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="e.g. 5241-XXXX-9901"
                      required
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Number of Adults */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Adult Visitors (Age 15+)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={adultCount}
                      onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Number of Children (Free) */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Children (Below 15 Years)</span>
                      <span className="text-emerald-400 font-bold text-[10px]">FREE ENTRY</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={childCount}
                      onChange={(e) => setChildCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Additional Add-ons */}
                <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                  <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Official Add-on Passes:
                  </div>

                  {currentPricing.domeFee && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={domeAccess}
                        onChange={(e) => setDomeAccess(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                      />
                      <span className="text-xs text-stone-200">
                        Include Main Mausoleum / Upper Cenotaph Chamber Access (+₹{currentPricing.domeFee}/adult)
                      </span>
                    </label>
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAudio}
                      onChange={(e) => setIncludeAudio(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                    />
                    <span className="text-xs text-stone-200">
                      Include Official ASI Digital Audio Guide on Smartphone (+₹100/adult)
                    </span>
                  </label>
                </div>

                {/* Fee Breakdown & Submit */}
                <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-400">Total Entry Fee:</span>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      ₹{calculatedTotal}{' '}
                      <span className="text-xs text-stone-400 font-normal">
                        ({adultCount} Adults + {childCount} Free Children)
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-900/40 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Official ASI Pass</span>
                  </button>
                </div>
              </form>
            </div>

            {/* GENERATED E-TICKET CERTIFICATE */}
            {generatedTicket && (
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fade-in">
                {/* Watermark */}
                <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                  <Landmark className="w-80 h-80 text-white" />
                </div>

                {/* Ticket Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-500/30 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black">
                      <Landmark className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                        Archaeological Survey of India • PayGov Pass
                      </div>
                      <h3 className="text-xl font-black text-white">{generatedTicket.monumentName}</h3>
                      <div className="text-xs text-stone-400">{generatedTicket.circle}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Reference Ticket ID</div>
                    <div className="text-sm font-mono font-bold text-amber-400 bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
                      {generatedTicket.ticketId}
                    </div>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-stone-800 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Visitor Name</span>
                    <span className="text-white font-bold">{generatedTicket.visitorName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">ID Proof</span>
                    <span className="text-stone-200">{generatedTicket.idProof}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Visit Date</span>
                    <span className="text-amber-300 font-mono font-bold">{generatedTicket.visitDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Time Slot</span>
                    <span className="text-stone-200">{generatedTicket.slot.split('(')[0]}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Category</span>
                    <span className="text-stone-200">{generatedTicket.nationality}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Pax</span>
                    <span className="text-stone-200">
                      {generatedTicket.adultCount} Adults, {generatedTicket.childCount} Child
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Dome Access</span>
                    <span className={generatedTicket.domeAccess ? 'text-emerald-400 font-bold' : 'text-stone-400'}>
                      {generatedTicket.domeAccess ? 'Included (Main Crypt)' : 'Standard Only'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Total Paid</span>
                    <span className="text-amber-400 font-mono font-black text-base">₹{generatedTicket.totalAmount}</span>
                  </div>
                </div>

                {/* QR Code Verification Section */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg">
                      <QrCode className="w-20 h-20 text-stone-950" />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED DIGITAL PASS</span>
                      </div>
                      <p className="text-[11px] text-stone-400 max-w-xs leading-relaxed">
                        Scan at turnstile barcode reader. Carry original government photo ID. No polythene bags or
                        tripods without prior permission.
                      </p>
                      <div className="text-[10px] font-mono text-stone-500">
                        Booked: {generatedTicket.bookedAt} (IST)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Pass</span>
                    </button>
                    <button
                      onClick={() => {
                        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedTicket, null, 2));
                        const dl = document.createElement('a');
                        dl.setAttribute('href', dataStr);
                        dl.setAttribute('download', `${generatedTicket.ticketId}.json`);
                        dl.click();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Digital Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: REAL 3D VIRTUAL HERITAGE EXPLORER */}
        {/* ============================================================== */}
        {activeTab === '3d-view' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Real 3D Virtual Monument Reconstruction</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Interactive WebGL Three.js PBR rendering with Archaeo-sun daylight cycle, LiDAR laser scan & hotspots
                </p>
              </div>

              {/* Monument Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {unescoMonumentsList.slice(0, 8).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected3DMonument(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selected3DMonument.id === m.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Upgraded 3D Viewer */}
            <Monument3DViewer
              monument={selected3DMonument}
              onSelectMonument={(m) => setSelected3DMonument(m)}
            />

            {/* Archaeological Telemetry Analysis Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Astronomical Orientation</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Engineered along cardinal solsticial azimuths. Konark aligns with the spring equinox dawn, while Sanchi
                  Toranas face true North, South, East, and West according to ancient Vaastu Shastra astronomical canons.
                </p>
              </div>

              <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Layers className="w-4 h-4" />
                  <span>LiDAR & Photogrammetry</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  ASI employs millimeter-precision terrestrial laser scanning (TLS) to map structural micro-cracks, dome
                  thrust vectors, and mortar joinery before undertaking chemical and architectural consolidation.
                </p>
              </div>

              <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Structural Integrity</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Built without cement or binding mortar, utilizing gravitational interlocking stone dowels, iron clamps,
                  and ashlar dry masonry that allows dynamic flexibility during seismic tremors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ASI SITE MUSEUMS & EXCAVATED ANTIQUITIES */}
        {/* ============================================================== */}
        {activeTab === 'museums' && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white">Archaeological Survey of India Site Museums</h2>
              <p className="text-xs text-stone-400 leading-relaxed mt-1">
                ASI operates over 45 on-site archaeological museums established right beside famous excavation sites to
                preserve artifacts in their original geographical and cultural context.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {asiMuseums.map((museum) => (
                <div
                  key={museum.id}
                  className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={museum.image}
                        alt={museum.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold bg-stone-950/80 px-2 py-0.5 rounded-md">
                            Estd. {museum.establishedYear}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{museum.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-stone-300 leading-relaxed">{museum.description}</p>

                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          Key Antiquities on Display:
                        </div>
                        <div className="space-y-2">
                          {museum.keyAntiquities.map((item, idx) => (
                            <div key={idx} className="bg-stone-950/70 p-2.5 rounded-2xl border border-stone-800 text-xs">
                              <div className="font-bold text-stone-100">{item.name}</div>
                              <div className="text-[10px] text-amber-400/90 font-mono">
                                {item.era} • {item.material}
                              </div>
                              <div className="text-[11px] text-stone-400 mt-1 leading-snug">{item.significance}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-800/80 mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>
                      🕒 {museum.timings} (Closed: {museum.closedOn})
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {museum.ticketFee.indian === 0 ? 'Free / Included' : `₹${museum.ticketFee.indian}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SCIENTIFIC CONSERVATION & EXCAVATIONS */}
        {/* ============================================================== */}
        {activeTab === 'conservation' && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white">Scientific Conservation & Archaeological Excavation Projects</h2>
              <p className="text-xs text-stone-400 leading-relaxed mt-1">
                Pioneering scientific restoration, ancient DNA genome mapping, marine archaeology, and structural
                stabilization across India’s timeless monuments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {asiConservationProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        {project.status} • {project.era}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{project.title}</h3>
                      <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>
                          {project.monument}, {project.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{project.details}</p>

                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800 space-y-1.5 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-mono block">Scientific Methodology</span>
                      <span className="text-amber-300 font-medium">{project.scientificTechnique}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-mono block">Conserving Authority</span>
                      <span className="text-stone-300">{project.leadWing}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: EPIGRAPHY & ANCIENT INSCRIPTIONS */}
        {/* ============================================================== */}
        {activeTab === 'epigraphy' && (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white">Epigraphia Indica & Ancient Epigraphical Archives</h2>
              <p className="text-xs text-stone-400 leading-relaxed mt-1">
                The Epigraphy Branch of the ASI (established 1887) has deciphered over 100,000 stone inscriptions and
                copper plates in Sanskrit, Prakrit, Old Tamil, Telugu, Kannada, Arabic, and Persian.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {asiEpigraphyRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        {rec.script} • {rec.language}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{rec.title}</h3>
                      <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>
                          {rec.findspot} ({rec.period})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{rec.summary}</p>

                  <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-amber-900/40 font-serif italic text-amber-200/90 text-xs leading-relaxed">
                    {rec.translationSnippet}
                  </div>

                  <div className="text-[10px] font-mono text-stone-500 flex items-center justify-between pt-2 border-t border-stone-800">
                    <span>Dynasty: {rec.dynasty}</span>
                    <span>Discovered: {rec.discoveredYear} CE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: AMASR ACT 1958/2010 & CITIZEN GUIDELINES */}
        {/* ============================================================== */}
        {activeTab === 'rules' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-stone-900/90 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">The AMASR Act 1958 (Amended 2010)</h2>
                  <p className="text-xs text-stone-400">
                    Statutory Heritage Protection Regulations governed by National Monuments Authority (NMA) & ASI
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Protected Heritage Buffer Zones:
                </h3>
                {amasrActSummary.zones.map((z, idx) => (
                  <div key={idx} className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-100 text-xs">{z.zone}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {z.radius}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{z.rules}</p>
                  </div>
                ))}
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-rose-300 block mb-0.5">Penalties for Heritage Vandalism:</span>
                  <p className="text-stone-300 leading-relaxed">{amasrActSummary.penalties}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Free Admission Days & National Concessions:
                </h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  {amasrActSummary.freeEntryRules.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
