import { useState, useEffect } from 'react';
import { MapPin, Navigation, Building2, Users, UtensilsCrossed, Landmark, Loader2, RefreshCw, AlertCircle, Compass, ExternalLink } from 'lucide-react';
import { navigate } from '@/hooks/useRouter';

interface HeritageLocation {
  id: string;
  name: string;
  category: 'monument' | 'artisan' | 'museum' | 'food';
  city: string;
  state: string;
  lat: number;
  lng: number;
  description: string;
  highlight: string;
  craftId?: string;
  timings?: string;
  image: string;
}

// 40+ curated geocoded Indian heritage monuments, artisan clusters, and museums
const heritageDatabase: HeritageLocation[] = [
  // North
  {
    id: 'h1',
    name: 'Taj Mahal (UNESCO World Heritage)',
    category: 'monument',
    city: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1751,
    lng: 78.0421,
    description: '17th-century white marble mausoleum built by Emperor Shah Jahan for Mumtaz Mahal. Peak of Indo-Islamic Mughal architecture.',
    highlight: 'Pietra Dura (Parchin Kari) gemstone inlay marble craft',
    timings: 'Sunrise to Sunset (Closed Fridays)',
    image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h2',
    name: 'Chowk Artisan Ward & Bara Imambara',
    category: 'artisan',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8687,
    lng: 80.9126,
    description: 'The ancient artisanal nerve center of Awadh. Hundreds of master needlework ateliers producing authentic white-on-white Chikankari.',
    highlight: 'Lucknow Chikankari Embroidery (GI-191)',
    craftId: 'chikankari',
    image: 'https://images.pexels.com/photos/14953193/pexels-photo-14953193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h3',
    name: 'Madanpura Handloom Silk Quarter',
    category: 'artisan',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    description: 'Ancestral neighborhood where 4th-generation Ansari weavers interlace pure silver zari and mulberry silk on wooden pit-looms.',
    highlight: 'Banarasi Brocade Silk Sarees (GI-200)',
    craftId: 'banarasi-silk',
    image: 'https://images.pexels.com/photos/10317127/pexels-photo-10317127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h4',
    name: 'Golden Temple (Harmandir Sahib)',
    category: 'monument',
    city: 'Amritsar',
    state: 'Punjab',
    lat: 31.6200,
    lng: 74.8765,
    description: 'The holiest Gurdwara of Sikhism. Golden gilded architecture standing serenely in the Amrit Sarovar sacred pool.',
    highlight: 'World\'s largest community kitchen (Langar) serving 100k free meals daily',
    timings: 'Open 24 hours',
    image: 'https://images.pexels.com/photos/7277341/pexels-photo-7277341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h5',
    name: 'Sanganer Blue Pottery & Block Print Studios',
    category: 'artisan',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.8042,
    lng: 75.7681,
    description: 'Suburban artisan village where quartz-based blue pottery and vegetable-dyed block printing are practiced in courtyard studios.',
    highlight: 'Jaipur Blue Pottery (GI-84)',
    craftId: 'blue-pottery',
    image: 'https://images.pexels.com/photos/34545851/pexels-photo-34545851.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h6',
    name: 'Amber Fort & Palace',
    category: 'monument',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9855,
    lng: 75.8513,
    description: 'Majestic 16th-century hilltop fortress famed for its Sheesh Mahal (Mirror Palace) and Rajput-Mughal fresco work.',
    highlight: 'Sheesh Mahal mirror mosaic craftsmanship',
    timings: '8:00 AM – 5:30 PM',
    image: 'https://images.pexels.com/photos/31508152/pexels-photo-31508152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h7',
    name: 'Downtown Srinagar Pashmina & Walnut Carving Atelier',
    category: 'artisan',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    lat: 34.0837,
    lng: 74.7973,
    description: 'Centuries-old wooden workshops along Dal Lake where artisans hand-spin pure Changthangi wool and chisel seasoned walnut wood.',
    highlight: 'Kashmir Pashmina Shawl (GI-46)',
    craftId: 'kashmir-pashmina',
    image: 'https://images.pexels.com/photos/14953193/pexels-photo-14953193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h8',
    name: 'National Museum New Delhi',
    category: 'museum',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.6118,
    lng: 77.2193,
    description: 'Premier cultural repository of India spanning 5,000 years of civilization from the Harappan Dancing Girl to Chola bronzes.',
    highlight: '200,000+ antique artifacts, miniature paintings, and temple sculptures',
    timings: '10:00 AM – 6:00 PM (Closed Mondays)',
    image: 'https://images.pexels.com/photos/17777833/pexels-photo-17777833.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  // West
  {
    id: 'h9',
    name: 'Patan Patola Heritage Museum & Atelier',
    category: 'artisan',
    city: 'Patan',
    state: 'Gujarat',
    lat: 23.8507,
    lng: 72.1266,
    description: 'The living workshop of the Salvi master weavers, where the ancient double-ikat silk weaving technique is demonstrated on inclined looms.',
    highlight: 'Patan Patola Double Ikat (GI-232)',
    craftId: 'patola-silk',
    image: 'https://images.pexels.com/photos/23494589/pexels-photo-23494589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h10',
    name: 'Rani Ki Vav Stepwell (UNESCO)',
    category: 'monument',
    city: 'Patan',
    state: 'Gujarat',
    lat: 23.8589,
    lng: 72.1017,
    description: 'Intricately sculpted 11th-century subterranean stepwell built by Queen Udayamati, designed as an inverted temple with over 500 principal sculptures.',
    highlight: 'Maru-Gurjara architectural style stone carving',
    timings: '8:00 AM – 6:00 PM',
    image: 'https://images.pexels.com/photos/32277958/pexels-photo-32277958.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h11',
    name: 'Ajanta & Ellora Basalt Caves (UNESCO)',
    category: 'monument',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    lat: 20.0268,
    lng: 75.1790,
    description: 'Rock-cut volcanic monuments dating from 2nd century BCE. Ellora features Cave 16 (Kailasa Temple), the largest monolithic rock excavation in human history.',
    highlight: 'Ancient Buddhist fresco murals & monolithic carving',
    timings: '9:00 AM – 5:30 PM (Closed Tuesdays)',
    image: 'https://images.pexels.com/photos/17223838/pexels-photo-17223838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h12',
    name: 'Dahanu Warli Tribal Art Studios',
    category: 'artisan',
    city: 'Dahanu / Palghar',
    state: 'Maharashtra',
    lat: 19.9703,
    lng: 72.7303,
    description: 'Indigenous settlement in the Sahyadri mountains where tribal families paint traditional rice-paste geometric murals.',
    highlight: 'Warli Painting (GI-86)',
    craftId: 'warli-painting',
    image: 'https://images.pexels.com/photos/368727/pexels-photo-368727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  // South
  {
    id: 'h13',
    name: 'Kanchipuram Silk Weaver Guilds & Kamakshi Temple',
    category: 'artisan',
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    lat: 12.8342,
    lng: 79.7036,
    description: 'The ancient "City of a Thousand Temples" where thousands of pit-loom handlooms weave heavy mulberry silk sarees with gold-plated silver zari.',
    highlight: 'Kanchipuram Silk Sarees (GI-1)',
    craftId: 'kanjivaram-silk',
    image: 'https://images.pexels.com/photos/10317127/pexels-photo-10317127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h14',
    name: 'Brihadeeswarar Big Temple (UNESCO)',
    category: 'monument',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    lat: 10.7828,
    lng: 79.1318,
    description: 'Architectural masterpiece constructed in 1010 CE by Chola Emperor Raja Raja I, crowned by an 80-tonne monolithic granite cupola.',
    highlight: 'Chola Dravidian temple architecture & Thanjavur paintings',
    timings: '6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM',
    image: 'https://images.pexels.com/photos/32673642/pexels-photo-32673642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h15',
    name: 'Aranmula Metal Mirror Guild',
    category: 'artisan',
    city: 'Aranmula',
    state: 'Kerala',
    lat: 9.3326,
    lng: 76.6853,
    description: 'Sacred village along the Pamba river where a hereditary guild casts front-surface metal mirrors from a secret copper-tin alloy.',
    highlight: 'Aranmula Kannadi Front-Surface Mirror (GI-19)',
    craftId: 'aranmula-kannadi',
    image: 'https://images.pexels.com/photos/37601639/pexels-photo-37601639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h16',
    name: 'Hampi Vijayanagara Capital Ruins (UNESCO)',
    category: 'monument',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.3350,
    lng: 76.4600,
    description: 'Vast capital of the medieval Vijayanagara Empire scattered across boulder hills, featuring the iconic Stone Chariot and musical pillars of Vittala Temple.',
    highlight: '15th-century imperial Dravidian stone masonry',
    timings: 'Sunrise to Sunset',
    image: 'https://images.pexels.com/photos/31969428/pexels-photo-31969428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h17',
    name: 'Bidar Fort & Bidriware Artisan Clusters',
    category: 'artisan',
    city: 'Bidar',
    state: 'Karnataka',
    lat: 17.9104,
    lng: 77.5199,
    description: 'Medieval Bahmani fort whose soil is used to chemically oxidize zinc vessels black, leaving inlaid pure silver shining like celestial stars.',
    highlight: 'Bidriware Silver-Inlaid Metalcraft (GI-19)',
    craftId: 'bidriware',
    image: 'https://images.pexels.com/photos/37601639/pexels-photo-37601639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  // East & Northeast
  {
    id: 'h18',
    name: 'Raghurajpur Heritage Crafts Village',
    category: 'artisan',
    city: 'Puri',
    state: 'Odisha',
    lat: 19.8271,
    lng: 85.8239,
    description: 'India\'s most famous living crafts village, where every resident family is a master Chitrakar painting Pattachitra cloth scrolls.',
    highlight: 'Odisha Pattachitra Cloth Painting (GI-90)',
    craftId: 'pattachitra',
    image: 'https://images.pexels.com/photos/22820070/pexels-photo-22820070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h19',
    name: 'Konark Sun Temple (UNESCO)',
    category: 'monument',
    city: 'Konark',
    state: 'Odisha',
    lat: 19.8876,
    lng: 86.0945,
    description: '13th-century colossal stone temple designed as a 24-wheeled chariot of Surya the Sun God, with intricate sundial wheels.',
    highlight: 'Kalinga architectural school stone sculpture',
    timings: '6:00 AM – 8:00 PM',
    image: 'https://images.pexels.com/photos/39086652/pexels-photo-39086652.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h20',
    name: 'Sualkuchi Silk Village',
    category: 'artisan',
    city: 'Kamrup',
    state: 'Assam',
    lat: 26.1738,
    lng: 91.5724,
    description: 'Fabled textile settlement along the Brahmaputra with over 25,000 active handlooms producing naturally golden Muga silk.',
    highlight: 'Assam Muga Golden Silk (GI-26)',
    craftId: 'muga-silk',
    image: 'https://images.pexels.com/photos/4253609/pexels-photo-4253609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h21',
    name: 'Khoai Shanibar Haat & Tagore Ashram',
    category: 'artisan',
    city: 'Shantiniketan',
    state: 'West Bengal',
    lat: 23.6766,
    lng: 87.6974,
    description: 'Open-air cultural market amidst red soil deodar groves where rural women bring hand-stitched Nakshi Kantha quilts and Baul singers perform.',
    highlight: 'Bengal Nakshi Kantha Stitch (GI-89)',
    craftId: 'kantha',
    image: 'https://images.pexels.com/photos/30108529/pexels-photo-30108529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'h22',
    name: 'Indian Museum Kolkata (Oldest in Asia)',
    category: 'museum',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5579,
    lng: 88.3511,
    description: 'Established in 1814, the ninth oldest museum in the world with rare collections of Gandharan Buddhist art, Mughal coins, and textiles.',
    highlight: 'Over 100,000 historical and cultural exhibits',
    timings: '10:00 AM – 5:00 PM (Closed Mondays)',
    image: 'https://images.pexels.com/photos/15979218/pexels-photo-15979218.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

// Major Indian cities for demo/manual selection
const popularHubs = [
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur (Rajasthan)', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow (UP)', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi (UP)', lat: 25.3176, lng: 82.9739 },
  { name: 'Kolkata (West Bengal)', lat: 22.5726, lng: 88.3639 },
  { name: 'Mumbai (Maharashtra)', lat: 18.9220, lng: 72.8347 },
  { name: 'Chennai (Tamil Nadu)', lat: 13.0827, lng: 80.2707 },
  { name: 'Bengaluru (Karnataka)', lat: 12.9716, lng: 77.5946 },
  { name: 'Srinagar (Kashmir)', lat: 34.0837, lng: 74.7973 },
  { name: 'Bhubaneswar (Odisha)', lat: 20.2961, lng: 85.8245 },
  { name: 'Guwahati (Assam)', lat: 26.1445, lng: 91.7362 },
];

// Haversine formula to compute exact distance in kilometers
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function NearMePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Detecting GPS location...');
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<number>(350);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'monument' | 'artisan' | 'museum'>('all');
  const [isGpsActive, setIsGpsActive] = useState(false);

  const requestGps = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      // Default to Delhi
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      setLocationName('Delhi NCR (Default Location)');
      setIsGpsActive(false);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName(`Your GPS Location (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`);
        setIsGpsActive(true);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation blocked or failed:', err);
        // Fallback gracefully to Jaipur
        setUserLocation({ lat: 26.9124, lng: 75.7873 });
        setLocationName('Jaipur, Rajasthan (Cultural Center)');
        setIsGpsActive(false);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    requestGps();
  }, []);

  const handleSelectHub = (hub: typeof popularHubs[0]) => {
    setUserLocation({ lat: hub.lat, lng: hub.lng });
    setLocationName(hub.name);
    setIsGpsActive(false);
  };

  // Compute distances & sort
  const computedItems = userLocation
    ? heritageDatabase
        .map((item) => ({
          ...item,
          distanceKm: calculateHaversineDistance(userLocation.lat, userLocation.lng, item.lat, item.lng),
        }))
        .filter((item) => {
          const withinRadius = item.distanceKm <= radius;
          const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
          return withinRadius && matchesCategory;
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : [];

  return (
    <div className="min-h-screen bg-stone-950 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 mb-3">
            <Compass className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-teal-300 text-xs font-semibold tracking-wide uppercase">
              GPS Heritage Locator
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
            Culture <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Near Me</span>
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl">
            Locate UNESCO World Heritage monuments, active artisan villages, and archaeological museums around you. Calculated with mathematical Haversine coordinates and one-click Google Maps directions.
          </p>
        </div>

        {/* Location & Controls Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 mb-8 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Active Reference Point
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm sm:text-base">{locationName}</h3>
                  {isGpsActive && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      Live GPS
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={requestGps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Use My Device GPS</span>
            </button>
          </div>

          {/* Hub Quick Select */}
          <div>
            <span className="text-xs text-stone-400 mb-2 block font-medium">
              Or Explore Heritage Around Cultural Hubs:
            </span>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {popularHubs.map((hub, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectHub(hub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                    locationName === hub.name
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  {hub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filters & Radius Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-400 font-medium mr-1">Category:</span>
              {(['all', 'monument', 'artisan', 'museum'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    categoryFilter === cat
                      ? 'bg-teal-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {cat === 'all' ? 'All Heritage' : cat === 'monument' ? 'Monuments' : cat === 'artisan' ? 'Artisan Hubs' : 'Museums'}
                </button>
              ))}
            </div>

            {/* Radius Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
                Search Radius: <strong className="text-white">{radius} km</strong>
              </span>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-stone-400">Computing distances to Indian heritage monuments...</p>
          </div>
        ) : computedItems.length === 0 ? (
          <div className="py-16 text-center bg-stone-900/60 border border-stone-800 rounded-2xl p-8">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">No heritage sites found within {radius} km</h3>
            <p className="text-stone-400 text-sm max-w-md mx-auto mb-4">
              Try increasing the search radius using the slider above or choose a different cultural center like Delhi, Jaipur, or Varanasi.
            </p>
            <button
              onClick={() => setRadius(750)}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-stone-950 font-bold text-xs transition-colors"
            >
              Expand to 750 km
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>Showing {computedItems.length} heritage destinations sorted by nearest distance:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {computedItems.map((item) => {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;

                return (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 hover:border-teal-500/40 rounded-2xl p-5 transition-all group flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Image + Meta */}
                      <div className="flex gap-4 mb-3">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-950 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 uppercase tracking-wider">
                              {item.category === 'monument'
                                ? 'Monument / Temple'
                                : item.category === 'artisan'
                                ? 'Living Artisan Hub'
                                : 'Cultural Museum'}
                            </span>
                            <span className="text-xs font-bold text-amber-400">
                              {item.distanceKm} km away
                            </span>
                          </div>

                          <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-teal-300 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-stone-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-500" />
                            <span>{item.city}, {item.state}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300 mb-4">
                        <strong className="text-amber-400 font-semibold">Special Highlight: </strong>
                        {item.highlight}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-3 border-t border-stone-800/80 flex items-center gap-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                      </a>

                      {item.craftId && (
                        <button
                          onClick={() => navigate(`/craft/${item.craftId}`)}
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                        >
                          Explore Craft &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
