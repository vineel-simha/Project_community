/**
 * src/services/auth/index.js
 * Client-side authentication service for CivicFix demo mode.
 * Stores sessions in localStorage under key: civicfix:auth:v1
 *
 * No real authentication, tokens or network calls are made.
 */

import { DEMO_USERS_BY_EMAIL, DEMO_CITIZEN, DEMO_WORKER } from '../../data/demoUsers.js';

const STORAGE_KEY = 'civicfix:auth:v1';

// ─── Type Definitions (JSDoc) ────────────────────────────────────────────────
/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {'citizen'|'worker'} role
 * @property {string} name
 * @property {string} fullName
 * @property {string} email
 * @property {string} area
 * @property {boolean} isDemo
 * @property {string} avatarInitials
 * @property {number} [walletBalance]   - Worker only
 * @property {number} [completedJobs]  - Worker only
 */

/**
 * @typedef {Object} AuthState
 * @property {UserProfile|null} user
 * @property {boolean} isAuthenticated
 */

// ─── Storage Helpers ─────────────────────────────────────────────────────────
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[CivicFix Auth] Could not write to localStorage:', e.message);
  }
}

// ─── Custom User Registry ────────────────────────────────────────────────────
const CUSTOM_USERS_KEY = 'civicfix:auth:users:v1';

function readCustomUsers() {
  try {
    const raw = localStorage.getItem(CUSTOM_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCustomUsers(users) {
  try {
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[CivicFix Auth] Could not save custom user:', e.message);
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
/**
 * Returns the current auth state from storage.
 * @returns {AuthState}
 */
export function getSession() {
  const data = readStorage();
  if (data.user) {
    return { user: data.user, isAuthenticated: true };
  }
  return { user: null, isAuthenticated: false };
}

/**
 * Attempts to log in with email + password.
 * Checks demo credentials first, then custom-registered users.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: UserProfile, error?: string }}
 */
export function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check demo users first
  const demoUser = DEMO_USERS_BY_EMAIL[normalizedEmail];
  if (demoUser) {
    if (demoUser.password !== password) {
      return { success: false, error: 'Incorrect password. Try: ' + (demoUser.role === 'citizen' ? 'civic123' : 'worker123') };
    }
    // Strip password before storing in session
    const { password: _pw, ...safeUser } = demoUser;
    writeStorage({ user: safeUser, loginAt: new Date().toISOString() });
    return { success: true, user: safeUser };
  }

  // Check custom registered users
  const customUsers = readCustomUsers();
  const customUser = customUsers[normalizedEmail];
  if (customUser) {
    if (customUser.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    const { password: _pw, ...safeUser } = customUser;
    writeStorage({ user: safeUser, loginAt: new Date().toISOString() });
    return { success: true, user: safeUser };
  }

  return { success: false, error: 'No account found for that email. Register below or use demo credentials.' };
}

/**
 * Registers a new custom demo user.
 * @param {{ name: string, email: string, password: string, role: 'citizen'|'worker', area?: string }} data
 * @returns {{ success: boolean, user?: UserProfile, error?: string }}
 */
export function register({ name, email, password, role, area = 'Bengaluru' }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (DEMO_USERS_BY_EMAIL[normalizedEmail]) {
    return { success: false, error: 'That email is reserved for the built-in demo account. Use a different email.' };
  }

  const customUsers = readCustomUsers();
  if (customUsers[normalizedEmail]) {
    return { success: false, error: 'An account with that email already exists.' };
  }

  const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const newUser = {
    id:             `custom-${role}-${Date.now()}`,
    role,
    name:           name.trim(),
    fullName:       name.trim(),
    email:          normalizedEmail,
    password,       // stored only in custom user registry
    area,
    isDemo:         false,
    avatarInitials: initials,
    walletBalance:  role === 'worker' ? 0 : undefined,
    completedJobs:  role === 'worker' ? 0 : undefined,
    registeredAt:   new Date().toISOString(),
  };

  customUsers[normalizedEmail] = newUser;
  writeCustomUsers(customUsers);

  const { password: _pw, ...safeUser } = newUser;
  writeStorage({ user: safeUser, loginAt: new Date().toISOString() });
  return { success: true, user: safeUser };
}

/**
 * Logs out the current user.
 */
export function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Updates the wallet balance for the currently logged-in worker.
 * @param {number} amount - Amount to ADD to the balance.
 * @returns {number} New balance.
 */
export function creditWorkerWallet(amount) {
  const data = readStorage();
  if (!data.user || data.user.role !== 'worker') return 0;

  const currentBalance = data.user.walletBalance ?? 0;
  const newBalance = currentBalance + amount;
  data.user.walletBalance = newBalance;
  data.user.completedJobs = (data.user.completedJobs ?? 0) + 1;
  writeStorage(data);

  // Also update custom user registry if applicable
  if (!data.user.isDemo) {
    const customUsers = readCustomUsers();
    if (customUsers[data.user.email]) {
      customUsers[data.user.email].walletBalance = newBalance;
      customUsers[data.user.email].completedJobs = data.user.completedJobs;
      writeCustomUsers(customUsers);
    }
  }

  return newBalance;
}

/**
 * Switches the current session to a demo account (for quick role switching).
 * @param {'citizen'|'worker'} role
 * @returns {UserProfile}
 */
export function switchToDemoRole(role) {
  const demoUser = role === 'citizen' ? DEMO_CITIZEN : DEMO_WORKER;
  const { password: _pw, ...safeUser } = demoUser;
  writeStorage({ user: safeUser, loginAt: new Date().toISOString() });
  return safeUser;
}

/**
 * Refreshes the current user object from storage (useful after wallet updates).
 * @returns {UserProfile|null}
 */
export function refreshSession() {
  return getSession().user;
}

export default {
  getSession,
  login,
  logout,
  register,
  creditWorkerWallet,
  switchToDemoRole,
  refreshSession,
};
