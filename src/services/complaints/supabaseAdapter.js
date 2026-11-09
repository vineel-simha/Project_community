/**
 * src/services/complaints/supabaseAdapter.js
 * Production Supabase integration stub with schema documentation.
 * Activated when import.meta.env.VITE_DATA_MODE === 'supabase'.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EXPECTED POSTGRESQL / SUPABASE SCHEMA:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. TABLE: public.profiles
 *    - id: uuid primary key references auth.users(id) on delete cascade
 *    - role: text not null check (role in ('citizen', 'worker'))
 *    - full_name: text not null
 *    - area: text
 *    - wallet_balance: numeric default 0.00 check (wallet_balance >= 0)
 *    - completed_jobs: integer default 0
 *    - created_at: timestamptz default now()
 *
 * 2. TABLE: public.complaints
 *    - id: text primary key (format: CF-YYYY-XXXXXX)
 *    - park_name: text not null
 *    - park_location: text not null
 *    - area_tag: text not null
 *    - category_id: text not null
 *    - description: text not null
 *    - bounty_amount: numeric not null
 *    - reporter_id: uuid references public.profiles(id)
 *    - photos_json: jsonb default '[]'::jsonb
 *    - pin_json: jsonb
 *    - status: text not null default 'Submitted'
 *        check (status in ('Submitted', 'Assigned', 'In Progress', 'Pending Approval', 'Resolved'))
 *    - assigned_worker_id: uuid references public.profiles(id)
 *    - worker_proof_json: jsonb
 *    - verification_status: jsonb
 *    - status_history: jsonb default '[]'::jsonb
 *    - created_at: timestamptz default now()
 *    - updated_at: timestamptz default now()
 *
 * 3. STORAGE BUCKETS:
 *    - issue-photos: Public read, authenticated citizen upload (max 5MB)
 *    - proof-photos: Public read, authenticated assigned worker upload (max 5MB)
 *
 * 4. ENVIRONMENT VARIABLES:
 *    - VITE_SUPABASE_URL=https://your-project.supabase.co
 *    - VITE_SUPABASE_ANON_KEY=eyJ...
 * ─────────────────────────────────────────────────────────────────────────────
 */

function checkSupabaseConfig() {
  const url = import.meta.env?.VITE_SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '[CivicFix] Supabase integration mode selected (VITE_DATA_MODE=supabase) but VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Please set these in your .env file or switch back to VITE_DATA_MODE=demo.'
    );
  }
  return { url, key };
}

export async function createComplaint() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview. Switch to VITE_DATA_MODE=demo to use browser demo persistence.');
}

export async function getComplaintById() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function listLocalComplaints() {
  checkSupabaseConfig();
  return [];
}

export async function listOpenJobsForWorkers() {
  checkSupabaseConfig();
  return [];
}

export async function acceptComplaintJob() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function startWorkerJob() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function submitWorkerProof() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function approveWorkerResolution() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function requestWorkerRework() {
  checkSupabaseConfig();
  throw new Error('Supabase live integration is currently in production preview.');
}

export async function advanceDemoStatus() {
  checkSupabaseConfig();
  throw new Error('advanceDemoStatus is only available in local demo mode.');
}

export async function resetDemoData() {
  checkSupabaseConfig();
  return [];
}
