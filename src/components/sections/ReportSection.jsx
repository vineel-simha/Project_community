/**
 * src/components/sections/ReportSection.jsx
 * Citizen Complaint Reporting Hub (#report)
 * Features:
 * - 8-tile accessible radiogroup category picker with arrow-key nav & simulated bounties
 * - Validated form with live description character counter (20 - 500 chars)
 * - Canvas-based 320px JPEG photo compression for up to 3 "Before" photos
 * - Interactive SVG sketch-map location pin dropper & Geolocation API fallback
 * - Confirmation receipt with Copy-ID, assigned bounty, and quick Worker dispatch shortcut
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CATEGORIES_BY_ID } from '../../data/categories.js';
import { createComplaint, compressImageToThumbnail } from '../../services/complaints/index.js';
import { switchToDemoRole } from '../../services/auth/index.js';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import BRAND from '../../config/brand.js';
import {
  MapPin, Camera, AlertCircle, CheckCircle2, Copy, Check,
  Navigation, Trash2, ArrowRight, UserCheck, Sparkles, RefreshCw
} from 'lucide-react';

const SUGGESTED_AREAS = [
  'Lalbagh / South Bengaluru',
  'Cubbon Park / Central',
  'Indiranagar Green Corridors',
  'Jayanagar 4th Block Park',
  'Rajarajeshwari Nagar',
];

export function ReportSection({
  user,
  onAuthSuccess,
  preselectedCategory,
  onComplaintCreated,
  onSwitchToWorkerAndScroll,
  onTrackComplaint,
}) {
  const navigate = useNavigate();

  // Form State
  const [parkName, setParkName] = useState('');
  const [parkLocation, setParkLocation] = useState('');
  const [areaTag, setAreaTag] = useState('South Bengaluru');
  const [categoryId, setCategoryId] = useState(preselectedCategory || 'benches');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]); // array of { name, size, thumb, file }
  const [pin, setPin] = useState(null); // { x: number, y: number, label: string }

  // Sync preselection from Hotspot if it changes
  useEffect(() => {
    if (preselectedCategory && CATEGORIES_BY_ID[preselectedCategory]) {
      setCategoryId(preselectedCategory);
    }
  }, [preselectedCategory]);

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState('');

  const sketchPadRef = useRef(null);
  const fileInputRef = useRef(null);

  // Selected Category Object
  const selectedCat = CATEGORIES_BY_ID[categoryId] || CATEGORIES[1];

  // ─── Field Validation ───────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs = {};
    if (!parkName.trim() || parkName.trim().length < 3) {
      errs.parkName = 'Park name must be at least 3 characters.';
    }
    if (!parkLocation.trim()) {
      errs.parkLocation = 'Please specify the location or landmark within the park.';
    }
    if (!categoryId) {
      errs.categoryId = 'Please select a maintenance category.';
    }
    if (!description.trim() || description.trim().length < 20) {
      errs.description = `Description must be at least 20 characters (currently ${description.trim().length}).`;
    } else if (description.trim().length > 500) {
      errs.description = 'Description cannot exceed 500 characters.';
    }
    return errs;
  }, [parkName, parkLocation, categoryId, description]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  // ─── Photo Upload & Canvas Compression ──────────────────────────────────────
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 3) {
      setErrors((prev) => ({ ...prev, photos: 'Maximum 3 photographs allowed.' }));
      return;
    }

    const validFiles = files.filter((f) => {
      const isImg = f.type.startsWith('image/');
      const isUnder5Mb = f.size <= 5 * 1024 * 1024;
      return isImg && isUnder5Mb;
    });

    if (validFiles.length < files.length) {
      setErrors((prev) => ({ ...prev, photos: 'Files must be JPG, PNG or WebP under 5 MB.' }));
    }

    const compressedThumbs = await Promise.all(
      validFiles.map((file) => compressImageToThumbnail(file))
    );

    setPhotos((prev) => [...prev, ...compressedThumbs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Sketch Map Pin Dropper ────────────────────────────────────────────────
  const handleMapClick = (e) => {
    const rect = sketchPadRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPin({ x, y, label: `${parkName || 'Park'} pin (${x}%, ${y}%)` });
    setGeoNotice('Pin placed on sketch map.');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setPin({
          x: 50,
          y: 50,
          label: `GPS: ${lat}° N, ${lng}° E`,
        });
        setGeoNotice(`GPS location acquired (${lat}°, ${lng}°).`);
      },
      (err) => {
        setGeoLocating(false);
        setGeoNotice('Location access not permitted. You can tap on the sketch map below to place a pin.');
      },
      { timeout: 8000 }
    );
  };

  // ─── Category Keyboard Navigation ──────────────────────────────────────────
  const handleCategoryKeyDown = (e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    }
    if (nextIndex !== index) {
      setCategoryId(CATEGORIES[nextIndex].id);
      const nextBtn = document.getElementById(`cat-radio-${CATEGORIES[nextIndex].id}`);
      nextBtn?.focus();
    }
  };

  // ─── Quick Demo Citizen Sign-in ────────────────────────────────────────────
  const handleLoginAsDemoCitizen = () => {
    const citizen = switchToDemoRole('citizen');
    if (onAuthSuccess) onAuthSuccess(citizen);
  };

  // ─── Form Submission ───────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setTouched({
      parkName: true,
      parkLocation: true,
      categoryId: true,
      description: true,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      el?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const reporter = user
        ? { id: user.id, name: user.name, email: user.email }
        : { id: 'demo-citizen-001', name: 'Vineel S.', email: 'citizen@civicfix.demo' };

      const complaint = createComplaint({
        parkName,
        parkLocation,
        areaTag,
        categoryId,
        description,
        bountyAmount: selectedCat.bounty,
        reporter,
        photos,
        pin,
      });

      setSubmitting(false);
      setSubmittedComplaint(complaint);
      if (onComplaintCreated) onComplaintCreated(complaint);
    } catch (err) {
      setSubmitting(false);
      console.error('[CivicFix Report] Submission failed:', err);
      setErrors({ form: 'Storage submission failed. Please try again.' });
    }
  };

  const copyIdToClipboard = () => {
    if (!submittedComplaint) return;
    navigator.clipboard?.writeText(submittedComplaint.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetForm = () => {
    setParkName('');
    setParkLocation('');
    setDescription('');
    setPhotos([]);
    setPin(null);
    setErrors({});
    setTouched({});
    setSubmittedComplaint(null);
  };

  return (
    <section
      id="report"
      className="scroll-mt-24 py-6 md:py-10 w-full"
      aria-labelledby="report-heading"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="citizen" size="sm">
              <Sparkles size={12} className="text-forest" />
              <span>Step 1: Citizen Field Intake</span>
            </Badge>
            <Badge variant="bounty" size="xs">
              Simulated Bounties ₹300 – ₹800
            </Badge>
          </div>

          <h2
            id="report-heading"
            className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-moss tracking-tighter leading-[1.1] mb-4"
          >
            Help us keep your park beautiful.
          </h2>

          <p className="font-jakarta text-muted text-base sm:text-lg leading-relaxed">
            Report maintenance problems in your neighborhood garden. Every complaint automatically generates a transparent community bounty for verified local gig technicians to repair.
          </p>
        </div>

        {/* Demo Mode Notice & Active Reporter Banner */}
        <div className="mb-8 p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 font-jakarta">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-950">Client-Side Demo Storage</p>
              <p className="text-amber-800/90">{BRAND.demoNotice}</p>
            </div>
          </div>

          {/* Reporter Status Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
            {user ? (
              <Badge variant={user.role === 'worker' ? 'worker' : 'citizen'} size="sm">
                <UserCheck size={12} />
                <span>Reporting as: {user.name} ({user.role})</span>
              </Badge>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoginAsDemoCitizen}
                className="bg-amber-100/70 border border-amber-300 text-amber-900 hover:bg-amber-200 text-xs py-1.5 px-3 min-h-0"
              >
                Auto-fill Demo Citizen (Vineel S.)
              </Button>
            )}
          </div>
        </div>

        {/* ── SUBMISSION CONFIRMATION PANEL ── */}
        {submittedComplaint ? (
          <div className="p-8 sm:p-12 rounded-4xl bg-surface border border-line shadow-card-lg text-moss">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <Badge variant="resolved" size="xs">
                  COMPLAINT SUBMITTED
                </Badge>
                <h3 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-moss tracking-tight mt-1">
                  Report Registered & Bounty Opened
                </h3>
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 rounded-3xl bg-cream/70 border border-line mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-mono-cf text-muted block mb-1">COMPLAINT TICKET ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-cf font-bold text-lg text-moss">
                    {submittedComplaint.id}
                  </span>
                  <button
                    onClick={copyIdToClipboard}
                    className="p-1.5 rounded-lg border border-line hover:bg-surface text-muted hover:text-moss transition-colors"
                    aria-label="Copy complaint ID"
                  >
                    {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono-cf text-muted block mb-1">ASSIGNED FIELD BOUNTY</span>
                <span className="font-jakarta font-bold text-xl text-clay">
                  ₹{submittedComplaint.bountyAmount}
                </span>
                <span className="text-[11px] text-muted block">Simulated local payout</span>
              </div>

              <div>
                <span className="text-xs font-mono-cf text-muted block mb-1">INITIAL STATUS</span>
                <Badge variant="submitted" size="sm">
                  Submitted · Open for Workers
                </Badge>
              </div>
            </div>

            {/* Next Steps CTA Actions */}
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (onTrackComplaint) {
                    onTrackComplaint(submittedComplaint.id);
                  } else {
                    navigate(`/track-verify?id=${submittedComplaint.id}`);
                  }
                }}
              >
                Track this Complaint in Verification Handshake <ArrowRight size={14} />
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  if (onSwitchToWorkerAndScroll) {
                    onSwitchToWorkerAndScroll(submittedComplaint.id);
                  } else {
                    switchToDemoRole('worker');
                    navigate(`/worker-jobs?id=${submittedComplaint.id}`);
                  }
                }}
              >
                Switch to Worker View to Accept Job
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={handleResetForm}
              >
                <RefreshCw size={14} /> Report Another Issue
              </Button>
            </div>
          </div>
        ) : (
          /* ── CITIZEN COMPLAINT FORM ── */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-8 sm:p-12 rounded-4xl bg-surface border border-line shadow-card-lg space-y-10"
          >
            {/* 1. Category 8-Tile Radiogroup */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="font-outfit font-bold text-base text-moss">
                  1. Select Maintenance Category <span className="text-clay">*</span>
                </label>
                <span className="text-xs font-mono-cf text-muted">
                  Bounty synced: {selectedCat.bountyFormatted}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Park maintenance categories"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {CATEGORIES.map((cat, idx) => {
                  const isSelected = categoryId === cat.id;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.id}
                      id={`cat-radio-${cat.id}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setCategoryId(cat.id)}
                      onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                      className={`
                        p-4 rounded-3xl border-2 text-left flex flex-col justify-between min-h-[110px]
                        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
                        ${isSelected
                          ? 'border-clay bg-clay/5 shadow-md scale-[1.02]'
                          : 'border-line/80 bg-cream/30 hover:border-moss/40 hover:bg-cream/60'}
                      `}
                    >
                      <div className="flex items-center justify-between gap-1 w-full mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-clay text-white' : 'bg-moss/10 text-moss'}`}>
                          <Icon size={16} />
                        </div>
                        <Badge variant={isSelected ? 'clay' : 'bounty'} size="xs">
                          {cat.bountyFormatted}
                        </Badge>
                      </div>

                      <span className={`font-outfit font-semibold text-xs leading-tight ${isSelected ? 'text-clay-dark' : 'text-moss'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Park Details & Area Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="field-parkName"
                  className="block font-outfit font-semibold text-sm text-moss mb-1.5"
                >
                  2. Park / Garden Name <span className="text-clay">*</span>
                </label>
                <input
                  id="field-parkName"
                  type="text"
                  value={parkName}
                  onChange={(e) => setParkName(e.target.value)}
                  onBlur={() => handleBlur('parkName')}
                  placeholder="e.g. Lalbagh Botanical Garden"
                  aria-invalid={!!errors.parkName && touched.parkName}
                  aria-describedby={errors.parkName ? 'err-parkName' : undefined}
                  className={`w-full px-4 py-3.5 rounded-2xl border font-jakarta text-sm text-moss bg-cream/40 focus:outline-none focus:ring-1 focus:ring-moss transition-colors ${
                    errors.parkName && touched.parkName ? 'border-red-500' : 'border-line'
                  }`}
                />
                {errors.parkName && touched.parkName && (
                  <p id="err-parkName" className="text-xs text-red-600 mt-1 font-jakarta">
                    {errors.parkName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-parkLocation"
                  className="block font-outfit font-semibold text-sm text-moss mb-1.5"
                >
                  3. Specific Location / Landmark <span className="text-clay">*</span>
                </label>
                <input
                  id="field-parkLocation"
                  type="text"
                  value={parkLocation}
                  onChange={(e) => setParkLocation(e.target.value)}
                  onBlur={() => handleBlur('parkLocation')}
                  placeholder="e.g. Near West Gate Lotus Pond, Bench #12"
                  aria-invalid={!!errors.parkLocation && touched.parkLocation}
                  aria-describedby={errors.parkLocation ? 'err-parkLocation' : undefined}
                  className={`w-full px-4 py-3.5 rounded-2xl border font-jakarta text-sm text-moss bg-cream/40 focus:outline-none focus:ring-1 focus:ring-moss transition-colors ${
                    errors.parkLocation && touched.parkLocation ? 'border-red-500' : 'border-line'
                  }`}
                />
                {errors.parkLocation && touched.parkLocation && (
                  <p id="err-parkLocation" className="text-xs text-red-600 mt-1 font-jakarta">
                    {errors.parkLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Area Suggestion Chips */}
            <div>
              <span className="text-xs font-outfit text-muted block mb-2">
                Popular Neighbourhood / Area Filter (used by field workers to discover jobs):
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      setAreaTag(area);
                      if (!parkLocation) setParkLocation(area);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-outfit transition-all ${
                      areaTag === area
                        ? 'bg-moss text-cream font-semibold'
                        : 'bg-cream text-moss/80 border border-line hover:border-moss'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Description with Live Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="field-description"
                  className="font-outfit font-semibold text-sm text-moss"
                >
                  4. Description of Problem <span className="text-clay">*</span>
                </label>
                <span className={`text-xs font-mono-cf ${description.length < 20 || description.length > 500 ? 'text-amber-700 font-semibold' : 'text-muted'}`}>
                  {description.length} / 500 chars (min. 20)
                </span>
              </div>
              <textarea
                id="field-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Explain the maintenance issue clearly so the field technician can bring appropriate tools (e.g., wooden slats broken, sharp exposed nails, bench wobbly)..."
                aria-invalid={!!errors.description && touched.description}
                aria-describedby={errors.description ? 'err-description' : undefined}
                className={`w-full p-4 rounded-2xl border font-jakarta text-sm text-moss bg-cream/40 focus:outline-none focus:ring-1 focus:ring-moss transition-colors resize-y ${
                  errors.description && touched.description ? 'border-red-500' : 'border-line'
                }`}
              />
              {errors.description && touched.description && (
                <p id="err-description" className="text-xs text-red-600 mt-1 font-jakarta">
                  {errors.description}
                </p>
              )}
            </div>

            {/* 4. Photo Upload with 320px Canvas Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-outfit font-semibold text-sm text-moss flex items-center gap-2">
                  <Camera size={16} />
                  <span>5. Upload "Before" Evidence Photographs (Max 3)</span>
                </label>
                <span className="text-xs font-mono-cf text-muted">
                  Auto-compressed to 320px JPEG
                </span>
              </div>

              {/* Upload Input & Thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                {photos.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden border border-line bg-cream group"
                  >
                    <img
                      src={p.thumb}
                      alt={`Issue evidence preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      aria-label={`Remove photo ${idx + 1}`}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-charcoal/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={13} />
                    </button>
                    <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono-cf bg-black/60 text-white">
                      PHOTO #{idx + 1}
                    </span>
                  </div>
                ))}

                {photos.length < 3 && (
                  <label className="w-full aspect-video rounded-2xl border-2 border-dashed border-line hover:border-moss hover:bg-cream/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors p-3 text-center">
                    <Camera size={20} className="text-muted" />
                    <span className="font-outfit text-xs font-semibold text-moss">
                      Add Evidence Photo
                    </span>
                    <span className="text-[10px] text-muted">JPG, PNG, WebP up to 5MB</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              {errors.photos && (
                <p className="text-xs text-red-600 mt-2 font-jakarta">{errors.photos}</p>
              )}
            </div>

            {/* 5. Interactive SVG Sketch-Map Pin Dropper */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-outfit font-semibold text-sm text-moss flex items-center gap-2">
                  <MapPin size={16} />
                  <span>6. Interactive Sketch-Map Pin (Tap on map to mark location)</span>
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={geoLocating}
                  className="inline-flex items-center gap-1.5 text-xs font-outfit text-clay-dark hover:underline"
                >
                  <Navigation size={12} className={geoLocating ? 'animate-spin' : ''} />
                  <span>{geoLocating ? 'Locating...' : 'Use My GPS Location'}</span>
                </button>
              </div>

              {/* Sketch Canvas */}
              <div
                ref={sketchPadRef}
                onClick={handleMapClick}
                className="relative w-full h-52 sm:h-64 rounded-3xl bg-[#1A2821] border border-line overflow-hidden cursor-crosshair select-none"
                aria-label="Park sketch map. Click to place a pin marking problem location."
              >
                {/* Stylized park map background SVG */}
                <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-40">
                  <defs>
                    <pattern id="parkGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <rect width="30" height="30" fill="none" stroke="#A9C5A9" strokeWidth="0.5" opacity="0.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#parkGrid)" />
                  {/* Organic pathways */}
                  <path d="M 0 80 Q 150 120 300 80 T 600 120" stroke="#A9C5A9" strokeWidth="12" fill="none" opacity="0.3" />
                  <path d="M 200 0 Q 220 150 350 250" stroke="#A9C5A9" strokeWidth="8" fill="none" opacity="0.25" />
                  {/* Pond */}
                  <ellipse cx="450" cy="160" rx="60" ry="35" fill="#4E7C7A" opacity="0.4" />
                </svg>

                {/* Placed Pin */}
                {pin && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-full z-20 pointer-events-none transition-all duration-300"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-0.5 rounded bg-clay text-[10px] font-mono-cf text-white shadow font-bold whitespace-nowrap mb-1">
                        PIN ({pin.x}%, {pin.y}%)
                      </span>
                      <MapPin size={24} className="text-clay drop-shadow-md animate-bounce" />
                    </div>
                  </div>
                )}

                {/* Helper overlay */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-mono-cf text-cream/90 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
                  <span>{geoNotice || 'Click anywhere to drop problem pin'}</span>
                </div>
              </div>
            </div>

            {/* Error Summary */}
            {errors.form && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-jakarta flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-muted font-jakarta">
                <span className="block font-semibold text-moss">Bounty to be opened: {selectedCat.bountyFormatted}</span>
                <span>Saved locally in demo mode. No municipal transmission.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Registering Issue...' : 'Submit Complaint & Open Bounty'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default ReportSection;
