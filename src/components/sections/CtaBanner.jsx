/**
 * src/components/sections/CtaBanner.jsx
 * Community Call-to-Action Section
 * Features:
 * - Soft sage botanical surface containing a large rounded cream card
 * - Custom SVG crystalline / glass leaf sapling illustration
 * - Large clay CTA: Report an Issue
 * - Secondary button: Browse Worker Jobs
 * - Text link: Track Your Complaint
 * - Zero fabricated statistics or testimonials
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { MapPin, Wrench, Search, Sparkles, ArrowRight } from 'lucide-react';

export function CtaBanner({ onReportClick, onWorkerClick, onTrackClick }) {
  const navigate = useNavigate();

  const handleReport = onReportClick || (() => navigate('/report'));
  const handleWorker = onWorkerClick || (() => navigate('/worker-jobs'));
  const handleTrack = onTrackClick || (() => navigate('/track-verify'));

  return (
    <section
      className="py-16 md:py-24 bg-[#E0ECE0]/50 w-full"
      aria-labelledby="cta-heading"
    >
      <div className="layout-fluid">
        <div className="relative rounded-[2.5rem] sm:rounded-[3.5rem] bg-cream border border-line shadow-card-lg p-8 sm:p-14 lg:p-20 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-sage/20 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-clay/10 blur-3xl pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Editorial Callout */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="citizen" size="sm">
                  <Sparkles size={12} className="text-forest" />
                  <span>Community Restoration Call</span>
                </Badge>
                <Badge variant="demo" size="xs">
                  Zero Intermediaries
                </Badge>
              </div>

              <h2
                id="cta-heading"
                className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-[1.1]"
              >
                Every citizen can make a difference.
              </h2>

              <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed max-w-xl">
                Cleaner parks, safer pathways and healthier green spaces begin when citizens report issues and local workers restore them.
              </p>

              <p className="font-cormorant italic text-2xl sm:text-3xl text-clay-dark font-semibold">
                "Your park deserves better."
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleReport}
                  className="rounded-full shadow-clay"
                >
                  <MapPin size={16} /> Report an Issue
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleWorker}
                  className="rounded-full"
                >
                  <Wrench size={16} /> Browse Worker Jobs
                </Button>

                <button
                  type="button"
                  onClick={handleTrack}
                  className="text-xs font-outfit font-semibold text-clay-dark hover:underline flex items-center gap-1.5 ml-2 py-2"
                >
                  <Search size={14} /> Track Your Complaint <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Right Column: Custom SVG Glass Sapling Illustration */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Background Rotating Aura */}
                <div className="absolute inset-0 rounded-full border border-dashed border-sage/60 animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-forest/15" />

                {/* SVG Botanical Glass Centerpiece */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full drop-shadow-lg"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="ctaGlass" cx="100" cy="90" r="70" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#A9C5A9" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#2E4036" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* Soft Core Glow */}
                  <circle cx="100" cy="100" r="60" fill="url(#ctaGlass)" />

                  {/* Stem */}
                  <path
                    d="M 100 155 Q 98 120 100 85"
                    stroke="#2E4036"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Glass Leaf Pair */}
                  <path
                    d="M 100 120 C 70 115 65 95 80 80 C 95 85 98 105 100 120 Z"
                    fill="rgba(169, 197, 169, 0.4)"
                    stroke="#2E4036"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 100 105 C 130 100 135 80 120 65 C 105 70 102 90 100 105 Z"
                    fill="rgba(204, 88, 51, 0.3)"
                    stroke="#CC5833"
                    strokeWidth="1.5"
                  />

                  {/* Crown Sprout */}
                  <path
                    d="M 100 85 C 88 55 95 40 100 35 C 105 40 112 55 100 85 Z"
                    fill="rgba(242, 240, 233, 0.7)"
                    stroke="#2E4036"
                    strokeWidth="1.8"
                  />
                  <line x1="100" y1="40" x2="100" y2="80" stroke="#CC5833" strokeWidth="1" />

                  {/* Sprout Core Bead */}
                  <circle cx="100" cy="85" r="4.5" fill="#CC5833" />
                  <circle cx="100" cy="85" r="9" fill="#CC5833" opacity="0.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
