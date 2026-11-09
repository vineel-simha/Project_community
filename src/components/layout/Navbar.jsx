/**
 * src/components/layout/Navbar.jsx
 * Floating pill navbar with real client-side route navigation:
 * - Direct routing via react-router-dom: /, /how-it-works, /report, /worker-jobs, /track-verify, /about, /login
 * - Transparent-to-cream morph over the Hero on homepage; solid cream blur on other pages
 * - Role status pill (Citizen/Worker name, wallet balance) leading to /login
 * - Primary clay CTA navigating to /report
 * - Fully accessible mobile drawer with keyboard trap, Escape key, and auto-close
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, MapPin, Wrench, LogIn, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import BRAND from '../../config/brand.js';

const NAV_LINKS = [
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Report',       path: '/report'       },
  { label: 'Worker Jobs',  path: '/worker-jobs'  },
  { label: 'Track & Verify', path: '/track-verify' },
  { label: 'About',        path: '/about'        },
];

export function Navbar({ user, onAuthSuccess, onLogout, onOpenAuthModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isHomepage = location.pathname === '/';

  // ── Scroll detection for homepage hero morph ─────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Mobile menu focus trap ────────────────────────────────────────────────
  const trapFocus = useCallback((e) => {
    if (!mobileMenuRef.current) return;
    if (e.key === 'Escape') { closeMobile(); return; }
    if (e.key !== 'Tab') return;

    const focusable = mobileMenuRef.current.querySelectorAll(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener('keydown', trapFocus);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        mobileMenuRef.current?.querySelector('a,button')?.focus();
      });
    } else {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, trapFocus]);

  function closeMobile() {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }

  function handleNavigate(path) {
    closeMobile();
    navigate(path);
  }

  // Determine navbar surface based on route and scroll
  const isLightPill = !isHomepage || scrolled;

  const userLabel = user
    ? user.role === 'worker'
      ? `${user.name} · ₹${user.walletBalance ?? 0}`
      : user.name
    : null;

  return (
    <>
      {/* ── Fixed Navbar ── */}
      <header
        ref={navRef}
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-[100]
          w-[calc(100%-2rem)] max-w-5xl
          transition-all duration-400 ease-out
          ${isLightPill
            ? 'bg-cream/95 backdrop-blur-xl border border-line shadow-card text-moss'
            : 'bg-black/20 backdrop-blur-md border border-white/15 text-cream'}
          rounded-full px-3 py-2
        `}
        role="banner"
      >
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between gap-2"
        >
          {/* Logo -> / */}
          <button
            onClick={() => handleNavigate('/')}
            aria-label="CivicFix — return to homepage"
            className={`
              flex items-center gap-2 flex-shrink-0 rounded-full px-3 py-1.5
              transition-colors hover:bg-black/5 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1
            `}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isLightPill ? 'bg-moss' : 'bg-white/15'}`}>
              <Leaf size={14} className={isLightPill ? 'text-sage' : 'text-white'} />
            </span>
            <span className={`font-outfit font-extrabold text-sm ${isLightPill ? 'text-moss' : 'text-white'}`}>
              {BRAND.name}
            </span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1 list-none" role="list">
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={`
                      block px-3 py-1.5 rounded-full text-xs font-outfit font-semibold
                      transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
                      ${isActive
                        ? isLightPill
                          ? 'bg-moss text-cream shadow-sm'
                          : 'bg-white text-moss shadow-sm font-bold'
                        : isLightPill
                          ? 'text-muted hover:text-moss hover:bg-moss/5'
                          : 'text-white/80 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* User Session Pill -> /login */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('/login')}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-semibold
                    border transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
                    ${isLightPill
                      ? 'border-line text-moss hover:bg-cream'
                      : 'border-white/20 text-white/90 hover:bg-white/10'}
                  `}
                  aria-label={`Logged in as ${user.name}. Click to view account.`}
                >
                  <span className="w-5 h-5 rounded-full bg-moss/80 flex items-center justify-center text-cream text-[10px] font-bold flex-shrink-0">
                    {user.avatarInitials}
                  </span>
                  {user.role === 'worker'
                    ? <Wrench size={11} className="opacity-60" />
                    : <MapPin  size={11} className="opacity-60" />}
                  <span className="max-w-[120px] truncate">{userLabel}</span>
                  <ChevronDown size={11} className="opacity-50" />
                </button>

                <button
                  onClick={onLogout}
                  className={`
                    text-xs font-outfit px-2 py-1 rounded-full transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
                    ${isLightPill ? 'text-muted hover:text-moss' : 'text-white/50 hover:text-white'}
                  `}
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-outfit font-semibold
                  border transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
                  ${isLightPill
                    ? 'border-line text-moss hover:bg-cream'
                    : 'border-white/20 text-white/90 hover:bg-white/10'}
                `}
              >
                <LogIn size={12} /> Log In
              </button>
            )}

            {/* Primary Report CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavigate('/report')}
              className="rounded-full text-xs px-4 py-2"
            >
              Report Issue
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className={`
              lg:hidden w-9 h-9 flex items-center justify-center rounded-full
              transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay
              ${isLightPill ? 'hover:bg-moss/10 text-moss' : 'hover:bg-white/10 text-white'}
            `}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] lg:hidden" role="presentation">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Menu Drawer */}
          <nav
            id="mobile-menu"
            ref={mobileMenuRef}
            aria-label="Mobile navigation"
            className="absolute top-20 left-4 right-4 bg-surface rounded-4xl shadow-card-lg p-6 space-y-1 z-10"
          >
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => handleNavigate(path)}
                  className={`
                    w-full text-left px-4 py-3 rounded-2xl text-sm font-outfit font-semibold
                    transition-colors flex items-center justify-between
                    ${isActive
                      ? 'bg-moss text-cream'
                      : 'text-muted hover:text-moss hover:bg-cream'}
                  `}
                >
                  <span>{label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-clay" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-line space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cream/50 rounded-2xl">
                    <span className="w-8 h-8 rounded-full bg-moss flex items-center justify-center text-cream text-xs font-bold font-outfit flex-shrink-0">
                      {user.avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-outfit font-semibold text-moss truncate">{user.name}</p>
                      <p className="text-xs text-muted font-jakarta truncate">
                        {user.role === 'worker' ? `Worker · ₹${user.walletBalance ?? 0}` : 'Citizen Reporter'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { onLogout(); closeMobile(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-outfit font-medium text-muted hover:text-moss hover:bg-cream transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigate('/login')}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-outfit font-medium text-muted hover:text-moss hover:bg-cream transition-colors flex items-center gap-2"
                >
                  <LogIn size={15} /> Log In to Account
                </button>
              )}

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => handleNavigate('/report')}
              >
                Report an Issue
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
