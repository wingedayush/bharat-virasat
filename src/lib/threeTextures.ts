import * as THREE from 'three';

// Procedural Photorealistic Material Engine for Indian Heritage 3D Reconstructions
// High-fidelity PBR procedural maps, bump maps, roughness maps, and environmental sky textures

function finalizeTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

// 1. Makrana Imperial White Marble (Taj Mahal)
// Authentic crystalline translucent marble with grey & honey veining + Pietra Dura floral borders
export function createMarbleTexture(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base luminous warm crystalline marble
  ctx.fillStyle = '#faf7f2';
  ctx.fillRect(0, 0, size, size);

  // Soft translucent cloudy mineral depth
  for (let i = 0; i < 70; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const rad = 60 + Math.random() * 120;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    grad.addColorStop(0, 'rgba(235, 227, 214, 0.42)');
    grad.addColorStop(0.6, 'rgba(245, 240, 232, 0.2)');
    grad.addColorStop(1, 'rgba(250, 247, 242, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Natural delicate grey and honey marble veins with branching
  for (let v = 0; v < 10; v++) {
    ctx.beginPath();
    let x = Math.random() * size;
    let y = 0;
    ctx.moveTo(x, y);
    ctx.strokeStyle =
      v % 3 === 0
        ? 'rgba(165, 155, 140, 0.32)'
        : v % 3 === 1
        ? 'rgba(205, 185, 150, 0.26)'
        : 'rgba(135, 125, 115, 0.2)';
    ctx.lineWidth = 1.0 + Math.random() * 2.2;
    while (y < size) {
      x += (Math.random() - 0.5) * 32;
      y += 12 + Math.random() * 24;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Marble Ashlar panel seams (large precision-fitted marble slabs)
  ctx.strokeStyle = 'rgba(180, 170, 155, 0.35)';
  ctx.lineWidth = 1.5;
  const slabSize = 256;
  for (let y = 0; y <= size; y += slabSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += slabSize) {
    const offset = (y / slabSize) % 2 === 0 ? 0 : slabSize / 2;
    for (let x = offset; x <= size; x += slabSize) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + slabSize);
      ctx.stroke();
    }
  }

  // Micro crystalline grain
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 8;
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + grain));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + grain));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // Roughness Map (very smooth, high specular luster with slight variation along seams)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#444444'; // ~0.27 roughness
  rCtx.fillRect(0, 0, size, size);
  // Slightly rougher along seams
  rCtx.strokeStyle = '#666666';
  rCtx.lineWidth = 2;
  for (let y = 0; y <= size; y += slabSize) {
    rCtx.beginPath();
    rCtx.moveTo(0, y);
    rCtx.lineTo(size, y);
    rCtx.stroke();
  }

  // Bump Map for subtle slab depth
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  bCtx.strokeStyle = '#555555';
  bCtx.lineWidth = 2;
  for (let y = 0; y <= size; y += slabSize) {
    bCtx.beginPath();
    bCtx.moveTo(0, y);
    bCtx.lineTo(size, y);
    bCtx.stroke();
  }

  return {
    map: finalizeTexture(canvas, 1, 1),
    roughnessMap: finalizeTexture(roughCanvas, 1, 1),
    bumpMap: finalizeTexture(bumpCanvas, 1, 1),
  };
}

