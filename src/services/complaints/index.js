/**
 * src/services/complaints/index.js
 * Central Complaint Service Facade.
 * Routes operations to localAdapter (default) or supabaseAdapter based on VITE_DATA_MODE.
 */
import * as localAdapter from './localAdapter.js';
import * as supabaseAdapter from './supabaseAdapter.js';

const isSupabase = import.meta.env?.VITE_DATA_MODE === 'supabase';
const adapter = isSupabase ? supabaseAdapter : localAdapter;

export const createComplaint = adapter.createComplaint;
export const getComplaintById = adapter.getComplaintById;
export const listLocalComplaints = adapter.listLocalComplaints;
export const listOpenJobsForWorkers = adapter.listOpenJobsForWorkers;
export const acceptComplaintJob = adapter.acceptComplaintJob;
export const startWorkerJob = adapter.startWorkerJob;
export const submitWorkerProof = adapter.submitWorkerProof;
export const approveWorkerResolution = adapter.approveWorkerResolution;
export const requestWorkerRework = adapter.requestWorkerRework;
export const advanceDemoStatus = adapter.advanceDemoStatus;
export const resetDemoData = adapter.resetDemoData;
export const compressImageToThumbnail = localAdapter.compressImageToThumbnail;
export const generateComplaintId = localAdapter.generateComplaintId;

export default {
  createComplaint,
  getComplaintById,
  listLocalComplaints,
  listOpenJobsForWorkers,
  acceptComplaintJob,
  startWorkerJob,
  submitWorkerProof,
  approveWorkerResolution,
  requestWorkerRework,
  advanceDemoStatus,
  resetDemoData,
  compressImageToThumbnail,
  generateComplaintId,
};
