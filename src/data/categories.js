/**
 * src/data/categories.js
 * 8 park and garden maintenance complaint categories.
 * Defines standard simulated bounties, icons, and descriptions.
 */
import {
  Trash2, Wrench, Lightbulb, Footprints,
  Trees, ShieldAlert, Droplets, HelpCircle
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'waste',
    label: 'Waste accumulation',
    shortLabel: 'Waste / Litter',
    bounty: 300,
    bountyFormatted: '₹300',
    icon: Trash2,
    description: 'Overflowing bins, scattered litter, or illegal debris dumped in green areas.',
    commonAreas: 'Picnic lawns, main promenades, park perimeters',
  },
  {
    id: 'benches',
    label: 'Damaged park benches',
    shortLabel: 'Park Benches',
    bounty: 450,
    bountyFormatted: '₹450',
    icon: Wrench,
    description: 'Broken wooden slats, loose cast-iron bolts, or unstable seating foundations.',
    commonAreas: 'Gazebos, walking paths, lakeside seating',
  },
  {
    id: 'lighting',
    label: 'Broken street lights',
    shortLabel: 'Pathway Lights',
    bounty: 600,
    bountyFormatted: '₹600',
    icon: Lightbulb,
    description: 'Outage fixtures, exposed wiring, flickering lamps, or damaged solar columns.',
    commonAreas: 'Perimeter trail, central circle, jogging loop',
  },
  {
    id: 'pathways',
    label: 'Damaged walking pathways',
    shortLabel: 'Paving & Walkways',
    bounty: 750,
    bountyFormatted: '₹750',
    icon: Footprints,
    description: 'Displaced interlocking pavers, tripping cracks, or erosion across pedestrian ways.',
    commonAreas: 'Jogging tracks, elder walking lanes, arboretum trails',
  },
  {
    id: 'plants',
    label: 'Overgrown plants & grass',
    shortLabel: 'Overgrown Flora',
    bounty: 350,
    bountyFormatted: '₹350',
    icon: Trees,
    description: 'Obstructing low branches, unkempt thorny thickets, or weeds covering park facilities.',
    commonAreas: 'Botanical sections, fence borders, flower beds',
  },
  {
    id: 'playground',
    label: 'Damaged playground equipment',
    shortLabel: 'Children Play Area',
    bounty: 800,
    bountyFormatted: '₹800',
    icon: ShieldAlert,
    description: 'Broken swing chains, rusted slides, cracked see-saws posing immediate risk to children.',
    commonAreas: 'Kids zone, sandbox surrounds, family lawns',
  },
  {
    id: 'fountain',
    label: 'Water fountain issues',
    shortLabel: 'Fountains & Pumps',
    bounty: 550,
    bountyFormatted: '₹550',
    icon: Droplets,
    description: 'Stagnant fountain basins, clogged filter nozzles, or malfunctioning aerator pumps.',
    commonAreas: 'Central pond, entrance water feature, reflection pools',
  },
  {
    id: 'other',
    label: 'Other maintenance problems',
    shortLabel: 'General Repair',
    bounty: 400,
    bountyFormatted: '₹400',
    icon: HelpCircle,
    description: 'Signage damage, broken water taps, fence gaps, or miscellaneous park repairs.',
    commonAreas: 'Public restrooms, entrance arches, cycle stands',
  },
];

export const CATEGORIES_BY_ID = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

export default CATEGORIES;
