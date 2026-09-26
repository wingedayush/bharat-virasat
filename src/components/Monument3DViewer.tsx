import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Sun,
  Sparkles,
  Info,
  X,
  Camera,
  Layers,
  Compass,
  Download,
  CheckCircle2,
  Landmark,
  Ruler,
  Volume2,
  VolumeX,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { UnescoMonument, unescoMonumentsList } from '@/data/unescoMonuments';
import {
  createMarbleTexture,
  createRedSandstoneTexture,
  createBasaltRockTexture,
  createKhondaliteTexture,
  createGraniteTexture,
  createPavementTexture,
  createWaterTexture
} from '@/lib/threeTextures';

export interface Monument3DViewerProps {
  monument: UnescoMonument;
  onClose?: () => void;
  isModal?: boolean;
  onSelectMonument?: (monument: UnescoMonument) => void;
  onPlayAudioGuide?: (title: string, text: string, location?: string) => void;
}

export type RenderMode = 'realistic' | 'lidar' | 'blueprint' | 'cutaway';
export type CameraPreset = 'perspective' | 'eye-level' | 'aerial' | 'facade' | 'plan';

export interface HotspotData {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: string;
  dimensions?: string;
  asiNotes: string;
}

interface ScreenHotspot {
  id: string;
  index: number;
  x: number;
  y: number;
  visible: boolean;
  data: HotspotData;
}

