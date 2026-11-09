/**
 * src/components/hero/LeafParticles.jsx
 * Lightweight HTML5 Canvas leaf particle system.
 * Emits ~25 organic botanical particles drifting gently across the hero.
 * Pauses on tab blur and respects prefers-reduced-motion.
 */
import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks.js';

export function LeafParticles({ className = '' }) {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const LEAF_COLORS = [
      'rgba(169, 197, 169, 0.45)', // Sage
      'rgba(85, 97, 90, 0.35)',    // Muted green
      'rgba(204, 88, 51, 0.30)',   // Clay accent
      'rgba(46, 64, 54, 0.40)',    // Moss
    ];

    const PARTICLE_COUNT = 24;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * 0.4 + 0.2,
      speedY: Math.random() * 0.4 + 0.2,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      sway: Math.random() * 0.8,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI,
    }));

    function drawLeaf(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      // Draw almond / curved leaf shape
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
      ctx.fill();

      // Stem line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(0, p.size * 0.8);
      ctx.stroke();

      ctx.restore();
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    let frame = 0;
    function animate() {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        frame++;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.rotSpeed;
          p.x += p.speedX + Math.sin(frame * p.swaySpeed + p.swayOffset) * p.sway;
          p.y += p.speedY;

          // Wrap around edges
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) {
            p.x = -20;
          } else if (p.x < -20) {
            p.x = width + 20;
          }

          drawLeaf(p);
        }
      }
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}

export default LeafParticles;
