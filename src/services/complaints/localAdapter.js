/**
 * src/services/complaints/localAdapter.js
 * LocalStorage adapter for client-side demo mode.
 * Storage key: civicfix:complaints:v1
 * Features:
 * - Generates CF-<YEAR>-<6 CHARS> unique IDs (excluding ambiguous chars)
 * - Canvas-based 320px JPEG compression for uploads
 * - Full 5-stage lifecycle state transitions
 * - Demo overrides & reset mechanisms
 */
import { INITIAL_DEMO_COMPLAINTS } from '../../data/demoComplaints.js';
import { creditWorkerWallet } from '../auth/index.js';

const STORAGE_KEY = 'civicfix:complaints:v1';

// Unambiguous character set for IDs
const ID_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateComplaintId() {
  const year = new Date().getFullYear();
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return `CF-${year}-${code}`;
}

/**
 * Resizes an image file to a maximum of 320px bounding box
 * and compresses it to a JPEG data URL.
 * @param {File} file
 * @returns {Promise<{ name: string, size: number, thumb: string }>}
 */
export async function compressImageToThumbnail(file) {
  return new Promise((resolve) => {
    // If not an image, resolve fallback
    if (!file.type.startsWith('image/')) {
      resolve({ name: file.name, size: file.size, thumb: '' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const thumb = canvas.toDataURL('image/jpeg', 0.72);
          resolve({
            name: file.name,
            size: file.size,
            thumb,
          });
        } else {
          resolve({ name: file.name, size: file.size, thumb: e.target.result });
        }
      };
      img.onerror = () => {
        resolve({ name: file.name, size: file.size, thumb: e.target.result });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve({ name: file.name, size: file.size, thumb: '' });
    };
    reader.readAsDataURL(file);
  });
}

function readAllComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo complaints on first run
      saveAllComplaints(INITIAL_DEMO_COMPLAINTS);
      return INITIAL_DEMO_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_COMPLAINTS;
  } catch (err) {
    console.warn('[CivicFix Complaints] Read storage error, falling back to initial demo complaints:', err);
    return INITIAL_DEMO_COMPLAINTS;
  }
}

function saveAllComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.warn('[CivicFix Complaints] Storage write error (possibly quota exceeded). Truncating thumbnails:', err);
    // If quota exceeded, strip thumbnails and retry
    try {
      const light = complaints.map(c => ({
        ...c,
        photos: c.photos?.map(p => ({ ...p, thumb: '' })) || [],
        workerProof: c.workerProof ? {
          ...c.workerProof,
          photos: c.workerProof.photos?.map(p => ({ ...p, thumb: '' })) || [],
        } : null,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(light));
    } catch (retryErr) {
      console.error('[CivicFix Complaints] Critical storage error:', retryErr);
    }
  }
}

// ─── Service Methods ─────────────────────────────────────────────────────────

export function listLocalComplaints() {
  return readAllComplaints();
}

export function getComplaintById(id) {
  if (!id) return null;
  const normalized = id.trim().toUpperCase();
  const all = readAllComplaints();
  return all.find(c => c.id.toUpperCase() === normalized) || null;
}

export function createComplaint(complaintData) {
  const id = generateComplaintId();
  const now = new Date().toISOString();

  const newRecord = {
    id,
    parkName: complaintData.parkName.trim(),
    parkLocation: complaintData.parkLocation.trim(),
    areaTag: complaintData.areaTag || 'Bengaluru',
    categoryId: complaintData.categoryId,
    description: complaintData.description.trim(),
    bountyAmount: complaintData.bountyAmount || 450,
    reporter: complaintData.reporter || {
      id: 'demo-citizen-001',
      name: 'Vineel S.',
      email: 'citizen@civicfix.demo',
    },
    photos: complaintData.photos || [],
    pin: complaintData.pin || null,
    status: 'Submitted',
    assignedWorker: null,
    workerProof: null,
    verification: null,
    statusHistory: [
      {
        status: 'Submitted',
        at: now,
        note: `Complaint registered. Bounty of ₹${complaintData.bountyAmount || 450} opened for nearby technicians.`,
      },
    ],
    createdAt: now,
    isDemo: true,
  };

  const all = readAllComplaints();
  all.unshift(newRecord);
  saveAllComplaints(all);
  return newRecord;
}

