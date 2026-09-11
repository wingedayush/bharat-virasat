import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Sun,
  Moon,
  Sunrise,
  Sparkles,
  Info,
  X,
  Compass,
  Sliders,
  Camera
} from 'lucide-react';
import { UnescoMonument } from '@/data/unescoMonuments';

interface Monument3DViewerProps {
  monument: UnescoMonument;
  onClose?: () => void;
  isModal?: boolean;
}

export function Monument3DViewer({ monument, onClose, isModal = false }: Monument3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [sunHour, setSunHour] = useState<number>(16); // 16 = 4:00 PM (Golden Hour)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'top' | 'closeup'>('perspective');

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const diyaLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0908);
    scene.fog = new THREE.FogExp2(0x0a0908, 0.032);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Archaeo-astronomy Dynamic Sun Lighting
    const ambient = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const sun = new THREE.DirectionalLight(0xffd59e, 2.0);
    sun.position.set(10, 10, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    sunLightRef.current = sun;

    // Diya warm lantern point light
    const diya = new THREE.PointLight(0xff9800, 1.5, 25);
    diya.position.set(0, 3.5, 3);
    scene.add(diya);
    diyaLightRef.current = diya;

    // 5. Build Architectural Procedural 3D Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Dynamic Materials
    const isTaj = monument.modelPreset === 'taj-mausoleum';
    const isRedSandstone = monument.modelPreset === 'qutub-minaret' || monument.id === 'red-fort' || monument.id === 'agra-fort' || monument.id === 'fatehpur-sikri';

    const baseColor = isTaj ? 0xf4f1eb : isRedSandstone ? 0xb55338 : 0xd8a47f;
    const trimColor = isTaj ? 0xded6c7 : isRedSandstone ? 0x8a3924 : 0xab7552;
    const goldColor = 0xf59e0b;

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.7,
      metalness: 0.15,
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: trimColor,
      roughness: 0.8,
      metalness: 0.2,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: goldColor,
      roughness: 0.25,
      metalness: 0.9,
    });

    // Paved Ground Platform
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 9.2, 0.4, 40),
      trimMaterial
    );
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    modelGroup.add(ground);

    // Stepped Base Plinth (Jagati)
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5 - i * 0.4, 7.8 - i * 0.4, 0.25, 40),
        baseMaterial
      );
      step.position.y = i * 0.25;
      step.receiveShadow = true;
      modelGroup.add(step);
    }

    // ARCHITECTURAL TYPOLOGIES:
    if (monument.modelPreset === 'taj-mausoleum') {
      // 1. TAJ MAHAL & MUGHAL MAUSOLEUM ARCHITECTURE
      // Plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.7, 5.2), baseMaterial);
      plinth.position.y = 1.0;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      modelGroup.add(plinth);

      // Main Marble Mausoleum Block
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.8, 3.8), baseMaterial);
      body.position.y = 2.75;
      body.castShadow = true;
      body.receiveShadow = true;
      modelGroup.add(body);

      // Four Arched Iwan Recesses with dark borders
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16, 1, false, 0, Math.PI), trimMaterial);
        arch.rotation.y = angle;
        arch.position.set(Math.sin(angle) * 1.9, 2.65, Math.cos(angle) * 1.9);
        modelGroup.add(arch);
      }

      // Grand Double Bulbous Marble Dome
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.35, 0.9, 32), trimMaterial);
      drum.position.y = 4.4;
      modelGroup.add(drum);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.7), baseMaterial);
      dome.position.y = 5.0;
      dome.scale.set(1.02, 1.3, 1.02);
      dome.castShadow = true;
      modelGroup.add(dome);

      // Golden Kalasha Finial
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 16), goldMaterial);
      finial.position.y = 7.1;
      modelGroup.add(finial);

      // 4 Octagonal Corner Minarets with Balconies and Cupolas
      const minaretPos = [
        [-3.2, -3.2],
        [3.2, -3.2],
        [-3.2, 3.2],
        [3.2, 3.2],
      ];
      minaretPos.forEach(([x, z]) => {
        const minaret = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 5.2, 16), baseMaterial);
        minaret.position.set(x, 3.2, z);
        minaret.castShadow = true;
        modelGroup.add(minaret);

        // Balconies
        for (let b = 1; b <= 3; b++) {
          const balc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.1, 16), trimMaterial);
          balc.position.set(x, 1.5 + b * 1.2, z);
          modelGroup.add(balc);
        }

        // Cupola Chhatri
        const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), goldMaterial);
        cupola.position.set(x, 6.0, z);
        modelGroup.add(cupola);
      });

      // Front Reflecting Pool
      const pool = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.1, 3.6),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.85 })
      );
      pool.position.set(0, 0.3, 4.4);
      modelGroup.add(pool);

    } else if (monument.modelPreset === 'konark-wheel') {
      // 2. KONARK SUN TEMPLE & ASTRONOMICAL SUNDIAL WHEEL
      const wheelGroup = new THREE.Group();
      wheelGroup.position.y = 3.4;
      modelGroup.add(wheelGroup);

      // Outer Thick Rim with Relief Carvings
      const outerRim = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.45, 24, 64), baseMaterial);
      outerRim.castShadow = true;
      wheelGroup.add(outerRim);

      // Central Hub Axle
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.9, 32), goldMaterial);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      // Real Solar Gnomon Pin (casts precision shadow on spokes)
      const gnomon = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.4, 16), goldMaterial);
      gnomon.rotation.x = Math.PI / 2;
      gnomon.position.z = 0.7;
      gnomon.castShadow = true;
      wheelGroup.add(gnomon);

      // 8 Major Spokes with Carved Medallions (Representing 8 Praharas)
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.9, 16), trimMaterial);
        spoke.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);

        // Medallion on Spoke
        const med = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.38, 16), goldMaterial);
        med.rotation.x = Math.PI / 2;
        med.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
        wheelGroup.add(med);
      }

      // 8 Minor Spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 2.8, 12), baseMaterial);
        spoke.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
        spoke.rotation.z = angle - Math.PI / 2;
        spoke.castShadow = true;
        wheelGroup.add(spoke);
      }

      // Sculpted Base Pillars & Horses
      const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 1.4), trimMaterial);
      pillarL.position.set(-3.4, 1.4, 0);
      modelGroup.add(pillarL);

      const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 1.4), trimMaterial);
      pillarR.position.set(3.4, 1.4, 0);
      modelGroup.add(pillarR);

    } else if (monument.modelPreset === 'qutub-minaret') {
      // 3. QUTUB MINAR & HISTORIC TOWERS (5 DISTINCT TAPERING STOREYS)
      const storeyHeights = [2.2, 1.8, 1.5, 1.3, 1.1];
      const bottomRadii = [1.4, 1.15, 0.95, 0.75, 0.58];
      const topRadii = [1.15, 0.95, 0.75, 0.58, 0.42];

      let currentY = 0.5;
      for (let s = 0; s < 5; s++) {
        const h = storeyHeights[s];
        const rB = bottomRadii[s];
        const rT = topRadii[s];
        const isUpper = s >= 3;

        // Storey Cylinder
        const tierMat = isUpper ? baseMaterial : trimMaterial;
        const tier = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, 24), tierMat);
        tier.position.y = currentY + h / 2;
        tier.castShadow = true;
        modelGroup.add(tier);

        // Balcony with Ornate Stalactite Corbels
        const balc = new THREE.Mesh(new THREE.CylinderGeometry(rT + 0.22, rT + 0.15, 0.22, 24), goldMaterial);
        balc.position.y = currentY + h;
        balc.castShadow = true;
        modelGroup.add(balc);

        currentY += h + 0.1;
      }

      // Cupola Finial
      const topCupola = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 16), goldMaterial);
      topCupola.position.y = currentY + 0.4;
      modelGroup.add(topCupola);

      // Iron Pillar of Delhi nearby
      const ironPillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.8 })
      );
      ironPillar.position.set(2.8, 1.6, 1.8);
      ironPillar.castShadow = true;
      modelGroup.add(ironPillar);

    } else if (monument.modelPreset === 'fort-bastions') {
      // 4. HILLTOP CITADEL, MASSIVE BASTIONS & RAMPARTS (CHITTORGARH, RED FORT, AGRA FORT, MARATHA FORTS)
      // Main Fort Curtain Wall
      const wall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.6, 2.0), baseMaterial);
      wall.position.set(0, 1.6, 0);
      wall.castShadow = true;
      modelGroup.add(wall);

      // Crenellated Battlements (Merlons) on top of wall
      for (let m = -3.0; m <= 3.0; m += 0.6) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.2), trimMaterial);
        merlon.position.set(m, 3.1, 0.9);
        modelGroup.add(merlon);
      }

      // Grand Maha Darwaza Gateway Arch
      const gate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 2.4), trimMaterial);
      gate.position.set(0, 1.2, 0);
      modelGroup.add(gate);

      const archPassage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 2.5, 16, 1, false, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x18181b })
      );
      archPassage.rotation.x = Math.PI / 2;
      archPassage.position.set(0, 1.2, 0);
      modelGroup.add(archPassage);

      // Two Massive Circular Bastions (Burj)
      for (let bx of [-3.4, 3.4]) {
        const bastion = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 3.6, 24), baseMaterial);
        bastion.position.set(bx, 2.0, 0);
        bastion.castShadow = true;
        modelGroup.add(bastion);

        // Domed Watchtower (Chhatri) atop bastion
        const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), goldMaterial);
        chhatriDome.position.set(bx, 4.1, 0);
        modelGroup.add(chhatriDome);
      }

      // Royal Flag Fluttering atop Bastion
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), goldMaterial);
      pole.position.set(3.4, 5.2, 0);
      modelGroup.add(pole);

      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xf97316, side: THREE.DoubleSide })
      );
      flag.position.set(3.8, 5.8, 0);
      flag.rotation.y = 0.3;
      modelGroup.add(flag);

    } else if (monument.modelPreset === 'buddhist-stupa') {
      // 5. ANCIENT BUDDHIST STUPA (SANCHI, BODH GAYA, NALANDA)
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.0, 1.2, 40), trimMaterial);
      drum.position.y = 1.0;
      drum.receiveShadow = true;
      modelGroup.add(drum);

      // Anda Hemispherical Stone Dome
      const anda = new THREE.Mesh(new THREE.SphereGeometry(3.4, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), baseMaterial);
      anda.position.y = 1.6;
      anda.castShadow = true;
      modelGroup.add(anda);

      // Square Balustrade Harmika on Apex
      const harmika = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.7, 1.3), trimMaterial);
      harmika.position.y = 5.1;
      modelGroup.add(harmika);

      // Triple Umbrellas (Chhatras) of Dharma, Sangha, Buddha
      for (let c = 0; c < 3; c++) {
        const chhatra = new THREE.Mesh(new THREE.CylinderGeometry(0.85 - c * 0.18, 0.95 - c * 0.18, 0.14, 24), goldMaterial);
        chhatra.position.y = 5.7 + c * 0.38;
        modelGroup.add(chhatra);
      }

      // 4 Monumental Torana Gateways at Cardinal Directions
      for (let t = 0; t < 4; t++) {
        const angle = (t * Math.PI) / 2;
        const torana = new THREE.Group();
        const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.0, 16), trimMaterial);
        col1.position.set(-0.9, 1.5, 0);
        const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.0, 16), trimMaterial);
        col2.position.set(0.9, 1.5, 0);
        const beam1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.22), goldMaterial);
        beam1.position.set(0, 2.7, 0);
        const beam2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.22, 0.22), trimMaterial);
        beam2.position.set(0, 3.0, 0);
        torana.add(col1, col2, beam1, beam2);
        torana.position.set(Math.sin(angle) * 4.9, 0.2, Math.cos(angle) * 4.9);
        torana.rotation.y = angle;
        modelGroup.add(torana);
      }

    } else if (monument.modelPreset === 'subterranean-stepwell') {
      // 6. INVERTED SUBTERRANEAN STEPWELL (RANI KI VAV, DHOLAVIRA)
      for (let level = 0; level < 6; level++) {
        const widthW = 7.6 - level * 0.9;
        const depthD = 5.0 - level * 0.6;
        const terrace = new THREE.Mesh(new THREE.BoxGeometry(widthW, 0.45, depthD), baseMaterial);
        terrace.position.y = 3.2 - level * 0.65;
        modelGroup.add(terrace);

        // Carved Pillar Colonnades
        for (let p = -2; p <= 2; p++) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.65, 12), trimMaterial);
          col.position.set(p * (1.2 - level * 0.12), 3.5 - level * 0.65, 1.6 - level * 0.2);
          modelGroup.add(col);
        }
      }

      // Sacred Water Reservoir at Bottom
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.9 })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.y = -0.15;
      modelGroup.add(water);

    } else if (monument.modelPreset === 'rock-cut-caves') {
      // 7. ROCK-CUT CLIFF CAVES (AJANTA, ELEPHANTA)
      const cliff = new THREE.Mesh(
        new THREE.CylinderGeometry(6.5, 7.0, 5.0, 32, 1, false, 0, Math.PI),
        trimMaterial
      );
      cliff.position.y = 2.5;
      cliff.rotation.y = -Math.PI / 2;
      modelGroup.add(cliff);

      // Chaitya Horse-Shoe Sun Window Arch
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.35, 16, 32, Math.PI), baseMaterial);
      arch.position.set(0, 3.4, 0.2);
      modelGroup.add(arch);

      // Verandah Pillars
      for (let cp = -2; cp <= 2; cp++) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.4, 16), baseMaterial);
        pillar.position.set(cp * 1.1, 1.4, 0.4);
        modelGroup.add(pillar);
      }

      // Inner Maheshmurti / Stupa in sanctum
      const innerShrine = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 1.6, 16), goldMaterial);
      innerShrine.position.set(0, 1.2, -1.2);
      modelGroup.add(innerShrine);

    } else {
      // 8. CLASSICAL DRAVIDIAN & NAGARA TEMPLE VIMANA / SHIKHARA (HAMPI, BRIHADISVARA, ELLORA KAILASA, KHAJURAHO, PATTADAKAL, RAMAPPA, HOYSALAS)
      // Sanctum Garbhagriha
      const sanctum = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 3.4), baseMaterial);
      sanctum.position.y = 1.45;
      sanctum.castShadow = true;
      modelGroup.add(sanctum);

      // Mandapa Pillared Assembly Hall in front
      const mandapa = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.5, 2.6), trimMaterial);
      mandapa.position.set(0, 1.1, 2.8);
      mandapa.castShadow = true;
      modelGroup.add(mandapa);

      // Mandapa Carved Granite Columns
      for (let cx of [-1.1, 1.1]) {
        for (let cz of [1.8, 3.8]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 1.5, 16), trimMaterial);
          col.position.set(cx, 1.1, cz);
          col.castShadow = true;
          modelGroup.add(col);
        }
      }

      // Multi-tiered Spire (Shikhara / Vimana) with 8 Tiers
      const tiers = 8;
      for (let t = 0; t < tiers; t++) {
        const factor = (tiers - t) / tiers;
        const tier = new THREE.Mesh(
          new THREE.BoxGeometry(3.2 * factor, 0.6, 3.2 * factor),
          t % 2 === 0 ? baseMaterial : trimMaterial
        );
        tier.position.y = 2.5 + t * 0.6;
        tier.castShadow = true;
        modelGroup.add(tier);
      }

      // Amalaka Ribbed Stone Disc
      const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.38, 24), trimMaterial);
      amalaka.position.y = 7.4;
      modelGroup.add(amalaka);

      // Golden Kalasha Sacred Finial
      const kalasha = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.0, 20), goldMaterial);
      kalasha.position.y = 8.1;
      kalasha.castShadow = true;
      modelGroup.add(kalasha);

      // Monolithic Cliff Walls if Ellora
      if (monument.id === 'ellora-caves') {
        const cliffWallL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 8.0, 9.0), trimMaterial);
        cliffWallL.position.set(-4.5, 4.0, 0);
        modelGroup.add(cliffWallL);

        const cliffWallR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 8.0, 9.0), trimMaterial);
        cliffWallR.position.set(4.5, 4.0, 0);
        modelGroup.add(cliffWallR);
      }
    }

    // 6. Floating Golden Sacred Aura Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = Math.random() * 9;
      positions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.14,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 7. Interactive Mouse / Touch Orbit Controls with Damping
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetCameraY = 5;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetCameraY = Math.max(1.5, Math.min(10, targetCameraY - deltaY * 0.02));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY * 0.008;
      const newZ = camera.position.z + zoom;
      if (newZ > 5 && newZ < 22) {
        camera.position.z = newZ;
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        targetRotationY += deltaX * 0.009;
        targetCameraY = Math.max(1.5, Math.min(10, targetCameraY - deltaY * 0.02));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth damping
      if (autoRotate && !isDragging) {
        targetRotationY += 0.003;
      }
      modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.1;
      camera.position.y += (targetCameraY - camera.position.y) * 0.1;
      camera.lookAt(0, 3, 0);

      // Particle floating drift
      if (particles) {
        const pos = particles.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 1; i < pos.count * 3; i += 3) {
          pos.array[i] += Math.sin(elapsed + i) * 0.004;
          if (pos.array[i] > 9) pos.array[i] = 0.5;
        }
        pos.needsUpdate = true;
        particles.rotation.y = elapsed * 0.02;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [monument]);

  // Update Wireframe
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Update Archaeo-astronomy Dynamic Sun Position & Lighting based on sunHour (6 to 24)
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !diyaLightRef.current || !sceneRef.current) return;

    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const diya = diyaLightRef.current;
    const scene = sceneRef.current;

    // Calculate sun angle from 6:00 (dawn) to 18:00 (dusk)
    const normalizedHour = (sunHour - 6) / 12; // 0 (dawn) to 1 (dusk)
    const angle = normalizedHour * Math.PI;

    if (sunHour >= 6 && sunHour <= 18) {
      // Daytime: Sun rises in East (x > 0), peaks at noon (y high), sets in West (x < 0)
      const sunX = Math.cos(angle) * 14;
      const sunY = Math.sin(angle) * 13 + 2;
      const sunZ = Math.sin(angle) * 8;
      sun.position.set(sunX, sunY, sunZ);

      if (sunHour === 6 || sunHour === 18) {
        // Dawn / Sunset (Golden Aarti)
        scene.background = new THREE.Color(0x1a0f08);
        scene.fog = new THREE.FogExp2(0x1a0f08, 0.035);
        sun.color.setHex(0xf97316);
        sun.intensity = 2.2;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.5;
        diya.intensity = 1.0;
      } else if (sunHour >= 11 && sunHour <= 13) {
        // Solar Noon
        scene.background = new THREE.Color(0x0a101f);
        scene.fog = new THREE.FogExp2(0x0a101f, 0.03);
        sun.color.setHex(0xffffff);
        sun.intensity = 2.6;
        ambient.color.setHex(0xddf0ff);
        ambient.intensity = 0.7;
        diya.intensity = 0.2;
      } else {
        // Normal Day / Afternoon
        scene.background = new THREE.Color(0x0c0a09);
        scene.fog = new THREE.FogExp2(0x0c0a09, 0.032);
        sun.color.setHex(0xffd59e);
        sun.intensity = 2.0;
        ambient.color.setHex(0xffeedd);
        ambient.intensity = 0.6;
        diya.intensity = 0.5;
      }
    } else {
      // Night Diya Mode (19:00 - 5:00)
      scene.background = new THREE.Color(0x030408);
      scene.fog = new THREE.FogExp2(0x030408, 0.045);
      sun.color.setHex(0x3b82f6);
      sun.intensity = 0.25;
      sun.position.set(-8, 8, -6);
      ambient.color.setHex(0x1e293b);
      ambient.intensity = 0.25;
      diya.color.setHex(0xf97316);
      diya.intensity = 3.0; // Warm glowing diya
    }
  }, [sunHour]);

  // Camera Presets
  const applyCameraPreset = (preset: 'perspective' | 'front' | 'top' | 'closeup') => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    setCameraPreset(preset);

    if (preset === 'perspective') {
      cameraRef.current.position.set(0, 5, 14);
      modelGroupRef.current.rotation.set(0, 0, 0);
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, 3.5, 12);
      modelGroupRef.current.rotation.set(0, 0, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 14, 0.1);
      modelGroupRef.current.rotation.set(0, 0, 0);
    } else if (preset === 'closeup') {
      cameraRef.current.position.set(0, 3.0, 7.5);
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
    cameraRef.current.lookAt(0, 3, 0);
  };

  const getTimeLabel = (h: number) => {
    if (h === 6) return '6:00 AM (Dawn Aarti)';
    if (h === 12) return '12:00 PM (Solar Noon)';
    if (h === 16) return '4:00 PM (Golden Hour)';
    if (h === 18) return '6:00 PM (Sandhya Sunset)';
    if (h >= 19 || h < 6) return `${h > 12 ? h - 12 : h}:00 PM (Diya Night)`;
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-stone-950 border border-amber-900/50 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-[560px]'}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>3D Virtual Sanctum</span>
          <span className="text-[10px] text-stone-400 font-mono">({monument.name})</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-rose-400 hover:bg-stone-800 transition-colors border border-stone-800"
              title="Close 3D View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Clickable Architectural Hotspots on Top-Left */}
      <div className="absolute top-16 left-4 max-w-xs sm:max-w-sm pointer-events-auto space-y-2">
        {monument.architecturalWonders.slice(0, 2).map((wonder, idx) => (
          <button
            key={idx}
            onClick={() => setActiveHotspot(activeHotspot === wonder ? null : wonder)}
            className={`w-full text-left p-2.5 rounded-2xl backdrop-blur-md border text-xs transition-all flex items-start gap-2 shadow-lg ${
              activeHotspot === wonder
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                : 'bg-stone-900/80 border-amber-500/30 text-stone-200 hover:border-amber-400 hover:bg-stone-800'
            }`}
          >
            <Info className={`w-4 h-4 shrink-0 mt-0.5 ${activeHotspot === wonder ? 'text-stone-950' : 'text-amber-400'}`} />
            <span className="line-clamp-2">{wonder}</span>
          </button>
        ))}
      </div>

      {/* Archaeo-astronomy Sun & Time Slider on Top-Right */}
      <div className="absolute top-16 right-4 pointer-events-auto bg-stone-900/85 backdrop-blur-md p-3 rounded-2xl border border-amber-900/40 text-xs w-48 sm:w-56 shadow-xl">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-stone-400 font-semibold flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Sun Position
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
          <span>6 PM</span>
          <span>10 PM</span>
        </div>
      </div>

      {/* Floating Control Bar at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Interaction hints */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-800 text-stone-400 text-[11px]">
          <span>🖱️ Drag to 360° Orbit</span>
          <span>•</span>
          <span>Scroll to Zoom</span>
          <span>•</span>
          <span>Slider moves Sun Shadows</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/50 shadow-2xl">
          {/* Camera Presets */}
          <button
            onClick={() => applyCameraPreset('perspective')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              cameraPreset === 'perspective' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Overview Angle"
          >
            Overview
          </button>
          <button
            onClick={() => applyCameraPreset('closeup')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              cameraPreset === 'closeup' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Sanctum Close-Up"
          >
            Sanctum
          </button>
          <button
            onClick={() => applyCameraPreset('top')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              cameraPreset === 'top' ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Top Aerial View"
          >
            Aerial
          </button>

          <div className="w-px h-5 bg-stone-700 mx-1" />

          {/* Wireframe Geometry Toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              wireframe ? 'bg-emerald-500 text-stone-950 shadow-md' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Toggle Sacred Geometry Wireframe"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Geometry</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              autoRotate ? 'bg-stone-800 text-amber-400' : 'text-stone-400 hover:bg-stone-800'
            }`}
            title="Toggle Continuous Spin"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Reset View */}
          <button
            onClick={() => applyCameraPreset('perspective')}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 text-xs transition-colors"
            title="Reset Camera"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
