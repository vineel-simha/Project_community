/**
 * src/pages/HomePage.jsx
 * Route: /
 * Product Landing Page introducing CivicFix.
 * Built with full-width responsive sections, edge-to-edge backgrounds,
 * fluid padding (clamp(20px, 4vw, 72px)), and rich educational storytelling.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/hero/Hero.jsx';
import { DiagnosticShuffler } from '../components/features/DiagnosticShuffler.jsx';
import { TelemetryTypewriter } from '../components/features/TelemetryTypewriter.jsx';
import { CursorScheduler } from '../components/features/CursorScheduler.jsx';
import { CtaBanner } from '../components/sections/CtaBanner.jsx';
import { CATEGORIES } from '../data/categories.js';
import { listLocalComplaints } from '../services/complaints/index.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import BRAND from '../config/brand.js';
import {
  MapPin, Wrench, ShieldCheck, Camera, ArrowRight,
  CheckCircle2, Clock, AlertTriangle, Users, Sparkles,
  ChevronDown, HelpCircle, Layers, Trees
} from 'lucide-react';

const FAQS = [
  {
    q: 'What is CivicFix and how does it work?',
    a: 'CivicFix is a community-driven civic technology platform that connects citizens who notice maintenance issues in public parks with nearby verified gig technicians. When an issue is reported, an automatic simulated community bounty is opened. A nearby technician fixes the problem, uploads photo proof, and the citizen verifies the repair before the payout is released.',
  },
  {
    q: 'How does the photographic verification handshake work?',
    a: 'Before any payout is credited to a worker, the field technician must upload high-resolution "After" photographs and resolution notes. The original citizen reporter inspects the Before-and-After evidence side-by-side. If the repair meets community standards, the citizen clicks "Approve", instantly releasing the bounty. If not, they can request rework.',
  },
  {
    q: 'Are the bounties real money or simulated?',
    a: 'In this client-side demo mode, all bounties (ranging from ₹300 to ₹850) and wallet balances are simulated demonstration tokens stored in your browser localStorage. No banking transactions, credit cards, or live payment gateways are involved.',
  },
  {
    q: 'Who can register as a field technician?',
    a: 'Any local technician, gardener, or maintenance worker can create a Worker account. Workers can browse nearby open jobs, filter by neighborhood distance, accept assignments, and track their demo wallet earnings.',
  },
  {
    q: 'Does CivicFix replace municipal authorities?',
    a: 'CivicFix is designed to complement existing civic maintenance by solving rapid-response neighborhood park issues (like loose bench slats, dead solar pathway bulbs, or small debris choke points) without bureaucratic delay.',
  },
  {
    q: 'Is my data transmitted to external servers?',
    a: 'No. The platform operates 100% client-side in your browser. All complaint records, photo compressions, worker sessions, and wallet balances stay strictly on your device.',
  },
];

export function HomePage({ user, onSelectCategory }) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  // Genuine local complaint statistics (no fabricated data)
  const complaints = useMemo(() => listLocalComplaints(), []);
  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const open = complaints.filter(c => c.status === 'Submitted').length;
    const totalBounty = complaints.reduce((sum, c) => sum + (c.bountyAmount || 0), 0);
    return { total, resolved, open, totalBounty };
  }, [complaints]);

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    navigate(`/report?category=${catId}`);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section (Full Viewport, Two-Column Responsive Grid) */}
      <Hero onSelectCategory={handleCategoryClick} />

      {/* Demo Mode Global Notice Bar */}
      <div className="w-full bg-amber-50 border-y border-amber-200/80 px-6 py-2.5">
        <div className="layout-fluid flex items-center justify-between text-xs text-amber-900 font-jakarta gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-700 flex-shrink-0" />
            <span>{BRAND.demoNotice}</span>
          </div>
          <Badge variant="demo" size="xs" className="hidden sm:inline-flex flex-shrink-0">
            Demo Mode Active
          </Badge>
        </div>
      </div>

      {/* 2. The Problem: Traditional Bureaucracy vs. Public Park Decay */}
      <section className="w-full py-20 bg-cream border-b border-line/60">
        <div className="layout-fluid">
          <div className="max-w-3xl mb-12">
            <Badge variant="citizen" size="sm" className="mb-3">
              <AlertTriangle size={12} className="text-clay" />
              <span>The Civic Dilemma</span>
            </Badge>
            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-tight mb-4">
              Why do neighborhood parks deteriorate?
            </h2>
            <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
              When small public issues arise—a snapped wooden bench slat, a dead perimeter solar lamp, or an overflowing waste bin—traditional reporting systems trap requests in administrative backlogs for months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-4xl bg-surface border border-line shadow-card hover:shadow-card-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <h3 className="font-jakarta font-bold text-xl text-moss mb-2">Bureaucratic Delays</h3>
              <p className="font-jakarta text-sm text-muted leading-relaxed">
                Traditional municipal ticket systems average weeks to route simple park repairs between contracting tiers.
              </p>
            </div>

            <div className="p-8 rounded-4xl bg-surface border border-line shadow-card hover:shadow-card-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-jakarta font-bold text-xl text-moss mb-2">Opaque Progress</h3>
              <p className="font-jakarta text-sm text-muted leading-relaxed">
                Citizens submit reports but receive no photographic confirmation or telemetry tracking whether the work was ever completed.
              </p>
            </div>

            <div className="p-8 rounded-4xl bg-surface border border-line shadow-card hover:shadow-card-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="font-jakarta font-bold text-xl text-moss mb-2">Untapped Local Labor</h3>
              <p className="font-jakarta text-sm text-muted leading-relaxed">
                Skilled neighborhood gardeners, carpenters, and electricians live right next to broken parks but lack a platform to discover micro-repairs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The CivicFix Solution: Direct Citizen-Worker Collaboration */}
      <section className="w-full py-20 bg-forest text-cream relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-clay/10 blur-3xl pointer-events-none"
        />

        <div className="layout-fluid relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="resolved" size="sm" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                <Sparkles size={12} className="text-emerald-400" />
                <span>The Community Handshake</span>
              </Badge>

              <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-cream tracking-tighter leading-tight">
                Direct action. Transparent verification.
              </h2>

              <p className="font-jakarta text-cream/70 text-base sm:text-lg leading-relaxed">
                CivicFix connects vigilant citizens directly with certified local technicians. By attaching clear photographic evidence and transparent community bounties, repairs are completed on-site within days—not months.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '100% Photographic Before-and-After Verification',
                  'Simulated community bounties released only upon citizen approval',
                  'Hyper-local radius matching within 3 km of your park',
                  'Zero paperwork: automated 5-stage status telemetry',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-jakarta text-cream/90">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" onClick={() => navigate('/report')} className="rounded-full shadow-clay">
                  <MapPin size={16} /> Report an Issue
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => navigate('/how-it-works')} className="rounded-full">
                  Explore Workflow <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <TelemetryTypewriter />
            </div>
          </div>
        </div>
      </section>

      {/* 4. How CivicFix Works: 4-Stage Overview Preview */}
      <section className="w-full py-20 bg-cream">
        <div className="layout-fluid">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Badge variant="citizen" size="sm" className="mb-3">
                <Layers size={12} className="text-forest" />
                <span>Restoration Workflow</span>
              </Badge>
              <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter">
                Four simple steps to a cleaner park.
              </h2>
            </div>
            <Button variant="ghost" size="md" onClick={() => navigate('/how-it-works')} className="self-start md:self-auto">
              View Detailed Guide <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Snap & Report',
                desc: 'Citizens capture the damaged bench or unlit trail, upload before-photos, and drop a sketch-map pin.',
                bounty: 'Opens Bounty',
                route: '/report',
              },
              {
                step: '02',
                title: 'Worker Accepts',
                desc: 'A nearby registered technician discovers the issue in their area filter and claims the assignment.',
                bounty: 'Dispatches Tech',
                route: '/worker-jobs',
              },
              {
                step: '03',
                title: 'On-Site Fix & Proof',
                desc: 'The technician executes the repair on-site and uploads completion photos via canvas compression.',
                bounty: 'Photo Proof',
                route: '/worker-jobs',
              },
              {
                step: '04',
                title: 'Citizen Verifies',
                desc: 'The citizen inspects the side-by-side Before/After evidence and approves the fix to release payment.',
                bounty: 'Payout Released',
                route: '/track-verify',
              },
            ].map((s) => (
              <div
                key={s.step}
                onClick={() => navigate(s.route)}
                className="p-6 rounded-4xl bg-surface border border-line shadow-card hover:shadow-card-lg hover:border-moss/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-cf font-extrabold text-2xl text-clay group-hover:scale-110 transition-transform">
                      {s.step}
                    </span>
                    <Badge variant="muted" size="xs">{s.bounty}</Badge>
                  </div>
                  <h3 className="font-jakarta font-bold text-lg text-moss mb-2 group-hover:text-clay-dark transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-jakarta text-xs text-muted leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-outfit text-moss font-semibold">
                  <span>Explore Stage</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Micro-UI interactive previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <DiagnosticShuffler />
            <CursorScheduler />
          </div>
        </div>
      </section>

      {/* 5. Issue Categories: 8 Supported Problem Types */}
      <section className="w-full py-20 bg-surface border-y border-line">
        <div className="layout-fluid">
          <div className="max-w-3xl mb-12">
            <Badge variant="bounty" size="sm" className="mb-3">
              <Trees size={12} className="text-clay" />
              <span>Supported Problems</span>
            </Badge>
            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter mb-4">
              What can you report on CivicFix?
            </h2>
            <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
              Every category comes with a pre-configured simulated maintenance bounty based on repair complexity and typical hardware requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="p-6 rounded-4xl bg-cream/40 border border-line/80 hover:border-moss hover:bg-cream transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-moss/10 group-hover:bg-clay group-hover:text-white text-moss flex items-center justify-center transition-colors">
                        <Icon size={18} />
                      </div>
                      <Badge variant="bounty" size="xs">
                        {cat.bountyFormatted} Bounty
                      </Badge>
                    </div>

                    <h3 className="font-outfit font-bold text-base text-moss mb-1 group-hover:text-clay-dark transition-colors">
                      {cat.label}
                    </h3>
                    <p className="font-jakarta text-xs text-muted leading-relaxed mb-4">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-outfit text-clay font-semibold">
                    <span>Report this issue</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Citizen & Worker Benefits Split */}
      <section className="w-full py-20 bg-cream">
        <div className="layout-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Citizen Benefits Card */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-surface border border-line shadow-card flex flex-col justify-between">
              <div>
                <Badge variant="citizen" size="sm" className="mb-4">
                  For Citizens & Park Visitors
                </Badge>
                <h3 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-moss tracking-tight mb-4">
                  Empowering your voice for greener neighborhoods.
                </h3>
                <p className="font-jakarta text-muted text-sm leading-relaxed mb-6">
                  Turn frustration with broken benches and unlit pathways into direct restorative action without navigating endless municipal forms.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Instant photo evidence upload with 320px Canvas compression',
                    'Interactive SVG sketch-pad location pin dropper',
                    'Real-time 5-stage progress timeline tracking',
                    'Inspect Before-and-After proof photos before approving',
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-moss font-jakarta">
                      <CheckCircle2 size={15} className="text-forest flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="primary" size="md" onClick={() => navigate('/report')} className="self-start">
                <MapPin size={15} /> Report an Issue Now
              </Button>
            </div>

            {/* Worker Benefits Card */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-forest text-cream border border-forest shadow-card flex flex-col justify-between">
              <div>
                <Badge variant="resolved" size="sm" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 mb-4">
                  For Local Gig Technicians
                </Badge>
                <h3 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-cream tracking-tight mb-4">
                  Flexible micro-bounties in your immediate radius.
                </h3>
                <p className="font-jakarta text-cream/70 text-sm leading-relaxed mb-6">
                  Are you a carpenter, gardener, electrician, or handyman? Discover paid maintenance jobs right across your neighborhood green spaces.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Filter jobs within 3 km of your current neighborhood',
                    'Clear, guaranteed simulated bounty amounts up-front',
                    'One-click job acceptance and on-site status toggles',
                    'Automatic wallet credit upon citizen verification',
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-cream/90 font-jakarta">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="md" onClick={() => navigate('/worker-jobs')} className="self-start bg-cream text-moss hover:bg-white">
                <Wrench size={15} /> Discover Nearby Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community Impact & Telemetry Counters */}
      <section className="w-full py-16 bg-moss text-cream">
        <div className="layout-fluid">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-cream/15">
            <div>
              <span className="font-mono-cf text-xs text-sage uppercase tracking-wider block mb-1">
                DEMO TELEMETRY // REAL-TIME COUNTERS
              </span>
              <h2 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-cream">
                Platform Activity on This Device
              </h2>
            </div>
            <Badge variant="sample" size="xs" className="bg-sage/20 text-cream border-sage/30 self-start md:self-auto">
              Reflects LocalStorage Records
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-forest/80 border border-cream/10">
              <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-cream block mb-1">
                {stats.total}
              </span>
              <span className="font-outfit text-xs text-sage font-semibold uppercase">Total Complaints</span>
            </div>

            <div className="p-6 rounded-3xl bg-forest/80 border border-cream/10">
              <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-clay block mb-1">
                {stats.open}
              </span>
              <span className="font-outfit text-xs text-sage font-semibold uppercase">Open for Workers</span>
            </div>

            <div className="p-6 rounded-3xl bg-forest/80 border border-cream/10">
              <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-emerald-300 block mb-1">
                {stats.resolved}
              </span>
              <span className="font-outfit text-xs text-sage font-semibold uppercase">Verified & Resolved</span>
            </div>

            <div className="p-6 rounded-3xl bg-forest/80 border border-cream/10">
              <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-cream block mb-1">
                ₹{stats.totalBounty}
              </span>
              <span className="font-outfit text-xs text-sage font-semibold uppercase">Simulated Bounties</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (FAQ) */}
      <section className="w-full py-20 bg-cream">
        <div className="layout-fluid">
          <div className="max-w-3xl mb-12">
            <Badge variant="citizen" size="sm" className="mb-3">
              <HelpCircle size={12} className="text-forest" />
              <span>Common Questions</span>
            </Badge>
            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter mb-4">
              Everything you need to know.
            </h2>
            <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
              Clear, transparent answers about our civic reporting workflow, simulated gig verification, and local data handling.
            </p>
          </div>

          <div className="max-w-4xl space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-surface border border-line shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                  >
                    <span className="font-jakarta font-bold text-base text-moss">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-moss text-cream' : ''}`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-line/40 text-xs sm:text-sm font-jakarta text-muted leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Banner */}
      <CtaBanner
        onReportClick={() => navigate('/report')}
        onWorkerClick={() => navigate('/worker-jobs')}
        onTrackClick={() => navigate('/track-verify')}
      />
    </div>
  );
}

export default HomePage;
