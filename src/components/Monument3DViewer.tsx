import { useEffect, useRef, useState, useMemo } from 'react';
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
  ChevronDown
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

interface HotspotData {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: string;
  dimensions?: string;
  asiNotes: string;
}

// Architectural Hotspots per monument typology
const monumentHotspotsMap: Record<string, HotspotData[]> = {
  'taj-mausoleum': [
    {
      id: 'dome',
      title: 'Grand Double Bulbous Dome',
      subtitle: 'Imperial White Makrana Marble',
      position: [0, 5.8, 0],
      cameraTarget: [0, 5.5, 0],
      cameraPosition: [0, 6.2, 5.5],
      description: 'The monumental central onion dome rises to 35 meters above the plinth, engineered as a double dome system allowing the high soaring exterior silhouette while maintaining harmonious interior proportions.',
      dimensions: 'Height: 35m | Outer Diameter: 17.6m | Material: Pure Makrana Marble',
      asiNotes: 'Cleaned periodically using Multani Mitti (Fuller’s Earth) clay poultice to preserve crystalline translucent luster.'
    },
    {
      id: 'iwan',
      title: 'Pishtaq & Pietra Dura Inlay Arch',
      subtitle: 'Parchin Kari Gem Inlay',
      position: [0, 2.7, 2.0],
      cameraTarget: [0, 2.7, 1.9],
      cameraPosition: [0, 2.9, 4.0],
      description: 'The vaulted southern iwan portal is framed with Thuluth Arabic script inlaid in black marble and floral arabesques composed of jasper, jade, lapis lazuli, and carnelian.',
      dimensions: 'Portal Height: 33m | Stones Used: 28 semi-precious varieties',
      asiNotes: 'Laser-cleaned and mapped using photogrammetric telemetry by ASI Agra Circle.'
    },
    {
      id: 'minarets',
      title: 'Outward-Tilted Corner Minarets',
      subtitle: 'Seismic Safety Engineering',
      position: [3.2, 3.8, 3.2],
      cameraTarget: [3.2, 3.5, 3.2],
      cameraPosition: [4.8, 4.2, 5.8],
      description: 'Four octagonal minarets stand 42m tall. To protect the main mausoleum in the event of an earthquake, each minaret is intentionally tilted outward by approximately 2 degrees.',
      dimensions: 'Height: 42m each | Tiers: 3 balconies with stalactite corbelling',
      asiNotes: 'Continuous structural plumb-line and tilt sensors monitored monthly by ASI Surveyors.'
    },
    {
      id: 'pool',
      title: 'Charbagh Reflecting Lotus Pool',
      subtitle: 'Mughal Paradise Garden Waterway',
      position: [0, 0.4, 4.4],
      cameraTarget: [0, 0.3, 4.4],
      cameraPosition: [0, 2.5, 9.5],
      description: 'The raised marble lotus water basin (Al Hawd al-Kawthar) mirrors the ivory facade symmetrically, fed by an ancient gravity-fed copper pipe hydraulic system from the Yamuna River.',
      dimensions: 'Pool Dimensions: 24m x 36m | Depth: 1.2m',
      asiNotes: 'Water circulation filtration restored in collaboration with CPWD & ASI Heritage Hydraulic Wing.'
    }
  ],
  'konark-wheel': [
    {
      id: 'gnomon',
      title: 'Astronomical Sundial Axle (Gnomon)',
      subtitle: 'Minute-Precision Solar Shadow Timekeeping',
      position: [0, 3.4, 0.8],
      cameraTarget: [0, 3.4, 0.8],
      cameraPosition: [0, 3.8, 3.5],
      description: 'The central axle pin acts as a precise solar gnomon. As the sun traverses the sky, the shadow falls upon the 8 major and 8 minor spokes, measuring time down to a single Vighatika (24 seconds).',
      dimensions: 'Axle Diameter: 85cm | Shadow Accuracy: Within 3 minutes of IST',
      asiNotes: 'Archaeological Survey of India astronomical study confirms the wheel aligns precisely with the equinoctial sunrise.'
    },
    {
      id: 'spokes',
      title: '8 Major Spokes with Carved Medallions',
      subtitle: 'Eight Praharas of Human Daily Life',
      position: [1.6, 3.4, 0],
      cameraTarget: [1.6, 3.4, 0],
      cameraPosition: [3.0, 3.6, 2.8],
      description: 'Each major spoke features sculpted roundels depicting scenes from the 8 praharas (3-hour periods) of the day: morning aarti, trade, music, court assembly, and evening rest.',
      dimensions: 'Wheel Diameter: 3.2m | Number of Wheels: 24 on temple plinth',
      asiNotes: 'Khondalite sandstone stabilized against coastal salt sea spray by ASI Bhubaneswar Circle.'
    }
  ],
  'qutub-minaret': [
    {
      id: 'balconies',
      title: 'Stalactite Muqarnas Balconies',
      subtitle: 'Early Indo-Islamic Sandstone Corbelling',
      position: [0, 4.3, 0],
      cameraTarget: [0, 4.3, 0],
      cameraPosition: [0, 4.8, 3.5],
      description: 'Projecting cantilevered balconies supported by clustered miniature arch-and-bracket corbels with Arabic inscriptions and ornate geometric stalactite patterns.',
      dimensions: 'Tower Height: 72.5m | Storeys: 5 Tapering Sections',
      asiNotes: 'Lightning arrestors and structural incline sensors installed by ASI Delhi Circle.'
    },
    {
      id: 'iron-pillar',
      title: '1600-Year Rustless Iron Pillar',
      subtitle: 'Gupta Metallurgical Marvel (King Chandra)',
      position: [2.8, 1.6, 1.8],
      cameraTarget: [2.8, 1.6, 1.8],
      cameraPosition: [4.0, 2.0, 3.6],
      description: 'Erected c. 400 CE by Chandragupta II Vikramaditya. Composed of 99.7% pure wrought iron with high phosphorus content that formed a protective misawite iron oxide layer, preventing corrosion for 16 centuries.',
      dimensions: 'Height: 7.21m | Weight: Over 6,000 kg | Pure Wrought Iron',
      asiNotes: 'Subject of landmark metallurgical studies by IIT Kanpur and ASI Materials Laboratory.'
    }
  ],
  'vimana-temple': [
    {
      id: 'vimana-shikhara',
      title: 'Monolithic Stepped Dravidian Vimana',
      subtitle: 'Sacred Cosmic Mountain Meru Architecture',
      position: [0, 5.0, 0],
      cameraTarget: [0, 5.0, 0],
      cameraPosition: [0, 5.5, 6.0],
      description: 'The monumental tiered pyramid rises above the sanctum sanctorum (garbhagriha), symbolizing Mount Meru. Built entirely with precision interlocking dry-masonry granite blocks without cement.',
      dimensions: 'Vimana Tiers: 8 distinct levels | Apex Kalasha: Gilded Copper',
      asiNotes: 'ASI structural vibration telemetry ensures conservation against heavy temple footfall.'
    },
    {
      id: 'mandapa-pillars',
      title: 'Yali Carved Granite Colonnade',
      subtitle: 'Musical & Mythological Sculptural Monoliths',
      position: [1.1, 1.1, 2.8],
      cameraTarget: [1.1, 1.1, 2.8],
      cameraPosition: [2.4, 1.6, 4.4],
      description: 'Monolithic pillars carved with rearing Yalis (celestial lion-elephant beasts) and tuned hollow musical shafts that resonate acoustic notes when gently tapped.',
      dimensions: 'Pillar Height: 3.2m carved from single granite blocks',
      asiNotes: 'Acoustic resonance frequency documented by ASI Musicology Division.'
    }
  ],
  'fort-bastions': [
    {
      id: 'ramparts',
      title: 'Crenellated Curtain Walls & Merlons',
      subtitle: 'Defensive Military Rajput-Mughal Fortification',
      position: [0, 3.1, 0.9],
      cameraTarget: [0, 3.1, 0.9],
      cameraPosition: [0, 3.8, 4.5],
      description: 'Massive ashlar masonry ramparts equipped with arrow slits, cannon embrasures, and machicolations designed to withstand siege artillery and cavalry assaults.',
      dimensions: 'Wall Thickness: Up to 5 meters | Bastion Diameter: 3.4m',
      asiNotes: 'Rampart stone grouting with lime-surkhi mortar ongoing by ASI Jaipur Circle.'
    }
  ],
  'buddhist-stupa': [
    {
      id: 'torana',
      title: 'Carved Sandstone Torana Gateway',
      subtitle: 'Jataka Tales in Low-Relief Stone Joinery',
      position: [0, 1.8, 4.9],
      cameraTarget: [0, 1.8, 4.9],
      cameraPosition: [0, 2.4, 8.2],
      description: 'Four monumental gateways oriented toward the cardinal directions. Three architraves joined by carved balusters depict the life of the Buddha, Yakshis, and royal processions.',
      dimensions: 'Gateway Height: 10m | 4 Gateways at Cardinal Points',
      asiNotes: 'Cleaned with non-ionic biocide by ASI Bhopal Circle.'
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
  const gnomonShadowMeshRef = useRef<THREE.Mesh | null>(null);

  // Hotspots for current monument
  const currentHotspots = useMemo(() => {
    return monumentHotspotsMap[monument.modelPreset] || monumentHotspotsMap['vimana-temple'] || [];
  }, [monument.modelPreset]);

  // Handle Monument Switcher
  const handleMonumentChange = (monumentId: string) => {
    setSelectedMonumentId(monumentId);
    const target = unescoMonumentsList.find((m) => m.id === monumentId);
    if (target && onSelectMonument) {
      onSelectMonument(target);
    }
  };

  // 1. Core Three.js Scene Setup & Model Construction
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // A. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080706);
    scene.fog = new THREE.FogExp2(0x080706, 0.028);

    // B. Camera Setup
    const width = container.clientWidth;
    const height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 14);
    cameraRef.current = camera;

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Allows screenshot capture
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

    // D. True OrbitControls with Smooth Damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.04; // Don't allow flipping under ground
    controls.minDistance = 2.5;
    controls.maxDistance = 35;
    controls.target.set(0, 3, 0);
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
    const isRedStone = monument.modelPreset === 'qutub-minaret' || monument.id === 'red-fort' || monument.id === 'agra-fort';
    const isBasalt = monument.modelPreset === 'rock-cut-caves' || monument.id === 'ellora-caves';
    const isKhondalite = monument.modelPreset === 'konark-wheel';

    const marbleTex = createMarbleTexture();
    const sandstoneTex = createRedSandstoneTexture();
    const basaltTex = createBasaltRockTexture();
    const khondaliteTex = createKhondaliteTexture();
    const graniteTex = createGraniteTexture();
    const pavementTex = createPavementTexture();
    const waterTex = createWaterTexture();

    // Select primary material based on monument typology
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
      // Monolithic Dravidian/Nagara Granite
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

    // G. Model Construction Group
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

    // ARCHITECTURAL TYPOLOGIES:
    if (monument.modelPreset === 'taj-mausoleum') {
      // --- TAJ MAHAL REAL 3D MODEL ---
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.8, 5.4), trimMat);
      plinth.position.y = 1.05;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      modelGroup.add(plinth);

      // Main Marble Mausoleum Block
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

      // High Cylindrical Drum
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.4, 0.95, 36), trimMat);
      drum.position.y = 4.55;
      drum.castShadow = true;
      modelGroup.add(drum);

      // Grand Double Bulbous Marble Dome
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.55, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.72), baseMat);
      dome.position.y = 5.2;
      dome.scale.set(1.02, 1.34, 1.02);
      dome.castShadow = true;
      modelGroup.add(dome);

      // Golden Kalasha Finial
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.15, 20), goldMat);
      finial.position.y = 7.35;
      modelGroup.add(finial);

      // 4 Corner Chhatris
      const chhatriCoords = [
        [-1.3, -1.3],
        [1.3, -1.3],
        [-1.3, 1.3],
        [1.3, 1.3]
      ];
      chhatriCoords.forEach(([cx, cz]) => {
        const pillarC = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.8, 12), trimMat);
        pillarC.position.set(cx, 4.6, cz);
        const domeC = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), baseMat);
        domeC.position.set(cx, 5.1, cz);
        modelGroup.add(pillarC, domeC);
      });

      // 4 Corner Minarets
      const minaretPos = [
        [-3.4, -3.4],
        [3.4, -3.4],
        [-3.4, 3.4],
        [3.4, 3.4]
      ];
      minaretPos.forEach(([x, z]) => {
        const minaret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 5.4, 20), baseMat);
        minaret.position.set(x, 3.4, z);
        minaret.castShadow = true;
        modelGroup.add(minaret);

        // Balconies
        for (let b = 1; b <= 3; b++) {
          const balc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 20), trimMat);
          balc.position.set(x, 1.6 + b * 1.25, z);
          modelGroup.add(balc);
        }

        // Cupola Chhatri atop minaret
        const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMat);
        cupola.position.set(x, 6.3, z);
        modelGroup.add(cupola);
      });

      // Reflecting Pool with Animated Living Water
      const poolGeo = new THREE.BoxGeometry(2.6, 0.12, 3.8);
      const waterMat = new THREE.MeshStandardMaterial({
        map: waterTex,
        roughness: 0.1,
        metalness: 0.85,
        color: 0x0284c7
      });
      const pool = new THREE.Mesh(poolGeo, waterMat);
      pool.position.set(0, 0.32, 4.6);
      modelGroup.add(pool);

    } else if (monument.modelPreset === 'konark-wheel') {
      // --- KONARK SUN TEMPLE SUNDIAL WHEEL ---
      const wheelGroup = new THREE.Group();
      wheelGroup.position.y = 3.6;
      modelGroup.add(wheelGroup);

      // Outer Carved Rim with Beads
      const outerRim = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.46, 28, 64), baseMat);
      outerRim.castShadow = true;
      wheelGroup.add(outerRim);

      // Central Hub Axle
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.95, 36), goldMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      // Real Solar Gnomon Pin
      const gnomon = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 1.6, 16), goldMat);
      gnomon.rotation.x = Math.PI / 2;
      gnomon.position.z = 0.8;
      gnomon.castShadow = true;
      wheelGroup.add(gnomon);

      // 8 Major Spokes with Carved Medallions
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.25, 3.0, 16), trimMat);
        spoke.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);

        // Medallion
        const med = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 16), goldMat);
        med.rotation.x = Math.PI / 2;
        med.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        wheelGroup.add(med);
      }

      // 8 Minor Spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.9, 14), baseMat);
        spoke.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.65, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);
      }

      // Sculpted Chariot Plinth & Guardian Elephants
      const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.4, 1.5), trimMat);
      pillarL.position.set(-3.5, 1.5, 0);
      pillarL.castShadow = true;
      modelGroup.add(pillarL);

      const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.4, 1.5), trimMat);
      pillarR.position.set(3.5, 1.5, 0);
      pillarR.castShadow = true;
      modelGroup.add(pillarR);

    } else if (monument.modelPreset === 'qutub-minaret') {
      // --- QUTUB MINAR REAL 3D MODEL ---
      const storeyHeights = [2.3, 1.85, 1.55, 1.35, 1.15];
      const bottomRadii = [1.45, 1.2, 0.98, 0.78, 0.6];
      const topRadii = [1.2, 0.98, 0.78, 0.6, 0.44];

      let currentY = 0.5;
      for (let s = 0; s < 5; s++) {
        const h = storeyHeights[s];
        const rB = bottomRadii[s];
        const rT = topRadii[s];
        const isUpper = s >= 3;

        // Cylindrical Fluted Storey
        const tier = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, 28), isUpper ? baseMat : trimMat);
        tier.position.y = currentY + h / 2;
        tier.castShadow = true;
        modelGroup.add(tier);

        // Balcony with Ornate Stalactite Corbels
        const balc = new THREE.Mesh(new THREE.CylinderGeometry(rT + 0.24, rT + 0.16, 0.24, 28), goldMat);
        balc.position.y = currentY + h;
        balc.castShadow = true;
        modelGroup.add(balc);

        currentY += h + 0.12;
      }

      // Cupola Finial
      const topCupola = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 18), goldMat);
      topCupola.position.y = currentY + 0.42;
      modelGroup.add(topCupola);

      // Nearby Rustless Iron Pillar
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
      // --- SANCHI STUPA REAL 3D MODEL ---
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 4.1, 1.3, 44), trimMat);
      drum.position.y = 1.1;
      drum.receiveShadow = true;
      modelGroup.add(drum);

      // Anda Hemispherical Stone Dome
      const anda = new THREE.Mesh(new THREE.SphereGeometry(3.5, 44, 28, 0, Math.PI * 2, 0, Math.PI * 0.5), baseMat);
      anda.position.y = 1.75;
      anda.castShadow = true;
      modelGroup.add(anda);

      // Square Harmika Balustrade
      const harmika = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 1.35), trimMat);
      harmika.position.y = 5.3;
      modelGroup.add(harmika);

      // Triple Chhatras (Dharma, Sangha, Buddha)
      for (let c = 0; c < 3; c++) {
        const chhatra = new THREE.Mesh(new THREE.CylinderGeometry(0.88 - c * 0.19, 0.98 - c * 0.19, 0.15, 24), goldMat);
        chhatra.position.y = 5.9 + c * 0.4;
        modelGroup.add(chhatra);
      }

      // 4 Torana Gateways at Cardinal Directions
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
      // --- KAILASA MONOLITHIC CLIFF EXCAVATION (ELLORA CAVE 16) ---
      const cliffWallL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8.5, 9.5), trimMat);
      cliffWallL.position.set(-4.6, 4.25, 0);
      modelGroup.add(cliffWallL);

      const cliffWallR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8.5, 9.5), trimMat);
      cliffWallR.position.set(4.6, 4.25, 0);
      modelGroup.add(cliffWallR);

      const backCliff = new THREE.Mesh(new THREE.BoxGeometry(10.8, 8.5, 1.6), trimMat);
      backCliff.position.set(0, 4.25, -4.7);
      modelGroup.add(backCliff);

      // Central Monolithic Temple Vimana
      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 3.2), baseMat);
      sanctum.position.set(0, 1.6, -1.0);
      sanctum.castShadow = true;
      modelGroup.add(sanctum);

      // 6-Tiered Dravidian Shikhara
      for (let t = 0; t < 6; t++) {
        const factor = (6 - t) / 6;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(3.0 * factor, 0.65, 3.0 * factor), t % 2 === 0 ? baseMat : trimMat);
        tier.position.set(0, 3.0 + t * 0.65, -1.0);
        tier.castShadow = true;
        modelGroup.add(tier);
      }

      // Monolithic Nandi Mandapa in Forecourt
      const nandiMandapa = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.0), baseMat);
      nandiMandapa.position.set(0, 1.3, 2.2);
      modelGroup.add(nandiMandapa);

      // 2 Victory Dhwaja Stambhas (Pillars)
      for (let px of [-2.4, 2.4]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.0, 16), trimMat);
        pillar.position.set(px, 2.8, 1.8);
        pillar.castShadow = true;
        modelGroup.add(pillar);
      }

    } else if (monument.modelPreset === 'fort-bastions') {
      // --- CITADEL BASTIONS & RAMPARTS ---
      const wall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.8, 2.2), baseMat);
      wall.position.set(0, 1.7, 0);
      wall.castShadow = true;
      modelGroup.add(wall);

      // Merlons
      for (let m = -3.1; m <= 3.1; m += 0.62) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.22), trimMat);
        merlon.position.set(m, 3.3, 1.0);
        modelGroup.add(merlon);
      }

      // 2 Massive Circular Bastions
      for (let bx of [-3.5, 3.5]) {
        const bastion = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 3.8, 28), baseMat);
        bastion.position.set(bx, 2.1, 0);
        bastion.castShadow = true;
        modelGroup.add(bastion);

        const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 18, 18), goldMat);
        chhatriDome.position.set(bx, 4.3, 0);
        modelGroup.add(chhatriDome);
      }

      // Victory Tower (Vijay Stambha simulation)
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.2, 1.4), trimMat);
      tower.position.set(-1.8, 3.5, -2.2);
      modelGroup.add(tower);

    } else {
      // --- BRIHADISVARA & CLASSICAL TEMPLE VIMANA ---
      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 3.6), baseMat);
      sanctum.position.y = 1.55;
      sanctum.castShadow = true;
      modelGroup.add(sanctum);

      // Mandapa Assembly Hall
      const mandapa = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 2.8), trimMat);
      mandapa.position.set(0, 1.15, 3.0);
      mandapa.castShadow = true;
      modelGroup.add(mandapa);

      // Pillars
      for (let cx of [-1.15, 1.15]) {
        for (let cz of [2.0, 4.0]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.6, 16), trimMat);
          col.position.set(cx, 1.15, cz);
          col.castShadow = true;
          modelGroup.add(col);
        }
      }

      // 8-Tiered Spire (Shikhara/Vimana)
      const tiers = 8;
      for (let t = 0; t < tiers; t++) {
        const factor = (tiers - t) / tiers;
        const tier = new THREE.Mesh(new THREE.BoxGeometry(3.4 * factor, 0.65, 3.4 * factor), t % 2 === 0 ? baseMat : trimMat);
        tier.position.y = 2.7 + t * 0.65;
        tier.castShadow = true;
        modelGroup.add(tier);
      }

      // 80-Tonne Monolithic Kumbam Cupola
      const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.42, 28), trimMat);
      amalaka.position.y = 8.0;
      modelGroup.add(amalaka);

      // Golden Kalasha Sacred Finial
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

      // Color based on elevation (ASI LiDAR telemetry false-color mapping)
      const normY = y / 8.5;
      if (normY < 0.25) {
        // Deep blue (ground)
        lidarColors[i * 3] = 0.05;
        lidarColors[i * 3 + 1] = 0.4;
        lidarColors[i * 3 + 2] = 0.95;
      } else if (normY < 0.65) {
        // Green-cyan (body)
        lidarColors[i * 3] = 0.1;
        lidarColors[i * 3 + 1] = 0.85;
        lidarColors[i * 3 + 2] = 0.6;
      } else {
        // Gold-orange (finial/dome apex)
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

    // I. Animation Loop with OrbitControls Update
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto rotation when enabled and user not dragging
      if (autoRotate && controls && !controls.state) {
        modelGroup.rotation.y += 0.003;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // J. Window Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [monument]);

  // 2. Render Mode Manager (Realistic, LiDAR, Blueprint, Cutaway)
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
            child.material.color.setHex(0x06b6d4); // Cyan CAD blueprint
            child.material.transparent = true;
            child.material.opacity = 0.85;
          } else if (renderMode === 'cutaway') {
            child.material.wireframe = false;
            child.material.transparent = true;
            child.material.opacity = 0.42; // Translucent glass-stone X-Ray
            child.material.roughness = 0.1;
          } else {
            // Realistic PBR
            child.material.wireframe = false;
            child.material.transparent = false;
            child.material.opacity = 1.0;
          }
        }
      });
    }
  }, [renderMode]);

  // 3. Archaeo-Astronomy Dynamic 24-Hour Sun Lighting & Celestial Tracking
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !diyaLightRef.current || !sceneRef.current) return;

    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const diya = diyaLightRef.current;
    const scene = sceneRef.current;

    // Angle calculation from 06:00 (dawn) to 18:00 (sunset)
    const normalizedHour = (sunHour - 6) / 12;
    const angle = normalizedHour * Math.PI;

    if (sunHour >= 6 && sunHour <= 18) {
      const sunX = Math.cos(angle) * 15;
      const sunY = Math.sin(angle) * 14 + 1.5;
      const sunZ = Math.sin(angle) * 9;
      sun.position.set(sunX, sunY, sunZ);

      if (sunHour === 6 || sunHour === 18) {
        // Dawn or Twilight Aarti
        scene.background = new THREE.Color(0x1a0d06);
        scene.fog = new THREE.FogExp2(0x1a0d06, 0.032);
        sun.color.setHex(0xf97316);
        sun.intensity = 2.4;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.55;
        diya.intensity = 1.2;
      } else if (sunHour >= 11 && sunHour <= 13) {
        // Solar Noon (High crisp overhead shadows)
        scene.background = new THREE.Color(0x0a1224);
        scene.fog = new THREE.FogExp2(0x0a1224, 0.026);
        sun.color.setHex(0xffffff);
        sun.intensity = 2.8;
        ambient.color.setHex(0xe0f2fe);
        ambient.intensity = 0.75;
        diya.intensity = 0.1;
      } else {
        // Golden Afternoon (3PM - 5PM)
        scene.background = new THREE.Color(0x0d0c0a);
        scene.fog = new THREE.FogExp2(0x0d0c0a, 0.028);
        sun.color.setHex(0xffd59e);
        sun.intensity = 2.3;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.65;
        diya.intensity = 0.4;
      }
    } else {
      // Night Aarti & Floodlights Mode (19:00 - 05:00)
      scene.background = new THREE.Color(0x020306);
      scene.fog = new THREE.FogExp2(0x020306, 0.04);
      sun.color.setHex(0x38bdf8); // Moonlight
      sun.intensity = 0.3;
      sun.position.set(-10, 10, -8);
      ambient.color.setHex(0x1e293b);
      ambient.intensity = 0.3;
      diya.color.setHex(0xf97316);
      diya.intensity = 3.4; // Glowing oil diya & golden floodlights
    }
  }, [sunHour]);

  // 4. Camera Presets
  const applyCameraPreset = (preset: CameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === 'perspective') {
      camera.position.set(0, 5, 14);
      controls.target.set(0, 3, 0);
    } else if (preset === 'eye-level') {
      camera.position.set(0, 1.2, 8.5);
      controls.target.set(0, 4.0, 0);
    } else if (preset === 'aerial') {
      camera.position.set(0, 15, 8);
      controls.target.set(0, 2, 0);
    } else if (preset === 'facade') {
      camera.position.set(0, 3.2, 13);
      controls.target.set(0, 3.2, 0);
    } else if (preset === 'plan') {
      camera.position.set(0, 18, 0.1);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  // 5. Hotspot Navigation (Smooth Camera lerp to feature)
  const handleSelectHotspot = (hotspot: HotspotData) => {
    if (activeHotspot?.id === hotspot.id) {
      setActiveHotspot(null);
      return;
    }
    setActiveHotspot(hotspot);

    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      camera.position.set(...hotspot.cameraPosition);
      controls.target.set(...hotspot.cameraTarget);
      controls.update();
    }
  };

  // 6. Screenshot / ASI Digital Heritage Certificate Capture
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

  // 7. Audio Guide Voice Readout
  const handleToggleAudio = () => {
    if (onPlayAudioGuide) {
      onPlayAudioGuide(
        `${monument.name} - 3D Architectural Field Study`,
        activeHotspot
          ? `${activeHotspot.title}. ${activeHotspot.description}. Dimensions: ${activeHotspot.dimensions || 'Imperial Standard'}. ${activeHotspot.asiNotes}`
          : monument.audioNarration,
        monument.location
      );
      setIsAudioPlaying(!isAudioPlaying);
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

      {/* TOP HEADER: ASI Badge & Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 pointer-events-auto bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400">
            <Landmark className="w-3 h-3 text-amber-400" />
          </div>
          <span className="hidden sm:inline">ASI 3D Architectural Telemetry</span>
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
            className="p-2 rounded-xl bg-stone-900/90 backdrop-blur-md text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800 shadow-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900/90 backdrop-blur-md text-stone-300 hover:text-rose-400 hover:bg-stone-800 transition-colors border border-stone-800 shadow-md"
              title="Close 3D View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ARCHAEOLOGICAL HOTSPOTS LIST (Left Side) */}
      <div className="absolute top-16 left-4 max-w-[260px] sm:max-w-xs pointer-events-auto space-y-2 z-10">
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-stone-900/80 px-2 py-0.5 rounded-md inline-block border border-amber-500/20 backdrop-blur-sm">
          ASI Field Hotspots ({currentHotspots.length})
        </div>
        {currentHotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => handleSelectHotspot(hotspot)}
            className={`w-full text-left p-2.5 rounded-2xl backdrop-blur-md border text-xs transition-all flex items-start gap-2 shadow-lg ${
              activeHotspot?.id === hotspot.id
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 scale-[1.02]'
                : 'bg-stone-900/85 border-amber-500/30 text-stone-200 hover:border-amber-400 hover:bg-stone-800'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                activeHotspot?.id === hotspot.id ? 'text-stone-950' : 'text-amber-400'
              }`}
            />
            <div className="overflow-hidden">
              <div className="truncate font-semibold">{hotspot.title}</div>
              <div
                className={`text-[10px] truncate ${
                  activeHotspot?.id === hotspot.id ? 'text-stone-800' : 'text-stone-400'
                }`}
              >
                {hotspot.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ACTIVE HOTSPOT FIELD ANNOTATION CARD (Left Bottom) */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-4 max-w-sm pointer-events-auto bg-stone-900/95 backdrop-blur-md p-4 rounded-3xl border border-amber-500/50 shadow-2xl z-20 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Landmark className="w-3 h-3" /> ASI Architectural Record
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
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
            🔍 <span className="font-semibold text-stone-300">ASI Note:</span> {activeHotspot.asiNotes}
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
        <div className="absolute top-36 right-4 pointer-events-auto bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/40 text-xs w-56 shadow-2xl z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Ruler className="w-3 h-3" /> Monument HUD
            </span>
            <button
              onClick={() => setShowMeasureHud(false)}
              className="p-1 rounded-md text-stone-400 hover:text-white"
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
              <span className="text-stone-400">Year Built:</span>
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
          <span>Scroll: Zoom</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/50 shadow-2xl flex-wrap">
          {/* Render Mode Dropdown */}
          <div className="flex items-center bg-stone-950/80 p-0.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setRenderMode('realistic')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                renderMode === 'realistic' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Photorealistic PBR Materials"
            >
              Realistic
            </button>
            <button
              onClick={() => setRenderMode('lidar')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                renderMode === 'lidar' ? 'bg-cyan-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="ASI Laser LiDAR Scan Point Cloud"
            >
              LiDAR
            </button>
            <button
              onClick={() => setRenderMode('blueprint')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                renderMode === 'blueprint' ? 'bg-teal-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Archaeological CAD Wireframe"
            >
              Blueprint
            </button>
            <button
              onClick={() => setRenderMode('cutaway')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
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
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              cameraPreset === 'perspective' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Overview Angle"
          >
            Overview
          </button>
          <button
            onClick={() => applyCameraPreset('eye-level')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              cameraPreset === 'eye-level' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Ground Visitor Eye-Level Walk"
          >
            Walk
          </button>
          <button
            onClick={() => applyCameraPreset('aerial')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              cameraPreset === 'aerial' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Drone Aerial View"
          >
            Aerial
          </button>
          <button
            onClick={() => applyCameraPreset('plan')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold hidden md:inline-block ${
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
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              showMeasureHud ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Monument Dimensions & HUD"
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              autoRotate ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-stone-400 hover:bg-stone-800'
            }`}
            title="Toggle Continuous Orbit"
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Screenshot Souvenir Capture */}
          <button
            onClick={handleCaptureScreenshot}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              screenshotSuccess ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Download ASI 3D Souvenir Photo"
          >
            {screenshotSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4" />}
          </button>

          {/* Audio Guide Narration */}
          {onPlayAudioGuide && (
            <button
              onClick={handleToggleAudio}
              className={`p-1.5 rounded-xl text-xs transition-colors ${
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
