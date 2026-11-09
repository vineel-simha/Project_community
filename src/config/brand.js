/**
 * CivicFix Brand Configuration
 * Single source of truth for all brand copy and configuration.
 * Import this file throughout the application instead of hardcoding strings.
 */

export const BRAND = {
  name: 'CivicFix',
  tagline: 'Better parks begin with a report.',
  description:
    'Empowering citizens to report public park and garden maintenance problems, and enabling nearby gig workers to discover, accept and resolve those issues with photographic verification.',

  cta: {
    primary:   'Report an Issue',
    secondary: 'Track a Complaint',
    worker:    'Find Nearby Jobs',
  },

  hero: {
    eyebrow:   'BUILDING GREENER COMMUNITIES',
    headline1: 'Better parks begin with a',
    headline2: 'report.',
    supporting:
      'Notice something broken, damaged or neglected in your local park? Report it, let a nearby community worker fix it, verify the photo proof and help make your neighbourhood greener.',
    supportingSmall: 'Your observation can make a difference.',
    workerCta: 'Looking for local maintenance work? Browse nearby jobs →',
  },

  manifesto: {
    statement1: 'Most civic tools focus on: bureaucratic delays and opaque processes.',
    statement2: 'We focus on: immediate ecological action.',
  },

  /**
   * Returns contact email from env variable or honest fallback.
   * @returns {string}
   */
  contactEmail: () => {
    const email = import.meta.env?.VITE_CONTACT_EMAIL;
    if (email && email.trim().length > 0) return email.trim();
    return null; // Caller should display the fallback text
  },

  contactFallback:
    'Contact details will be published when the service goes live.',

  demoNotice:
    'Demo mode: Complaints, worker logins, proof photos and bounty payouts are saved in your browser only. Nothing is sent to municipal authorities or payment gateways.',

  copyright: `© ${new Date().getFullYear()} CivicFix. Community-driven civic technology.`,
};

export default BRAND;
