/**
 * src/components/sections/TrackSection.jsx
 * Complaint Tracker & Citizen Verification Handshake (#track)
 * Features:
 * - Real-time complaint ID search (with normalization) & sample chips (DEMO-1001, DEMO-1002, DEMO-1003)
 * - 5-stage progress timeline (Submitted -> Assigned -> In Progress -> Pending Approval -> Resolved)
 * - Side-by-Side Before/After Photo Verification Panel for "Pending Approval" complaints
 * - "Approve Fix & Release Payout" and "Request Rework" citizen controls
 * - Evaluator demo controls: "Advance Status" and "Reset Sample Data"
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  getComplaintById,
  listLocalComplaints,
  approveWorkerResolution,
  requestWorkerRework,
  advanceDemoStatus,
  resetDemoData
} from '../../services/complaints/index.js';
import { switchToDemoRole } from '../../services/auth/index.js';
import { CATEGORIES_BY_ID } from '../../data/categories.js';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import {
  Search, CheckCircle2, AlertCircle, Clock, MapPin, Wrench,
  Camera, ShieldCheck, RefreshCw, ArrowRight, UserCheck, Eye,
  Sparkles, RotateCcw, ShieldAlert
} from 'lucide-react';

const STAGES = [
  { id: 'Submitted',        label: 'Submitted',        desc: 'Bounty opened' },
  { id: 'Assigned',         label: 'Assigned',         desc: 'Technician dispatched' },
  { id: 'In Progress',      label: 'In Progress',      desc: 'On-site maintenance' },
  { id: 'Pending Approval', label: 'Pending Approval', desc: 'Awaiting citizen check' },
  { id: 'Resolved',         label: 'Resolved',         desc: 'Verified & payout released' },
];

export function TrackSection({
  user,
  onAuthSuccess,
  initialComplaintId,
  complaintRefreshTrigger,
  onComplaintUpdated,
  onSelectComplaint,
}) {
  const [searchInput, setSearchInput] = useState(initialComplaintId || 'DEMO-1002');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [reworkReason, setReworkReason] = useState('');
  const [showReworkInput, setShowReworkInput] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [celebrateResolved, setCelebrateResolved] = useState(false);

  // Sync initial ID if passed down (e.g., from Report submission)
  useEffect(() => {
    if (initialComplaintId) {
      setSearchInput(initialComplaintId);
      loadComplaint(initialComplaintId);
    }
  }, [initialComplaintId]);

  // Load recent complaints for chips
  useEffect(() => {
    const all = listLocalComplaints();
    setRecentComplaints(all.slice(0, 5));
    if (!activeComplaint) {
      loadComplaint(searchInput || 'DEMO-1002');
    }
  }, [complaintRefreshTrigger]);

  const loadComplaint = (id) => {
    if (!id) return;
    const normalized = id.trim().toUpperCase();
    const found = getComplaintById(normalized);
    setActiveComplaint(found);
    setShowReworkInput(false);
    setReworkReason('');
    if (found?.status === 'Resolved') {
      setCelebrateResolved(true);
    } else {
      setCelebrateResolved(false);
    }
    if (onSelectComplaint) {
      onSelectComplaint(normalized);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadComplaint(searchInput);
  };

  // ── Citizen Verification Actions ──
  const handleApproveFix = () => {
    if (!activeComplaint) return;
    if (user?.role === 'worker') {
      setActionMessage('Security Gate: Technicians cannot authorize their own payouts. Please switch to Citizen mode.');
      return;
    }
    try {
      const updated = approveWorkerResolution(activeComplaint.id, user);
      setActiveComplaint({ ...updated });
      setCelebrateResolved(true);
      setActionMessage(`Resolution approved! ₹${updated.bountyAmount} payout credited to worker wallet.`);
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleRequestRework = (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    if (user?.role === 'worker') {
      setActionMessage('Security Gate: Technicians cannot request rework on their own tasks. Please switch to Citizen mode.');
      return;
    }
    try {
      const updated = requestWorkerRework(activeComplaint.id, user, reworkReason || 'Please revisit problem site.');
      setActiveComplaint({ ...updated });
      setShowReworkInput(false);
      setActionMessage(`Rework requested for ${updated.id}. Job returned to "In Progress".`);
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  // ── Quick Evaluator Controls ──
  const handleAdvanceStatus = () => {
    if (!activeComplaint) return;
    try {
      const updated = advanceDemoStatus(activeComplaint.id);
      setActiveComplaint({ ...updated });
      setActionMessage(`[Demo Control] Status advanced to "${updated.status}".`);
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setActionMessage(err.message);
    }
  };

  const handleResetData = () => {
    resetDemoData();
    loadComplaint('DEMO-1002');
    setActionMessage('Sample data reset to default evaluation states.');
    if (onComplaintUpdated) onComplaintUpdated();
  };

  const cat = activeComplaint ? CATEGORIES_BY_ID[activeComplaint.categoryId] : null;
  const currentStageIndex = activeComplaint
    ? STAGES.findIndex((s) => s.id === activeComplaint.status)
    : -1;

  return (
    <section
      id="track"
      className="scroll-mt-24 py-6 md:py-10 w-full"
      aria-labelledby="track-heading"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="citizen" size="sm">
              <ShieldCheck size={12} className="text-forest" />
              <span>Step 3: Verification & Telemetry Handshake</span>
            </Badge>
            <Badge variant="demo" size="xs">
              Five-Stage Progress Telemetry
            </Badge>
          </div>

          <h2
            id="track-heading"
            className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-[1.1] mb-4"
          >
            Your complaint. Your visibility & verification.
          </h2>

          <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
            Track reported issues through our five-stage lifecycle. When a field technician submits photographic proof of resolution, inspect Before-and-After evidence and release the simulated community bounty.
          </p>
        </div>

        {/* ── SEARCH BAR & SAMPLE CHIPS ── */}
        <div className="p-6 sm:p-8 rounded-4xl bg-surface border border-line shadow-card mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Complaint ID (e.g. DEMO-1002, DEMO-1001, CF-2026-...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-line font-mono-cf text-sm uppercase text-moss bg-cream/30 focus:outline-none focus:ring-1 focus:ring-moss"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="flex-shrink-0">
              Track Complaint <ArrowRight size={14} />
            </Button>
          </form>

          {/* Clickable Quick Sample ID Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-jakarta">
            <span className="text-muted font-outfit">Quick Test Chips:</span>
            {['DEMO-1001', 'DEMO-1002', 'DEMO-1003'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  loadComplaint(id);
                }}
                className={`px-3 py-1 rounded-full font-mono-cf text-xs border transition-all ${
                  activeComplaint?.id === id
                    ? 'bg-moss text-cream border-moss font-bold shadow-sm'
                    : 'bg-cream text-moss border-line hover:border-moss'
                }`}
              >
                {id}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1 text-[11px] font-outfit text-muted hover:text-clay"
              >
                <RotateCcw size={11} /> Reset Sample Records
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {actionMessage && (
          <div className="mb-8 p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-jakarta flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-600 flex-shrink-0" />
              <span>{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage('')}
              className="text-emerald-900 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── COMPLAINT TELEMETRY DISPLAY ── */}
        {!activeComplaint ? (
          <div className="p-12 rounded-4xl bg-surface border border-line text-center text-muted">
            <AlertCircle size={36} className="mx-auto text-line mb-3" />
            <h4 className="font-jakarta font-bold text-base text-moss mb-1">
              Complaint Record Not Found
            </h4>
            <p className="text-xs font-jakarta max-w-sm mx-auto">
              No complaint matches the ID "{searchInput}". Try testing with chip <code className="font-mono-cf font-semibold">DEMO-1002</code> or report a new issue above.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Header Meta Card */}
            <div className="p-8 rounded-4xl bg-surface border border-line shadow-card-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-cf text-xs font-bold text-moss/70">
                      TICKET {activeComplaint.id}
                    </span>
                    {activeComplaint.isDemo && (
                      <Badge variant="demo" size="xs">
                        Demo Record
                      </Badge>
                    )}
                    <Badge variant="bounty" size="xs">
                      ₹{activeComplaint.bountyAmount} Bounty
                    </Badge>
                  </div>

                  <h3 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-moss tracking-tight">
                    {activeComplaint.parkName}
                  </h3>
                  <p className="text-xs text-muted font-jakarta mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-clay" />
                    <span>{activeComplaint.parkLocation} ({activeComplaint.areaTag})</span>
                  </p>
                </div>

                {/* Right Quick Evaluator Controls */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdvanceStatus}
                    className="text-xs py-2 px-3 border-line"
                    title="Quick demo tool to simulate advancing through the lifecycle"
                  >
                    <RefreshCw size={12} /> Advance Demo Status
                  </Button>
                </div>
              </div>

              {/* 2. Five-Stage Progress Timeline */}
              <div className="pt-8">
                <p className="text-xs font-outfit font-semibold text-muted uppercase tracking-wider mb-6">
                  Five-Stage Resolution Lifecycle
                </p>

                {/* Horizontal on Desktop, Vertical on Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = currentStageIndex > idx;
                    const isActive = currentStageIndex === idx;
                    const isPending = currentStageIndex < idx;

                    return (
                      <div
                        key={stage.id}
                        className={`
                          p-4 rounded-3xl border transition-all duration-300 relative
                          ${isActive
                            ? 'bg-clay/5 border-clay shadow-md ring-2 ring-clay/20'
                            : isCompleted
                            ? 'bg-forest/5 border-forest/30'
                            : 'bg-cream/40 border-line text-muted/60'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono-cf ${
                            isActive
                              ? 'bg-clay text-white'
                              : isCompleted
                              ? 'bg-forest text-cream'
                              : 'bg-line text-muted'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                          </span>

                          <span className={`text-[10px] font-mono-cf uppercase ${
                            isActive ? 'text-clay font-bold' : isCompleted ? 'text-forest' : 'text-muted/60'
                          }`}>
                            {isActive ? 'ACTIVE' : isCompleted ? 'DONE' : 'QUEUED'}
                          </span>
                        </div>

                        <h5 className={`font-outfit font-bold text-sm mb-1 ${
                          isActive ? 'text-clay-dark' : isCompleted ? 'text-moss' : 'text-muted'
                        }`}>
                          {stage.label}
                        </h5>

                        <p className="text-[11px] text-muted font-jakarta leading-tight">
                          {stage.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. CITIZEN REPORTER VERIFICATION PANEL (Active when Pending Approval) */}
            {activeComplaint.status === 'Pending Approval' && (
              <div className="p-8 sm:p-12 rounded-4xl bg-amber-50/70 border-2 border-amber-300 shadow-card-lg text-moss">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <Badge variant="pending-approval" size="xs">
                      WORKER PROOF SUBMITTED · CITIZEN APPROVAL REQUIRED
                    </Badge>
                    <h4 className="font-jakarta font-extrabold text-2xl text-moss tracking-tight mt-1">
                      Side-by-Side Resolution Verification
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-amber-900/90 font-jakarta leading-relaxed max-w-2xl mb-8">
                  The assigned field technician has uploaded photographic proof of the completed restoration. Inspect the Before-and-After evidence below to verify the repair before authorizing release of the simulated ₹{activeComplaint.bountyAmount} community payout.
                </p>

                {/* Side-by-Side Before & After Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left: Original Citizen Before Evidence */}
                  <div className="p-6 rounded-3xl bg-surface border border-line shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-outfit font-bold text-xs uppercase tracking-wider text-clay">
                        1. ORIGINAL REPORT ("BEFORE")
                      </span>
                      <span className="text-[10px] font-mono-cf text-muted">
                        Reported by: {activeComplaint.reporter?.name || 'Citizen'}
                      </span>
                    </div>

                    <div className="aspect-video rounded-2xl overflow-hidden border border-line mb-3 bg-cream">
                      {activeComplaint.photos?.[0]?.thumb ? (
                        <img
                          src={activeComplaint.photos[0].thumb}
                          alt="Before repair condition"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                          No photographic evidence
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-moss/90 font-jakarta leading-relaxed bg-cream/40 p-3 rounded-xl border border-line/60">
                      "{activeComplaint.description}"
                    </p>
                  </div>

                  {/* Right: Worker After Completion Proof */}
                  <div className="p-6 rounded-3xl bg-surface border-2 border-emerald-500/40 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-outfit font-bold text-xs uppercase tracking-wider text-emerald-700">
                        2. TECHNICIAN PROOF ("AFTER")
                      </span>
                      <span className="text-[10px] font-mono-cf text-emerald-800 font-semibold">
                        Tech: {activeComplaint.assignedWorker?.name || 'Arjun K.'}
                      </span>
                    </div>

                    <div className="aspect-video rounded-2xl overflow-hidden border border-emerald-500/40 mb-3 bg-forest/10">
                      {activeComplaint.workerProof?.photos?.[0]?.thumb ? (
                        <img
                          src={activeComplaint.workerProof.photos[0].thumb}
                          alt="After repair proof"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                          Proof photo processing
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-moss font-jakarta leading-relaxed">
                      <span className="font-semibold text-emerald-950 block mb-0.5">Technician Resolution Note:</span>
                      "{activeComplaint.workerProof?.notes || 'Restoration completed as requested.'}"
                    </div>
                  </div>
                </div>

                {/* Citizen Verification Decision Controls with Role Gate */}
                {user?.role === 'worker' ? (
                  <div className="p-6 rounded-3xl bg-amber-100/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert size={22} className="text-amber-800 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-jakarta font-bold text-sm text-amber-950">
                          Role Gate Active: Verification Locked for Technicians
                        </h5>
                        <p className="text-xs text-amber-900/90 font-jakarta mt-0.5">
                          You are currently signed in as <strong>{user.name}</strong> (Field Technician). To prevent conflicts of interest and unauthorized payouts, only Citizen accounts can verify the repair and release the bounty.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const citizen = switchToDemoRole('citizen');
                        if (onAuthSuccess) onAuthSuccess(citizen);
                        setActionMessage('Switched to Citizen Vineel S. You can now verify and approve this repair.');
                      }}
                      className="text-xs py-2 px-3 flex-shrink-0 shadow-sm"
                    >
                      <UserCheck size={14} /> Switch to Citizen (Vineel S.)
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="block font-outfit font-bold text-sm text-moss">
                        Authorize Bounty Release
                      </span>
                      <span className="text-xs text-muted font-jakarta">
                        Approving releases ₹{activeComplaint.bountyAmount} to {activeComplaint.assignedWorker?.name || 'technician'}'s demo wallet.
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleApproveFix}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={16} /> Approve Fix & Release ₹{activeComplaint.bountyAmount} Payout
                      </Button>

                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setShowReworkInput(!showReworkInput)}
                        className="border-amber-300 text-amber-900 hover:bg-amber-100"
                      >
                        Request Rework
                      </Button>
                    </div>
                  </div>
                )}

                {/* Optional Rework Reason Box */}
                {showReworkInput && (
                  <form onSubmit={handleRequestRework} className="mt-4 p-4 rounded-2xl bg-surface border border-amber-300 space-y-3">
                    <label htmlFor="rework-input" className="block text-xs font-outfit font-semibold text-amber-950">
                      Specify reason for rework:
                    </label>
                    <input
                      id="rework-input"
                      type="text"
                      value={reworkReason}
                      onChange={(e) => setReworkReason(e.target.value)}
                      placeholder="e.g. Loose bolts remain on the left side slat..."
                      className="w-full p-3 rounded-xl border border-line font-jakarta text-xs text-moss focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReworkInput(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="bg-amber-700 hover:bg-amber-800 text-white"
                      >
                        Submit Rework Request to Worker
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 4. Resolved Celebratory Banner */}
            {activeComplaint.status === 'Resolved' && (
              <div className="p-8 rounded-4xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <h4 className="font-jakarta font-extrabold text-xl text-emerald-950">
                      Complaint Fully Resolved & Verified
                    </h4>
                    <p className="text-xs text-emerald-800 font-jakarta mt-0.5">
                      Citizen verified resolution. Simulated ₹{activeComplaint.bountyAmount} community bounty paid to {activeComplaint.assignedWorker?.name || 'field technician'}.
                    </p>
                  </div>
                </div>

                <div className="font-mono-cf text-xs font-bold text-emerald-800 bg-emerald-100/80 px-4 py-2 rounded-2xl self-start sm:self-auto border border-emerald-300">
                  PAYOUT STATUS: RELEASED (DEMO)
                </div>
              </div>
            )}

            {/* 5. Telemetry Status History Log */}
            <div className="p-6 rounded-3xl bg-surface border border-line text-xs font-jakarta">
              <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-muted mb-3">
                Telemetry Audit Log
              </h5>
              <div className="space-y-2">
                {activeComplaint.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-moss/80">
                    <span className="font-mono-cf text-[10px] text-muted whitespace-nowrap">
                      {new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-semibold text-moss">[{h.status}]</span>
                    <span>{h.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrackSection;
