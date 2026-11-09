/**
 * src/lib/hooks.js
 * Reusable React hooks for GSAP, IntersectionObserver, reduced-motion
 * and responsive breakpoint detection.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from './gsap.js';

// ─── useReducedMotion ────────────────────────────────────────────────────────
/**
 * Returns true when the user has requested reduced motion.
 * Updates reactively if the system preference changes.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// ─── useMediaQuery ───────────────────────────────────────────────────────────
/**
 * Returns true when the given media query matches.
 * @param {string} query - e.g. '(max-width: 767px)'
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ─── useIsMobile ─────────────────────────────────────────────────────────────
/** Returns true for viewport widths below 768px. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

// ─── useGSAPContext ──────────────────────────────────────────────────────────
/**
 * Creates a GSAP context scoped to `containerRef` and cleans it up on unmount.
 * Usage:
 *   const containerRef = useRef();
 *   useGSAPContext(containerRef, (ctx) => { gsap.from(...) });
 *
 * @param {React.RefObject} containerRef
 * @param {(ctx: gsap.Context) => void} animationFn - called with the context
 * @param {Array} deps - additional dependencies (default: [])
 */
export function useGSAPContext(containerRef, animationFn, deps = []) {
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => animationFn(ctx), containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── useInView ───────────────────────────────────────────────────────────────
/**
 * Returns [ref, isInView] using IntersectionObserver.
 * Useful for pausing/resuming animations when off-screen.
 *
 * @param {IntersectionObserverInit} options
 */
export function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isInView];
}

// ─── useScrollProgress ───────────────────────────────────────────────────────
/**
 * Returns a ref and a reactive scroll progress value [0..1]
 * for the element, using ScrollTrigger.
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => st.kill();
  }, []);

  return [ref, progress];
}

// ─── useStaggerEntrance ──────────────────────────────────────────────────────
/**
 * Animates children of `containerRef` with a staggered fade-up entrance
 * when the container enters the viewport.
 *
 * @param {React.RefObject} containerRef
 * @param {string} selector - CSS selector for children to animate
 * @param {object} opts - { stagger, duration, y, delay }
 */
export function useStaggerEntrance(containerRef, selector = '*', opts = {}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) return; // skip animation; elements are already visible

    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: opts.y ?? 40,
        opacity: 0,
        duration: opts.duration ?? 0.75,
        stagger: opts.stagger ?? 0.1,
        delay: opts.delay ?? 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
}

export { gsap, ScrollTrigger };
