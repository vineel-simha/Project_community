/**
 * src/components/features/DiagnosticShuffler.jsx
 * Interactive micro-UI displaying 3 overlapping sample complaint cards.
 * Cycles vertically every 3 seconds with spring transitions.
 * Pauses when offscreen and provides static state under reduced motion.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import { Wrench, Trash2, Lightbulb, MapPin, Sparkles } from 'lucide-react';

const SAMPLE_CARDS = [
  {
    id: 'DEMO-SHUFFLE-1',
    category: 'Damaged Bench',
    location: 'Zone A · West Gate Grove',
    bounty: '₹450 bounty',
    pin: 'PIN: 12.9716° N, 77.5946° E',
    icon: Wrench,
    status: 'Open for Workers',
    accentColor: 'border-clay/40 bg-white',
    badgeVariant: 'bounty',
  },
  {
    id: 'DEMO-SHUFFLE-2',
    category: 'Overflowing Bin',
    location: 'Main Gate · North Promenade',
    bounty: '₹300 bounty',
    pin: 'PIN: 12.9724° N, 77.5951° E',
    icon: Trash2,
    status: 'In Progress',
    accentColor: 'border-amber-400/40 bg-white',
    badgeVariant: 'in-progress',
  },
  {
    id: 'DEMO-SHUFFLE-3',
    category: 'Pathway Lamp Out',
    location: 'Lake Path · Bamboo Trail',
    bounty: '₹600 bounty',
    pin: 'PIN: 12.9708° N, 77.5938° E',
    icon: Lightbulb,
    status: 'Pending Approval',
    accentColor: 'border-emerald-400/40 bg-white',
    badgeVariant: 'pending-approval',
  },
];

export function DiagnosticShuffler() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const interval = setInterval(() => {
      if (isVisible) {
        setActiveIndex((prev) => (prev + 1) % SAMPLE_CARDS.length);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-between h-full min-h-[380px] p-6 rounded-4xl bg-surface border border-line shadow-card overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-clay animate-pulse" />
          <h3 className="font-jakarta font-bold text-base text-moss tracking-tight">
            Instant Geo-Reporting
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="sample" size="xs">
            Sample data
          </Badge>
          <Badge variant="muted" size="xs">
            3s Auto-cycle
          </Badge>
        </div>
      </div>

      {/* Shuffling Cards Container */}
      <div className="relative flex-1 min-h-[220px] w-full flex items-center justify-center">
        {SAMPLE_CARDS.map((card, idx) => {
          // Relative position in cyclic stack (0 = front, 1 = mid, 2 = back)
          const offset = (idx - activeIndex + SAMPLE_CARDS.length) % SAMPLE_CARDS.length;
          const Icon = card.icon;

          // Compute styles based on stack depth
          const translateY = reducedMotion ? idx * 16 : offset * 18;
          const scale = reducedMotion ? 1 - idx * 0.05 : 1 - offset * 0.05;
          const opacity = reducedMotion ? (idx === 0 ? 1 : 0.6) : offset === 0 ? 1 : offset === 1 ? 0.75 : 0.45;
          const zIndex = reducedMotion ? 10 - idx : 10 - offset;

          return (
            <div
              key={card.id}
              className={`
                absolute w-full max-w-[340px] p-4 rounded-3xl border shadow-card transition-all duration-700 ease-out
                ${card.accentColor}
              `}
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: offset === 0 ? 'auto' : 'none',
              }}
            >
              {/* Card Meta Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-moss/10 flex items-center justify-center text-moss">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-sm text-moss leading-tight">
                      {card.category}
                    </h4>
                    <span className="text-[11px] text-muted font-jakarta">
                      {card.location}
                    </span>
                  </div>
                </div>
                <Badge variant={card.badgeVariant} size="xs">
                  {card.bounty}
                </Badge>
              </div>

              {/* Pin Set Monospace Chip */}
              <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-mono-cf text-[10px] text-moss/70 font-semibold bg-cream/70 px-2 py-0.5 rounded-md">
                  <MapPin size={10} className="text-clay" />
                  {card.pin}
                </span>
                <span className="font-outfit text-[11px] text-muted">
                  {card.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Indicators */}
      <div className="flex items-center justify-between pt-4 border-t border-line/40 text-xs text-muted font-jakarta">
        <span className="flex items-center gap-1 text-[11px]">
          <Sparkles size={12} className="text-clay" />
          Click or wait to rotate queue
        </span>
        <div className="flex gap-1.5">
          {SAMPLE_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show sample report card ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-clay' : 'w-1.5 bg-line'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiagnosticShuffler;
