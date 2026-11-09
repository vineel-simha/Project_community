/**
 * src/data/demoComplaints.js
 * Sample preloaded complaints for evaluation and demo walkthroughs.
 * Every record is clearly marked with isDemo: true.
 * Uses lightweight inline SVG data-URLs for Before and After thumbnails so no external requests fail.
 */

// Helper to generate a clean, self-contained SVG thumbnail data URI
function createSvgThumb(title, subtitle, accentColor, bgColor = '#173D2C') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
    <rect width="320" height="240" fill="${bgColor}"/>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2E4036" stroke-width="0.75" opacity="0.3"/>
    </pattern>
    <rect width="320" height="240" fill="url(#grid)"/>
    <circle cx="160" cy="100" r="48" fill="${accentColor}" opacity="0.15"/>
    <rect x="136" y="76" width="48" height="48" rx="12" fill="${accentColor}" opacity="0.3"/>
    <path d="M150 90 L170 110 M170 90 L150 110" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
    <text x="160" y="160" font-family="sans-serif" font-weight="bold" font-size="14" fill="#F2F0E9" text-anchor="middle">${title}</text>
    <text x="160" y="180" font-family="monospace" font-size="11" fill="#A9C5A9" text-anchor="middle">${subtitle}</text>
    <rect x="12" y="12" width="76" height="22" rx="6" fill="#CC5833" opacity="0.9"/>
    <text x="50" y="27" font-family="sans-serif" font-weight="bold" font-size="10" fill="#FFFFFF" text-anchor="middle">SAMPLE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_DEMO_COMPLAINTS = [
  {
    id: 'DEMO-1001',
    parkName: 'Lalbagh Botanical Garden',
    parkLocation: 'West Gate Promenade, Near Lotus Pond',
    areaTag: 'South Bengaluru',
    categoryId: 'benches',
    description: 'Two teak wood slats split in half along the main senior walking trail. Cast-iron bracket is rusted and poses a snag hazard.',
    bountyAmount: 450,
    reporter: {
      id: 'demo-citizen-001',
      name: 'Vineel S.',
      email: 'citizen@civicfix.demo',
    },
    photos: [
      {
        name: 'bench_broken_slats.jpg',
        size: 245000,
        thumb: createSvgThumb('BEFORE: Damaged Bench', 'Lalbagh West Gate', '#CC5833', '#1A241F'),
      },
    ],
    pin: { x: 34, y: 68, label: 'Lalbagh West Gate Grove' },
    status: 'Submitted',
    assignedWorker: null,
    workerProof: null,
    verification: null,
    statusHistory: [
      {
        status: 'Submitted',
        at: '2026-11-08T09:30:00.000Z',
        note: 'Complaint registered by citizen with ₹450 community bounty.',
      },
    ],
    createdAt: '2026-11-08T09:30:00.000Z',
    isDemo: true,
  },
  {
    id: 'DEMO-1002',
    parkName: 'Cubbon Park Arboretum',
    parkLocation: 'Bamboo Grove Pathway, Pole #14',
    areaTag: 'Central Bengaluru',
    categoryId: 'lighting',
    description: 'Solar LED perimeter lantern fixture failed. Night walking trail is pitch black between King Edward statue and tennis club.',
    bountyAmount: 600,
    reporter: {
      id: 'demo-citizen-001',
      name: 'Vineel S.',
      email: 'citizen@civicfix.demo',
    },
    photos: [
      {
        name: 'lamp_outage_before.jpg',
        size: 310000,
        thumb: createSvgThumb('BEFORE: Lamp Outage', 'Cubbon Bamboo Grove', '#CC5833', '#1E2522'),
      },
    ],
    pin: { x: 62, y: 44, label: 'Cubbon Bamboo Trail Pole #14' },
    status: 'Pending Approval',
    assignedWorker: {
      id: 'demo-worker-001',
      name: 'Arjun K.',
      email: 'worker@civicfix.demo',
      acceptedAt: '2026-11-08T11:15:00.000Z',
    },
    workerProof: {
      photos: [
        {
          name: 'lamp_repaired_after.jpg',
          size: 290000,
          thumb: createSvgThumb('AFTER: Repaired & Lit', 'Cubbon Pole #14 Fixed', '#4E9B6E', '#173D2C'),
        },
      ],
      notes: 'Replaced dead 12V lithium cell, cleaned solar glass panel, and secured fixture weather seal. Tested lumens to standard.',
      submittedAt: '2026-11-08T14:40:00.000Z',
    },
    verification: null,
    statusHistory: [
      {
        status: 'Submitted',
        at: '2026-11-08T10:00:00.000Z',
        note: 'Complaint registered by citizen with ₹600 bounty.',
      },
      {
        status: 'Assigned',
        at: '2026-11-08T11:15:00.000Z',
        note: 'Accepted by verified technician Arjun K.',
      },
      {
        status: 'In Progress',
        at: '2026-11-08T12:00:00.000Z',
        note: 'Worker arrived on-site with replacement 12V cell.',
      },
      {
        status: 'Pending Approval',
        at: '2026-11-08T14:40:00.000Z',
        note: 'Repair completed. Photographic proof submitted for citizen review.',
      },
    ],
    createdAt: '2026-11-08T10:00:00.000Z',
    isDemo: true,
  },
  {
    id: 'DEMO-1003',
    parkName: 'Jaya Prakash Narayana Park',
    parkLocation: 'Musical Fountain Plaza, Pump Vault B',
    areaTag: 'Indiranagar / East',
    categoryId: 'fountain',
    description: 'Submersible aerator intake choked with tree leaves and plastic cups, causing nozzle sputter.',
    bountyAmount: 500,
    reporter: {
      id: 'demo-citizen-002',
      name: 'Ananya R.',
      email: 'ananya@civicfix.demo',
    },
    photos: [
      {
        name: 'fountain_clog_before.jpg',
        size: 275000,
        thumb: createSvgThumb('BEFORE: Clogged Nozzle', 'JPN Park Basin', '#CC5833', '#192823'),
      },
    ],
    pin: { x: 75, y: 65, label: 'JPN Park Fountain Plaza' },
    status: 'Resolved',
    assignedWorker: {
      id: 'demo-worker-001',
      name: 'Arjun K.',
      email: 'worker@civicfix.demo',
      acceptedAt: '2026-11-07T08:00:00.000Z',
    },
    workerProof: {
      photos: [
        {
          name: 'fountain_clear_after.jpg',
          size: 280000,
          thumb: createSvgThumb('AFTER: Aerator Cleared', 'JPN Fountain Restored', '#388E3C', '#12261E'),
        },
      ],
      notes: 'Debris screen cleared and impeller purged. Water pressure normalized at 2.4 bar.',
      submittedAt: '2026-11-07T11:30:00.000Z',
    },
    verification: {
      verifiedByReporter: true,
      verifiedAt: '2026-11-07T12:15:00.000Z',
      payoutReleased: true,
    },
    statusHistory: [
      { status: 'Submitted', at: '2026-11-07T07:30:00.000Z', note: 'Issue reported.' },
      { status: 'Assigned', at: '2026-11-07T08:00:00.000Z', note: 'Assigned to Arjun K.' },
      { status: 'In Progress', at: '2026-11-07T09:00:00.000Z', note: 'On-site maintenance started.' },
      { status: 'Pending Approval', at: '2026-11-07T11:30:00.000Z', note: 'Proof uploaded.' },
      { status: 'Resolved', at: '2026-11-07T12:15:00.000Z', note: 'Approved by reporter. ₹500 bounty paid to technician.' },
    ],
    createdAt: '2026-11-07T07:30:00.000Z',
    isDemo: true,
  },
];

export default INITIAL_DEMO_COMPLAINTS;