// Comprehensive Architectural Hotspots mapped per monument typology
const monumentHotspotsMap: Record<string, HotspotData[]> = {
  'taj-mausoleum': [
    {
      id: 'taj-dome',
      index: 1,
      title: 'Grand Double Bulbous Dome',
      subtitle: 'Imperial White Makrana Marble',
      position: [0, 5.8, 0],
      cameraTarget: [0, 5.5, 0],
      cameraPosition: [0, 6.2, 5.5],
      description: 'The monumental central onion dome rises to 35 meters above the plinth, engineered as a double dome system allowing the high soaring exterior silhouette while maintaining harmonious acoustic proportions inside.',
      dimensions: 'Height: 35m | Outer Diameter: 17.6m | Makrana Marble',
      asiNotes: 'Cleaned periodically using Multani Mitti (Fuller’s Earth) clay poultice to preserve crystalline translucent luster.'
    },
    {
      id: 'taj-iwan',
      index: 2,
      title: 'Pishtaq & Pietra Dura Inlay Arch',
      subtitle: 'Parchin Kari Semi-Precious Gem Inlay',
      position: [0, 2.7, 2.0],
      cameraTarget: [0, 2.7, 1.9],
      cameraPosition: [0, 2.9, 4.0],
      description: 'The vaulted southern iwan portal is framed with Thuluth Arabic script inlaid in black marble and floral arabesques composed of jasper, jade, lapis lazuli, and carnelian.',
      dimensions: 'Portal Height: 33m | Stones: 28 semi-precious varieties',
      asiNotes: 'Laser-cleaned and mapped using photogrammetric telemetry by ASI Agra Circle.'
    },
    {
      id: 'taj-minarets',
      index: 3,
      title: 'Outward-Tilted Corner Minarets',
      subtitle: 'Seismic Safety Engineering',
      position: [3.4, 4.2, 3.4],
      cameraTarget: [3.4, 3.8, 3.4],
      cameraPosition: [5.2, 4.5, 6.0],
      description: 'Four octagonal minarets stand 42m tall. To protect the main mausoleum in the event of an earthquake, each minaret is intentionally tilted outward by approximately 2 degrees.',
      dimensions: 'Height: 42m each | Tiers: 3 balconies with stalactite corbelling',
      asiNotes: 'Continuous structural plumb-line and tilt sensors monitored monthly by ASI Surveyors.'
    },
    {
      id: 'taj-pool',
      index: 4,
      title: 'Charbagh Reflecting Lotus Pool',
      subtitle: 'Mughal Paradise Garden Waterway',
      position: [0, 0.4, 4.6],
      cameraTarget: [0, 0.3, 4.4],
      cameraPosition: [0, 2.2, 8.5],
      description: 'The raised marble lotus water basin (Al Hawd al-Kawthar) mirrors the ivory facade symmetrically, fed by an ancient gravity-fed copper pipe hydraulic system from the Yamuna River.',
      dimensions: 'Pool Dimensions: 26m x 38m | Depth: 1.2m',
      asiNotes: 'Water circulation filtration restored in collaboration with CPWD & ASI Heritage Hydraulic Wing.'
    }
  ],
  'konark-wheel': [
    {
      id: 'konark-gnomon',
      index: 1,
      title: 'Astronomical Sundial Axle (Gnomon)',
      subtitle: 'Minute-Precision Solar Shadow Timekeeping',
      position: [0, 3.6, 0.85],
      cameraTarget: [0, 3.6, 0.8],
      cameraPosition: [0, 4.0, 3.8],
      description: 'The central axle pin acts as a precise solar gnomon. As the sun traverses the sky, the shadow falls upon the 8 major and 8 minor spokes, measuring time down to a single Vighatika (24 seconds).',
      dimensions: 'Axle Diameter: 90cm | Shadow Accuracy: Within 3 minutes of IST',
      asiNotes: 'Archaeological Survey of India astronomical study confirms the wheel aligns precisely with the equinoctial sunrise.'
    },
    {
      id: 'konark-spokes',
      index: 2,
      title: '8 Major Spokes & Carved Medallions',
      subtitle: 'Eight Praharas of Human Daily Life',
      position: [1.65, 3.6, 0],
      cameraTarget: [1.65, 3.6, 0],
      cameraPosition: [3.2, 3.8, 3.0],
      description: 'Each major spoke features sculpted roundels depicting scenes from the 8 praharas (3-hour periods) of the day: morning aarti, trade, music, court assembly, and evening rest.',
      dimensions: 'Wheel Diameter: 3.3m | Number of Wheels: 24 on temple plinth',
      asiNotes: 'Khondalite sandstone stabilized against coastal salt sea spray by ASI Bhubaneswar Circle.'
    },
    {
      id: 'konark-horses',
      index: 3,
      title: 'Galloping Solar Chariot Horses',
      subtitle: 'Seven Days of the Cosmic Week',
      position: [-3.5, 1.6, 0],
      cameraTarget: [-3.5, 1.5, 0],
      cameraPosition: [-5.0, 2.4, 2.5],
      description: 'Seven rearing stone horses pull the cosmic chariot of Lord Surya toward the dawn, symbolizing the seven days of the week and the seven sacred meters of Sanskrit poetry (Chandas).',
      dimensions: 'Chariot Base Length: 42m | Plinth Height: 4m',
      asiNotes: 'Endoscopic ultrasonic testing conducted to reinforce internal stone joints.'
    }
  ],
  'qutub-minaret': [
    {
      id: 'qutub-balconies',
      index: 1,
      title: 'Stalactite Muqarnas Balconies',
      subtitle: 'Early Indo-Islamic Sandstone Corbelling',
      position: [0, 4.5, 0],
      cameraTarget: [0, 4.4, 0],
      cameraPosition: [0, 5.0, 3.8],
      description: 'Projecting cantilevered balconies supported by clustered miniature arch-and-bracket corbels with Arabic inscriptions and ornate geometric stalactite patterns.',
      dimensions: 'Tower Height: 72.5m | Storeys: 5 Tapering Sections',
      asiNotes: 'Lightning arrestors and structural incline sensors installed by ASI Delhi Circle.'
    },
    {
      id: 'qutub-pillar',
      index: 2,
      title: '1600-Year Rustless Iron Pillar',
      subtitle: 'Gupta Metallurgical Marvel (King Chandra)',
      position: [2.8, 1.7, 1.8],
      cameraTarget: [2.8, 1.7, 1.8],
      cameraPosition: [4.2, 2.2, 3.8],
      description: 'Erected c. 400 CE by Chandragupta II Vikramaditya. Composed of 99.7% pure wrought iron with high phosphorus content that formed a protective misawite iron oxide layer, preventing corrosion for 16 centuries.',
      dimensions: 'Height: 7.21m | Weight: Over 6,000 kg | Pure Wrought Iron',
      asiNotes: 'Subject of landmark metallurgical studies by IIT Kanpur and ASI Materials Laboratory.'
    },
    {
      id: 'qutub-fluting',
      index: 3,
      title: 'Alternating Angular & Rounded Fluting',
      subtitle: 'Chiseled Red Sandstone Geometry',
      position: [0, 2.2, 1.3],
      cameraTarget: [0, 2.2, 0],
      cameraPosition: [0, 2.6, 3.6],
      description: 'The lowest storey features alternating semicircular and angular vertical flutings carved into red Agra sandstone, creating dramatic shadow interplay under shifting sunlight.',
      dimensions: 'Base Diameter: 14.3m | Top Diameter: 2.7m',
      asiNotes: 'Restored under Firoz Shah Tughlaq in 1368 and preserved continuously by ASI.'
    }
  ],
  'rock-cut-caves': [
    {
      id: 'ellora-scarp',
      index: 1,
      title: 'Top-Down Monolithic Excavation Scarp',
      subtitle: '200,000 Tonnes of Basalt Carved from Mountain',
      position: [-4.6, 5.5, 0],
      cameraTarget: [-4.6, 4.5, 0],
      cameraPosition: [-6.0, 6.5, 4.0],
      description: 'Carved completely top-down from the basalt cliff face of the Charanandri Hills under Rashtrakuta King Krishna I (c. 756–773 CE). Masons excavated over 200,000 tonnes of solid rock without scaffolding.',
      dimensions: 'Courtyard Trench: 82m long x 46m wide x 32m deep',
      asiNotes: 'Rock-face stabilization with stainless steel tie-backs by ASI Science Branch.'
    },
    {
      id: 'ellora-vimana',
      index: 2,
      title: 'Monolithic Kailasa Shikhara Spire',
      subtitle: 'Abode of Shiva Carved from Single Living Rock',
      position: [0, 4.5, -1.0],
      cameraTarget: [0, 4.0, -1.0],
      cameraPosition: [0, 5.5, 3.5],
      description: 'The monumental tiered pyramid rises above the sanctum sanctorum (garbhagriha), symbolizing Mount Meru. Built entirely with precision interlocking dry-masonry granite blocks without cement.',
      dimensions: 'Vimana Height: 30m | 6 Tiers of Relief Sculptures',
      asiNotes: '3D terrestrial LiDAR scanning mapped internal sanctum load-bearing columns.'
    },
    {
      id: 'ellora-pillar',
      index: 3,
      title: 'Dhwaja Stambha (Monolithic Victory Pillar)',
      subtitle: '15-Meter Free-Standing Basalt Monolith',
      position: [2.4, 3.0, 1.8],
      cameraTarget: [2.4, 2.8, 1.8],
      cameraPosition: [3.8, 3.5, 4.2],
      description: 'Two gigantic victory pillars stand in the forecourt, carved in situ from the native rock with intricate trishula emblems and floral bands.',
      dimensions: 'Height: 15.5m carved from courtyard rock bed',
      asiNotes: 'Surface consolidation and biocidal treatment applied annually.'
    }
  ],
  'vimana-temple': [
    {
      id: 'vimana-kumbam',
      index: 1,
      title: '80-Tonne Monolithic Granite Kumbam',
      subtitle: 'Single Block Cupola Atop 66-Meter Vimana',
      position: [0, 8.2, 0],
      cameraTarget: [0, 8.0, 0],
      cameraPosition: [0, 8.8, 4.5],
      description: 'The apex cupola (kumbam) was carved from a single 80-tonne granite boulder and hauled up a 6-kilometer earthen ramp by elephants during Rajaraja Chola I’s reign (1010 CE).',
      dimensions: 'Weight: 80 Tonnes | Tower Height: 66m (13 Tiers)',
      asiNotes: 'Shadow of the vimana apex was engineered not to fall outside the sanctum at solar noon.'
    },
    {
      id: 'vimana-mandapa',
      index: 2,
      title: 'Yali Carved Granite Colonnade',
      subtitle: 'Acoustic Musical & Mythological Monoliths',
      position: [1.15, 1.2, 3.0],
      cameraTarget: [1.15, 1.2, 3.0],
      cameraPosition: [2.6, 1.8, 4.6],
      description: 'Monolithic pillars carved with rearing Yalis (celestial lion-elephant beasts) and tuned hollow musical shafts that resonate acoustic notes when gently tapped.',
      dimensions: 'Pillars: 56 carved monolithic shafts | Solid Granite',
      asiNotes: 'Acoustic frequency spectrum documented by ASI Musicology Division.'
    }
  ],
  'buddhist-stupa': [
    {
      id: 'stupa-torana',
      index: 1,
      title: 'Carved Sandstone Torana Gateway',
      subtitle: 'Jataka Tales in Low-Relief Stone Joinery',
      position: [0, 2.0, 5.1],
      cameraTarget: [0, 2.0, 5.0],
      cameraPosition: [0, 2.6, 8.5],
      description: 'Four monumental gateways oriented toward the cardinal directions. Three architraves joined by carved balusters depict the life of the Buddha, Yakshis, and royal processions.',
      dimensions: 'Gateway Height: 10m | 4 Gateways at Cardinal Points',
      asiNotes: 'Cleaned with non-ionic biocide by ASI Bhopal Circle.'
    },
    {
      id: 'stupa-harmika',
      index: 2,
      title: 'Square Harmika & Triple Chhatras',
      subtitle: 'Three Jewels: Buddha, Dharma, Sangha',
      position: [0, 5.8, 0],
      cameraTarget: [0, 5.5, 0],
      cameraPosition: [0, 6.2, 4.5],
      description: 'Surmounting the hemispherical Anda dome is the square Harmika balustrade, from which rises the Yashti shaft bearing three umbrellas (Chhatras) signifying divine sovereignty.',
      dimensions: 'Anda Diameter: 36m | Total Height: 16.4m',
      asiNotes: 'Stone joints sealed with lime-surkhi hydraulic mortar.'
    }
  ],
  'fort-bastions': [
    {
      id: 'fort-ramparts',
      index: 1,
      title: 'Crenellated Curtain Walls & Merlons',
      subtitle: 'Defensive Military Rajput-Mughal Fortification',
      position: [0, 3.2, 1.0],
      cameraTarget: [0, 3.1, 0.9],
      cameraPosition: [0, 4.0, 4.8],
      description: 'Massive ashlar masonry ramparts equipped with arrow slits, cannon embrasures, and machicolations designed to withstand siege artillery and cavalry assaults.',
      dimensions: 'Wall Thickness: Up to 5 meters | Bastion Diameter: 3.4m',
      asiNotes: 'Rampart stone grouting with lime-surkhi mortar ongoing by ASI Jaipur Circle.'
    },
    {
      id: 'fort-tower',
      index: 2,
      title: 'Vijay Stambha (Tower of Victory)',
      subtitle: '9-Storey Commemorative Rajput Minaret',
      position: [-1.8, 3.6, -2.2],
      cameraTarget: [-1.8, 3.5, -2.2],
      cameraPosition: [-1.8, 4.2, 2.2],
      description: 'Erected by Rana Kumbha in 1448 CE to celebrate victory over the combined armies of Malwa and Gujarat. Features nine storeys decorated with intricate Hindu mythological icons.',
      dimensions: 'Height: 37.19m | Steps: 157 narrow spiral steps',
      asiNotes: 'Seismic telemetry sensors monitored by ASI Jaipur Circle.'
    }
  ]
};

