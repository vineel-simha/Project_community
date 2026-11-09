/**
 * src/components/sections/Manifesto.jsx
 * The Civic Manifesto Section
 * Features:
 * - Full-width charcoal editorial surface (#1A1A1A) with edge-to-edge reach
 * - Removed narrow max-w-5xl restriction; uses fluid padding (clamp(20px, 4vw, 72px))
 * - Subtle botanical parallax texture (<=15% opacity, pure SVG, zero external images)
 * - Accessible word-by-word reveal using manual word splitter & GSAP ScrollTrigger
 * - Full sentence preserved for screen readers via aria-label
 * - Oversized Cormorant Garamond italic for second statement with "action" highlighted in clay
 * - Graceful fallback & immediate visibility under prefers-reduced-motion
 */
import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap.js';
import { useReducedMotion } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import { Leaf, ArrowDownRight, Sparkles } from 'lucide-react';
import BRAND from '../../config/brand.js';

const STATEMENT_1 = "Most civic tools focus on: bureaucratic delays and opaque processes.";
const STATEMENT_2_PREFIX = "We focus on: immediate ecological";
const STATEMENT_2_KEYWORD = "action.";

export function Manifesto({ fullBleed = true }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textureRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Subtle parallax on botanical background texture
      if (textureRef.current) {
        gsap.to(textureRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 2. Word-by-word reveal timeline
      const words1 = containerRef.current?.querySelectorAll('.manifesto-word-1');
      const words2 = containerRef.current?.querySelectorAll('.manifesto-word-2');
      const editorialNote = containerRef.current?.querySelector('.manifesto-editorial-note');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
        },
      });

      if (words1 && words1.length > 0) {
        tl.from(words1, {
          y: 35,
          opacity: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power3.out',
        });
      }

      if (words2 && words2.length > 0) {
        tl.from(words2, {
          y: 45,
          opacity: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power3.out',
        }, '-=0.2');
      }

      if (editorialNote) {
        tl.from(editorialNote, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Split words for manual accessible word-by-word animation
  const statement1Words = STATEMENT_1.split(' ');
  const statement2Words = STATEMENT_2_PREFIX.split(' ');

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative scroll-mt-24 w-full bg-charcoal text-cream py-24 md:py-36 overflow-hidden ${
        fullBleed ? 'my-0 rounded-none' : 'my-12 rounded-[2.5rem] md:rounded-[4rem]'
      }`}
      aria-label="The CivicFix Manifesto: About our civic philosophy"
    >
      {/* ── Subtle Botanical Parallax Texture (<=15% opacity, zero external images) ── */}
      <div
        ref={textureRef}
        aria-hidden="true"
        className="absolute -top-24 inset-x-0 h-[130%] pointer-events-none opacity-10 select-none"
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="manifesto-botanical-tile"
              x="0"
              y="0"
              width="240"
              height="240"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M120 20 C120 20 60 70 60 120 C60 155 85 180 120 180 C155 180 180 155 180 120 C180 70 120 20 120 20 Z"
                fill="none"
                stroke="#A9C5A9"
                strokeWidth="1.2"
              />
              <path
                d="M120 180 L120 220 M120 120 L80 90 M120 140 L160 110 M120 100 L155 80 M120 80 L85 60"
                stroke="#A9C5A9"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="120" cy="20" r="3" fill="#CC5833" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#manifesto-botanical-tile)" />
        </svg>
      </div>

      {/* Atmospheric Radial Shimmer */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(204,88,51,0.25) 0%, rgba(46,64,54,0.15) 50%, transparent 75%)',
        }}
      />

      {/* ── Main Editorial Content (Expanded Full-Width Responsive Container) ── */}
      <div
        ref={containerRef}
        className="relative z-10 layout-fluid"
      >
        {/* Eyebrow Pill */}
        <div className="flex items-center gap-2 mb-8">
          <Badge variant="clay" size="sm" className="bg-clay/20 text-cream border-clay/40">
            <Leaf size={12} className="text-clay" />
            <span>The Civic Manifesto</span>
          </Badge>
          <span className="text-xs font-mono-cf text-cream/40 uppercase tracking-widest">
            #about // philosophy
          </span>
        </div>

        {/* First Statement: Bureaucracy */}
        <div className="mb-10 sm:mb-14 max-w-5xl">
          <p
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-semibold text-cream/50 tracking-tight leading-[1.25]"
            aria-label={STATEMENT_1}
          >
            {statement1Words.map((word, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block mr-[0.25em] overflow-hidden align-top"
              >
                <span className="manifesto-word-1 inline-block">
                  {word}
                </span>
              </span>
            ))}
          </p>
        </div>

        {/* Second Statement: Oversized Cormorant Garamond with Clay Action */}
        <div className="mb-16 sm:mb-24 max-w-6xl">
          <p
            className="font-cormorant italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] text-cream font-semibold tracking-tight leading-[1.05]"
            aria-label={`${STATEMENT_2_PREFIX} ${STATEMENT_2_KEYWORD}`}
          >
            {statement2Words.map((word, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block mr-[0.28em] overflow-hidden align-top"
              >
                <span className="manifesto-word-2 inline-block">
                  {word}
                </span>
              </span>
            ))}
            <span
              aria-hidden="true"
              className="inline-block overflow-hidden align-top"
            >
              <span className="manifesto-word-2 inline-block text-clay">
                {STATEMENT_2_KEYWORD}
              </span>
            </span>
          </p>
        </div>

        {/* Editorial Footnote Block */}
        <div className="manifesto-editorial-note pt-10 border-t border-cream/15 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cream/10 border border-cream/20 flex items-center justify-center text-sage">
              <ArrowDownRight size={20} />
            </div>
            <div>
              <p className="font-outfit font-semibold text-sm text-cream">
                Direct Field Handshake
              </p>
              <p className="font-mono-cf text-xs text-cream/50">
                0 intermediaries · Photo verified
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="font-jakarta text-cream/70 text-sm sm:text-base leading-relaxed max-w-3xl">
              When damaged benches, dark perimeter lighting, or hazardous root upheavals sit in traditional municipal backlogs, green spaces deteriorate. CivicFix connects vigilant park visitors directly with verified local gig workers. Every restoration requires photographic evidence uploaded by the technician and verified by the citizen who reported it before community bounties are released.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Manifesto;
