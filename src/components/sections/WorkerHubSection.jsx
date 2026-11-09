/**
 * src/components/sections/WorkerHubSection.jsx
 * Field Worker & Gig Restorations Hub (#worker-hub)
 * Features:
 * - Worker Auth Gate & Telemetry Bar (Wallet balance, jobs completed, area)
 * - Area, category, and lifecycle state filters ("Open Jobs", "My Active Jobs", "Awaiting Approval")
 * - Job cards with simulated distance indicators, bounty badges, and before-photos
 * - "Accept Job", "Start On-Site Work", and "Upload Proof of Resolution" (320px Canvas JPEG compression)
 * - Shortcut to switch to Citizen Reporter & verify fix in #track
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  listLocalComplaints,
  acceptComplaintJob,
  startWorkerJob,
  submitWorkerProof,
  compressImageToThumbnail
} from '../../services/complaints/index.js';
import { switchToDemoRole, refreshSession } from '../../services/auth/index.js';
import { CATEGORIES_BY_ID } from '../../data/categories.js';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import BRAND from '../../config/brand.js';
import {
  Wrench, Wallet, MapPin, Camera, AlertCircle, CheckCircle2,
  Clock, ArrowRight, Filter, ChevronRight, UserCheck, ShieldAlert,
  Sparkles, Layers
} from 'lucide-react';

const AREAS = [
  'All Areas',
  'South Bengaluru',
  'Central Bengaluru',
  'Indiranagar / East',
  'Jayanagar',
];

export function WorkerHubSection({
  user,
  onAuthSuccess,
  complaintRefreshTrigger,
  onComplaintUpdated,
  onSwitchToCitizenAndVerify,
  onOpenAuthModal,
  targetComplaintId,
  targetArea,
  targetTab,
}) {
  const [complaints, setComplaints] = useState([]);
  const [selectedArea, setSelectedArea] = useState(targetArea || 'All Areas');
  const [activeTab, setActiveTab] = useState(targetTab || 'open'); // 'open' | 'my-active' | 'awaiting' | 'all'
  const [proofFormFor, setProofFormFor] = useState(null); // complaintId
  const [proofPhotos, setProofPhotos] = useState([]);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofError, setProofError] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const proofFileInputRef = useRef(null);

  const isWorker = user?.role === 'worker';

  // Load complaints from service layer
  const refreshComplaints = () => {
    const list = listLocalComplaints();
    setComplaints(list);
  };

  useEffect(() => {
    refreshComplaints();
  }, [complaintRefreshTrigger]);

  // Handle direct target complaint from URL query parameter (?id=...)
  useEffect(() => {
    if (!targetComplaintId || complaints.length === 0) return;
    const target = complaints.find(
      (c) => c.id.toUpperCase() === targetComplaintId.trim().toUpperCase()
    );
    if (target) {
      if (target.status === 'Submitted') {
        setActiveTab('open');
      } else if (target.status === 'Assigned' || target.status === 'In Progress') {
        setActiveTab(isWorker ? 'my-active' : 'all');
      } else if (target.status === 'Pending Approval') {
        setActiveTab('awaiting');
      } else {
        setActiveTab('all');
      }
      setSelectedArea('All Areas');
      setActionNotice(`Selected job ticket: ${target.id} (${target.status})`);
      setTimeout(() => {
        const el = document.getElementById(`job-card-${target.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [targetComplaintId, complaints, isWorker]);

  // Filter complaints based on tab and area
  const filteredJobs = useMemo(() => {
    return complaints.filter((c) => {
      // Area match
      if (selectedArea !== 'All Areas') {
        const areaMatch = (c.areaTag || '').toLowerCase().includes(selectedArea.toLowerCase());
        if (!areaMatch) return false;
      }

      // Tab match
      if (activeTab === 'open') {
        return c.status === 'Submitted';
      }
      if (activeTab === 'my-active') {
        if (!isWorker) return false;
        return (c.status === 'Assigned' || c.status === 'In Progress') &&
               (c.assignedWorker?.id === user?.id || c.assignedWorker?.email === user?.email);
      }
      if (activeTab === 'awaiting') {
        return c.status === 'Pending Approval';
      }
      return true; // 'all'
    });
  }, [complaints, selectedArea, activeTab, isWorker, user]);

  // Counts for tabs
  const openCount = useMemo(() => complaints.filter(c => c.status === 'Submitted').length, [complaints]);
  const myActiveCount = useMemo(() => {
    if (!isWorker) return 0;
    return complaints.filter(c =>
      (c.status === 'Assigned' || c.status === 'In Progress') &&
      (c.assignedWorker?.id === user?.id || c.assignedWorker?.email === user?.email)
    ).length;
  }, [complaints, isWorker, user]);
  const awaitingCount = useMemo(() => complaints.filter(c => c.status === 'Pending Approval').length, [complaints]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleLoginAsDemoWorker = () => {
    const worker = switchToDemoRole('worker');
    if (onAuthSuccess) onAuthSuccess(worker);
    setActionNotice('Logged in as Arjun K. (Verified Park Technician).');
  };

  const handleAcceptJob = (complaintId) => {
    if (!isWorker) {
      if (onOpenAuthModal) {
        onOpenAuthModal('login', 'worker');
      } else {
        setActionNotice('Role Gate: Only registered field technicians can accept maintenance jobs. Please switch to or log in as a Worker.');
      }
      return;
    }
    try {
      const updated = acceptComplaintJob(complaintId, user);
      refreshComplaints();
      setActionNotice(`Job ${updated.id} accepted! Card moved to "My Active Jobs".`);
      setActiveTab('my-active');
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setActionNotice(err.message);
    }
  };

  const handleStartWork = (complaintId) => {
    try {
      const updated = startWorkerJob(complaintId, user);
      refreshComplaints();
      setActionNotice(`Status updated to "In Progress" for ${updated.id}.`);
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setActionNotice(err.message);
    }
  };

  const handleOpenProofModal = (complaintId) => {
    setProofFormFor(complaintId);
    setProofPhotos([]);
    setResolutionNotes('');
    setProofError('');
  };

  const handleProofPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (proofPhotos.length + files.length > 3) {
      setProofError('Maximum 3 completion proof photos allowed.');
      return;
    }
    const compressed = await Promise.all(
      files.map((file) => compressImageToThumbnail(file))
    );
    setProofPhotos((prev) => [...prev, ...compressed]);
    if (proofFileInputRef.current) proofFileInputRef.current.value = '';
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (proofPhotos.length === 0) {
      setProofError('Please upload at least one "After" completion photograph.');
      return;
    }
    if (!resolutionNotes.trim() || resolutionNotes.trim().length < 10) {
      setProofError('Resolution note must be at least 10 characters.');
      return;
    }

    setSubmittingProof(true);
    try {
      const updated = submitWorkerProof(proofFormFor, user, {
        photos: proofPhotos,
        notes: resolutionNotes.trim(),
      });
      setSubmittingProof(false);
      setProofFormFor(null);
      refreshComplaints();
      setActionNotice(`Proof submitted for ${updated.id}! Complaint now awaits Citizen Approval.`);
      setActiveTab('awaiting');
      if (onComplaintUpdated) onComplaintUpdated(updated);
    } catch (err) {
      setSubmittingProof(false);
      setProofError(err.message);
    }
  };

  return (
    <section
      id="worker-hub"
      className="scroll-mt-24 py-6 md:py-10 w-full"
      aria-labelledby="worker-heading"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="worker" size="sm">
              <Wrench size={12} />
              <span>Step 2: Community Gig Restoration</span>
            </Badge>
            <Badge variant="demo" size="xs">
              Simulated Field Bounties
            </Badge>
          </div>

          <h2
            id="worker-heading"
            className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-[1.1] mb-4"
          >
            Nearby Park Maintenance Jobs.
          </h2>

          <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
            Are you a local technician or community maintenance worker? Discover reported issues in your surroundings, accept open bounties, upload photo proof of your repair, and earn community payouts upon citizen verification.
          </p>
        </div>

        {/* ── WORKER AUTH STATUS & TELEMETRY BAR ── */}
        {isWorker ? (
          <div className="p-6 rounded-3xl bg-forest text-cream border border-forest shadow-card mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sage/20 border border-sage/30 flex items-center justify-center text-sage text-xl font-bold font-outfit flex-shrink-0">
                {user.avatarInitials || 'WK'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-jakarta font-bold text-lg text-cream">
                    {user.name}
                  </h3>
                  <Badge variant="resolved" size="xs" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                    Verified Field Technician
                  </Badge>
                </div>
                <p className="text-xs text-cream/70 font-jakarta flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-sage" />
                  <span>{user.area || 'Bengaluru Green Zones (Within 3 km)'}</span>
                </p>
              </div>
            </div>

            {/* Live Wallet & Stats Counter */}
            <div className="flex items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-cream/15">
              <div>
                <span className="text-[11px] font-mono-cf text-sage/70 block uppercase">
                  SIMULATED WALLET BALANCE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-cream">
                    ₹{user.walletBalance ?? 1200}
                  </span>
                  <span className="text-[10px] text-cream/50 font-mono-cf">DEMO INR</span>
                </div>
              </div>

              <div className="h-10 w-px bg-cream/15 hidden sm:block" />

              <div>
                <span className="text-[11px] font-mono-cf text-sage/70 block uppercase">
                  COMPLETED RESTORATIONS
                </span>
                <span className="font-jakarta font-bold text-xl text-sage">
                  {user.completedJobs ?? 7} jobs
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/60 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="font-jakarta font-bold text-base text-amber-950">
                  {user ? `Signed in as Citizen (${user.name}) — Technician Access Required` : 'Technician Login Required to Accept Jobs'}
                </h3>
                <p className="text-xs text-amber-800 font-jakarta mt-0.5">
                  {user
                    ? 'Only verified field technicians can claim open maintenance bounties. Switch to technician mode to accept jobs and submit resolution proofs.'
                    : <>Sign in with demo worker credentials (<code className="font-mono-cf font-semibold">worker@civicfix.demo</code> / <code className="font-mono-cf font-semibold">worker123</code>) to accept open bounties and upload resolution proofs.</>}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoginAsDemoWorker}
              className="flex-shrink-0"
            >
              <UserCheck size={14} /> One-Click Switch to Demo Worker (Arjun K.)
            </Button>
          </div>
        )}

        {/* Action Notice Feedback */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-jakarta flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice('')}
              className="text-emerald-900 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── FILTER & TAB TOOLBAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-line">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-4 py-2 rounded-2xl text-xs font-outfit font-semibold transition-all ${
                activeTab === 'open'
                  ? 'bg-moss text-cream shadow-sm'
                  : 'bg-cream text-muted hover:text-moss hover:bg-line/50'
              }`}
            >
              Open Jobs Near Me ({openCount})
            </button>

            {isWorker && (
              <button
                onClick={() => setActiveTab('my-active')}
                className={`px-4 py-2 rounded-2xl text-xs font-outfit font-semibold transition-all ${
                  activeTab === 'my-active'
                    ? 'bg-moss text-cream shadow-sm'
                    : 'bg-cream text-muted hover:text-moss hover:bg-line/50'
                }`}
              >
                My Active Jobs ({myActiveCount})
              </button>
            )}

            <button
              onClick={() => setActiveTab('awaiting')}
              className={`px-4 py-2 rounded-2xl text-xs font-outfit font-semibold transition-all ${
                activeTab === 'awaiting'
                  ? 'bg-moss text-cream shadow-sm'
                  : 'bg-cream text-muted hover:text-moss hover:bg-line/50'
              }`}
            >
              Awaiting Citizen Approval ({awaitingCount})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-outfit font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-moss text-cream shadow-sm'
                  : 'bg-cream text-muted hover:text-moss hover:bg-line/50'
              }`}
            >
              All Records ({complaints.length})
            </button>
          </div>

          {/* Area Selector Dropdown / Chips */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted" />
            <span className="text-xs font-outfit text-muted">Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-line bg-surface font-jakarta text-xs text-moss focus:outline-none focus:ring-1 focus:ring-moss"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── JOB BOARD CARDS GRID ── */}
        {filteredJobs.length === 0 ? (
          <div className="p-12 rounded-4xl bg-surface border border-line text-center text-muted">
            <ShieldAlert size={36} className="mx-auto text-line mb-3" />
            <h4 className="font-jakarta font-bold text-base text-moss mb-1">
              No jobs found in this view
            </h4>
            <p className="text-xs font-jakarta max-w-sm mx-auto mb-4">
              Try switching the area filter to "All Areas" or submit a new citizen complaint in the reporting section above.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSelectedArea('All Areas'); setActiveTab('open'); }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const cat = CATEGORIES_BY_ID[job.categoryId] || { label: 'General Repair', icon: Wrench };
              const Icon = cat.icon;
              const isAssignedToMe = isWorker && (job.assignedWorker?.id === user?.id || job.assignedWorker?.email === user?.email);
              const thumbUrl = job.photos?.[0]?.thumb;

              const isTargeted = targetComplaintId && targetComplaintId.trim().toUpperCase() === job.id.toUpperCase();

              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className={`rounded-4xl bg-surface border shadow-card hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    isTargeted
                      ? 'border-clay ring-2 ring-clay/60 shadow-glow'
                      : 'border-line'
                  }`}
                >
                  {/* Card Header & Photo */}
                  <div>
                    {/* Before Photo Banner */}
                    <div className="relative aspect-video w-full bg-forest/20 overflow-hidden border-b border-line">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={job.parkName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-1">
                          <Camera size={24} />
                          <span className="text-[10px] font-mono-cf">NO BEFORE PHOTO</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="font-mono-cf text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-sm">
                          {job.id}
                        </span>
                        <Badge
                          variant={
                            job.status === 'Submitted'
                              ? 'bounty'
                              : job.status === 'Assigned'
                              ? 'assigned'
                              : job.status === 'In Progress'
                              ? 'in-progress'
                              : job.status === 'Pending Approval'
                              ? 'pending-approval'
                              : 'resolved'
                          }
                          size="xs"
                        >
                          {job.status}
                        </Badge>
                      </div>

                      {/* Distance pill */}
                      <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-full bg-forest/90 text-white text-[10px] font-outfit backdrop-blur-sm flex items-center gap-1">
                        <MapPin size={9} className="text-sage" />
                        <span>~1.4 km from your radius</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-outfit text-xs text-muted flex items-center gap-1">
                          <Icon size={13} className="text-clay" /> {cat.label}
                        </span>
                        <span className="font-jakarta font-extrabold text-lg text-clay">
                          ₹{job.bountyAmount}
                        </span>
                      </div>

                      <h4 className="font-jakarta font-bold text-base text-moss leading-snug mb-1">
                        {job.parkName}
                      </h4>

                      <p className="text-xs text-muted font-jakarta mb-3 line-clamp-1">
                        {job.parkLocation}
                      </p>

                      <p className="text-xs text-moss/80 font-jakarta line-clamp-2 leading-relaxed bg-cream/50 p-2.5 rounded-2xl border border-line/60">
                        "{job.description}"
                      </p>

                      {/* Assigned Worker / Reporter Note */}
                      <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-jakarta text-muted">
                        <span>Reporter: {job.reporter?.name || 'Citizen'}</span>
                        {job.assignedWorker && (
                          <span className="font-semibold text-moss">
                            Tech: {job.assignedWorker.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0">
                    {/* Status 1: Submitted -> Accept Job */}
                    {job.status === 'Submitted' && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleAcceptJob(job.id)}
                        className="w-full text-xs"
                      >
                        <Wrench size={14} /> Accept Job (₹{job.bountyAmount} Bounty)
                      </Button>
                    )}

                    {/* Status 2: Assigned -> Start Work */}
                    {job.status === 'Assigned' && (
                      isAssignedToMe ? (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => handleStartWork(job.id)}
                          className="w-full text-xs bg-forest hover:bg-moss"
                        >
                          <Clock size={14} /> Start On-Site Maintenance
                        </Button>
                      ) : (
                        <div className="w-full py-2.5 px-3 rounded-2xl bg-cream border border-line text-center text-xs text-muted font-outfit">
                          Assigned to {job.assignedWorker?.name}
                        </div>
                      )
                    )}

                    {/* Status 3: In Progress -> Upload Proof */}
                    {job.status === 'In Progress' && (
                      isAssignedToMe ? (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleOpenProofModal(job.id)}
                          className="w-full text-xs bg-amber-600 hover:bg-amber-700 border-none shadow-none text-white"
                        >
                          <Camera size={14} /> Upload Proof of Resolution
                        </Button>
                      ) : (
                        <div className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800 font-outfit">
                          Repair in progress by {job.assignedWorker?.name}
                        </div>
                      )
                    )}

                    {/* Status 4: Pending Approval -> Verify Shortcut */}
                    {job.status === 'Pending Approval' && (
                      <div className="space-y-2">
                        <div className="w-full py-2 px-3 rounded-2xl bg-amber-50 border border-amber-200 text-center text-[11px] text-amber-900 font-outfit">
                          Proof uploaded · Awaiting Citizen Review
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (onSwitchToCitizenAndVerify) onSwitchToCitizenAndVerify(job.id);
                          }}
                          className="w-full text-xs font-outfit text-clay font-semibold hover:bg-clay/5"
                        >
                          Switch to Citizen & Verify Fix <ArrowRight size={12} />
                        </Button>
                      </div>
                    )}

                    {/* Status 5: Resolved */}
                    {job.status === 'Resolved' && (
                      <div className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-outfit font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={14} /> Resolved · ₹{job.bountyAmount} Paid
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PROOF OF RESOLUTION MODAL DRAWER ── */}
      {proofFormFor && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="presentation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setProofFormFor(null)}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="proof-modal-title"
            className="relative bg-surface rounded-4xl shadow-card-lg w-full max-w-lg p-6 sm:p-8 z-10 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="worker" size="xs">
                  COMPLETION PROOF
                </Badge>
                <h3 id="proof-modal-title" className="font-jakarta font-bold text-xl text-moss mt-1">
                  Upload Resolution Evidence
                </h3>
              </div>
              <button
                onClick={() => setProofFormFor(null)}
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-moss"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted font-jakarta mb-6">
              Please upload at least one clear photograph showing the completed repair and enter a short resolution note for the citizen reporter to inspect.
            </p>

            <form onSubmit={handleSubmitProof} noValidate className="space-y-5">
              {/* Photo Upload Box */}
              <div>
                <label className="block text-xs font-outfit font-semibold text-moss mb-1.5">
                  1. "After" Repair Photographs (Max 3) <span className="text-clay">*</span>
                </label>

                <div className="grid grid-cols-3 gap-3 mb-2">
                  {proofPhotos.map((p, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-line bg-cream">
                      <img src={p.thumb} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProofPhotos(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {proofPhotos.length < 3 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-line hover:border-moss flex flex-col items-center justify-center cursor-pointer p-2 text-center transition-colors">
                      <Camera size={18} className="text-muted mb-1" />
                      <span className="text-[10px] font-outfit font-semibold text-moss">Add After Photo</span>
                      <input
                        ref={proofFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProofPhotoUpload}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label htmlFor="proof-notes" className="block text-xs font-outfit font-semibold text-moss mb-1.5">
                  2. Technician Resolution Notes (Min. 10 chars) <span className="text-clay">*</span>
                </label>
                <textarea
                  id="proof-notes"
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Replaced broken wooden slats with fresh teak boards and tightened all anchoring bolts..."
                  className="w-full p-3.5 rounded-2xl border border-line font-jakarta text-xs text-moss bg-cream/40 focus:outline-none focus:ring-1 focus:ring-moss"
                />
              </div>

              {proofError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-jakarta flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{proofError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setProofFormFor(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submittingProof}
                >
                  {submittingProof ? 'Compressing & Submitting...' : 'Submit Proof for Citizen Approval'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default WorkerHubSection;
