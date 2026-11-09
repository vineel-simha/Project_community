/**
 * src/data/demoUsers.js
 * Pre-configured demo credentials for CivicFix.
 * These are purely client-side demo accounts — no real authentication occurs.
 */

/** @type {import('../services/auth/index.js').UserProfile} */
export const DEMO_CITIZEN = {
  id:       'demo-citizen-001',
  role:     'citizen',
  name:     'Vineel S.',
  fullName: 'Vineel S. (Citizen Reporter)',
  email:    'citizen@civicfix.demo',
  password: 'civic123',
  area:     'Rajarajeshwari Nagar / South Bengaluru',
  isDemo:   true,
  avatarInitials: 'VS',
};

/** @type {import('../services/auth/index.js').UserProfile} */
export const DEMO_WORKER = {
  id:            'demo-worker-001',
  role:          'worker',
  name:          'Arjun K.',
  fullName:      'Arjun K. (Verified Park Technician)',
  email:         'worker@civicfix.demo',
  password:      'worker123',
  area:          'Bengaluru Green Zones (Within 3 km)',
  serviceRadius: '3 km',
  walletBalance: 1200,
  completedJobs: 7,
  isDemo:        true,
  avatarInitials: 'AK',
};

/** Combined lookup by email for the auth service. */
export const DEMO_USERS_BY_EMAIL = {
  [DEMO_CITIZEN.email]: DEMO_CITIZEN,
  [DEMO_WORKER.email]:  DEMO_WORKER,
};

export default { DEMO_CITIZEN, DEMO_WORKER, DEMO_USERS_BY_EMAIL };
