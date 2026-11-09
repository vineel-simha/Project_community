/**
 * src/App.jsx
 * Phase 1 — Multi-Page Architecture & Route Configuration
 * Configures BrowserRouter with the 7 dedicated pages:
 * 1. / (Home)
 * 2. /how-it-works (Detailed two-sided lifecycle guide)
 * 3. /report (Dedicated Citizen reporting hub)
 * 4. /worker-jobs (Dedicated Field worker marketplace)
 * 5. /track-verify (Dedicated 5-stage tracking & verification)
 * 6. /about (Full-width dark editorial manifesto)
 * 7. /login (Dedicated authentication page)
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AuthModal } from './components/ui/AuthModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { HowItWorksPage } from './pages/HowItWorksPage.jsx';
import { ReportPage } from './pages/ReportPage.jsx';
import { WorkerJobsPage } from './pages/WorkerJobsPage.jsx';
import { TrackVerifyPage } from './pages/TrackVerifyPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { getSession, logout, refreshSession } from './services/auth/index.js';
import { Button } from './components/ui/Button.jsx';
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 404 Not Found Page Component
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
        <AlertCircle size={32} />
      </div>
      <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-moss tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="font-jakarta text-sm text-muted max-w-md mb-8">
        The destination you requested does not exist or has been relocated to one of our dedicated hubs.
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        <ArrowLeft size={15} /> Return to Homepage
      </Button>
    </div>
  );
}

function MainApp() {
  const [session, setSession] = useState(() => getSession());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [complaintRefreshTrigger, setComplaintRefreshTrigger] = useState(0);

  // Global Auth Modal Controller
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [authModalRole, setAuthModalRole] = useState('citizen');

  useEffect(() => {
    const handleStorageChange = () => {
      setSession(getSession());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function handleAuthSuccess(user) {
    setSession({ user, isAuthenticated: true });
    setAuthModalOpen(false);
  }

  function handleLogout() {
    logout();
    setSession({ user: null, isAuthenticated: false });
  }

  function handleComplaintCreated() {
    setComplaintRefreshTrigger((prev) => prev + 1);
  }

  function handleComplaintUpdated() {
    setComplaintRefreshTrigger((prev) => prev + 1);
    setSession({ user: refreshSession(), isAuthenticated: true });
  }

  function handleOpenAuthModal(tab = 'login', role = 'citizen') {
    setAuthModalTab(tab);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-cream text-moss selection:bg-clay/20 selection:text-moss flex flex-col justify-between">
      {/* Skip to Content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />

      {/* Global Navbar */}
      <Navbar
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Routed Page Content */}
      <main id="main-content" className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route
            path="/report"
            element={
              <ReportPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
                onComplaintCreated={handleComplaintCreated}
              />
            }
          />
          <Route
            path="/worker-jobs"
            element={
              <WorkerJobsPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
                complaintRefreshTrigger={complaintRefreshTrigger}
                onComplaintUpdated={handleComplaintUpdated}
                onOpenAuthModal={handleOpenAuthModal}
              />
            }
          />
          <Route
            path="/track-verify"
            element={
              <TrackVerifyPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
                complaintRefreshTrigger={complaintRefreshTrigger}
                onComplaintUpdated={handleComplaintUpdated}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/login"
            element={
              <LoginPage
                user={user}
                onAuthSuccess={handleAuthSuccess}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Charcoal Footer */}
      <Footer onOpenAuthModal={handleOpenAuthModal} />

      {/* Global Auth Modal for quick header/footer triggers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
        defaultRole={authModalRole}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
