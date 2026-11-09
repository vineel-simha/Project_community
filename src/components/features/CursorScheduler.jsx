/**
 * src/components/features/CursorScheduler.jsx
 * Animated weekly S-M-T-W-T-F-S grid showcasing automated community restoration protocols.
 * Follows an autonomous simulated cursor routine:
 * 1. Cursor enters
 * 2. Selects a day (Wednesday)
 * 3. Day turns clay
 * 4. Cursor moves to "Verify & Resolve"
 * 5. Button flips to "Verified"
 * 6. Pauses and loops
 * Pauses offscreen; renders static verified layout under reduced motion.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/hooks.js';
import { Badge } from '../ui/Badge.jsx';
import { Calendar, CheckCircle2, MousePointer2, Shield } from 'lucide-react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CursorScheduler() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [buttonState, setButtonState] = useState('idle'); // 'idle' | 'hover' | 'verified'
  const [cursorPos, setCursorPos] = useState({ x: 20, y: 15, opacity: 0 });
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setSelectedDay(3); // Wednesday
      setButtonState('verified');
      return;
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let timeoutIds = [];

    function runSequence() {
      if (!isVisible) {
        timeoutIds.push(setTimeout(runSequence, 1000));
        return;
      }

      // Step 0: Reset state
      setSelectedDay(null);
      setButtonState('idle');
      setCursorPos({ x: 10, y: 10, opacity: 0 });

      // Step 1: Cursor enters & moves toward Wednesday (day index 3, ~48% x, ~48% y)
      timeoutIds.push(setTimeout(() => {
        setCursorPos({ x: 50, y: 46, opacity: 1 });
      }, 500));

      // Step 2: Select Wednesday
      timeoutIds.push(setTimeout(() => {
        setSelectedDay(3);
      }, 1400));

      // Step 3: Move cursor to "Verify & Resolve" button (~50% x, ~78% y)
      timeoutIds.push(setTimeout(() => {
        setCursorPos({ x: 50, y: 76, opacity: 1 });
        setButtonState('hover');
      }, 2100));

      // Step 4: Click button -> becomes Verified
      timeoutIds.push(setTimeout(() => {
        setButtonState('verified');
      }, 2800));

      // Step 5: Cursor fades out
      timeoutIds.push(setTimeout(() => {
        setCursorPos((prev) => ({ ...prev, opacity: 0 }));
      }, 3800));

      // Step 6: Loop restart
      timeoutIds.push(setTimeout(runSequence, 5200));
    }

    runSequence();

    return () => {
      timeoutIds.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-between h-full min-h-[380px] p-6 rounded-4xl bg-surface border border-line shadow-card overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-forest" />
          <h3 className="font-jakarta font-bold text-base text-moss tracking-tight">
            Protocol Scheduler
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="sample" size="xs">
            Sample week
          </Badge>
          <Badge variant="citizen" size="xs">
            Automated
          </Badge>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 flex flex-col justify-center items-center py-4">
        {/* Week Day Pills Row */}
        <p className="text-xs font-outfit text-muted uppercase tracking-wider mb-3">
          Community Maintenance Cadence
        </p>

        <div className="grid grid-cols-7 gap-2 w-full max-w-[320px] mb-8">
          {DAYS.map((day, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`
                    w-10 h-11 rounded-2xl flex items-center justify-center font-outfit font-bold text-xs
                    border transition-all duration-300
                    ${isSelected
                      ? 'bg-clay text-white border-clay shadow-md scale-105'
                      : 'bg-cream text-moss border-line/80'}
                  `}
                >
                  {day}
                </div>
                <span className="text-[10px] text-muted font-jakarta">
                  {DAY_LABELS[idx]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[280px]">
          <div
            className={`
              w-full py-3 px-4 rounded-2xl font-outfit font-semibold text-sm
              flex items-center justify-center gap-2 transition-all duration-400
              ${buttonState === 'verified'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                : buttonState === 'hover'
                  ? 'bg-forest text-cream scale-[1.01]'
                  : 'bg-moss text-cream'}
            `}
          >
            {buttonState === 'verified' ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-200 animate-bounce" />
                <span>Fix Verified & Paid</span>
              </>
            ) : (
              <>
                <Shield size={15} className="text-sage" />
                <span>Verify & Resolve</span>
              </>
            )}
          </div>
        </div>

        {/* Animated SVG Cursor */}
        {!reducedMotion && (
          <div
            className="absolute pointer-events-none transition-all duration-500 ease-out z-30"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              opacity: cursorPos.opacity,
              transform: 'translate(-2px, -2px)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#CC5833"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-4 px-2 py-0.5 rounded-md bg-forest text-[9px] font-mono-cf text-cream shadow">
              auto-agent
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-line/40 text-xs text-muted font-jakarta">
        <span className="flex items-center gap-1 text-[11px]">
          <MousePointer2 size={12} className="text-clay" />
          Autonomous workflow verification sequence
        </span>
        <span className="font-mono-cf text-[10px] text-moss font-semibold">
          CYCLE: WED_SYNC
        </span>
      </div>
    </div>
  );
}

export default CursorScheduler;
