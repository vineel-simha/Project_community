/**
 * src/components/ui/AuthModal.jsx
 * Login / Register modal with:
 * - Citizen and Worker tabs
 * - One-click demo credential auto-fill
 * - Custom demo account registration
 * - Demo-mode transparency notice
 */
import React, { useState } from 'react';
import { LogIn, UserCircle, Wrench, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';
import { login, register, switchToDemoRole } from '../../services/auth/index.js';
import { DEMO_CITIZEN, DEMO_WORKER } from '../../data/demoUsers.js';
import BRAND from '../../config/brand.js';

const TABS = [
  { id: 'login',    label: 'Log In',   icon: LogIn },
  { id: 'register', label: 'Register', icon: UserCircle },
];

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onAuthSuccess: (user: object) => void,
 *   defaultTab?: 'login'|'register',
 *   defaultRole?: 'citizen'|'worker',
 * }} props
 */
export function AuthModal({ isOpen, onClose, onAuthSuccess, defaultTab = 'login', defaultRole = 'citizen' }) {
  const [tab, setTab] = useState(defaultTab);
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEmail(''); setPassword(''); setName(''); setArea('');
    setError(''); setSuccess(''); setShowPw(false);
  }

  function switchTab(t) { setTab(t); resetForm(); }
  function switchRole(r) { setRole(r); resetForm(); }

  function fillDemo(demoRole) {
    const creds = demoRole === 'citizen' ? DEMO_CITIZEN : DEMO_WORKER;
    setRole(demoRole);
    setTab('login');
    setEmail(creds.email);
    setPassword(creds.password);
    setError(''); setSuccess('');
  }

  function handleClose() { resetForm(); onClose(); }

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const result = login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      setSuccess(`Welcome back, ${result.user.name}!`);
      setTimeout(() => { handleClose(); onAuthSuccess(result.user); }, 800);
    } else {
      setError(result.error);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = register({ name, email: email.trim(), password, role, area });
    setLoading(false);
    if (result.success) {
      setSuccess(`Account created! Welcome, ${result.user.name}.`);
      setTimeout(() => { handleClose(); onAuthSuccess(result.user); }, 800);
    } else {
      setError(result.error);
    }
  }

  function handleDemoInstant(demoRole) {
    const user = switchToDemoRole(demoRole);
    handleClose();
    onAuthSuccess(user);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Sign in to CivicFix"
      description="Demo mode — sessions are saved in your browser only."
      size="md"
    >
      {/* Demo-mode notice */}
      <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex gap-2 items-start">
        <AlertCircle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 font-jakarta">
          {BRAND.demoNotice}
        </p>
      </div>

      {/* Quick demo access */}
      <div className="mb-5">
        <p className="text-xs font-outfit font-semibold text-muted uppercase tracking-wider mb-2">
          Quick Demo Access
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleDemoInstant('citizen')}
            className="flex-1 flex items-center gap-2 p-3 rounded-2xl border border-line hover:border-moss hover:bg-cream transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-full bg-sage/40 flex items-center justify-center text-moss text-xs font-bold font-outfit flex-shrink-0">VS</span>
            <div className="min-w-0">
              <p className="text-xs font-outfit font-semibold text-moss truncate">Demo Citizen</p>
              <p className="text-xs text-muted font-mono-cf truncate">{DEMO_CITIZEN.email}</p>
            </div>
          </button>
          <button
            onClick={() => handleDemoInstant('worker')}
            className="flex-1 flex items-center gap-2 p-3 rounded-2xl border border-line hover:border-moss hover:bg-cream transition-colors text-left"
          >
            <span className="w-8 h-8 rounded-full bg-moss/15 flex items-center justify-center text-moss text-xs font-bold font-outfit flex-shrink-0">AK</span>
            <div className="min-w-0">
              <p className="text-xs font-outfit font-semibold text-moss truncate">Demo Worker</p>
              <p className="text-xs text-muted font-mono-cf truncate">{DEMO_WORKER.email}</p>
            </div>
          </button>
        </div>
        <p className="text-xs text-muted mt-2 text-center font-jakarta">
          Click above to instantly enter as a demo account, or sign in manually below.
        </p>
      </div>

      <div className="border-t border-line my-4" />

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-cream rounded-2xl mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            aria-pressed={tab === id}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-outfit font-semibold transition-all ${
              tab === id
                ? 'bg-surface text-moss shadow-sm'
                : 'text-muted hover:text-moss'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Role selector (register only) */}
      {tab === 'register' && (
        <div className="mb-4">
          <p className="text-xs font-outfit font-semibold text-muted uppercase tracking-wider mb-2">I am a…</p>
          <div className="flex gap-2">
            {[
              { r: 'citizen', label: 'Citizen Reporter', Icon: UserCircle },
              { r: 'worker',  label: 'Field Worker',     Icon: Wrench },
            ].map(({ r, label, Icon }) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                aria-pressed={role === r}
                className={`flex-1 flex items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-outfit font-medium ${
                  role === r
                    ? 'border-moss bg-moss/5 text-moss'
                    : 'border-line text-muted hover:border-moss/40'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-2 items-center">
          <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-jakarta">{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex gap-2 items-center">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-jakarta">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={tab === 'login' ? handleLogin : handleRegister} noValidate>
        {tab === 'register' && (
          <div className="mb-3">
            <label htmlFor="auth-name" className="block text-xs font-outfit font-semibold text-moss mb-1">
              Full Name <span aria-hidden="true" className="text-clay">*</span>
            </label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-3 rounded-2xl border border-line bg-cream text-moss font-jakarta text-sm placeholder:text-muted/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-colors"
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="auth-email" className="block text-xs font-outfit font-semibold text-moss mb-1">
            Email <span aria-hidden="true" className="text-clay">*</span>
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-2xl border border-line bg-cream text-moss font-jakarta text-sm placeholder:text-muted/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-colors"
          />
        </div>

        <div className="mb-3 relative">
          <label htmlFor="auth-password" className="block text-xs font-outfit font-semibold text-moss mb-1">
            Password <span aria-hidden="true" className="text-clay">*</span>
          </label>
          <input
            id="auth-password"
            type={showPw ? 'text' : 'password'}
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder={tab === 'login' ? 'Your password' : 'Min. 6 characters'}
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-line bg-cream text-moss font-jakarta text-sm placeholder:text-muted/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-[2.1rem] text-muted hover:text-moss transition-colors p-1"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {tab === 'register' && (
          <div className="mb-3">
            <label htmlFor="auth-area" className="block text-xs font-outfit font-semibold text-moss mb-1">
              Your Area / Neighbourhood
            </label>
            <input
              id="auth-area"
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="e.g. Jayanagar, South Bengaluru"
              className="w-full px-4 py-3 rounded-2xl border border-line bg-cream text-moss font-jakarta text-sm placeholder:text-muted/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss transition-colors"
            />
          </div>
        )}

        {/* Demo fill shortcuts */}
        <div className="flex gap-2 mb-4 mt-1">
          <button
            type="button"
            onClick={() => fillDemo('citizen')}
            className="text-xs text-clay-dark font-outfit font-semibold hover:underline"
          >
            Fill Demo Citizen Credentials
          </button>
          <span className="text-muted text-xs">·</span>
          <button
            type="button"
            onClick={() => fillDemo('worker')}
            className="text-xs text-clay-dark font-outfit font-semibold hover:underline"
          >
            Fill Demo Worker Credentials
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Please wait…' : tab === 'login' ? 'Log In' : 'Create Demo Account'}
        </Button>
      </form>
    </Modal>
  );
}

export default AuthModal;
