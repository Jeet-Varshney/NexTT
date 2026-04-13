import { useEffect, useRef } from 'react';
import './BackgroundAnimation.css';

const PARTICLE_COUNT = 65;

// Aurora-palette particle colors
const COLORS = [
  { r: 139, g: 92,  b: 246 }, // Violet
  { r: 6,   g: 182, b: 212 }, // Cyan
  { r: 244, g: 63,  b: 94  }, // Rose
  { r: 251, g: 146, b: 60  }, // Amber
  { r: 167, g: 139, b: 250 }, // Lavender
];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let width    = canvas.width  = window.innerWidth;
    let height   = canvas.height = window.innerHeight;
    let animId;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:     random(0, width),
        y:     random(0, height),
        vx:    random(-0.3, 0.3),
        vy:    random(-0.3, 0.3),
        r:     random(1.2, 2.8),
        alpha: random(0.25, 0.75),
        color,
      };
    });

    const onResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ── Connection lines ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.2;
            const ci = particles[i].color;
            const cj = particles[j].color;
            // Blend between the two particle colors for the line
            const mr = (ci.r + cj.r) / 2;
            const mg = (ci.g + cj.g) / 2;
            const mb = (ci.b + cj.b) / 2;

            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grad.addColorStop(0,   `rgba(${ci.r},${ci.g},${ci.b},${opacity})`);
            grad.addColorStop(0.5, `rgba(${mr},${mg},${mb},${opacity * 1.3})`);
            grad.addColorStop(1,   `rgba(${cj.r},${cj.g},${cj.b},${opacity})`);

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth   = 0.9;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Particles ──
      particles.forEach(p => {
        const { r: pr, g: pg, b: pb } = p.color;

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        glow.addColorStop(0,   `rgba(${pr},${pg},${pb},${p.alpha * 0.8})`);
        glow.addColorStop(0.4, `rgba(${pr},${pg},${pb},${p.alpha * 0.3})`);
        glow.addColorStop(1,   `rgba(${pr},${pg},${pb},0)`);

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Move + bounce
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
};

export default BackgroundAnimation;
