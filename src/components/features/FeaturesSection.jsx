/**
 * src/components/features/FeaturesSection.jsx
 * Interactive Features Section (#how-it-works)
 * Displays 3 software artifacts:
 * 1. Instant Geo-Reporting (Diagnostic Shuffler)
 * 2. Resolution Telemetry (Typewriter Feed)
 * 3. Protocol Scheduler (Cursor Sequence)
 */
import React from 'react';
import { Badge } from '../ui/Badge.jsx';
import { DiagnosticShuffler } from './DiagnosticShuffler.jsx';
import { TelemetryTypewriter } from './TelemetryTypewriter.jsx';
import { CursorScheduler } from './CursorScheduler.jsx';
import { Sparkles, Layers } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 pt-8"
      aria-labelledby="features-heading"
    >
      <div className="layout-fluid">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="citizen" size="sm">
              <Layers size={13} className="text-forest" />
              <span>Core Telemetry & Functional Protocols</span>
            </Badge>
            <Badge variant="demo" size="xs">
              Interactive UIs
            </Badge>
          </div>

          <h2
            id="features-heading"
            className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-[1.1] mb-4"
          >
            Small reports. Meaningful improvements.
          </h2>

          <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
            CivicFix unites citizen reporting, localized gig-worker dispatch, and photographic verification into one transparent cycle. Discover how our live telemetry, geo-diagnostics, and restoration scheduling keep public parks beautiful.
          </p>
        </div>

        {/* 3 Interactive Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Diagnostic Shuffler */}
          <div className="h-full">
            <DiagnosticShuffler />
          </div>

          {/* Card 2: Resolution Telemetry Typewriter */}
          <div className="h-full">
            <TelemetryTypewriter />
          </div>

          {/* Card 3: Cursor Protocol Scheduler */}
          <div className="h-full md:col-span-2 lg:col-span-1">
            <CursorScheduler />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
