/**
 * src/lib/gsap.js
 * Central GSAP + ScrollTrigger registration.
 * Import `gsap` and `ScrollTrigger` from this file — never directly from 'gsap'
 * in components — so the plugin is registered exactly once.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.75,
});

// ScrollTrigger defaults
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

export { gsap, ScrollTrigger };
