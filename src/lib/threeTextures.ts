import * as THREE from 'three';

// Procedural Canvas Texture Engine for Photorealistic Indian Heritage 3D Materials

// Helper to create a Three.CanvasTexture with optimal mipmapping and filtering
function finalizeTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

// 1. Makrana Imperial White Marble (Taj Mahal)
export function createMarbleTexture(): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base off-white crystalline marble
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, size, size);

  // Soft translucent cloudy variations
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const rad = 40 + Math.random() * 80;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    grad.addColorStop(0, 'rgba(238, 232, 222, 0.45)');
    grad.addColorStop(1, 'rgba(248, 246, 240, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Natural subtle grey and golden marble veining
  ctx.lineWidth = 1.5;
  for (let v = 0; v < 7; v++) {
    ctx.beginPath();
    let x = Math.random() * size;
    let y = 0;
    ctx.moveTo(x, y);
    ctx.strokeStyle = v % 2 === 0 ? 'rgba(180, 172, 160, 0.28)' : 'rgba(215, 195, 165, 0.22)';
    while (y < size) {
      x += (Math.random() - 0.5) * 24;
      y += 8 + Math.random() * 16;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Roughness Map (very smooth, high specular luster)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#333333'; // ~0.2 roughness
  rCtx.fillRect(0, 0, size, size);

  return {
    map: finalizeTexture(canvas),
    roughnessMap: finalizeTexture(roughCanvas)
  };
}

// 2. Red Agra Sandstone (Qutub Minar, Red Fort, Fatehpur Sikri)
export function createRedSandstoneTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base warm iron-oxide terracotta red
  ctx.fillStyle = '#a64228';
  ctx.fillRect(0, 0, size, size);

  // Sedimentary horizontal grain and mineral strata
  for (let y = 0; y < size; y += 4) {
    const darkness = Math.sin(y * 0.05) * 18 + (Math.random() - 0.5) * 12;
    const r = Math.min(255, Math.max(0, 166 + darkness));
    const g = Math.min(255, Math.max(0, 66 + darkness * 0.5));
    const b = Math.min(255, Math.max(0, 40 + darkness * 0.3));
    ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    ctx.fillRect(0, y, size, 4);
  }

  // Sandstone speckle noise
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Chiseled ashlar masonry block seams
  ctx.strokeStyle = 'rgba(50, 15, 10, 0.4)';
  ctx.lineWidth = 2;
  for (let y = 64; y < size; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += 64) {
    const offsetX = (y / 64) % 2 === 0 ? 0 : 64;
    for (let x = offsetX; x < size; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();
    }
  }

  // Bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas),
    bumpMap: finalizeTexture(bumpCanvas)
  };
}

// 3. Ancient Deccan Basalt Rock (Ellora Kailasa Temple & Ajanta Caves)
export function createBasaltRockTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark weathered volcanic basalt
  ctx.fillStyle = '#423d38';
  ctx.fillRect(0, 0, size, size);

  // Volcanic pores and geological weathering
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = 1 + Math.random() * 3.5;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(25, 23, 20, 0.6)' : 'rgba(95, 88, 80, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chisel marks from top-down monolithic scooping
  ctx.strokeStyle = 'rgba(20, 18, 16, 0.35)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 15 + Math.random() * 25, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas),
    bumpMap: finalizeTexture(bumpCanvas)
  };
}

// 4. Weathered Orissan Khondalite Stone (Konark Sun Temple)
export function createKhondaliteTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm golden-brown ferric weathered stone
  ctx.fillStyle = '#9e6d4c';
  ctx.fillRect(0, 0, size, size);

  // Ferruginous oxidization patches
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = 25 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, 'rgba(128, 70, 35, 0.45)');
    grad.addColorStop(1, 'rgba(158, 109, 76, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stone carving relief details
  ctx.strokeStyle = 'rgba(60, 35, 20, 0.35)';
  ctx.lineWidth = 1.5;
  for (let y = 32; y < size; y += 48) {
    ctx.beginPath();
    ctx.arc(size / 2, y, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas),
    bumpMap: finalizeTexture(bumpCanvas)
  };
}

// 5. Monolithic Granite Stone (Brihadisvara & Hampi)
export function createGraniteTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Specckled pinkish-grey South Indian granite
  ctx.fillStyle = '#8a7d74';
  ctx.fillRect(0, 0, size, size);

  // Quartz, feldspar, and biotite mica flecks
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rand = Math.random();
    if (rand < 0.35) {
      ctx.fillStyle = 'rgba(215, 175, 160, 0.6)'; // Pink potassium feldspar
    } else if (rand < 0.7) {
      ctx.fillStyle = 'rgba(25, 25, 25, 0.7)'; // Black mica
    } else {
      ctx.fillStyle = 'rgba(235, 235, 240, 0.75)'; // White quartz
    }
    ctx.fillRect(x, y, 1.5 + Math.random() * 2, 1.5 + Math.random() * 2);
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas),
    bumpMap: finalizeTexture(bumpCanvas)
  };
}

// 6. Courtyard Flagstone Pavement
export function createPavementTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5c5248';
  ctx.fillRect(0, 0, size, size);

  // Ashlar paving grid
  ctx.strokeStyle = '#2b231d';
  ctx.lineWidth = 3;
  const step = 64;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Worn slab surface variations
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const tint = (Math.random() - 0.5) * 30;
      ctx.fillStyle = `rgba(${Math.round(90 + tint)}, ${Math.round(80 + tint)}, ${Math.round(70 + tint)}, 0.4)`;
      ctx.fillRect(x + 2, y + 2, step - 4, step - 4);
    }
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas),
    bumpMap: finalizeTexture(bumpCanvas)
  };
}

// 7. Reflecting Pool Living Water
export function createWaterTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0369a1');
  grad.addColorStop(0.5, '#0284c7');
  grad.addColorStop(1, '#075985');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric subtle water ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.2;
  for (let r = 10; r < size; r += 22) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return finalizeTexture(canvas);
}