// 2. Red Agra & Sikri Sandstone (Qutub Minar, Red Fort, Agra Fort)
export function createRedSandstoneTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm ferric oxide terracotta red
  ctx.fillStyle = '#aa442c';
  ctx.fillRect(0, 0, size, size);

  // Sedimentary horizontal mineral strata
  for (let y = 0; y < size; y += 3) {
    const wave = Math.sin(y * 0.04) * 22 + (Math.random() - 0.5) * 14;
    const r = Math.min(255, Math.max(0, 172 + wave));
    const g = Math.min(255, Math.max(0, 70 + wave * 0.5));
    const b = Math.min(255, Math.max(0, 44 + wave * 0.35));
    ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    ctx.fillRect(0, y, size, 3);
  }

  // Sandstone granular texture
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 26;
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Ashlar masonry block joints
  ctx.strokeStyle = 'rgba(55, 18, 12, 0.65)';
  ctx.lineWidth = 2.5;
  const blockH = 80;
  const blockW = 160;
  for (let y = 0; y <= size; y += blockH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += blockH) {
    const offset = (y / blockH) % 2 === 0 ? 0 : blockW / 2;
    for (let x = offset; x <= size; x += blockW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + blockH);
      ctx.stroke();
    }
  }

  // Bump Map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 1, 1),
    bumpMap: finalizeTexture(bumpCanvas, 1, 1),
  };
}

// 3. Ancient Deccan Basalt Rock (Ellora Kailasa Temple & Ajanta Caves)
export function createBasaltRockTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep dark weathered basalt cliff tone
  ctx.fillStyle = '#3c3631';
  ctx.fillRect(0, 0, size, size);

  // Weathering color gradients and patina
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = 40 + Math.random() * 120;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, Math.random() > 0.5 ? 'rgba(30, 27, 24, 0.55)' : 'rgba(75, 68, 60, 0.4)');
    grad.addColorStop(1, 'rgba(60, 54, 49, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chiseled horizontal rock quarry strata
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(20, 18, 16, 0.45)' : 'rgba(90, 82, 74, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 25 + Math.random() * 45, y + (Math.random() - 0.5) * 12);
    ctx.stroke();
  }

  // Volcanic vesicular pores
  for (let i = 0; i < 1200; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const prad = 1 + Math.random() * 3.5;
    ctx.fillStyle = 'rgba(18, 16, 14, 0.7)';
    ctx.beginPath();
    ctx.arc(px, py, prad, 0, Math.PI * 2);
    ctx.fill();
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 1, 1),
    bumpMap: finalizeTexture(bumpCanvas, 1, 1),
  };
}

// 4. Weathered Orissan Khondalite Stone (Konark Sun Temple)
export function createKhondaliteTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9b6c4b';
  ctx.fillRect(0, 0, size, size);

  // Ferric oxidization patches and coastal salt weathering
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = 30 + Math.random() * 90;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, 'rgba(125, 72, 38, 0.5)');
    grad.addColorStop(1, 'rgba(155, 108, 75, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Carved architectural frieze relief bands
  ctx.strokeStyle = 'rgba(50, 28, 14, 0.45)';
  ctx.lineWidth = 2.0;
  for (let y = 64; y < size; y += 96) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
    // Scrollwork flourishes
    for (let x = 20; x < size; x += 48) {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI);
      ctx.stroke();
    }
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 1, 1),
    bumpMap: finalizeTexture(bumpCanvas, 1, 1),
  };
}

// 5. Monolithic Granite Stone (Brihadisvara & Hampi)
export function createGraniteTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8c7f76';
  ctx.fillRect(0, 0, size, size);

  // Crystalline mineral flecks: pink potassium feldspar, white quartz, black biotite mica
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random();
    if (r < 0.38) {
      ctx.fillStyle = 'rgba(215, 178, 162, 0.65)'; // Pink feldspar
    } else if (r < 0.72) {
      ctx.fillStyle = 'rgba(22, 22, 22, 0.75)'; // Dark biotite
    } else {
      ctx.fillStyle = 'rgba(240, 240, 245, 0.8)'; // Translucent quartz
    }
    ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  // Interlocking dry-stone granite joint lines
  ctx.strokeStyle = 'rgba(40, 36, 32, 0.6)';
  ctx.lineWidth = 2.0;
  const blockH = 96;
  const blockW = 192;
  for (let y = 0; y <= size; y += blockH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += blockH) {
    const offset = (y / blockH) % 2 === 0 ? 0 : blockW / 2;
    for (let x = offset; x <= size; x += blockW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + blockH);
      ctx.stroke();
    }
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 1, 1),
    bumpMap: finalizeTexture(bumpCanvas, 1, 1),
  };
}

