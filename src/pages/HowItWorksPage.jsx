/**
 * src/pages/HowItWorksPage.jsx
 * Route: /how-it-works
 * Explains the complete CivicFix two-sided restoration lifecycle:
 * - Citizen Journey (Steps 1–8)
 * - Worker Journey (Steps 1–8)
 * - Embeds the ProtocolArchive sticky stacking visual demonstration
 * - Direct action entry points to /report and /worker-jobs
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolArchive } from '../components/sections/ProtocolArchive.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
  MapPin, Wrench, Camera, ShieldCheck, CheckCircle2,
  Clock, ArrowRight, Eye, Navigation, Wallet, RotateCcw,
  Sparkles, Layers
} from 'lucide-react';

const CITIZEN_STEPS = [
  {
    num: '01',
    title: 'Discover Local Civic Problem',
    desc: 'Notice a broken bench, unlit walkway lamp, or damaged playground swing while visiting your neighborhood public park.',
    icon: Eye,
  },
  {
    num: '02',
    title: 'Submit Issue Report',
    desc: 'Select the matching maintenance category, enter the park landmark, and describe the hazard.',
    icon: MapPin,
  },
  {
    num: '03',
    title: 'Upload Photos & Pin Location',
    desc: 'Attach up to three "Before" photos (compressed via 320px Canvas) and drop an interactive sketch-pad pin.',
    icon: Camera,
  },
  {
    num: '04',
    title: 'Instant Bounty Assignment',
    desc: 'CivicFix automatically assigns a transparent community bounty (₹300 – ₹850) to incentivize local workers.',
    icon: Sparkles,
  },
  {
    num: '05',
    title: 'Nearby Worker Dispatched',
    desc: 'A verified field technician working within a 3 km radius discovers the ticket and accepts the job.',
    icon: Wrench,
  },
  {
    num: '06',
    title: 'Track On-Site Progress',
    desc: 'Follow the 5-stage telemetry timeline in real time as the technician arrives and executes the restoration.',
    icon: Clock,
  },
  {
    num: '07',
    title: 'Inspect Completion Proof',
    desc: 'Review high-resolution "After" repair photographs uploaded by the technician side-by-side with your original report.',
    icon: Layers,
  },
  {
    num: '08',
    title: 'Approve & Release Payout',
    desc: 'One click approves the resolution, marks the ticket Resolved, and credits the bounty to the worker demo wallet.',
    icon: CheckCircle2,
  },
];

const WORKER_STEPS = [
  {
    num: '01',
    title: 'Register & Log In as Worker',
    desc: 'Sign in with your verified technician credentials (e.g. Arjun K.) or register a custom demo technician account.',
    icon: Wrench,
  },
  {
    num: '02',
    title: 'Discover Nearby Open Jobs',
    desc: 'Browse open maintenance tickets in your surroundings and filter by neighborhood area or specific category.',
    icon: Navigation,
  },
  {
    num: '03',
    title: 'Inspect Distance & Reward',
    desc: 'Evaluate the park landmark, distance radius (e.g. 1.2 km away), and guaranteed bounty before accepting.',
    icon: MapPin,
  },
  {
    num: '04',
    title: 'Accept Job Assignment',
    desc: 'Claim the ticket to lock it in your "My Active Jobs" queue and prevent duplicate worker assignments.',
    icon: CheckCircle2,
  },
  {
    num: '05',
    title: 'Execute On-Site Restoration',
    desc: 'Travel to the park, toggle status to "In Progress", and repair the bench, clear debris, or restore lighting.',
    icon: Clock,
  },
  {
    num: '06',
    title: 'Upload Photographic Proof',
    desc: 'Capture "After" photos directly on your device. CivicFix compresses them to 320px JPEG for fast verification.',
    icon: Camera,
  },
  {
    num: '07',
    title: 'Submit for Citizen Review',
    desc: 'Add short technician resolution notes explaining materials used and submit the ticket for reporter sign-off.',
    icon: ShieldCheck,
  },
  {
    num: '08',
    title: 'Receive Payout Credit',
    desc: 'Upon citizen approval, the simulated bounty (e.g. ₹600) is credited to your demo wallet balance.',
    icon: Wallet,
  },
];

export function HowItWorksPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'worker'

  return (
    <div className="w-full flex flex-col py-12 md:py-20">
      <div className="layout-fluid">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <Badge variant="citizen" size="sm" className="mb-3">
            <Layers size={13} className="text-forest" />
            <span>Complete Platform Architecture</span>
          </Badge>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl lg:text-6xl text-moss tracking-tighter leading-tight mb-4">
            How CivicFix Works
          </h1>
          <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
            A transparent, two-sided civic restoration loop. Explore how citizens and field technicians collaborate to maintain public gardens without municipal delay.
          </p>
        </div>

        {/* Journey Switcher Tab Buttons */}
        <div className="flex gap-2 p-1.5 bg-cream rounded-3xl border border-line w-fit mb-12">
          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            className={`px-6 py-3 rounded-2xl font-outfit font-semibold text-sm transition-all ${
              activeTab === 'citizen'
                ? 'bg-moss text-cream shadow-sm'
                : 'text-muted hover:text-moss'
            }`}
          >
            Citizen Reporter Journey (8 Steps)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('worker')}
            className={`px-6 py-3 rounded-2xl font-outfit font-semibold text-sm transition-all ${
              activeTab === 'worker'
                ? 'bg-moss text-cream shadow-sm'
                : 'text-muted hover:text-moss'
            }`}
          >
            Field Worker Journey (8 Steps)
          </button>
        </div>

        {/* 8-Step Timeline Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
            <div>
              <h2 className="font-jakarta font-bold text-2xl text-moss">
                {activeTab === 'citizen' ? 'Citizen Lifecycle Flow' : 'Technician Dispatch Flow'}
              </h2>
              <p className="text-xs text-muted font-jakarta mt-1">
                {activeTab === 'citizen'
                  ? 'From identifying a park hazard to verifying the completed repair.'
                  : 'From discovering a nearby bounty to receiving wallet payout credit.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(activeTab === 'citizen' ? '/report' : '/worker-jobs')}
            >
              {activeTab === 'citizen' ? 'Try Reporting an Issue' : 'Browse Worker Job Board'}
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'citizen' ? CITIZEN_STEPS : WORKER_STEPS).map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-4xl bg-surface border border-line shadow-card hover:shadow-card-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono-cf font-extrabold text-2xl text-clay">
                        {step.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-moss/10 text-moss flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                    </div>
                    <h3 className="font-outfit font-bold text-base text-moss mb-2">
                      {step.title}
                    </h3>
                    <p className="font-jakarta text-xs text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-line/60 flex items-center gap-1.5 text-[11px] font-mono-cf text-moss/70">
                    <CheckCircle2 size={12} className="text-forest" />
                    <span>VERIFIED PROTOCOL</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded Interactive Sticky Stacking Protocol Archive */}
        <div className="my-16">
          <ProtocolArchive />
        </div>

        {/* Bottom CTA Block */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-forest text-cream flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-cream mb-2">
              Ready to restore your local park?
            </h3>
            <p className="text-xs sm:text-sm text-cream/70 font-jakarta max-w-xl">
              Report an issue with photographic proof or log in as a field technician to discover nearby paid community bounties.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/report')}
              className="rounded-full"
            >
              <MapPin size={15} /> Report an Issue
            </Button>
            <Button
              variant="outline-light"
              size="md"
              onClick={() => navigate('/worker-jobs')}
              className="rounded-full"
            >
              <Wrench size={15} /> Worker Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
