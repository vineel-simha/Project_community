/**
 * src/components/hero/ParkIsland.jsx
 * Interactive layered SVG botanical park island with:
 * - GSAP quickTo() layer parallax & container 3D tilt (max 6 degrees)
 * - 6 keyboard-focusable maintenance hotspots with floating labels
 * - Category preselection synchronization
 * - Fallback to static illustration for touch devices and prefers-reduced-motion
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { useReducedMotion, useIsMobile } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import {
  Wrench, Trash2, Lightbulb, Footprints, Droplets, Sparkles, ChevronRight
} from 'lucide-react';

const HOTSPOTS = [
  {
    id: 'benches',
    label: 'Damaged Bench',
    bounty: '₹450',
    description: 'Loose slats & rusted bolts near West Lawn',
    icon: Wrench,
    x: 32, // percentage across container
    y: 70, // percentage down container
    area: 'West Lawn Area',
  },
  {
    id: 'lighting',
    label: 'Pathway Lamp Out',
    bounty: '₹600',
    description: 'Fixture short-circuit along perimeter trail',
    icon: Lightbulb,
    x: 68,
    y: 42,
    area: 'East Perimeter Grove',
  },
  {
    id: 'waste',
    label: 'Overflowing Bin',
    bounty: '₹300',
    description: 'Recycling station requires clearance',
    icon: Trash2,
    x: 24,
    y: 52,
    area: 'Main Gate Promenade',
  },
  {
    id: 'pathways',
    label: 'Cracked Pathway',
    bounty: '₹750',
    description: 'Displaced flagstones creating trip hazard',
    icon: Footprints,
    x: 52,
    y: 76,
    area: 'Central Arboretum Way',
  },
  {
    id: 'fountain',
    label: 'Fountain Aerator',
    bounty: '₹550',
    description: 'Pump pressure drop in reflection pond',
    icon: Droplets,
    x: 74,
    y: 68,
    area: 'Botanical Lagoon',
  },
  {
    id: 'plants',
    label: 'Glass Sapling Care',
    bounty: '₹350',
    description: 'Pruning & soil conditioning required',
    icon: Sparkles,
    x: 48,
    y: 35,
    area: 'Center Botanical Core',
  },
];

export function ParkIsland({ onSelectCategory }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const navigate = useNavigate();

  const handleHotspotClick = useCallback((hotspot) => {
    if (onSelectCategory) {
      onSelectCategory(hotspot.id);
    }
    navigate(`/report?category=${hotspot.id}`);
  }, [onSelectCategory, navigate]);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    let ctx;
    ctx = gsap.context(() => {
      // Depth parallax setup
      const depth1Layers = svg.querySelectorAll('[data-depth="1"]');
      const depth2Layers = svg.querySelectorAll('[data-depth="2"]');
      const depth3Layers = svg.querySelectorAll('[data-depth="3"]');
      const depth4Layers = svg.querySelectorAll('[data-depth="4"]');

      const qRotateX = gsap.quickTo(container, 'rotationX', { duration: 0.6, ease: 'power2.out' });
      const qRotateY = gsap.quickTo(container, 'rotationY', { duration: 0.6, ease: 'power2.out' });

      const qD1X = gsap.quickTo(depth1Layers, 'x', { duration: 0.7, ease: 'power2.out' });
      const qD1Y = gsap.quickTo(depth1Layers, 'y', { duration: 0.7, ease: 'power2.out' });

      const qD2X = gsap.quickTo(depth2Layers, 'x', { duration: 0.6, ease: 'power2.out' });
      const qD2Y = gsap.quickTo(depth2Layers, 'y', { duration: 0.6, ease: 'power2.out' });

      const qD3X = gsap.quickTo(depth3Layers, 'x', { duration: 0.5, ease: 'power2.out' });
      const qD3Y = gsap.quickTo(depth3Layers, 'y', { duration: 0.5, ease: 'power2.out' });

      const qD4X = gsap.quickTo(depth4Layers, 'x', { duration: 0.4, ease: 'power2.out' });
      const qD4Y = gsap.quickTo(depth4Layers, 'y', { duration: 0.4, ease: 'power2.out' });

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        // Max 6 degrees 3D tilt
        qRotateX(-normY * 6);
        qRotateY(normX * 6);

        // Multi-depth layer offsets
        qD1X(normX * 8);
        qD1Y(normY * 8);

        qD2X(normX * 16);
        qD2Y(normY * 16);

        qD3X(normX * 24);
        qD3Y(normY * 24);

        qD4X(normX * 32);
        qD4Y(normY * 32);
      };

      const handleMouseLeave = () => {
        qRotateX(0);
        qRotateY(0);
        qD1X(0); qD1Y(0);
        qD2X(0); qD2Y(0);
        qD3X(0); qD3Y(0);
        qD4X(0); qD4Y(0);
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, containerRef);

    return () => ctx?.revert();
  }, [reducedMotion, isMobile]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] mx-auto select-none"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      aria-label="Interactive Botanical Park Island. Click or activate any hotspot to report or inspect maintenance needs."
    >
      {/* Dynamic Background Ambient Aura */}
      <div
        className="absolute -inset-8 pointer-events-none rounded-full blur-3xl opacity-20 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(169,197,169,0.8) 0%, rgba(46,64,54,0.4) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Main SVG Park Architecture ────────────────────────────── */}
      <svg
        ref={svgRef}
        viewBox="0 0 540 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="groundGrad" x1="270" y1="360" x2="270" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E4036" />
            <stop offset="60%" stopColor="#1E2F26" />
            <stop offset="100%" stopColor="#14211A" />
          </linearGradient>

          <linearGradient id="grassGrad" x1="270" y1="310" x2="270" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3C5648" />
            <stop offset="60%" stopColor="#2B3F34" />
            <stop offset="100%" stopColor="#213329" />
          </linearGradient>

          <linearGradient id="pathGrad" x1="160" y1="330" x2="380" y2="410" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDE2D6" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#A9C5A9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#DDE2D6" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="fountainWater" x1="390" y1="340" x2="430" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7DA8A8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#385858" stopOpacity="0.9" />
          </linearGradient>

          <radialGradient id="saplingGlow" cx="270" cy="220" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A9C5A9" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#2E4036" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* ── DEPTH LAYER 1: Deep Ground Shadow & Terrain Base ── */}
        <g data-depth="1">
          {/* Cast Shadow */}
          <ellipse cx="270" cy="460" rx="210" ry="34" fill="#0A0F0D" opacity="0.65" />
          <ellipse cx="270" cy="460" rx="160" ry="24" fill="#050807" opacity="0.4" />

          {/* Floating Subterranean Crust */}
          <path
            d="M70 380 Q 270 470 470 380 L 465 410 Q 270 495 75 410 Z"
            fill="url(#groundGrad)"
          />
          {/* Geological strata fissures */}
          <path d="M120 400 Q 200 435 280 430" stroke="#17241D" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <path d="M295 432 Q 380 430 425 405" stroke="#17241D" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* ── DEPTH LAYER 2: Floating Island Plateau & Water Features ── */}
        <g data-depth="2">
          {/* Main Topographical Lawn Plate */}
          <ellipse cx="270" cy="375" rx="205" ry="68" fill="url(#grassGrad)" stroke="#4A6A5A" strokeWidth="1.5" />
          
          {/* Contoured inner grass terraces */}
          <path
            d="M95 370 Q 270 330 445 370 Q 270 430 95 370 Z"
            fill="#324A3E"
            opacity="0.8"
          />
          <path
            d="M125 365 Q 270 340 415 365 Q 270 415 125 365 Z"
            fill="#395346"
            opacity="0.9"
          />

          {/* Botanical Lagoon / Reflection Pond */}
          <ellipse cx="400" cy="375" rx="46" ry="20" fill="url(#fountainWater)" stroke="#8EB4B4" strokeWidth="1.5" />
          {/* Ripples */}
          <ellipse cx="400" cy="375" rx="30" ry="12" fill="none" stroke="#D3E6E6" strokeWidth="0.8" opacity="0.6" />
          <ellipse cx="400" cy="375" rx="14" ry="5" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

          {/* S-Curved Flagstone Pedestrian Pathway */}
          <path
            d="M110 385 C 190 395 210 350 270 350 C 330 350 330 380 460 380"
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Stepping flagstones detail */}
          <path
            d="M130 384 L 145 386 M 165 385 L 180 383 M 200 375 L 212 368 M 235 358 L 250 353 M 275 352 L 290 354 M 315 363 L 330 371 M 355 377 L 370 379 M 410 380 L 430 380"
            stroke="#2E4036"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>

        {/* ── DEPTH LAYER 3: Architecture, Benches, Lights & Vegetation ── */}
        <g data-depth="3">
          {/* Back Tree Clusters */}
          <g transform="translate(140, 240)">
            <ellipse cx="0" cy="40" rx="36" ry="46" fill="#1C2E25" />
            <ellipse cx="-8" cy="34" rx="28" ry="38" fill="#253C31" />
            <ellipse cx="0" cy="28" rx="20" ry="30" fill="#325042" />
            <rect x="-4" y="65" width="8" height="35" rx="3" fill="#121D18" />
          </g>

          <g transform="translate(380, 260)">
            <ellipse cx="0" cy="30" rx="28" ry="36" fill="#1C2E25" />
            <ellipse cx="4" cy="24" rx="22" ry="30" fill="#294236" />
            <ellipse cx="0" cy="18" rx="16" ry="24" fill="#3C5E4E" />
            <rect x="-3" y="50" width="6" height="30" rx="2" fill="#121D18" />
          </g>

          {/* West Garden Bench (Hotspot Target 1) */}
          <g id="svg-bench" transform="translate(160, 360)">
            {/* Wooden slats */}
            <rect x="-24" y="-8" width="48" height="5" rx="2" fill="#B36E46" stroke="#874B2A" strokeWidth="0.8" />
            <rect x="-24" y="-2" width="48" height="5" rx="2" fill="#C57E56" stroke="#874B2A" strokeWidth="0.8" />
            <rect x="-24" y="4" width="48" height="5" rx="2" fill="#A86139" stroke="#874B2A" strokeWidth="0.8" />
            {/* Cast iron legs */}
            <path d="M-20 6 L-22 22 M20 6 L22 22 M-20 12 L20 12" stroke="#2E4036" strokeWidth="2.5" strokeLinecap="round" />
            {/* Simulated crack indicator */}
            <path d="M2 -8 L6 -2 L4 4" stroke="#CC5833" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Overflowing Waste Station (Hotspot Target 3) */}
          <g id="svg-bin" transform="translate(130, 290)">
            <rect x="-10" y="-5" width="20" height="26" rx="4" fill="#3A4D43" stroke="#23322B" strokeWidth="1.2" />
            <rect x="-12" y="-9" width="24" height="5" rx="2" fill="#1D2A24" />
            {/* Slits */}
            <line x1="-5" y1="2" x2="-5" y2="15" stroke="#A9C5A9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="0" y1="2" x2="0" y2="15" stroke="#A9C5A9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1="5" y1="2" x2="5" y2="15" stroke="#A9C5A9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            {/* Spilling paper / waste hint in warning clay */}
            <circle cx="6" cy="-11" r="3" fill="#CC5833" opacity="0.9" />
          </g>

          {/* Victorian Perimeter Solar Lamp (Hotspot Target 2) */}
          <g id="svg-lamp" transform="translate(365, 240)">
            <line x1="0" y1="0" x2="0" y2="90" stroke="#3A4D43" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M-7 90 L7 90 M-4 85 L4 85" stroke="#25352E" strokeWidth="3" strokeLinecap="round" />
            {/* Lantern crown */}
            <path d="M0 0 L-10 -15 L10 -15 Z" fill="#25352E" />
            <rect x="-7" y="-28" width="14" height="13" rx="2" fill="#E8EEEC" opacity="0.5" stroke="#25352E" strokeWidth="1" />
            {/* Outage cross hint */}
            <line x1="-5" y1="-26" x2="5" y2="-17" stroke="#CC5833" strokeWidth="1.8" />
            <line x1="5" y1="-26" x2="-5" y2="-17" stroke="#CC5833" strokeWidth="1.8" />
          </g>

          {/* Fountain Jet & Spray (Hotspot Target 5) */}
          <g id="svg-fountain" transform="translate(400, 365)">
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="#1C2E25" />
            <path d="M0 0 Q -8 -25 0 -38 Q 8 -25 0 0" fill="none" stroke="#A6DBDB" strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
            <path d="M0 -5 Q -14 -20 -8 -30" fill="none" stroke="#C7EFEF" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <path d="M0 -5 Q 14 -20 8 -30" fill="none" stroke="#C7EFEF" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <circle cx="0" cy="-38" r="3" fill="#FFFFFF" opacity="0.9" />
          </g>
        </g>

        {/* ── DEPTH LAYER 4: Glass Sapling Botanical Centerpiece ── */}
        <g data-depth="4">
          {/* Ambient Glow */}
          <circle cx="270" cy="225" r="90" fill="url(#saplingGlow)" />

          {/* Glass Conservatory Pedestal */}
          <polygon points="252,320 288,320 294,335 246,335" fill="#213329" stroke="#3A5244" strokeWidth="1.5" />
          <polygon points="255,305 285,305 288,320 252,320" fill="#2E4036" stroke="#4A6A5A" strokeWidth="1.2" />

          {/* Centerpiece Glass Sapling (Hotspot Target 6) */}
          <g transform="translate(270, 220)">
            {/* Trunk */}
            <path d="M0 85 Q -3 45 0 15 Q 4 50 0 85" fill="#A9C5A9" opacity="0.7" />
            
            {/* Faceted crystalline / glass leaf canopies */}
            <path
              d="M0 15 C -45 -15 -35 -60 0 -80 C 35 -60 45 -15 0 15 Z"
              fill="rgba(169, 197, 169, 0.25)"
              stroke="rgba(221, 226, 214, 0.8)"
              strokeWidth="1.8"
            />
            {/* Inner crystalline facets */}
            <path
              d="M0 10 C -25 -10 -20 -45 0 -60 C 20 -45 25 -10 0 10 Z"
              fill="rgba(204, 88, 51, 0.2)"
              stroke="rgba(242, 240, 233, 0.9)"
              strokeWidth="1.2"
            />
            {/* Facet lines */}
            <line x1="0" y1="12" x2="0" y2="-78" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" />
            <line x1="0" y1="-25" x2="-30" y2="-40" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
            <line x1="0" y1="-25" x2="30" y2="-40" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
            <line x1="0" y1="-5" x2="-22" y2="-12" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
            <line x1="0" y1="-5" x2="22" y2="-12" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />

            {/* Glowing Sprout Core */}
            <circle cx="0" cy="-25" r="5" fill="#CC5833" />
            <circle cx="0" cy="-25" r="10" fill="#CC5833" opacity="0.35" />
          </g>
        </g>
      </svg>

      {/* ── 6 Focusable Accessible Maintenance Hotspots ───────────── */}
      {HOTSPOTS.map((h) => {
        const isHovered = activeHotspot?.id === h.id;
        const Icon = h.icon;

        return (
          <div
            key={h.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            {/* Pulse Ring Indicator */}
            <span
              className="absolute -inset-2 rounded-full bg-clay opacity-30 animate-ping pointer-events-none"
              aria-hidden="true"
            />

            {/* Hotspot Interactive Button */}
            <button
              type="button"
              onClick={() => handleHotspotClick(h)}
              onMouseEnter={() => setActiveHotspot(h)}
              onMouseLeave={() => setActiveHotspot(null)}
              onFocus={() => setActiveHotspot(h)}
              onBlur={() => setActiveHotspot(null)}
              aria-label={`Maintenance Issue: ${h.label} in ${h.area}. Simulated Bounty: ${h.bounty}. Activate to report or inspect.`}
              className={`
                relative w-8 h-8 rounded-full flex items-center justify-center
                border-2 transition-all duration-300 transform
                hover:scale-125 focus:scale-125 focus:outline-none
                focus-visible:ring-4 focus-visible:ring-clay/40
                ${isHovered
                  ? 'bg-clay border-white text-white shadow-lg shadow-clay/50 scale-110'
                  : 'bg-moss/90 border-cream/80 text-cream shadow-md hover:bg-clay hover:border-white'}
              `}
            >
              <Icon size={14} className="stroke-[2.2]" />
            </button>

            {/* Floating Glass Context Card (Appears on Hover / Keyboard Focus) */}
            <div
              role="tooltip"
              className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3.5
                rounded-2xl bg-forest/95 backdrop-blur-md border border-cream/20
                text-cream shadow-2xl transition-all duration-300 pointer-events-none
                ${isHovered
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95'}
              `}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-outfit font-semibold text-xs tracking-tight text-white flex items-center gap-1">
                  <Icon size={12} className="text-sage" /> {h.label}
                </span>
                <Badge variant="bounty" size="xs" className="text-[10px] py-0 px-1.5 bg-clay/20 text-clay-100 border-clay/40">
                  {h.bounty}
                </Badge>
              </div>

              <p className="text-[11px] text-cream/70 font-jakarta leading-snug mb-2">
                {h.description}
              </p>

              <div className="flex items-center justify-between pt-1.5 border-t border-cream/10 text-[10px] font-outfit text-sage">
                <span>{h.area}</span>
                <span className="flex items-center text-clay-300 font-semibold">
                  Report issue <ChevronRight size={10} />
                </span>
              </div>

              {/* Triangle Tail */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-forest/95" />
            </div>
          </div>
        );
      })}

      {/* Interactive Helper Hint */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max px-4 py-1 rounded-full bg-forest/70 backdrop-blur-sm border border-cream/10 text-cream/70 text-xs font-outfit flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
        <span>Select any hotspot pin to auto-fill report category</span>
      </div>
    </div>
  );
}

export default ParkIsland;