export function listOpenJobsForWorkers(areaFilter = 'All Areas') {
  const all = readAllComplaints();
  return all.filter(c => {
    if (c.status !== 'Submitted') return false;
    if (areaFilter && areaFilter !== 'All Areas') {
      return c.areaTag.toLowerCase().includes(areaFilter.toLowerCase());
    }
    return true;
  });
}

export function acceptComplaintJob(complaintId, workerUser) {
  // Security Gate: Only registered field technicians can accept jobs
  if (!workerUser || workerUser.role !== 'worker') {
    throw new Error('Unauthorized: Only verified field technicians can accept maintenance jobs.');
  }

  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  if (complaint.status !== 'Submitted') {
    throw new Error(`Job cannot be accepted from status: ${complaint.status}`);
  }

  const now = new Date().toISOString();
  complaint.status = 'Assigned';
  complaint.assignedWorker = {
    id: workerUser.id || 'demo-worker-001',
    name: workerUser.name || 'Arjun K.',
    email: workerUser.email || 'worker@civicfix.demo',
    acceptedAt: now,
  };
  complaint.statusHistory.push({
    status: 'Assigned',
    at: now,
    note: `Job accepted by technician ${complaint.assignedWorker.name}.`,
  });

  saveAllComplaints(all);
  return complaint;
}

export function startWorkerJob(complaintId, workerUser) {
  // Security Gate: Only registered field technicians can start work
  if (!workerUser || workerUser.role !== 'worker') {
    throw new Error('Unauthorized: Only verified field technicians can start maintenance jobs.');
  }

  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  if (complaint.status !== 'Assigned') {
    throw new Error(`Job cannot be started from status: ${complaint.status}`);
  }

  // Verify that the worker starting work is the assigned worker
  if (
    complaint.assignedWorker &&
    workerUser.id &&
    complaint.assignedWorker.id !== workerUser.id &&
    complaint.assignedWorker.email !== workerUser.email
  ) {
    throw new Error(`Unauthorized: This job is assigned to ${complaint.assignedWorker.name}.`);
  }

  const now = new Date().toISOString();
  complaint.status = 'In Progress';
  complaint.statusHistory.push({
    status: 'In Progress',
    at: now,
    note: `Technician arrived on-site. Field restoration underway.`,
  });

  saveAllComplaints(all);
  return complaint;
}

export function submitWorkerProof(complaintId, workerUser, proofData) {
  // Security Gate: Only registered field technicians can submit resolution proof
  if (!workerUser || workerUser.role !== 'worker') {
    throw new Error('Unauthorized: Only verified field technicians can submit resolution proof.');
  }

  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  if (complaint.status !== 'In Progress' && complaint.status !== 'Assigned') {
    throw new Error(`Proof cannot be submitted from status: ${complaint.status}`);
  }

  // Verify that the worker uploading proof is the assigned worker
  if (
    complaint.assignedWorker &&
    workerUser.id &&
    complaint.assignedWorker.id !== workerUser.id &&
    complaint.assignedWorker.email !== workerUser.email
  ) {
    throw new Error(`Unauthorized: Only the assigned technician (${complaint.assignedWorker.name}) can submit proof.`);
  }

  const now = new Date().toISOString();
  complaint.status = 'Pending Approval';
  complaint.workerProof = {
    photos: proofData.photos || [],
    notes: proofData.notes || 'Repair completed.',
    submittedAt: now,
  };
  complaint.statusHistory.push({
    status: 'Pending Approval',
    at: now,
    note: `Technician submitted photographic completion proof. Awaiting citizen verification.`,
  });

  saveAllComplaints(all);
  return complaint;
}

