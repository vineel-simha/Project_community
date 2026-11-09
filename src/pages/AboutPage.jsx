/**
 * src/pages/AboutPage.jsx
 * Route: /about
 * Dedicated About CivicFix Page.
 * Expands across the full viewport width (no narrow centered card with empty cream margins).
 * Preserves the dark editorial aesthetic, Cormorant Garamond typography, and botanical visual language.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Manifesto } from '../components/sections/Manifesto.jsx';
import { CtaBanner } from '../components/sections/CtaBanner.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  Leaf, ShieldCheck, Users, Trees, HeartHandshake,
  CheckCircle2, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      {/* 1. Full-Width Edge-to-Edge Manifesto Section */}
      <Manifesto fullBleed={true} />

      {/* 2. Deep Dive: The Mission & Community Principles */}
      <section className="w-full py-20 bg-cream">
        <div className="layout-fluid">
          <div className="max-w-3xl mb-14">
            <Badge variant="citizen" size="sm" className="mb-3">
              <Leaf size={13} className="text-forest" />
              <span>Core Philosophy</span>
            </Badge>
            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-tight mb-4">
              Restoring our parks through collective agency.
            </h2>
            <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
              Public parks are the breathing lungs of our cities. When they suffer from neglect, entire communities lose their shared sanctuaries. CivicFix is built on three core pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 sm:p-10 rounded-4xl bg-surface border border-line shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-moss/10 text-moss flex items-center justify-center mb-6">
                  <Trees size={24} />
                </div>
                <h3 className="font-jakarta font-bold text-xl text-moss mb-3">
                  Immediate Ecological Action
                </h3>
                <p className="font-jakarta text-sm text-muted leading-relaxed">
                  Rather than waiting for multi-month bureaucratic tender cycles to replace a rotted plank or clear overgrown thorny bushes, local residents trigger immediate action with photographic evidence.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-line/60 flex items-center gap-1.5 text-xs font-outfit text-clay font-semibold">
                <span>Fast Local Response</span>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-4xl bg-surface border border-line shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-6">
                  <HeartHandshake size={24} />
                </div>
                <h3 className="font-jakarta font-bold text-xl text-moss mb-3">
                  Dignified Neighborhood Work
                </h3>
                <p className="font-jakarta text-sm text-muted leading-relaxed">
                  Every community is home to skilled carpenters, electricians, handymen, and gardeners. CivicFix channels maintenance funding directly into neighborhood hands through transparent, guaranteed bounties.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-line/60 flex items-center gap-1.5 text-xs font-outfit text-forest font-semibold">
                <span>Fair Micro-Bounties</span>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-4xl bg-surface border border-line shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-clay/10 text-clay flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-jakarta font-bold text-xl text-moss mb-3">
                  Verification Handshake
                </h3>
                <p className="font-jakarta text-sm text-muted leading-relaxed">
                  Trust is maintained through strict visual proof. The original citizen reporter inspects Before-and-After photos before any payout is authorized, preventing fraudulent claims and ensuring craftsmanship.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-line/60 flex items-center gap-1.5 text-xs font-outfit text-clay font-semibold">
                <span>100% Photo Proof</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Comparison: Traditional Complaint Workflow vs CivicFix */}
      <section className="w-full py-20 bg-forest text-cream">
        <div className="layout-fluid">
          <div className="max-w-3xl mb-12">
            <span className="font-mono-cf text-xs text-sage uppercase tracking-wider block mb-2">
              SYSTEM COMPARISON // PARADIGM SHIFT
            </span>
            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-cream tracking-tight mb-4">
              Traditional municipal tenders vs. CivicFix
            </h2>
            <p className="font-jakarta text-cream/70 text-sm sm:text-base leading-relaxed">
              Why decentralized community reporting and local gig dispatch achieves superior results for neighborhood green spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="p-8 rounded-4xl bg-charcoal/80 border border-cream/10 space-y-4">
              <span className="font-outfit font-bold text-xs uppercase tracking-wider text-red-400">
                Traditional Centralized Process
              </span>
              <ul className="space-y-3 text-xs sm:text-sm font-jakarta text-cream/60">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Complaint routed through multiple central agency desks before field review.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Months to bundle minor repairs into large external contractor tenders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Citizen has zero visibility into whether or when an issue is inspected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>No photographic proof required before public expenditure is signed off.</span>
                </li>
              </ul>
            </div>

            {/* CivicFix */}
            <div className="p-8 rounded-4xl bg-forest/90 border-2 border-emerald-500/40 space-y-4 shadow-card">
              <span className="font-outfit font-bold text-xs uppercase tracking-wider text-emerald-300">
                The CivicFix Community Handshake
              </span>
              <ul className="space-y-3 text-xs sm:text-sm font-jakarta text-cream/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Immediate bounty generation upon photographic report submission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Nearby technician accepts assignment within hours based on radius match.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>5-stage progress timeline updated live on the reporter's device.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Payout released only after the citizen inspects the "After" repair photo.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA Banner */}
      <CtaBanner
        onReportClick={() => navigate('/report')}
        onWorkerClick={() => navigate('/worker-jobs')}
        onTrackClick={() => navigate('/track-verify')}
      />
    </div>
  );
}

export default AboutPage;
