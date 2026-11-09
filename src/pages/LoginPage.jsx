/**
 * src/pages/LoginPage.jsx
 * Route: /login
 * Dedicated Authentication Page supporting Citizen and Worker accounts.
 * Provides manual login, custom registration, and one-click demo credentials.
 * Handles return-URL redirects back to intended workflows.
 */
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, register, switchToDemoRole } from '../services/auth/index.js';
import { DEMO_CITIZEN, DEMO_WORKER } from '../data/demoUsers.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import BRAND from '../config/brand.js';
import {
  LogIn, UserCircle, Wrench, Eye, EyeOff, AlertCircle,
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react';

export function LoginPage({ user, onAuthSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('return') || '/';

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('citizen'); // 'citizen' | 'worker'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (demoRole) => {
    const creds = demoRole === 'citizen' ? DEMO_CITIZEN : DEMO_WORKER;
    setRole(demoRole);
    setTab('login');
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  const handleInstantDemo = (demoRole) => {
    const authedUser = switchToDemoRole(demoRole);
    if (onAuthSuccess) onAuthSuccess(authedUser);
    navigate(returnUrl);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      setSuccess(`Welcome back, ${result.user.name}!`);
      if (onAuthSuccess) onAuthSuccess(result.user);
      setTimeout(() => navigate(returnUrl), 600);
    } else {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const result = register({ name, email: email.trim(), password, role, area });
    setLoading(false);

    if (result.success) {
      setSuccess(`Account registered! Welcome to CivicFix, ${result.user.name}.`);
      if (onAuthSuccess) onAuthSuccess(result.user);
      setTimeout(() => navigate(returnUrl), 600);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-center py-12 md:py-20">
      <div className="layout-fluid">
        {/* Back Link */}
        <div className="max-w-md mx-auto mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-outfit text-muted hover:text-moss transition-colors"
          >
            <ArrowLeft size={13} /> Back to Homepage
          </button>
        </div>

        {/* Main Authentication Card */}
        <div className="max-w-md mx-auto p-8 sm:p-10 rounded-4xl bg-surface border border-line shadow-card-lg">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="citizen" size="xs">
                SECURE DEMO AUTH
              </Badge>
              <span className="text-[10px] font-mono-cf text-muted">
                v1.local
              </span>
            </div>
            <h1 className="font-jakarta font-extrabold text-2xl text-moss tracking-tight">
              Sign in to CivicFix
            </h1>
            <p className="text-xs text-muted font-jakarta mt-1">
              Connect as a Citizen Reporter or Verified Field Technician.
            </p>
          </div>

          {/* Quick 1-Click Demo Access */}
          <div className="mb-6 p-4 rounded-3xl bg-cream/70 border border-line/80">
            <span className="text-xs font-outfit font-bold text-moss block mb-2.5">
              Instant One-Click Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemo('citizen')}
                className="p-2.5 rounded-2xl bg-surface border border-line hover:border-moss hover:shadow-sm text-left transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-sage/30 text-moss text-[10px] font-bold flex items-center justify-center">
                    VS
                  </span>
                  <span className="font-outfit font-semibold text-xs text-moss">Citizen</span>
                </div>
                <span className="text-[10px] text-muted block font-mono-cf truncate">
                  Vineel S.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemo('worker')}
                className="p-2.5 rounded-2xl bg-surface border border-line hover:border-moss hover:shadow-sm text-left transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-forest text-cream text-[10px] font-bold flex items-center justify-center">
                    AK
                  </span>
                  <span className="font-outfit font-semibold text-xs text-moss">Worker</span>
                </div>
                <span className="text-[10px] text-muted block font-mono-cf truncate">
                  Arjun K. (₹1,200)
                </span>
              </button>
            </div>
          </div>

          {/* Tab Selector: Log In vs Register */}
          <div className="flex gap-1 p-1 bg-cream rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-outfit font-semibold transition-all ${
                tab === 'login'
                  ? 'bg-surface text-moss shadow-sm'
                  : 'text-muted hover:text-moss'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-outfit font-semibold transition-all ${
                tab === 'register'
                  ? 'bg-surface text-moss shadow-sm'
                  : 'text-muted hover:text-moss'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {success && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-jakarta flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-jakarta flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={tab === 'login' ? handleLoginSubmit : handleRegisterSubmit} noValidate className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-outfit font-semibold text-moss mb-1">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`p-2.5 rounded-2xl border text-xs font-outfit font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'citizen'
                        ? 'border-moss bg-moss/10 text-moss'
                        : 'border-line text-muted hover:border-moss'
                    }`}
                  >
                    <UserCircle size={14} /> Citizen Reporter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`p-2.5 rounded-2xl border text-xs font-outfit font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'worker'
                        ? 'border-moss bg-moss/10 text-moss'
                        : 'border-line text-muted hover:border-moss'
                    }`}
                  >
                    <Wrench size={14} /> Field Technician
                  </button>
                </div>

                <label htmlFor="reg-name" className="block text-xs font-outfit font-semibold text-moss mb-1">
                  Full Name <span className="text-clay">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-3 rounded-2xl border border-line bg-cream/30 text-moss font-jakarta text-xs focus:outline-none focus:ring-1 focus:ring-moss"
                />
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-outfit font-semibold text-moss mb-1">
                Email Address <span className="text-clay">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-line bg-cream/30 text-moss font-jakarta text-xs focus:outline-none focus:ring-1 focus:ring-moss"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-outfit font-semibold text-moss mb-1">
                Password <span className="text-clay">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'login' ? 'Your password' : 'Min. 6 characters'}
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-line bg-cream/30 text-moss font-jakarta text-xs focus:outline-none focus:ring-1 focus:ring-moss"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-moss p-1"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label htmlFor="reg-area" className="block text-xs font-outfit font-semibold text-moss mb-1">
                  Neighborhood / Area
                </label>
                <input
                  id="reg-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. South Bengaluru / Jayanagar"
                  className="w-full px-4 py-3 rounded-2xl border border-line bg-cream/30 text-moss font-jakarta text-xs focus:outline-none focus:ring-1 focus:ring-moss"
                />
              </div>
            )}

            {/* Quick Demo Fill Text Helpers */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-outfit text-clay-dark">
              <button
                type="button"
                onClick={() => fillDemo('citizen')}
                className="hover:underline font-semibold"
              >
                Auto-fill Citizen creds
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => fillDemo('worker')}
                className="hover:underline font-semibold"
              >
                Auto-fill Worker creds
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? 'Authenticating...' : tab === 'login' ? 'Log In to Account' : 'Create Demo Account'}
              <ArrowRight size={14} />
            </Button>
          </form>

          {/* Privacy Note */}
          <p className="mt-6 text-[10px] text-muted text-center font-jakarta leading-relaxed">
            Client-side demo session only. Credentials and wallet balances are stored in browser localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
