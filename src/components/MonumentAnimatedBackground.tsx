import { useEffect, useRef } from 'react';

interface MonumentAnimatedBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  isFixed?: boolean;
}

export function MonumentAnimatedBackground({
  children,
  className = '',
  isFixed = true,
}: MonumentAnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    // Floating golden diya / lantern particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
    }[] = [];

    const numParticles = 75;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 1.2,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.75 + 0.25,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let panOffset = 0;

    const render = () => {
      time += 0.012;
      panOffset += 0.35; // Gentle continuous horizontal pan of the monument panorama
      ctx.clearRect(0, 0, width, height);

      // 1. Royal Indian Twilight Sky Gradient (Deep Sandstone Obsidian -> Royal Amber Glow)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#100a06');
      grad.addColorStop(0.3, '#190e07');
      grad.addColorStop(0.65, '#221207');
      grad.addColorStop(0.85, '#2a1608');
      grad.addColorStop(1, '#140a04');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars Twinkling
      stars.forEach((s) => {
        s.alpha += Math.sin(time * 2 + s.x) * s.speed;
        const a = Math.max(0.1, Math.min(0.9, s.alpha));
        ctx.fillStyle = `rgba(254, 240, 138, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Subtle Golden Auroral Halo Beams
      const beamX1 = width * 0.3 + Math.sin(time * 0.5) * 140;
      const beamY1 = height * 0.35 + Math.cos(time * 0.4) * 70;
      const radGrad1 = ctx.createRadialGradient(beamX1, beamY1, 20, beamX1, beamY1, width * 0.5);
      radGrad1.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radGrad1.addColorStop(0.5, 'rgba(217, 119, 6, 0.07)');
      radGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad1;
      ctx.fillRect(0, 0, width, height);

      const beamX2 = width * 0.75 + Math.cos(time * 0.35) * 160;
      const beamY2 = height * 0.55 + Math.sin(time * 0.45) * 90;
      const radGrad2 = ctx.createRadialGradient(beamX2, beamY2, 30, beamX2, beamY2, width * 0.45);
      radGrad2.addColorStop(0, 'rgba(234, 88, 12, 0.15)');
      radGrad2.addColorStop(0.6, 'rgba(180, 83, 9, 0.05)');
      radGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad2;
      ctx.fillRect(0, 0, width, height);

      // 4. Rotating Sacred Mandala in Background
      ctx.save();
      ctx.translate(width * 0.5, height * 0.42);
      ctx.rotate(time * 0.035);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1.5;

      const mandalaR = Math.min(width, height) * 0.48;
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        ctx.arc(0, 0, (mandalaR * ring) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      const numPetals = 16;
      for (let p = 0; p < numPetals; p++) {
        const ang = (p * Math.PI * 2) / numPetals;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * mandalaR, Math.sin(ang) * mandalaR);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(Math.cos(ang) * mandalaR * 0.6, Math.sin(ang) * mandalaR * 0.6, mandalaR * 0.16, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Animated Panning Horizon Monument Silhouettes with Golden Edge Glow
      ctx.save();
      const baseY = height * 0.92;
      ctx.fillStyle = 'rgba(14, 8, 4, 0.9)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);

      // Repeating monument profile (Taj Mahal, Konark, Hampi, Qutub, Fort)
      const segWidth = 420;
      const numSegs = Math.ceil(width / segWidth) + 2;
      const offset = -(panOffset % segWidth);

      for (let s = -1; s < numSegs; s++) {
        const sx = s * segWidth + offset;

        // 1. Temple Vimana Spire (Brihadisvara / Hampi)
        ctx.lineTo(sx + 30, baseY);
        ctx.lineTo(sx + 55, baseY - 60);
        ctx.lineTo(sx + 65, baseY - 90); // Spire peak
        ctx.lineTo(sx + 67, baseY - 98); // Kalasha finial
        ctx.lineTo(sx + 70, baseY - 90);
        ctx.lineTo(sx + 80, baseY - 60);
        ctx.lineTo(sx + 105, baseY);

        // 2. Qutub Minar Tapering Tower with Balconies
        ctx.lineTo(sx + 130, baseY);
        ctx.lineTo(sx + 136, baseY - 40);
        ctx.lineTo(sx + 142, baseY - 40); // balcony
        ctx.lineTo(sx + 138, baseY - 80);
        ctx.lineTo(sx + 144, baseY - 80); // balcony
        ctx.lineTo(sx + 140, baseY - 110); // peak
        ctx.lineTo(sx + 142, baseY - 110);
        ctx.lineTo(sx + 148, baseY);

        // 3. Central Taj Mahal Grand Bulbous Dome & Minarets
        ctx.lineTo(sx + 180, baseY);
        // Left Minaret
        ctx.lineTo(sx + 185, baseY - 85);
        ctx.lineTo(sx + 189, baseY - 85);
        ctx.lineTo(sx + 192, baseY);
        // Plinth & Arched Iwan
        ctx.lineTo(sx + 205, baseY);
        ctx.lineTo(sx + 215, baseY - 45);
        // Bulbous Dome
        ctx.arc(sx + 240, baseY - 65, 26, Math.PI * 0.85, Math.PI * 0.15, true);
        ctx.lineTo(sx + 240, baseY - 100); // Golden finial
        ctx.lineTo(sx + 241, baseY - 65);
        ctx.lineTo(sx + 265, baseY - 45);
        ctx.lineTo(sx + 275, baseY);
        // Right Minaret
        ctx.lineTo(sx + 288, baseY - 85);
        ctx.lineTo(sx + 292, baseY - 85);
        ctx.lineTo(sx + 295, baseY);

        // 4. Fort Ramparts & Bastions (Chittorgarh / Red Fort)
        ctx.lineTo(sx + 315, baseY);
        ctx.lineTo(sx + 315, baseY - 40);
        ctx.lineTo(sx + 335, baseY - 40);
        ctx.lineTo(sx + 335, baseY - 32);
        ctx.lineTo(sx + 355, baseY - 32);
        ctx.lineTo(sx + 355, baseY - 40);
        ctx.lineTo(sx + 375, baseY - 40);
        ctx.lineTo(sx + 375, baseY);

        // 5. Buddhist Stupa Dome (Sanchi)
        ctx.lineTo(sx + 390, baseY);
        ctx.arc(sx + 405, baseY, 25, Math.PI, 0);
        ctx.lineTo(sx + 405, baseY - 32); // harmika
        ctx.lineTo(sx + 420, baseY);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 6. Floating Golden Diya / Sparkle Particles Floating Upwards
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.pulse) * 0.35;
        p.pulse += 0.02;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Warm golden diya glow
        ctx.fillStyle = `rgba(251, 191, 36, ${currentOpacity})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = p.size * 6;
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

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Animated Canvas */}
      <canvas
        ref={canvasRef}
        className={`${isFixed ? 'fixed' : 'absolute'} inset-0 w-full h-full pointer-events-none z-0`}
      />

      {/* Content wrapper with royal warm ambient backdrop */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