// 6. Courtyard Flagstone Pavement
export function createPavementTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#554c42';
  ctx.fillRect(0, 0, size, size);

  // Large weathered flagstone grid
  const step = 128;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const tint = (Math.random() - 0.5) * 35;
      ctx.fillStyle = `rgb(${Math.round(85 + tint)}, ${Math.round(76 + tint)}, ${Math.round(66 + tint)})`;
      ctx.fillRect(x + 2, y + 2, step - 4, step - 4);
    }
  }

  ctx.strokeStyle = '#221b16';
  ctx.lineWidth = 3.5;
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

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 2, 2),
    bumpMap: finalizeTexture(bumpCanvas, 2, 2),
  };
}

// 7. Reflecting Pool Living Water with ripples
export function createWaterTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.5, '#0369a1');
  grad.addColorStop(1, '#075985');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric caustic ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  for (let r = 8; r < size; r += 24) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return finalizeTexture(canvas, 1, 1);
}

// 8. Atmospheric Sky Texture based on Sun Hour (6 AM to 20 PM)
export function createSkyTexture(sunHour = 16): THREE.CanvasTexture {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, height);

  if (sunHour <= 7) {
    // Dawn / Brahma Muhurta: Soft coral, rose, lilac & warm amber horizon
    grad.addColorStop(0, '#1e1b4b'); // Deep indigo zenith
    grad.addColorStop(0.35, '#3b1d64');
    grad.addColorStop(0.65, '#b45309');
    grad.addColorStop(0.85, '#f59e0b');
    grad.addColorStop(1, '#fde68a'); // Warm golden horizon
  } else if (sunHour >= 8 && sunHour <= 14) {
    // Clear Indian Midday: Radiant cyan & azure blue
    grad.addColorStop(0, '#0369a1'); // Deep sky blue
    grad.addColorStop(0.4, '#38bdf8');
    grad.addColorStop(0.75, '#bae6fd');
    grad.addColorStop(1, '#e0f2fe'); // Soft pale horizon haze
  } else if (sunHour >= 15 && sunHour <= 18) {
    // Golden Hour: Rich amber, apricot, fiery orange & serene blue
    grad.addColorStop(0, '#1e3a8a'); // Deep royal blue zenith
    grad.addColorStop(0.3, '#7c2d12'); // Amber twilight
    grad.addColorStop(0.65, '#ea580c'); // Warm orange
    grad.addColorStop(0.88, '#f59e0b'); // Golden sun glow
    grad.addColorStop(1, '#fef08a'); // Bright gold horizon
  } else {
    // Night / Twilight: Deep midnight velvet with faint starry dust
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(0.85, '#1e1b4b');
    grad.addColorStop(1, '#2e1065');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Add subtle star points if evening/night
  if (sunHour >= 19 || sunHour <= 6) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 140; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * (height * 0.65);
      const srad = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, srad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}

// 9. Charbagh Manicured Lawn Texture (Mughal Gardens)
export function createGardenTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep manicured grass green
  ctx.fillStyle = '#2d5a27';
  ctx.fillRect(0, 0, size, size);

  // Subtle turf variation
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random();
    ctx.fillStyle =
      r < 0.4
        ? 'rgba(30, 80, 25, 0.45)'
        : r < 0.8
        ? 'rgba(60, 110, 45, 0.4)'
        : 'rgba(20, 50, 18, 0.5)';
    ctx.fillRect(x, y, 2, 3);
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.drawImage(canvas, 0, 0);

  return {
    map: finalizeTexture(canvas, 3, 3),
    bumpMap: finalizeTexture(bumpCanvas, 3, 3),
  };
}
