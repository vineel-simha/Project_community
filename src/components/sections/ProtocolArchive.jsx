/**
 * src/components/sections/ProtocolArchive.jsx
 * Protocol: Sticky Stacking Archive
 * Features:
 * - 3 full-screen instructional cards:
 *   1. SNAP & REPORT (Cream surface, animated concentric rings, geometric target, rotating pin)
 *   2. DISCOVER & FIX (Sage-tinted surface, dotted park grid, horizontal laser scanner locking on jobs)
 *   3. VERIFY & REWARD (Moss surface, EKG waveform transitioning to verified check emblem)
 * - Desktop GSAP ScrollTrigger pinning with scale (0.90), blur (up to 20px), and opacity (0.50)
 * - Mobile and prefers-reduced-motion fallback with normal unpinned vertical stack
 * - Clean release into following sections with no layout jumps
 */
import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap.js';
import { useReducedMotion } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import {
  Camera, Wrench, ShieldCheck, MapPin, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';

export function ProtocolArchive() {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // Only apply sticky pinning on desktop screens (>=1024px) without reduced motion
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
      if (cards.length < 3) return;

      // Pin the section while scrolling through cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Card 1 stays, Card 2 slides over Card 1
      tl.to(card1Ref.current, {
        scale: 0.90,
        filter: 'blur(16px)',
        opacity: 0.50,
        ease: 'power2.inOut',
        duration: 1,
      }, 0)
      .fromTo(card2Ref.current, {
        yPercent: 100,
        opacity: 0.8,
      }, {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.inOut',
        duration: 1,
      }, 0);

      // Card 2 stays, Card 3 slides over Card 2
      tl.to(card2Ref.current, {
        scale: 0.90,
        filter: 'blur(16px)',
        opacity: 0.50,
        ease: 'power2.inOut',
        duration: 1,
      }, 1)
      .fromTo(card3Ref.current, {
        yPercent: 100,
        opacity: 0.8,
      }, {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.inOut',
        duration: 1,
      }, 1);

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 lg:py-0 overflow-hidden"
      aria-label="CivicFix 3-Stage Restoration Protocol"
    >
      {/* Outer Section Intro (Visible before sticky pin) */}
      <div className="layout-fluid mb-8 lg:mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="citizen" size="sm">
            <Zap size={12} className="text-forest" />
            <span>Field Restoration Lifecycle</span>
          </Badge>
          <span className="text-xs font-mono-cf text-muted uppercase tracking-wider">
            Protocol Archive // 3 Steps
          </span>
        </div>
        <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter">
          From citizen glance to verified fix.
        </h2>
      </div>

      {/* ── Cards Stack Container ── */}
      <div
        ref={cardsContainerRef}
        className="relative layout-fluid h-auto lg:h-[82vh] lg:min-h-[580px] lg:flex lg:items-center"
      >
        <div className="relative w-full space-y-8 lg:space-y-0 lg:h-full">

          {/* ─────────────────────────────────────────────────────────────
              CARD 01: SNAP & REPORT (Cream surface)
             ───────────────────────────────────────────────────────────── */}
          <div
            ref={card1Ref}
            className="w-full lg:absolute lg:inset-0 rounded-4xl bg-cream border border-line shadow-card-lg p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between border-b border-line pb-6">
              <span className="font-mono-cf text-xs font-bold text-moss/70 tracking-widest uppercase">
                STEP 01 // CITIZEN INTAKE
              </span>
              <Badge variant="bounty" size="sm">
                Instant Bounty Trigger
              </Badge>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6">
              <div className="lg:col-span-7">
                <div className="w-12 h-12 rounded-2xl bg-clay/10 text-clay flex items-center justify-center mb-6">
                  <Camera size={24} />
                </div>
                <h3 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-moss tracking-tight mb-4">
                  Snap & Report
                </h3>
                <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed max-w-xl mb-6">
                  Citizens capture the issue, upload a photo and post the location to open a local maintenance bounty.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-outfit text-moss/80">
                  <span className="px-3 py-1.5 rounded-full bg-surface border border-line flex items-center gap-1.5">
                    <MapPin size={12} className="text-clay" /> Precision sketch-map pin
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-surface border border-line">
                    Up to 3 photo proofs
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-surface border border-line">
                    Instant unique CF ticket ID
                  </span>
                </div>
              </div>

              {/* Visual 01: Concentric Rings & Rotating Pin Motif */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  {/* Concentric Pulsing Rings */}
                  <div className="absolute inset-0 rounded-full border border-clay/20 animate-ping opacity-25" />
                  <div className="absolute inset-4 rounded-full border border-moss/20" />
                  <div className="absolute inset-10 rounded-full border border-dashed border-clay/40 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-16 rounded-full bg-surface shadow-card flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-clay/10 flex items-center justify-center">
                      <MapPin size={36} className="text-clay animate-bounce" />
                    </div>
                  </div>
                  {/* Radar crosshairs */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-line/60 pointer-events-none" />
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-line/60 pointer-events-none" />
                  {/* Geo-tag coordinates badge */}
                  <span className="absolute bottom-2 font-mono-cf text-[10px] text-moss/70 bg-surface/90 px-2 py-0.5 rounded shadow border border-line">
                    LAT 12.9716° · LON 77.5946°
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-jakarta text-muted">
              <span>Opens local gig bounty immediately (₹300 – ₹850)</span>
              <span className="font-mono-cf font-semibold text-moss">STAGE: SUBMITTED</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 02: DISCOVER & FIX (Sage-tinted surface)
             ───────────────────────────────────────────────────────────── */}
          <div
            ref={card2Ref}
            className="w-full lg:absolute lg:inset-0 rounded-4xl bg-[#E6ECE4] border border-sage/80 shadow-card-lg p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between border-b border-sage/60 pb-6">
              <span className="font-mono-cf text-xs font-bold text-forest tracking-widest uppercase">
                STEP 02 // WORKER DISPATCH
              </span>
              <Badge variant="worker" size="sm" className="bg-forest/10 border-forest/20 text-forest">
                Community Gig Network
              </Badge>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6">
              <div className="lg:col-span-7">
                <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-6">
                  <Wrench size={24} />
                </div>
                <h3 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-forest tracking-tight mb-4">
                  Discover & Fix
                </h3>
                <p className="font-jakarta text-forest/80 text-base sm:text-lg leading-relaxed max-w-xl mb-6">
                  Nearby registered workers log in, accept jobs in their area, resolve the problem on-site and upload photo proof.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-outfit text-forest/90">
                  <span className="px-3 py-1.5 rounded-full bg-surface/90 border border-sage flex items-center gap-1.5">
                    <Zap size={12} className="text-clay" /> Area distance filtering
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-surface/90 border border-sage">
                    Direct on-site execution
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-surface/90 border border-sage">
                    HTML5 Canvas 320px proof compression
                  </span>
                </div>
              </div>

              {/* Visual 02: Dotted Park Grid with Scanning Laser Beam */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-surface/70 border border-sage/80 p-4 overflow-hidden shadow-inner flex flex-col justify-between">
                  {/* Dotted Grid Background */}
                  <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-40">
                    <defs>
                      <pattern id="dotGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.2" fill="#2E4036" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotGrid)" />
                  </svg>

                  {/* Active Job Nodes */}
                  <div className="relative z-10 flex justify-around pt-3">
                    <div className="px-2 py-1 rounded-md bg-clay text-white text-[9px] font-mono-cf font-bold shadow animate-pulse">
                      JOB #402
                    </div>
                    <div className="px-2 py-1 rounded-md bg-forest text-cream text-[9px] font-mono-cf">
                      IDLE
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between px-4">
                    <div className="w-3 h-3 rounded-full bg-clay ring-4 ring-clay/30" />
                    <div className="w-3 h-3 rounded-full bg-forest ring-4 ring-forest/20" />
                  </div>

                  <div className="relative z-10 flex justify-center pb-2">
                    <span className="font-mono-cf text-[10px] text-forest/80 font-semibold bg-sage/40 px-2 py-0.5 rounded">
                      RADIUS: 3.2 KM // 4 OPEN BOUNTIES
                    </span>
                  </div>

                  {/* Scanning Laser Beam Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-clay to-transparent shadow-lg shadow-clay/50 animate-[scanLaser_3s_ease-in-out_infinite] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-sage/60 flex items-center justify-between text-xs font-jakarta text-forest/70">
              <span>Technicians upload completion photograph + resolution notes</span>
              <span className="font-mono-cf font-semibold text-forest">STAGE: IN PROGRESS → PENDING</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CARD 03: VERIFY & REWARD (Moss surface)
             ───────────────────────────────────────────────────────────── */}
          <div
            ref={card3Ref}
            className="w-full lg:absolute lg:inset-0 rounded-4xl bg-moss text-cream border border-forest shadow-card-lg p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between border-b border-cream/20 pb-6">
              <span className="font-mono-cf text-xs font-bold text-sage tracking-widest uppercase">
                STEP 03 // HANDSHAKE PAYOUT
              </span>
              <Badge variant="resolved" size="sm" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                Citizen Handshake
              </Badge>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6">
              <div className="lg:col-span-7">
                <div className="w-12 h-12 rounded-2xl bg-sage/20 text-sage flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-cream tracking-tight mb-4">
                  Verify & Reward
                </h3>
                <p className="font-jakarta text-cream/70 text-base sm:text-lg leading-relaxed max-w-xl mb-6">
                  The original reporter inspects the worker's photo proof and approves the fix to release the maintenance payout.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-outfit text-cream/90">
                  <span className="px-3 py-1.5 rounded-full bg-forest/80 border border-cream/20 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Side-by-side Before/After
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-forest/80 border border-cream/20">
                    One-click bounty wallet credit
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-forest/80 border border-cream/20">
                    Rework request protection
                  </span>
                </div>
              </div>

              {/* Visual 03: EKG Waveform Transitioning to Verified Check */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-forest/80 border border-cream/20 p-6 flex flex-col justify-between items-center shadow-inner">
                  <span className="font-mono-cf text-[10px] text-sage/70 self-start">
                    PROOF VERIFICATION TELEMETRY
                  </span>

                  {/* Animated EKG SVG Waveform */}
                  <svg viewBox="0 0 200 80" className="w-full h-20 overflow-visible">
                    <path
                      d="M 10 40 L 50 40 L 65 15 L 75 65 L 90 25 L 105 50 L 120 40 L 190 40"
                      fill="none"
                      stroke="#A9C5A9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-[pulse_2s_ease-in-out_infinite]"
                    />
                  </svg>

                  {/* Verified Check Emblem */}
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={32} className="text-emerald-300" />
                  </div>

                  <span className="font-mono-cf text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    BOUNTY RELEASED: ₹600.00
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-cream/20 flex items-center justify-between text-xs font-jakarta text-cream/60">
              <span>Simulated demo wallet balance credited automatically</span>
              <span className="font-mono-cf font-semibold text-emerald-400">STAGE: RESOLVED</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0%, 100% { top: 10%; opacity: 0.2; }
          50%      { top: 85%; opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}

export default ProtocolArchive;
