import { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

export interface MonumentBackdrop {
  name: string;
  hindiName: string;
  sub: string;
  url: string;
}

export const heritageBackdrops: MonumentBackdrop[] = [
  {
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर',
    sub: 'Odisha • 13th Century Ganga Dynasty Sun Chariot',
    url: 'https://plus.unsplash.com/premium_photo-1694475136007-14c4dbf484f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
  {
    name: 'Taj Mahal',
    hindiName: 'ताज महल',
    sub: 'Agra, Uttar Pradesh • Mughal Makrana Marble Wonder',
    url: 'https://plus.unsplash.com/premium_photo-1661885523029-fc960a2bb4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
  {
    name: 'Hampi Vittala Stone Chariot',
    hindiName: 'हम्पी प्रस्तर रथ',
    sub: 'Vijayanagara, Karnataka • 14th Century Imperial Capital',
    url: 'https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
  {
    name: 'Ellora Kailasa Monolithic Temple',
    hindiName: 'कैलाश मंदिर, एलोरा',
    sub: 'Maharashtra • Monolithic Mountain Rock-Cut Wonder',
    url: 'https://plus.unsplash.com/premium_photo-1697729444936-8c6a6f643312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
  {
    name: 'The Brihadisvara Temple',
    hindiName: 'बृहदीश्वर मंदिर, तंजावुर',
    sub: 'Thanjavur, Tamil Nadu • 1010 CE Great Living Chola Temple',
    url: 'https://images.unsplash.com/photo-1686310894901-d326b8722c13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
  {
    name: 'Chittorgarh Fort',
    hindiName: 'चित्तौड़गढ़ किला',
    sub: 'Rajasthan • Legendary Hilltop Mewar Citadel & Victory Tower',
    url: 'https://plus.unsplash.com/premium_photo-1697729640715-b4f8b691b9ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920'
  },
];

interface MonumentAnimatedBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  isFixed?: boolean;
  showBackdropIndicator?: boolean;
}

export function MonumentAnimatedBackground({
  children,
  className = '',
  isFixed = true,
  showBackdropIndicator = true,
}: MonumentAnimatedBackgroundProps) {
  const [currentBackdrop, setCurrentBackdrop] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-cycle through living monument backdrops every 9 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentBackdrop((prev) => (prev + 1) % heritageBackdrops.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Canvas particle & sacred geometry animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const onResize = () => {
      if (!canvas) return;
      if (isFixed) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      } else {
        const parent = canvas.parentElement;
        width = canvas.width = parent?.clientWidth || window.innerWidth;
        height = canvas.height = parent?.clientHeight || 600;
      }
    };
    onResize();
    window.addEventListener('resize', onResize);

    // Stars / Constellations
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    const numStars = isFixed ? 90 : 45;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * ((height || window.innerHeight) * 0.75),
        size: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    // Floating golden diya / sacred lantern particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
      color: string;
    }[] = [];

    const numParticles = isFixed ? 65 : 35;
    const colors = [
      'rgba(251, 191, 36, ', // Amber
      'rgba(245, 158, 11, ', // Golden orange
      'rgba(249, 115, 22, ', // Saffron
      'rgba(253, 230, 138, ', // Light gold
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        size: Math.random() * 2.8 + 1.2,
        speedY: -(Math.random() * 0.45 + 0.18),
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.75 + 0.25,
        pulse: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // 1. Soft Twinkling Constellations in Upper Sky
      stars.forEach((s) => {
        s.alpha += Math.sin(time * 2.5 + s.x) * s.speed;
        const a = Math.max(0.15, Math.min(0.85, s.alpha));
        ctx.fillStyle = `rgba(254, 240, 138, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Rotating Konark Sun Wheel / Cosmic Sacred Mandala in Upper Background
      ctx.save();
      const chakraCenterX = width * 0.5;
      const chakraCenterY = height * (isFixed ? 0.35 : 0.45);
      const chakraRadius = Math.min(width, height) * (isFixed ? 0.45 : 0.35);

      ctx.translate(chakraCenterX, chakraCenterY);
      ctx.rotate(time * 0.025); // Gentle celestial rotation
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.07)';
      ctx.lineWidth = 1.6;

      // Concentric sanctum rings
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, (chakraRadius * r) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 24 Astronomical Spokes (Konark Surya Chakra)
      const numSpokes = 24;
      for (let sp = 0; sp < numSpokes; sp++) {
        const ang = (sp * Math.PI * 2) / numSpokes;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * chakraRadius, Math.sin(ang) * chakraRadius);
        ctx.stroke();

        if (sp % 2 === 0) {
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * chakraRadius * 0.65, Math.sin(ang) * chakraRadius * 0.65, chakraRadius * 0.05, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Floating Golden Diya / Firefly Embers Rising Upward
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.pulse) * 0.4;
        p.pulse += 0.025;

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = p.size * 7;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [isFixed]);

  const activeBackdrop = heritageBackdrops[currentBackdrop];

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 1. Living Monument Background Imagery with Smooth Crossfade & Cinematic Drift */}
      <div className={`${isFixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none z-0 overflow-hidden`}>
        {heritageBackdrops.map((backdrop, idx) => {
          const isActive = idx === currentBackdrop;
          return (
            <div
              key={backdrop.name}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={backdrop.url}
                alt={backdrop.name}
                className={`w-full h-full object-cover transform transition-transform duration-[12000ms] ease-out ${
                  isActive ? 'scale-110 translate-y-1' : 'scale-100 translate-y-0'
                }`}
              />
            </div>
          );
        })}

        {/* 2. Royal Atmospheric Indian Twilight Gradients & Overlays (Ensuring High Contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/75 to-stone-950/95 z-20" />
        <div className="absolute inset-0 bg-radial from-amber-500/15 via-orange-950/20 to-stone-950/80 z-20 pointer-events-none mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/25 via-transparent to-black/60 z-20 pointer-events-none" />

        {/* 3. Golden Particle & Konark Surya Chakra Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />
      </div>

      {/* 4. Floating Backdrop Control Indicator (Only if enabled and fixed) */}
      {showBackdropIndicator && isFixed && (
        <aside
          aria-label="Living Heritage Atmosphere"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-950/85 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-xs text-stone-200 pointer-events-auto hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                Living Heritage Atmosphere
              </span>
              <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                {activeBackdrop.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPaused(true);
              setCurrentBackdrop((prev) => (prev + 1) % heritageBackdrops.length);
            }}
            title="Switch to next heritage monument backdrop"
            className="ml-2 p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 transition-all flex items-center gap-1 font-bold text-[11px]"
          >
            <span>Switch</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* 5. Main Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
