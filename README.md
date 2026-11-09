# CivicFix — Cinematic Civic-Tech & Gig-Verification Platform

> *"Better parks begin with a report."*

**CivicFix** is a public park and garden maintenance complaint-tracking and crowdsourced field-resolution website. Built with React 19, Tailwind CSS, GSAP 3, and native HTML5 Canvas, it connects **Citizens (Issue Reporters)** and **Local Gig Technicians (Field Resolvers)** through a 5-stage verified lifecycle.

---

## 🌿 Core Value Propositions

1. **Instant Geo-Reporting**: Pinpoint park maintenance issues with photographic evidence and an interactive SVG sketch-map location pin.
2. **Community Gig Restoration**: Registered local technicians discover nearby complaints, accept jobs, execute on-site repairs, and upload completion proof.
3. **Resolution Telemetry & Proof Verification**: Citizen reporters inspect Side-by-Side Before-and-After photographs to verify repairs before authorizing simulated community bounties into the worker's wallet.

---

## 🔑 Demo Credentials (One-Click or Manual)

CivicFix runs client-side in **DEMO MODE** by default using browser `localStorage` (`civicfix:complaints:v1` and `civicfix:auth:v1`). You can sign in using manual credentials or click the quick-access buttons in the Auth Modal:

| Role | Email / Username | Password | Profile Name | Details |
|---|---|---|---|---|
| **Citizen Reporter** | `citizen@civicfix.demo` | `civic123` | Vineel S. | Rajarajeshwari Nagar / South Bengaluru |
| **Field Technician** | `worker@civicfix.demo` | `worker123` | Arjun K. | Verified Park Technician · ₹1,200 Starting Balance |

*Custom Citizen or Worker accounts can also be registered and are persisted locally in your browser.*

---

## 🔄 The 5-Stage Complaint Lifecycle

```
[1. Submitted] ──> [2. Assigned] ──> [3. In Progress] ──> [4. Pending Approval] ──> [5. Resolved]
  Bounty Opened      Worker Accepts      On-site repair        Proof uploaded          Citizen approves
                                                                                      & bounty credited
```

1. **Submitted**: Citizen submits complaint with park name, category, description, photos, and sketch pin. Local bounty (₹300 – ₹800) is opened.
2. **Assigned**: Logged-in technician accepts the job from the Worker Hub board.
3. **In Progress**: Technician begins on-site maintenance work.
4. **Pending Approval**: Technician submits resolution notes and at least one "After" photograph (auto-compressed to 320px JPEG via HTML5 Canvas).
5. **Resolved**: Original reporter inspects the Before/After comparison and approves the fix, crediting the worker's simulated wallet balance. (If rework is needed, a note sends the job back to *In Progress*).

---

## 🧪 Step-by-Step E2E Verification Walkthrough

You can test the entire two-sided handshake locally in under 2 minutes:

1. **Test Preloaded Verification (`DEMO-1002`)**:
   - Scroll to **Track & Verify** (`#track`) or click the **DEMO-1002** chip.
   - Note the status is **Pending Approval** (Cubbon Park solar lamp outage).
   - Review the **Side-by-Side Before/After Photo Comparison**.
   - Click **"Approve Fix & Release ₹600 Payout"**.
   - Observe the celebratory completion banner and the status updating to **Resolved**.
   - Scroll up to **Worker Jobs** (`#worker-hub`) and log in as Demo Worker to observe the wallet balance increasing!

2. **Test Accepting Open Jobs (`DEMO-1001`)**:
   - Scroll to **Worker Jobs** (`#worker-hub`).
   - Click **"One-Click Login as Demo Worker"** (Arjun K.).
   - Find ticket **DEMO-1001** (Lalbagh Broken Bench, ₹450 Bounty) in the *Open Jobs Near Me* tab.
   - Click **"Accept Job"** — the card moves into *My Active Jobs*.
   - Click **"Start On-Site Maintenance"** — status transitions to *In Progress*.
   - Click **"Upload Proof of Resolution"**, attach a photo and note, then submit.
   - Click **"Switch to Citizen & Verify Fix"** to view and approve your own fix in the tracker!