export function approveWorkerResolution(complaintId, citizenUser) {
  // Security Gate: Workers cannot self-approve their own repair jobs or authorize payouts to themselves
  if (citizenUser && citizenUser.role === 'worker') {
    throw new Error('Unauthorized: Field technicians cannot self-approve repairs or authorize payouts. A Citizen must verify the fix.');
  }

  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  if (complaint.status !== 'Pending Approval') {
    throw new Error(`Cannot approve fix from status: ${complaint.status}`);
  }

  // Prevent assigned worker from self-approving even if using custom ID
  if (
    citizenUser &&
    complaint.assignedWorker &&
    (citizenUser.id === complaint.assignedWorker.id || citizenUser.email === complaint.assignedWorker.email)
  ) {
    throw new Error('Unauthorized: You cannot approve your own repair assignment.');
  }

  const now = new Date().toISOString();
  complaint.status = 'Resolved';
  complaint.verification = {
    verifiedByReporter: true,
    verifiedAt: now,
    rejectionReason: null,
    payoutReleased: true,
  };
  complaint.statusHistory.push({
    status: 'Resolved',
    at: now,
    note: `Citizen inspected proof and approved fix. ₹${complaint.bountyAmount} demo payout released to ${complaint.assignedWorker?.name || 'technician'}.`,
  });

  // Credit demo worker wallet
  creditWorkerWallet(complaint.bountyAmount);

  saveAllComplaints(all);
  return complaint;
}

export function requestWorkerRework(complaintId, citizenUser, rejectionReason) {
  // Security Gate: Workers cannot request rework on their own tasks
  if (citizenUser && citizenUser.role === 'worker') {
    throw new Error('Unauthorized: Only citizen reporters can evaluate resolution quality and request rework.');
  }

  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  if (complaint.status !== 'Pending Approval') {
    throw new Error(`Cannot request rework from status: ${complaint.status}`);
  }

  const now = new Date().toISOString();
  complaint.status = 'In Progress';
  complaint.verification = {
    verifiedByReporter: false,
    verifiedAt: now,
    rejectionReason: rejectionReason || 'Rework requested.',
    payoutReleased: false,
  };
  complaint.statusHistory.push({
    status: 'In Progress',
    at: now,
    note: `Citizen requested rework: "${rejectionReason || 'Please review resolution quality.'}". Job returned to in-progress.`,
  });

  saveAllComplaints(all);
  return complaint;
}

export function advanceDemoStatus(complaintId) {
  const all = readAllComplaints();
  const idx = all.findIndex(c => c.id === complaintId);
  if (idx === -1) throw new Error('Complaint not found');

  const complaint = all[idx];
  const STAGES = ['Submitted', 'Assigned', 'In Progress', 'Pending Approval', 'Resolved'];
  const curIdx = STAGES.indexOf(complaint.status);
  const nextStatus = STAGES[(curIdx + 1) % STAGES.length];
  const now = new Date().toISOString();

  complaint.status = nextStatus;

  if (nextStatus === 'Assigned' && !complaint.assignedWorker) {
    complaint.assignedWorker = {
      id: 'demo-worker-001',
      name: 'Arjun K.',
      email: 'worker@civicfix.demo',
      acceptedAt: now,
    };
  } else if (nextStatus === 'Pending Approval' && !complaint.workerProof) {
    complaint.workerProof = {
      photos: complaint.photos || [],
      notes: 'Quick demo resolution proof uploaded.',
      submittedAt: now,
    };
  } else if (nextStatus === 'Resolved') {
    complaint.verification = {
      verifiedByReporter: true,
      verifiedAt: now,
      rejectionReason: null,
      payoutReleased: true,
    };
    creditWorkerWallet(complaint.bountyAmount);
  }

  complaint.statusHistory.push({
    status: nextStatus,
    at: now,
    note: `[Demo Control] Manually advanced status to ${nextStatus}.`,
  });

  saveAllComplaints(all);
  return complaint;
}

export function resetDemoData() {
  saveAllComplaints(INITIAL_DEMO_COMPLAINTS);
  return INITIAL_DEMO_COMPLAINTS;
}
