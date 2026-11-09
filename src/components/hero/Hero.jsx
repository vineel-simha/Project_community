/**
 * src/components/hero/Hero.jsx
 * Full-viewport cinematic hero with:
 * - Fluid responsive two-column grid using layout-fluid (no restrictive central squeezing)
 * - Deep moss-to-black gradient + botanical SVG texture + noise
 * - Canvas leaf particles drifting in background
 * - Staggered GSAP entrance (runs once on mount)
 * - Editorial headline: Plus Jakarta Sans + Cormorant Garamond italic
 * - Direct route navigation: /report, /track-verify, /worker-jobs
 * - Interactive layered SVG botanical ParkIsland with 3D tilt & maintenance hotspots
 * - Fully responsive, reduced-motion safe
 */
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Wrench } from 'lucide-react';
import { gsap } from '../../lib/gsap.js';
import { useReducedMotion } from '../../lib/hooks.js';
import { Button } from '../ui/Button.jsx';
import { ParkIsland } from './ParkIsland.jsx';
import { LeafParticles } from './LeafParticles.jsx';
import BRAND from '../../config/brand.js';

export function Hero({ onSelectCategory }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.from('.hero-eyebrow', {
        y: 24, opacity: 0, duration: 0.6, ease: 'power3.out',
      })
      .from('.hero-headline-1', {
        y: 40, opacity: 0, duration: 0.75, ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-headline-2', {
        y: 50, opacity: 0, duration: 0.85, ease: 'power3.out',
      }, '-=0.5')
      .from('.hero-supporting', {
        y: 30, opacity: 0, duration: 0.65, ease: 'power3.out',
      }, '-=0.4')
      .from('.hero-ctas', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      }, '-=0.35')
      .from('.hero-secondary', {
        y: 15, opacity: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-island-col', {
        x: 60, opacity: 0, duration: 1, ease: 'power3.out',
      }, '-=1.1')
      .from('.hero-scroll-hint', {
        opacity: 0, duration: 0.5,
      }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden bg-forest"
      style={{
        background: 'linear-gradient(155deg, #173D2C 0%, #0D2A1D 45%, #0A0A0A 100%)',
      }}
    >
      {/* ── Background Leaf Particle System ─────────────────────────────── */}
      <LeafParticles />

      {/* ── Botanical SVG texture layer ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.07 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 10 C60 10 30 35 30 60 C30 77 44 90 60 90 C76 90 90 77 90 60 C90 35 60 10 60 10Z"
                fill="none" stroke="#A9C5A9" strokeWidth="0.8" opacity="0.6"/>
              <line x1="60" y1="90" x2="60" y2="110" stroke="#A9C5A9" strokeWidth="0.5" opacity="0.4"/>
              <path d="M40 55 C50 50 60 60 70 55" fill="none" stroke="#A9C5A9" strokeWidth="0.5" opacity="0.4"/>
              <path d="M35 65 C45 58 60 68 75 61" fill="none" stroke="#A9C5A9" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-grid)"/>
        </svg>
      </div>

      {/* ── Gradient radial glow ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '20%', right: '-5%',
          width: '55vw', height: '55vw',
          background: 'radial-gradient(ellipse at center, rgba(46,64,54,0.5) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '0', left: '10%',
          width: '30vw', height: '30vw',
          background: 'radial-gradient(ellipse at center, rgba(204,88,51,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* ── Main content (Full-Width Responsive Two-Column Grid) ─────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full layout-fluid pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* ── Left: Editorial content (7 cols on desktop) ─────────────── */}
            <div className="lg:col-span-7 flex flex-col max-w-2xl">

              {/* Eyebrow */}
              <p
                className="hero-eyebrow font-outfit font-semibold text-xs tracking-[0.2em] text-sage/70 uppercase mb-6"
                aria-hidden="true"
              >
                {BRAND.hero.eyebrow}
              </p>

              {/* Headline */}
              <h1 id="hero-heading" className="mb-6">
                <span className="hero-headline-1 block font-jakarta font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.08] tracking-tighter text-cream">
                  {BRAND.hero.headline1}
                </span>
                <span
                  className="hero-headline-2 block font-cormorant italic text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1] text-cream"
                  aria-label="report."
                >
                  report<span className="text-clay">.</span>
                </span>
              </h1>

              {/* Supporting copy */}
              <p className="hero-supporting font-jakarta text-cream/70 leading-relaxed text-sm sm:text-base max-w-xl mb-8">
                {BRAND.hero.supporting}
              </p>

              {/* Direct Route CTAs */}
              <div className="hero-ctas flex flex-wrap gap-3 mb-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/report')}
                  className="rounded-full shadow-clay"
                >
                  <MapPin size={16} />
                  {BRAND.cta.primary}
                </Button>
                <Button
                  variant="ghost-light"
                  size="lg"
                  onClick={() => navigate('/track-verify')}
                  className="rounded-full"
                >
                  <Search size={16} />
                  {BRAND.cta.secondary}
                </Button>
              </div>

              {/* Worker secondary link */}
              <div className="hero-secondary flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/worker-jobs')}
                  className="text-left text-sm text-sage/70 hover:text-sage font-outfit font-medium transition-colors group flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded"
                >
                  <Wrench size={13} className="flex-shrink-0" />
                  {BRAND.hero.workerCta}
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-cream/40 font-jakarta">
                  {BRAND.hero.supportingSmall}
                </p>
              </div>
            </div>

            {/* ── Right: Park Island column (5 cols on desktop) ───────────── */}
            <div
              className="hero-island-col lg:col-span-5 relative flex items-center justify-center min-h-[360px] lg:min-h-[540px]"
            >
              <ParkIsland onSelectCategory={onSelectCategory} />
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────────── */}
      <div
        className="hero-scroll-hint relative z-10 flex justify-center pb-8"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="font-outfit text-cream text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-cream/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
