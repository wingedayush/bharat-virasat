import { useState, useEffect } from 'react';
import { Users, MapPin, ArrowLeft, Award, Clock, Phone, MessageSquare, Package, Sparkles, ExternalLink, Check, Heart, ShieldCheck } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';
import { artisans } from '@/data/artisans';
import { crafts } from '@/data/crafts';
import { useProgress } from '@/hooks/useProgress';

export function ArtisansPage() {
  const [selectedCraft, setSelectedCraft] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const craftCategories = ['all', ...Array.from(new Set(artisans.map(a => a.craft)))];

  const filteredArtisans = artisans.filter((artisan) => {
    const matchesCraft = selectedCraft === 'all' || artisan.craft === selectedCraft;
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.craft.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCraft && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 mb-3">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
            <span className="text-rose-300 text-xs font-semibold tracking-wide uppercase">Direct Artisan Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
            Living Legends of <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Indian Craft</span>
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            Meet the master craftspeople preserving thousands of years of handmade wisdom. Connect directly with generational weavers, potters, and painters with 0% platform middlemen fees.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-8 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisan, village, craft, state..."
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="w-full sm:w-auto flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {craftCategories.slice(0, 6).map((craft) => (
              <button
                key={craft}
                onClick={() => setSelectedCraft(craft)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCraft === craft
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {craft === 'all' ? 'All Masters' : craft}
              </button>
            ))}
          </div>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="group relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all text-left shadow-xl flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => navigate(`/artisans/${artisan.id}`)}
                  className="aspect-[4/3] overflow-hidden relative cursor-pointer bg-stone-950"
                >
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {artisan.yearsOfExperience} yrs experience
                  </div>
                  {artisan.awards.length > 0 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{artisan.awards[0].split(' ')[0]} Awardee</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-2">
                    <h3
                      onClick={() => navigate(`/artisans/${artisan.id}`)}
                      className="text-white font-bold text-lg hover:text-amber-400 cursor-pointer transition-colors"
                    >
                      {artisan.name}
                    </h3>
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                      {artisan.craft}
                    </p>
                    <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-stone-500" /> {artisan.village}, {artisan.stateName}
                    </p>
                  </div>

                  <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-4">
                    {artisan.learningStory}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {artisan.products.slice(0, 3).map((prod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-[10px] text-stone-400"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-stone-800/80 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/artisans/${artisan.id}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors text-center"
                >
                  Full Story & Bio
                </button>

                {artisan.whatsapp && (
                  <a
                    href={`https://wa.me/${artisan.whatsapp}?text=${encodeURIComponent(
                      `Namaste ${artisan.name} ji! I discovered your profile on BharatVirasat and would like to inquire about your authentic handcrafted ${artisan.craft}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                    title="Connect on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArtisanDetailPage({ artisanId }: { artisanId: string }) {
  const artisan = artisans.find((a) => a.id === artisanId);
  const craft = artisan ? crafts.find((c) => c.id === artisan.craftId) : null;
  const { recordArtisanView } = useProgress();
  const [inquiryModal, setInquiryModal] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (artisan) {
      recordArtisanView(artisan.id);
    }
  }, [artisan, recordArtisanView]);

  if (!artisan) {
    return (
      <div className="min-h-screen bg-stone-950 pt-20 flex flex-col items-center justify-center">
        <p className="text-stone-400 mb-4">Artisan profile not found.</p>
        <button
          onClick={() => navigate('/artisans')}
          className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          &larr; Return to Artisan Directory
        </button>
      </div>
    );
  }

  const whatsappLink = artisan.whatsapp
    ? `https://wa.me/${artisan.whatsapp}?text=${encodeURIComponent(
        `Namaste ${artisan.name} ji! I am reaching out through BharatVirasat regarding your ${artisan.craft} collection.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/artisans')}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Artisan Directory
        </button>

        {/* Hero Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 aspect-[3/4] md:aspect-auto relative bg-stone-950">
              <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
            </div>

            <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Master Craftsperson
                  </span>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Verified Artisan
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{artisan.name}</h1>
                <p className="text-stone-400 text-sm flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>{artisan.village}, {artisan.stateName}</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <span className="text-xs text-stone-500 block">Experience</span>
                    <strong className="text-white text-base">{artisan.yearsOfExperience} Years</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <span className="text-xs text-stone-500 block">Craft Form</span>
                    <strong className="text-amber-400 text-sm font-semibold">{artisan.craft}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center col-span-2 sm:col-span-1">
                    <span className="text-xs text-stone-500 block">Direct Fee</span>
                    <strong className="text-emerald-400 text-sm font-semibold">0% Middlemen</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}

                <button
                  onClick={() => setInquiryModal(true)}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-colors"
                >
                  Commission Work
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Family Lineage & History</h2>
              <p className="text-sm text-stone-300 leading-relaxed">{artisan.familyHistory}</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">The Apprentice Journey</h2>
              <p className="text-sm text-stone-300 leading-relaxed italic">"{artisan.learningStory}"</p>
            </div>

            {/* Handcrafted Products */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Signature Handcrafted Collections</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {artisan.products.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <span className="text-xs text-stone-300 font-medium">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Honors & Recognitions */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Honors & Recognitions</span>
              </h3>
              <ul className="space-y-3">
                {artisan.awards.map((award, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Linked Craft */}
            {craft && (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-2">Heritage Craft Profile</h3>
                <p className="text-xs text-stone-400 mb-4">{craft.name} ({craft.giNumber || 'GI Heritage'})</p>
                <button
                  onClick={() => navigate(`/craft/${craft.id}`)}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold transition-colors"
                >
                  View Making Process & GI Tag &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commission Modal */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-900/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {inquirySent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-stone-400 mb-6">
                  Your direct request has been formatted for {artisan.name}. They typically respond within 24–48 hours.
                </p>
                <button
                  onClick={() => {
                    setInquirySent(false);
                    setInquiryModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Commission Custom Work</h3>
                <p className="text-xs text-stone-400 mb-4">
                  Inquire with master artisan {artisan.name} for bespoke handloom or artisanal pieces.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInquirySent(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Your Email or Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98..."
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Requested Piece or Custom Dimensions</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={`Tell ${artisan.name} what you would like crafted (e.g. Saree color, dimensions, timeline)...`}
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setInquiryModal(false)}
                      className="px-3 py-2 rounded-lg text-xs text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors"
                    >
                      Send Direct Message
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
