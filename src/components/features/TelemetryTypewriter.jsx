/**
 * src/components/features/TelemetryTypewriter.jsx
 * Technical monospace event feed with character-by-character typing animation.
 * Features a blinking clay cursor, sample data badge, and max 4 visible log lines.
 * Pauses when offscreen and shows full static logs under reduced motion.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import { Terminal, Radio, ShieldCheck } from 'lucide-react';

const TELEMETRY_FEED = [
  'Ticket #402: Worker accepted job at Lalbagh West Gate.',
  'Ticket #405: Proof photo uploaded for Zone B waste clearance.',
  'Ticket #411: Reporter approved fix · ₹500 demo bounty released.',
  'Ticket #418: Pathway repair assigned to local technician.',
  'Ticket #424: Citizen submitted fallen branch alert at Cubbon Grove.',
  'Ticket #430: Solar lamp battery replaced · verified by community.',
];

export function TelemetryTypewriter() {
  const [completedLines, setCompletedLines] = useState([
    TELEMETRY_FEED[0],
    TELEMETRY_FEED[1],
  ]);
  const [currentLineIndex, setCurrentLineIndex] = useState(2);
  const [typedChars, setTypedChars] = useState('');
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCompletedLines(TELEMETRY_FEED.slice(0, 4));
      return;
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const targetText = TELEMETRY_FEED[currentLineIndex];
    let charIdx = 0;
    setTypedChars('');

    const charTimer = setInterval(() => {
      if (!isVisible) return;

      if (charIdx < targetText.length) {
        setTypedChars(targetText.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(charTimer);
        // Pause briefly after completing line, then push to completed and advance
        setTimeout(() => {
          setCompletedLines((prev) => {
            const next = [...prev, targetText];
            return next.slice(-3); // Keep up to 3 completed + 1 active = max 4 visible lines
          });
          setCurrentLineIndex((prev) => (prev + 1) % TELEMETRY_FEED.length);
        }, 1200);
      }
    }, 45);

    return () => {
      clearInterval(charTimer);
      observer.disconnect();
    };
  }, [currentLineIndex, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-between h-full min-h-[380px] p-6 rounded-4xl bg-forest/95 text-cream border border-forest shadow-card overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-sage" />
          <h3 className="font-jakarta font-bold text-base text-cream tracking-tight">
            Resolution Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="sample" size="xs" className="bg-sage/20 text-cream border-sage/30">
            Sample data
          </Badge>
          <span className="flex items-center gap-1 font-mono-cf text-[10px] text-sage">
            <Radio size={10} className="text-clay animate-pulse" />
            LIVE FEED
          </span>
        </div>
      </div>

      {/* Terminal Monospace Feed Window */}
      <div className="flex-1 flex flex-col justify-end p-4 rounded-3xl bg-charcoal/80 border border-line/10 font-mono-cf text-xs leading-relaxed overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-line/10 text-[10px] text-cream/40">
          <span>sys.telemetry.stream // protocol-v1</span>
          <span>UTF-8 · DEMO MODE</span>
        </div>

        {/* Max 4 Visible Log Lines */}
        <div className="space-y-2.5 min-h-[140px] flex flex-col justify-end">
          {completedLines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2 text-cream/70">
              <span className="text-sage/60 select-none">&gt;</span>
              <span className="break-words">{line}</span>
            </div>
          ))}

          {/* Active Typing Line */}
          {!reducedMotion && (
            <div className="flex items-start gap-2 text-cream font-medium">
              <span className="text-clay select-none">&gt;</span>
              <span className="break-words">
                {typedChars}
                <span className="inline-block w-2 h-3.5 ml-1 bg-clay align-middle animate-blink" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-cream/10 text-xs text-cream/60 font-jakarta">
        <span className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck size={13} className="text-sage" />
          Simulated gig handshake verification events
        </span>
        <span className="font-mono-cf text-[10px] text-sage">
          4 lines visible
        </span>
      </div>
    </div>
  );
}

export default TelemetryTypewriter;