3. **Report a Brand New Issue**:
   - Scroll to **Report** (`#report`).
   - Choose one of the 8 category tiles (or click a hotspot pin on the interactive 3D Park Island in the Hero).
   - Tap the SVG sketch-map to drop a pin.
   - Upload evidence photos and click **"Submit Complaint & Open Bounty"**.
   - Click **"Switch to Worker View to Accept Job"** to dispatch the new ticket immediately.

---

## 🎨 Visual Identity & Design System: Organic Tech

- **moss** (`#2E4036`): Primary brand color & navigation
- **forest** (`#173D2C`): Deep interactive accents & terminal surfaces
- **clay** (`#CC5833`): Primary action accent & active hotspots
- **clay-dark** (`#A8431F`): Accessible accent text
- **cream** (`#F2F0E9`): Main background
- **surface** (`#FFFFFF`): Cards & form controls
- **sage** (`#A9C5A9`): Botanical accents & secondary cards
- **charcoal** (`#1A1A1A`): Manifesto & Footer backgrounds
- **muted** (`#55615A`): Secondary body text
- **line** (`#DDE2D6`): Structural borders & dividers

### Typography
- **Headings**: Plus Jakarta Sans (Weights 700, 800)
- **Editorial Accent**: Cormorant Garamond (Italic 600)
- **Navigation & Controls**: Outfit (Weights 500, 600)
- **Technical Telemetry**: IBM Plex Mono (Weights 400, 500)
- **Body Copy**: Plus Jakarta Sans (Weights 400, 500)

---

## 🏗️ Technical Stack & Project Architecture

```
src/
├── main.jsx                     # React root mount
├── App.jsx                      # Application composition & shared state
├── index.css                    # CSS tokens, noise overlay & resets
├── config/
│   └── brand.js                 # Brand copy & contact configuration
├── lib/
│   ├── gsap.js                  # Central GSAP + ScrollTrigger registration
│   └── hooks.js                 # useReducedMotion, useIsMobile, useInView
├── data/
│   ├── categories.js            # 8 maintenance categories & bounties
│   ├── demoUsers.js             # Demo Citizen and Worker accounts
│   └── demoComplaints.js        # DEMO-1001, DEMO-1002, DEMO-1003
├── services/
│   ├── auth/                    # Session management & wallet credit
│   └── complaints/
│       ├── index.js             # Facade adapter router
│       ├── localAdapter.js      # LocalStorage CRUD & 320px Canvas JPEG compression
│       └── supabaseAdapter.js   # Production PostgreSQL/Supabase schema stub
└── components/
    ├── ui/                      # Button, Badge, Modal, AuthModal
    ├── layout/                  # Navbar (morphing pill), Footer (charcoal)
    ├── hero/                    # Hero, ParkIsland (3D tilt & hotspots), LeafParticles
    ├── features/                # DiagnosticShuffler, TelemetryTypewriter, CursorScheduler
    └── sections/                # Manifesto, ProtocolArchive, Report, WorkerHub, Track, CtaBanner
```

---

## 🛡️ Honesty & Transparency Commitments

- **Demo Mode Transparency**: Displays explicit notices across forms, telemetry bars, and receipts confirming records are client-side only.
- **Zero Fabricated Claims**: No fake government partnerships, endorsements, testimonials, or fake statistics.
- **Accessible & Tested**: Keyboard focus traps on dialogs, full screen-reader `aria-label` coverage on word-reveal texts, and automatic pause of animations when offscreen or when `prefers-reduced-motion` is enabled.

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Community Open Source Civic-Tech Prototype. Built with care for cleaner, greener neighborhood parks.