export function Monument3DViewer({
  monument,
  onClose,
  isModal = false,
  onSelectMonument,
  onPlayAudioGuide
}: Monument3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('realistic');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [autoRotate, setAutoRotate] = useState(true);
  const [sunHour, setSunHour] = useState<number>(16); // 4:00 PM Golden Hour default
  const [activeHotspot, setActiveHotspot] = useState<HotspotData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMeasureHud, setShowMeasureHud] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedMonumentId, setSelectedMonumentId] = useState(monument.id);
  const [screenHotspots, setScreenHotspots] = useState<ScreenHotspot[]>([]);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lidarPointsRef = useRef<THREE.Points | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const diyaLightRef = useRef<THREE.PointLight | null>(null);
  const pinMeshesGroupRef = useRef<THREE.Group | null>(null);

  // Smooth Camera Transition State
  const isTransitioningCamera = useRef(false);
  const transitionStartTime = useRef(0);
  const transitionDuration = useRef(1100); // 1.1s smooth glide
  const startCamPos = useRef(new THREE.Vector3());
  const targetCamPos = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  // Hotspots for current monument typology
  const currentHotspots = useMemo(() => {
    return (
      monumentHotspotsMap[monument.modelPreset] ||
      monumentHotspotsMap[monument.id] ||
      monumentHotspotsMap['vimana-temple'] ||
      []
    );
  }, [monument.modelPreset, monument.id]);

  // Handle Monument Switcher
  const handleMonumentChange = (monumentId: string) => {
    setSelectedMonumentId(monumentId);
    setActiveHotspot(null);
    const target = unescoMonumentsList.find((m) => m.id === monumentId);
    if (target && onSelectMonument) {
      onSelectMonument(target);
    }
  };

  // Smooth Camera Transition Trigger
  const smoothGlideCamera = useCallback(
    (newCamPos: [number, number, number], newLookAt: [number, number, number], duration = 1100) => {
      if (!cameraRef.current || !controlsRef.current) return;
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      startCamPos.current.copy(camera.position);
      targetCamPos.current.set(...newCamPos);

      startLookAt.current.copy(controls.target);
      targetLookAt.current.set(...newLookAt);

      transitionDuration.current = duration;
      transitionStartTime.current = performance.now();
      isTransitioningCamera.current = true;
    },
    []
  );

  // Handle Hotspot Click (From 3D Pin OR Screen Badge OR Sidebar)
  const handleSelectHotspot = useCallback(
    (hotspot: HotspotData) => {
      if (activeHotspot?.id === hotspot.id) {
        // Toggle off: return to perspective overview
        setActiveHotspot(null);
        smoothGlideCamera([0, 5, 14], [0, 3, 0], 1000);
        return;
      }
      setActiveHotspot(hotspot);
      // Smoothly fly camera to exact hotspot position & angle
      smoothGlideCamera(hotspot.cameraPosition, hotspot.cameraTarget, 1200);

      // Auto play audio narration if enabled
      if (onPlayAudioGuide) {
        onPlayAudioGuide(
          `${hotspot.title} — ${monument.name}`,
          `${hotspot.title}. ${hotspot.description} Dimensions: ${hotspot.dimensions || 'Imperial Standard'}. ASI Excavation Note: ${hotspot.asiNotes}`,
          monument.location
        );
        setIsAudioPlaying(true);
      }
    },
    [activeHotspot, smoothGlideCamera, monument, onPlayAudioGuide]
  );

  // 1. Core Three.js Scene Setup & Model Construction
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // A. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080706);
    scene.fog = new THREE.FogExp2(0x080706, 0.026);

    // B. Camera Setup
    const width = container.clientWidth;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 14);
    cameraRef.current = camera;

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // D. True OrbitControls with Smooth Damping & Auto-Rotate
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.03; // Keep above ground level
    controls.minDistance = 2.0;
    controls.maxDistance = 35;
    controls.target.set(0, 3, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // E. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.65);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xffd59e, 2.2);
    sunLight.position.set(10, 12, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -12;
    sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 12;
    sunLight.shadow.camera.bottom = -12;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Warm Diya / Night Spotlight
    const diyaLight = new THREE.PointLight(0xf97316, 1.2, 28);
    diyaLight.position.set(0, 3.5, 3.5);
    scene.add(diyaLight);
    diyaLightRef.current = diyaLight;

    // F. Procedural Materials
    const isTaj = monument.modelPreset === 'taj-mausoleum';
    const isRedStone =
      monument.modelPreset === 'qutub-minaret' || monument.id === 'red-fort' || monument.id === 'agra-fort';
    const isBasalt = monument.modelPreset === 'rock-cut-caves' || monument.id === 'ellora-caves';
    const isKhondalite = monument.modelPreset === 'konark-wheel';

    const marbleTex = createMarbleTexture();
    const sandstoneTex = createRedSandstoneTexture();
    const basaltTex = createBasaltRockTexture();
    const khondaliteTex = createKhondaliteTexture();
    const graniteTex = createGraniteTexture();
    const pavementTex = createPavementTexture();
    const waterTex = createWaterTexture();

    let baseMat: THREE.MeshStandardMaterial;
    let trimMat: THREE.MeshStandardMaterial;

    if (isTaj) {
      baseMat = new THREE.MeshStandardMaterial({
        map: marbleTex.map,
        roughnessMap: marbleTex.roughnessMap,
        roughness: 0.25,
        metalness: 0.12,
        color: 0xfdfdfc
      });
      trimMat = new THREE.MeshStandardMaterial({
        map: marbleTex.map,
        roughness: 0.4,
        metalness: 0.1,
        color: 0xe5ded3
      });
    } else if (isRedStone) {
      baseMat = new THREE.MeshStandardMaterial({
        map: sandstoneTex.map,
        bumpMap: sandstoneTex.bumpMap,
        bumpScale: 0.05,
        roughness: 0.75,
        metalness: 0.08,
        color: 0xb9472e
      });
      trimMat = new THREE.MeshStandardMaterial({
        map: sandstoneTex.map,
        bumpMap: sandstoneTex.bumpMap,
        bumpScale: 0.03,
        roughness: 0.65,
        metalness: 0.12,
        color: 0x8a311d
      });
    } else if (isBasalt) {
      baseMat = new THREE.MeshStandardMaterial({
        map: basaltTex.map,
        bumpMap: basaltTex.bumpMap,
        bumpScale: 0.08,
        roughness: 0.85,
        metalness: 0.15,
        color: 0x4a443e
      });
      trimMat = new THREE.MeshStandardMaterial({
        map: basaltTex.map,
        roughness: 0.9,
        color: 0x332e29
      });
    } else if (isKhondalite) {
      baseMat = new THREE.MeshStandardMaterial({
        map: khondaliteTex.map,
        bumpMap: khondaliteTex.bumpMap,
        bumpScale: 0.06,
        roughness: 0.8,
        metalness: 0.1,
        color: 0x9b6745
      });
      trimMat = new THREE.MeshStandardMaterial({
        map: khondaliteTex.map,
        roughness: 0.85,
        color: 0x7a4d31
      });
    } else {
      baseMat = new THREE.MeshStandardMaterial({
        map: graniteTex.map,
        bumpMap: graniteTex.bumpMap,
        bumpScale: 0.05,
        roughness: 0.7,
        metalness: 0.18,
        color: 0x9e9287
      });
      trimMat = new THREE.MeshStandardMaterial({
        map: graniteTex.map,
        roughness: 0.75,
        color: 0x766b60
      });
    }

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.92
    });

    const pavementMat = new THREE.MeshStandardMaterial({
      map: pavementTex.map,
      bumpMap: pavementTex.bumpMap,
      bumpScale: 0.04,
      roughness: 0.85
    });

    // G. Model Construction Group (World Coordinates Aligned)
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Ground Platform
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(8.8, 9.4, 0.45, 48), pavementMat);
    ground.position.y = -0.22;
    ground.receiveShadow = true;
    modelGroup.add(ground);

    // Stepped Base Plinth (Jagati)
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.CylinderGeometry(7.8 - i * 0.45, 8.2 - i * 0.45, 0.28, 48),
        trimMat
      );
      step.position.y = i * 0.28;
      step.receiveShadow = true;
      step.castShadow = true;
      modelGroup.add(step);
    }

    // --- ARCHITECTURAL TYPOLOGIES ---
    if (monument.modelPreset === 'taj-mausoleum') {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.8, 5.4), trimMat);
      plinth.position.y = 1.05;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      modelGroup.add(plinth);

      const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.9, 4.0), baseMat);
      body.position.y = 2.85;
      body.castShadow = true;
      body.receiveShadow = true;
      modelGroup.add(body);

      // 4 Grand Arched Iwan Recesses with Pietra Dura Trim
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.9, 20, 1, false, 0, Math.PI), trimMat);
        arch.rotation.y = angle;
        arch.position.set(Math.sin(angle) * 2.01, 2.75, Math.cos(angle) * 2.01);
        modelGroup.add(arch);
      }

      const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.4, 0.95, 36), trimMat);
      drum.position.y = 4.55;
      drum.castShadow = true;
      modelGroup.add(drum);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.55, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.72), baseMat);
      dome.position.y = 5.2;
      dome.scale.set(1.02, 1.34, 1.02);
      dome.castShadow = true;
      modelGroup.add(dome);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.15, 20), goldMat);
      finial.position.y = 7.35;
      modelGroup.add(finial);

      // 4 Corner Chhatris
      [
        [-1.3, -1.3],
        [1.3, -1.3],
        [-1.3, 1.3],
        [1.3, 1.3]
      ].forEach(([cx, cz]) => {
        const pillarC = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.8, 12), trimMat);
        pillarC.position.set(cx, 4.6, cz);
        const domeC = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), baseMat);
        domeC.position.set(cx, 5.1, cz);
        modelGroup.add(pillarC, domeC);
      });

      // 4 Outward Tilted Corner Minarets
      [
        [-3.4, -3.4],
        [3.4, -3.4],
        [-3.4, 3.4],
        [3.4, 3.4]
      ].forEach(([x, z]) => {
        const minaret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 5.4, 20), baseMat);
        minaret.position.set(x, 3.4, z);
        minaret.castShadow = true;
        modelGroup.add(minaret);

        for (let b = 1; b <= 3; b++) {
          const balc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 20), trimMat);
          balc.position.set(x, 1.6 + b * 1.25, z);
          modelGroup.add(balc);
        }

        const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMat);
        cupola.position.set(x, 6.3, z);
        modelGroup.add(cupola);
      });

      // Reflecting Pool with Animated Living Water
      const waterMat = new THREE.MeshStandardMaterial({
        map: waterTex,
        roughness: 0.1,
        metalness: 0.85,
        color: 0x0284c7
      });
      const pool = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 3.8), waterMat);
      pool.position.set(0, 0.32, 4.6);
      modelGroup.add(pool);

    } else if (monument.modelPreset === 'konark-wheel') {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.y = 3.6;
      modelGroup.add(wheelGroup);

      const outerRim = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.46, 28, 64), baseMat);
      outerRim.castShadow = true;
      wheelGroup.add(outerRim);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.95, 36), goldMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      const gnomon = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 1.6, 16), goldMat);
      gnomon.rotation.x = Math.PI / 2;
      gnomon.position.z = 0.8;
      gnomon.castShadow = true;
      wheelGroup.add(gnomon);

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 3.0, 16), trimMat);
        spoke.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);

        const med = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 16), goldMat);
        med.rotation.x = Math.PI / 2;
        med.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        wheelGroup.add(med);
      }

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.9, 14), baseMat);
        spoke.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);
      }

      const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.4, 1.5), trimMat);
      pillarL.position.set(-3.5, 1.5, 0);
      pillarL.castShadow = true;
      modelGroup.add(pillarL);

      const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.4, 1.5), trimMat);
      pillarR.position.set(3.5, 1.5, 0);
      pillarR.castShadow = true;
      modelGroup.add(pillarR);

    } else if (monument.modelPreset === 'qutub-minaret') {
      const storeyHeights = [2.3, 1.85, 1.55, 1.35, 1.15];
      const bottomRadii = [1.45, 1.2, 0.98, 0.78, 0.6];
      const topRadii = [1.2, 0.98, 0.78, 0.6, 0.44];

      let currentY = 0.5;
      for (let s = 0; s < 5; s++) {
        const h = storeyHeights[s];
        const rB = bottomRadii[s];
        const rT = topRadii[s];
        const isUpper = s >= 3;

        const tier = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, 28), isUpper ? baseMat : trimMat);
        tier.position.y = currentY + h / 2;
        tier.castShadow = true;
        modelGroup.add(tier);

        const balc = new THREE.Mesh(new THREE.CylinderGeometry(rT + 0.24, rT + 0.16, 0.24, 28), goldMat);
        balc.position.y = currentY + h;
        balc.castShadow = true;
        modelGroup.add(balc);

        currentY += h + 0.12;
      }

      const topCupola = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 18), goldMat);
      topCupola.position.y = currentY + 0.42;
      modelGroup.add(topCupola);

      const ironPillarMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.35,
        metalness: 0.88
      });
      const ironPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.4, 16), ironPillarMat);
      ironPillar.position.set(2.8, 1.7, 1.8);
      ironPillar.castShadow = true;
      modelGroup.add(ironPillar);

    } else if (monument.modelPreset === 'buddhist-stupa') {
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 4.1, 1.3, 44), trimMat);
      drum.position.y = 1.1;
      drum.receiveShadow = true;
      modelGroup.add(drum);

      const anda = new THREE.Mesh(new THREE.SphereGeometry(3.5, 44, 28, 0, Math.PI * 2, 0, Math.PI * 0.5), baseMat);
      anda.position.y = 1.75;
      anda.castShadow = true;
      modelGroup.add(anda);

      const harmika = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 1.35), trimMat);
      harmika.position.y = 5.3;
      modelGroup.add(harmika);

      for (let c = 0; c < 3; c++) {
        const chhatra = new THREE.Mesh(new THREE.CylinderGeometry(0.88 - c * 0.19, 0.98 - c * 0.19, 0.15, 24), goldMat);
        chhatra.position.y = 5.9 + c * 0.4;
        modelGroup.add(chhatra);
      }

      for (let t = 0; t < 4; t++) {
        const angle = (t * Math.PI) / 2;
        const torana = new THREE.Group();
        const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 3.2, 16), trimMat);
        col1.position.set(-0.95, 1.6, 0);
        const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 3.2, 16), trimMat);
        col2.position.set(0.95, 1.6, 0);
        const beam1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.24, 0.24), goldMat);
        beam1.position.set(0, 2.8, 0);
        const beam2 = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.24, 0.24), trimMat);
        beam2.position.set(0, 3.15, 0);
        torana.add(col1, col2, beam1, beam2);
        torana.position.set(Math.sin(angle) * 5.1, 0.25, Math.cos(angle) * 5.1);
        torana.rotation.y = angle;
        modelGroup.add(torana);
      }

    } else if (monument.modelPreset === 'rock-cut-caves' || monument.id === 'ellora-caves') {
      const cliffWallL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8.5, 9.5), trimMat);
      cliffWallL.position.set(-4.6, 4.25, 0);
      modelGroup.add(cliffWallL);

      const cliffWallR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8.5, 9.5), trimMat);
      cliffWallR.position.set(4.6, 4.25, 0);
      modelGroup.add(cliffWallR);

      const backCliff = new THREE.Mesh(new THREE.BoxGeometry(10.8, 8.5, 1.6), trimMat);
      backCliff.position.set(0, 4.25, -4.7);
      modelGroup.add(backCliff);

      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 3.2), baseMat);
      sanctum.position.set(0, 1.6, -1.0);
      sanctum.castShadow = true;
      modelGroup.add(sanctum);

      for (let t = 0; t < 6; t++) {
        const factor = (6 - t) / 6;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(3.0 * factor, 0.65, 3.0 * factor), t % 2 === 0 ? baseMat : trimMat);
        tier.position.set(0, 3.0 + t * 0.65, -1.0);
        tier.castShadow = true;
        modelGroup.add(tier);
      }

      const nandiMandapa = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.0), baseMat);
      nandiMandapa.position.set(0, 1.3, 2.2);
      modelGroup.add(nandiMandapa);

      for (let px of [-2.4, 2.4]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.0, 16), trimMat);
        pillar.position.set(px, 2.8, 1.8);
        pillar.castShadow = true;
        modelGroup.add(pillar);
      }

    } else if (monument.modelPreset === 'fort-bastions') {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.8, 2.2), baseMat);
      wall.position.set(0, 1.7, 0);
      wall.castShadow = true;
      modelGroup.add(wall);

      for (let m = -3.1; m <= 3.1; m += 0.62) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.22), trimMat);
        merlon.position.set(m, 3.3, 1.0);
        modelGroup.add(merlon);
      }

      for (let bx of [-3.5, 3.5]) {
        const bastion = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 3.8, 28), baseMat);
        bastion.position.set(bx, 2.1, 0);
        bastion.castShadow = true;
        modelGroup.add(bastion);

        const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 18, 18), goldMat);
        chhatriDome.position.set(bx, 4.3, 0);
        modelGroup.add(chhatriDome);
      }

      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.2, 1.4), trimMat);
      tower.position.set(-1.8, 3.5, -2.2);
      modelGroup.add(tower);

    } else {
      // Brihadisvara / Classical Temple
      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 3.6), baseMat);
      sanctum.position.y = 1.55;
      sanctum.castShadow = true;
      modelGroup.add(sanctum);

      const mandapa = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 2.8), trimMat);
      mandapa.position.set(0, 1.15, 3.0);
      mandapa.castShadow = true;
      modelGroup.add(mandapa);

      for (let cx of [-1.15, 1.15]) {
        for (let cz of [2.0, 4.0]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.6, 16), trimMat);
          col.position.set(cx, 1.15, cz);
          col.castShadow = true;
          modelGroup.add(col);
        }
      }

      const tiers = 8;
      for (let t = 0; t < tiers; t++) {
        const factor = (tiers - t) / tiers;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(3.4 * factor, 0.65, 3.4 * factor), t % 2 === 0 ? baseMat : trimMat);
        tier.position.y = 2.7 + t * 0.65;
        tier.castShadow = true;
        modelGroup.add(tier);
      }

      const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.42, 28), trimMat);
      amalaka.position.y = 8.0;
      modelGroup.add(amalaka);

      const kalasha = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.05, 20), goldMat);
      kalasha.position.y = 8.75;
      kalasha.castShadow = true;
      modelGroup.add(kalasha);
    }

    // H. LiDAR Point Cloud Generation for LiDAR Mode
    const lidarPointsGeo = new THREE.BufferGeometry();
    const pointCount = 28000;
    const lidarPositions = new Float32Array(pointCount * 3);
    const lidarColors = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 5.5;
      const y = Math.random() * 8.5;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      lidarPositions[i * 3] = x;
      lidarPositions[i * 3 + 1] = y;
      lidarPositions[i * 3 + 2] = z;

      const normY = y / 8.5;
      if (normY < 0.25) {
        lidarColors[i * 3] = 0.05;
        lidarColors[i * 3 + 1] = 0.4;
        lidarColors[i * 3 + 2] = 0.95;
      } else if (normY < 0.65) {
        lidarColors[i * 3] = 0.1;
        lidarColors[i * 3 + 1] = 0.85;
        lidarColors[i * 3 + 2] = 0.6;
      } else {
        lidarColors[i * 3] = 0.98;
        lidarColors[i * 3 + 1] = 0.65;
        lidarColors[i * 3 + 2] = 0.1;
      }
    }

    lidarPointsGeo.setAttribute('position', new THREE.BufferAttribute(lidarPositions, 3));
    lidarPointsGeo.setAttribute('color', new THREE.BufferAttribute(lidarColors, 3));

    const lidarMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const lidarPoints = new THREE.Points(lidarPointsGeo, lidarMat);
    lidarPoints.visible = false;
    lidarPointsRef.current = lidarPoints;
    scene.add(lidarPoints);

    // I. Visual 3D Hotspot Pin Markers (Attached to scene in world space)
    const pinMeshesGroup = new THREE.Group();
    pinMeshesGroupRef.current = pinMeshesGroup;
    scene.add(pinMeshesGroup);

    currentHotspots.forEach((hotspot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...hotspot.position);
      pinGroup.userData = { hotspotId: hotspot.id, hotspotData: hotspot };

      // Core Glowing Beacon Sphere
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pinGroup.add(sphere);

      // Pulsing Outer Beacon Ring
      const ringGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      pinGroup.add(ring);

      // Vertical Pointer Stem
      const stemGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.5, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -0.25;
      pinGroup.add(stem);

      pinMeshesGroup.add(pinGroup);
    });

    // J. Raycasting for Direct Clicks & Hover on 3D Pins
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      // Only treat as click if user didn't drag to orbit
      if (dx < 6 && dy < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinMeshesGroup.children, true);

        if (intersects.length > 0) {
          // Find root pin group with userData
          let obj: THREE.Object3D | null = intersects[0].object;
          while (obj && !obj.userData?.hotspotData && obj !== scene) {
            obj = obj.parent;
          }
          if (obj && obj.userData?.hotspotData) {
            handleSelectHotspot(obj.userData.hotspotData);
          }
        }
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshesGroup.children, true);

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.hotspotData && obj !== scene) {
          obj = obj.parent;
        }
        if (obj?.userData?.hotspotData) {
          setHoveredHotspotId(obj.userData.hotspotData.id);
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredHotspotId(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // K. Animation Loop with Camera Interpolation & 2D Screen Projection
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Glide Interpolation
      if (isTransitioningCamera.current) {
        const now = performance.now();
        const progress = Math.min(1, (now - transitionStartTime.current) / transitionDuration.current);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic Ease Out

        camera.position.lerpVectors(startCamPos.current, targetCamPos.current, ease);
        controls.target.lerpVectors(startLookAt.current, targetLookAt.current, ease);
        controls.update();

        if (progress >= 1) {
          isTransitioningCamera.current = false;
        }
      } else {
        controls.update();
      }

      // Animate 3D Pin Beacon Pulses
      pinMeshesGroup.children.forEach((pin, idx) => {
        const ring = pin.children[1];
        if (ring) {
          const pulse = 1 + Math.sin(elapsed * 3.5 + idx) * 0.25;
          ring.scale.set(pulse, pulse, pulse);
        }
      });

      // Calculate 2D Screen Projected Positions for HTML badges
      if (container && renderer && camera) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const tempV = new THREE.Vector3();

        const newScreenHotspots: ScreenHotspot[] = currentHotspots.map((hs) => {
          tempV.set(...hs.position);
          tempV.project(camera);

          const isBehind = tempV.z > 1;
          const x = (tempV.x * 0.5 + 0.5) * w;
          const y = (-(tempV.y * 0.5) + 0.5) * h;

          return {
            id: hs.id,
            index: hs.index,
            x,
            y,
            visible: !isBehind && x >= 20 && x <= w - 20 && y >= 20 && y <= h - 20,
            data: hs
          };
        });
        setScreenHotspots(newScreenHotspots);
      }

      renderer.render(scene, camera);
    };
    animate();

    // L. Window Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [monument, currentHotspots, handleSelectHotspot]);

  // Update OrbitControls Auto-Rotate
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = autoRotate && !activeHotspot;
  }, [autoRotate, activeHotspot]);

  // Update Render Mode (Realistic, LiDAR, Blueprint, Cutaway)
  useEffect(() => {
    if (!modelGroupRef.current || !lidarPointsRef.current) return;
    const modelGroup = modelGroupRef.current;
    const lidarPoints = lidarPointsRef.current;

    if (renderMode === 'lidar') {
      modelGroup.visible = false;
      lidarPoints.visible = true;
    } else {
      modelGroup.visible = true;
      lidarPoints.visible = false;

      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          if (renderMode === 'blueprint') {
            child.material.wireframe = true;
            child.material.color.setHex(0x06b6d4);
            child.material.transparent = true;
            child.material.opacity = 0.85;
          } else if (renderMode === 'cutaway') {
            child.material.wireframe = false;
            child.material.transparent = true;
            child.material.opacity = 0.42;
            child.material.roughness = 0.1;
          } else {
            child.material.wireframe = false;
            child.material.transparent = false;
            child.material.opacity = 1.0;
          }
        }
      });
    }
  }, [renderMode]);

  // Archaeo-Astronomy Dynamic 24-Hour Sun Position & Lighting
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !diyaLightRef.current || !sceneRef.current) return;

    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const diya = diyaLightRef.current;
    const scene = sceneRef.current;

    const normalizedHour = (sunHour - 6) / 12;
    const angle = normalizedHour * Math.PI;

    if (sunHour >= 6 && sunHour <= 18) {
      const sunX = Math.cos(angle) * 15;
      const sunY = Math.sin(angle) * 14 + 1.5;
      const sunZ = Math.sin(angle) * 9;
      sun.position.set(sunX, sunY, sunZ);

      if (sunHour === 6 || sunHour === 18) {
        scene.background = new THREE.Color(0x1a0d06);
        scene.fog = new THREE.FogExp2(0x1a0d06, 0.032);
        sun.color.setHex(0xf97316);
        sun.intensity = 2.4;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.55;
        diya.intensity = 1.2;
      } else if (sunHour >= 11 && sunHour <= 13) {
        scene.background = new THREE.Color(0x0a1224);
        scene.fog = new THREE.FogExp2(0x0a1224, 0.026);
        sun.color.setHex(0xffffff);
        sun.intensity = 2.8;
        ambient.color.setHex(0xe0f2fe);
        ambient.intensity = 0.75;
        diya.intensity = 0.1;
      } else {
        scene.background = new THREE.Color(0x0d0c0a);
        scene.fog = new THREE.FogExp2(0x0d0c0a, 0.028);
        sun.color.setHex(0xffd59e);
        sun.intensity = 2.3;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.65;
        diya.intensity = 0.4;
      }
    } else {
      scene.background = new THREE.Color(0x020306);
      scene.fog = new THREE.FogExp2(0x020306, 0.04);
      sun.color.setHex(0x38bdf8);
      sun.intensity = 0.3;
      sun.position.set(-10, 10, -8);
      ambient.color.setHex(0x1e293b);
      ambient.intensity = 0.3;
      diya.color.setHex(0xf97316);
      diya.intensity = 3.4;
    }
  }, [sunHour]);

  // Apply Camera Presets
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setActiveHotspot(null);

    if (preset === 'perspective') {
      smoothGlideCamera([0, 5, 14], [0, 3, 0]);
    } else if (preset === 'eye-level') {
      smoothGlideCamera([0, 1.4, 8.5], [0, 3.8, 0]);
    } else if (preset === 'aerial') {
      smoothGlideCamera([0, 16, 8], [0, 2, 0]);
    } else if (preset === 'facade') {
      smoothGlideCamera([0, 3.2, 13], [0, 3.2, 0]);
    } else if (preset === 'plan') {
      smoothGlideCamera([0, 18, 0.1], [0, 0, 0]);
    }
  };

  // Screenshot Capture
  const handleCaptureScreenshot = () => {
    if (!rendererRef.current) return;
    try {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ASI-3D-${monument.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setScreenshotSuccess(true);
      setTimeout(() => setScreenshotSuccess(false), 3000);
    } catch (e) {
      console.error('Screenshot capture failed', e);
    }
  };

  const getTimeLabel = (h: number) => {
    if (h === 6) return '6:00 AM (Dawn Aarti)';
    if (h === 12) return '12:00 PM (Solar Noon)';
    if (h === 16) return '4:00 PM (Golden Hour)';
    if (h === 18) return '6:00 PM (Sandhya Sunset)';
    if (h >= 19 || h < 6) return `${h > 12 ? h - 12 : h}:00 PM (Night Aarti & Diyas)`;
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-stone-950 border border-amber-900/50 shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-[620px]'
      }`}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* INTERACTIVE 3D HOTSPOT PINS FLOATING ON SCREEN */}
      {screenHotspots.map((hs) => {
        if (!hs.visible) return null;
        const isActive = activeHotspot?.id === hs.id;
        const isHovered = hoveredHotspotId === hs.id;

        return (
          <button
            key={hs.id}
            onClick={() => handleSelectHotspot(hs.data)}
            style={{
              left: `${hs.x}px`,
              top: `${hs.y}px`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group flex items-center gap-1.5 p-1 rounded-2xl transition-all duration-300 cursor-pointer pointer-events-auto ${
              isActive
                ? 'scale-110 ring-4 ring-amber-400 bg-amber-500 text-stone-950 shadow-2xl'
                : isHovered
                ? 'scale-105 bg-stone-900/90 text-amber-300 ring-2 ring-amber-400 shadow-xl'
                : 'bg-stone-950/80 text-stone-200 border border-amber-500/40 hover:border-amber-400 shadow-lg'
            }`}
            title={`Click spot: ${hs.data.title}`}
          >
            {/* Pulsing Beacon Dot */}
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shadow-md transition-all ${
                isActive
                  ? 'bg-stone-950 text-amber-400 font-mono'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 animate-pulse font-mono'
              }`}
            >
              {hs.index}
            </span>

            {/* Label (Visible on desktop or when active) */}
            <span
              className={`text-xs font-bold pr-2 whitespace-nowrap hidden sm:inline ${
                isActive ? 'text-stone-950' : 'text-stone-100 group-hover:text-amber-300'
              }`}
            >
              {hs.data.title}
            </span>
          </button>
        );
      })}

      {/* TOP HEADER: ASI Badge & Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 z-10">
        <div className="flex items-center gap-2 pointer-events-auto bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400">
            <Landmark className="w-3 h-3 text-amber-400" />
          </div>
          <span className="hidden sm:inline">ASI 3D Virtual Telemetry</span>
          <span className="text-[10px] text-stone-400 font-mono">[{monument.name}]</span>
        </div>

        {/* Monument Switcher Dropdown */}
        <div className="pointer-events-auto flex items-center gap-2">
          <select
            value={selectedMonumentId}
            onChange={(e) => handleMonumentChange(e.target.value)}
            className="bg-stone-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-amber-400 cursor-pointer shadow-lg hidden md:block"
          >
            {unescoMonumentsList.map((m) => (
              <option key={m.id} value={m.id} className="bg-stone-900 text-stone-200">
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-stone-900/90 backdrop-blur-md text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800 shadow-md cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900/90 backdrop-blur-md text-stone-300 hover:text-rose-400 hover:bg-stone-800 transition-colors border border-stone-800 shadow-md cursor-pointer"
              title="Close 3D View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* INTERACTIVE SPOT SELECTOR PILLS (Top Left) */}
      <div className="absolute top-16 left-4 max-w-[260px] sm:max-w-xs pointer-events-auto space-y-2 z-10">
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-stone-900/90 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 border border-amber-500/20 backdrop-blur-sm shadow-md">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>Click 3D Spot on Monument</span>
        </div>
        <div className="space-y-1.5">
          {currentHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => handleSelectHotspot(hotspot)}
              className={`w-full text-left p-2 rounded-2xl backdrop-blur-md border text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                activeHotspot?.id === hotspot.id
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 scale-[1.02]'
                  : 'bg-stone-900/85 border-amber-500/30 text-stone-200 hover:border-amber-400 hover:bg-stone-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  activeHotspot?.id === hotspot.id
                    ? 'bg-stone-950 text-amber-400'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                }`}
              >
                {hotspot.index}
              </span>
              <div className="overflow-hidden">
                <div className="truncate font-semibold text-[11px]">{hotspot.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE SPOT FIELD ANNOTATION CARD (Left Bottom) */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-4 max-w-sm pointer-events-auto bg-stone-900/95 backdrop-blur-md p-4 rounded-3xl border border-amber-500/50 shadow-2xl z-20 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Landmark className="w-3 h-3" /> Spot #{activeHotspot.index} • Field Study Record
            </span>
            <button
              onClick={() => {
                setActiveHotspot(null);
                smoothGlideCamera([0, 5, 14], [0, 3, 0]);
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              title="Reset Spot View"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h4 className="text-white font-bold text-sm mb-1">{activeHotspot.title}</h4>
          <p className="text-stone-300 text-xs leading-relaxed mb-2.5">{activeHotspot.description}</p>
          {activeHotspot.dimensions && (
            <div className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 mb-2">
              📏 {activeHotspot.dimensions}
            </div>
          )}
          <div className="text-[10px] text-stone-400 italic bg-stone-950/60 p-2 rounded-xl border border-stone-800">
            🔍 <span className="font-semibold text-stone-300">ASI Field Note:</span> {activeHotspot.asiNotes}
          </div>
        </div>
      )}

      {/* ARCHAEO-ASTRONOMY SUN & TIME SLIDER (Right Top) */}
      <div className="absolute top-16 right-4 pointer-events-auto bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-amber-900/40 text-xs w-48 sm:w-56 shadow-xl z-10">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-stone-300 font-semibold flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Archaeo-Sun
          </span>
          <span className="text-amber-400 font-mono font-bold text-[10px]">{getTimeLabel(sunHour)}</span>
        </div>
        <input
          type="range"
          min="6"
          max="22"
          step="1"
          value={sunHour}
          onChange={(e) => setSunHour(parseInt(e.target.value))}
          className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1">
          <span>6 AM</span>
          <span>12 PM</span>
          <span>5 PM</span>
          <span>10 PM</span>
        </div>
      </div>

      {/* REAL DIMENSIONS / HUD MODAL (Right Middle) */}
      {showMeasureHud && (
        <div className="absolute top-36 right-4 pointer-events-auto bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/40 text-xs w-56 shadow-2xl z-10 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Ruler className="w-3 h-3" /> Monument HUD
            </span>
            <button
              onClick={() => setShowMeasureHud(false)}
              className="p-1 rounded-md text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-stone-800 pb-1">
              <span className="text-stone-400">Typology:</span>
              <span className="text-amber-300 font-mono">{monument.modelPreset}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-1">
              <span className="text-stone-400">Inscribed:</span>
              <span className="text-stone-200">{monument.yearInscribed || 'Ancient'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-1">
              <span className="text-stone-400">Coordinates:</span>
              <span className="text-stone-200 font-mono text-[10px]">
                {monument.coordinates.lat.toFixed(2)}°N, {monument.coordinates.lng.toFixed(2)}°E
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">UNESCO:</span>
              <span className="text-amber-400 font-semibold">{monument.unescoCriteria}</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS & RENDER MODE BAR */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        {/* Interaction hints */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-400 text-[11px]">
          <span>🖱️ Left-Click: 360° Orbit</span>
          <span>•</span>
          <span>Right-Click: Pan</span>
          <span>•</span>
          <span>Click Pins: Zoom to Spot</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/50 shadow-2xl flex-wrap">
          {/* Render Mode Switcher */}
          <div className="flex items-center bg-stone-950/80 p-0.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setRenderMode('realistic')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                renderMode === 'realistic' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Photorealistic PBR Materials"
            >
              Realistic
            </button>
            <button
              onClick={() => setRenderMode('lidar')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                renderMode === 'lidar' ? 'bg-cyan-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="ASI Laser LiDAR Scan Point Cloud"
            >
              LiDAR
            </button>
            <button
              onClick={() => setRenderMode('blueprint')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                renderMode === 'blueprint' ? 'bg-teal-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Archaeological CAD Wireframe"
            >
              Blueprint
            </button>
            <button
              onClick={() => setRenderMode('cutaway')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                renderMode === 'cutaway' ? 'bg-indigo-500 text-white' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="X-Ray Cutaway Interior View"
            >
              X-Ray
            </button>
          </div>

          <div className="w-px h-5 bg-stone-700 mx-1 hidden sm:block" />

          {/* Camera Presets */}
          <button
            onClick={() => applyCameraPreset('perspective')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              cameraPreset === 'perspective' && !activeHotspot
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Overview Angle"
          >
            Overview
          </button>
          <button
            onClick={() => applyCameraPreset('eye-level')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              cameraPreset === 'eye-level' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Ground Visitor Eye-Level Walk"
          >
            Walk
          </button>
          <button
            onClick={() => applyCameraPreset('aerial')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              cameraPreset === 'aerial' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Drone Aerial View"
          >
            Aerial
          </button>
          <button
            onClick={() => applyCameraPreset('plan')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold hidden md:inline-block cursor-pointer ${
              cameraPreset === 'plan' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Top Floor Plan"
          >
            Plan
          </button>

          <div className="w-px h-5 bg-stone-700 mx-1" />

          {/* Dimension HUD Toggle */}
          <button
            onClick={() => setShowMeasureHud(!showMeasureHud)}
            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              showMeasureHud ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Monument Dimensions & HUD"
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              autoRotate ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-stone-400 hover:bg-stone-800'
            }`}
            title="Toggle Continuous Orbit"
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Screenshot Souvenir Capture */}
          <button
            onClick={handleCaptureScreenshot}
            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              screenshotSuccess ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Download ASI 3D Souvenir Photo"
          >
            {screenshotSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4" />}
          </button>

          {/* Audio Guide Narration */}
          {onPlayAudioGuide && (
            <button
              onClick={() => {
                if (onPlayAudioGuide) {
                  onPlayAudioGuide(
                    `${monument.name} - 3D Audio Guide`,
                    activeHotspot ? `${activeHotspot.title}. ${activeHotspot.description}` : monument.audioNarration,
                    monument.location
                  );
                  setIsAudioPlaying(!isAudioPlaying);
                }
              }}
              className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                isAudioPlaying ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Play 3D Audio Guide"
            >
              {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
