/**
 * src/components/layout/Footer.jsx
 * Accessible Charcoal Footer (#1A1A1A) with real route navigation
 * Features:
 * - Brand, Explore, Take Action, and Contact columns with router navigation
 * - Environment-based contact email with honest fallback
 * - Accessible Privacy Dialog with local storage inspect & clear controls
 * - Accessible Demo Terms & Simulated Bounty Notice Dialog
 * - Dynamic copyright year & Demo Mode system status indicator
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import BRAND from '../../config/brand.js';
import {
  Leaf, ArrowUp, ShieldCheck, FileText, Mail,
  CheckCircle2, Trash2
} from 'lucide-react';

export function Footer({ onOpenAuthModal }) {
  const navigate = useNavigate();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const contactEmail = BRAND.contactEmail();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('civicfix:complaints:v1');
      localStorage.removeItem('civicfix:auth:v1');
      setClearedNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.warn('Could not clear local demo data:', e);
    }
  };

  return (
    <footer
      className="bg-charcoal text-cream rounded-t-[3rem] sm:rounded-t-[4.5rem] pt-16 sm:pt-20 pb-12 mt-16 border-t border-line/10 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="layout-fluid">
        {/* ── TOP 4-COLUMN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-cream/10">

          {/* Column 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2.5 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-clay rounded-full"
              aria-label="CivicFix — return to homepage"
            >
              <span className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-sage">
                <Leaf size={16} />
              </span>
              <span className="font-outfit font-extrabold text-xl tracking-tight">
                {BRAND.name}
              </span>
            </Link>

            <p className="font-cormorant italic text-xl text-sage/80 max-w-sm">
              "Together, let's keep our public spaces beautiful."
            </p>

            <p className="text-xs text-cream/60 font-jakarta leading-relaxed max-w-sm">
              {BRAND.description}
            </p>

            {/* Demo Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/10 border border-cream/15 text-xs font-mono-cf text-cream/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System: Demo mode · LocalStorage active</span>
            </div>
          </div>

          {/* Column 2: Explore Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-sage">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-jakarta text-cream/70" role="list">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-cream transition-colors hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cream transition-colors hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/worker-jobs" className="hover:text-cream transition-colors hover:underline">
                  Worker Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cream transition-colors hover:underline">
                  The Manifesto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Take Action (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-sage">
              Take Action
            </h4>
            <ul className="space-y-2 text-xs font-jakarta text-cream/70" role="list">
              <li>
                <Link to="/report" className="hover:text-cream transition-colors hover:underline">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/track-verify" className="hover:text-cream transition-colors hover:underline">
                  Track & Verify
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cream transition-colors hover:underline">
                  Worker / Citizen Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cream transition-colors hover:underline">
                  Create Demo Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Honesty (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-sage">
              Contact & Support
            </h4>

            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono-cf text-cream/90 hover:text-clay transition-colors hover:underline"
              >
                <Mail size={13} /> {contactEmail}
              </a>
            ) : (
              <p className="text-xs text-cream/50 font-jakarta leading-relaxed">
                {BRAND.contactFallback}
              </p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-left text-xs text-cream/60 hover:text-cream transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck size={13} className="text-sage" />
                <span>Privacy & Data Handling</span>
              </button>

              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="text-left text-xs text-cream/60 hover:text-cream transition-colors flex items-center gap-1.5"
              >
                <FileText size={13} className="text-sage" />
                <span>Demo Terms & Bounty Notice</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM UTILITY BAR ── */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-jakarta text-cream/50">
          <p>{BRAND.copyright}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-cream transition-colors"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-cream transition-colors"
            >
              Simulated Terms
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-sage hover:text-cream transition-colors ml-2"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── PRIVACY DIALOG ── */}
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy & Local Data Policy"
        description="Transparent disclosure on how CivicFix handles your device data in demo mode."
        size="md"
      >
        <div className="space-y-4 text-xs font-jakarta text-moss leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <strong>Demo Mode Notice:</strong> CivicFix operates entirely client-side in your browser by default. No complaints, worker login credentials, or uploaded photographs are transmitted to municipal databases, police departments, or cloud tracking servers.
          </div>

          <div>
            <h5 className="font-outfit font-bold text-sm text-moss mb-1">Local Storage Keys Used</h5>
            <ul className="list-disc list-inside space-y-1 font-mono-cf text-[11px] text-muted">
              <li><code className="bg-cream px-1 py-0.5 rounded">civicfix:complaints:v1</code> — Stores local complaint tickets and uploaded canvas-compressed thumbnails.</li>
              <li><code className="bg-cream px-1 py-0.5 rounded">civicfix:auth:v1</code> — Stores active user session role (Citizen or Worker) and simulated wallet balances.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearData}
              className="border-red-300 text-red-700 hover:bg-red-50 text-xs"
            >
              <Trash2 size={13} /> {clearedNotice ? 'Resetting...' : 'Clear Device Storage & Reset'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setPrivacyOpen(false)}
            >
              Understood
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── DEMO TERMS DIALOG ── */}
      <Modal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Demo Terms & Simulated Bounty Notice"
        description="Operating parameters and simulated community gig resolution guidelines."
        size="md"
      >
        <div className="space-y-4 text-xs font-jakarta text-moss leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-forest/10 border border-forest/20 text-forest">
            <strong>Simulated Community Bounties:</strong> All bounties displayed across CivicFix (ranging from ₹300 to ₹850) are simulated demonstration tokens. No real currency, credit cards, or banking transactions are handled.
          </div>

          <div>
            <h5 className="font-outfit font-bold text-sm text-moss mb-1">Two-Sided Verification Integrity</h5>
            <p className="text-muted">
              CivicFix models a trust-first community handshake: field technicians must upload verifiable photographic proof of completed repairs before citizen reporters authorize release of the community bounty into the worker's demo wallet.
            </p>
          </div>

          <div className="pt-3 border-t border-line flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setTermsOpen(false)}
            >
              Close Guidelines
            </Button>
          </div>
        </div>
      </Modal>
    </footer>
  );
}

export default Footer;
