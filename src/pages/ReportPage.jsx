/**
 * src/pages/ReportPage.jsx
 * Route: /report
 * Dedicated Citizen Issue Reporting Page.
 * Reuses ReportSection with full-width responsive layout and authentication gate.
 */
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReportSection } from '../components/sections/ReportSection.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { switchToDemoRole } from '../services/auth/index.js';
import { LogIn, UserCheck, AlertCircle, ArrowLeft, Wrench } from 'lucide-react';

export function ReportPage({ user, onAuthSuccess, onComplaintCreated }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const handleLoginAsDemoCitizen = () => {
    const citizen = switchToDemoRole('citizen');
    if (onAuthSuccess) onAuthSuccess(citizen);
  };

  return (
    <div className="w-full flex flex-col py-8 md:py-16">
      <div className="layout-fluid">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-outfit text-muted hover:text-moss transition-colors"
          >
            <ArrowLeft size={13} /> Back to Homepage
          </button>
        </div>

        {/* Authentication Notice if visitor is not logged in */}
        {!user && (
          <div className="mb-8 p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-jakarta font-bold text-sm text-amber-950">
                  Citizen Sign-In Recommended
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Sign in to associate your report with your citizen profile so you can verify the technician's completed repair later.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={handleLoginAsDemoCitizen}
                className="text-xs py-2 px-3"
              >
                <UserCheck size={13} /> Auto-fill Demo Citizen (Vineel S.)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login?return=/report')}
                className="text-xs py-2 px-3 text-amber-900 border-amber-300 hover:bg-amber-100"
              >
                <LogIn size={13} /> Sign In
              </Button>
            </div>
          </div>
        )}

        {/* Worker role notice if logged in as technician */}
        {user?.role === 'worker' && (
          <div className="mb-8 p-4 rounded-3xl bg-forest/10 border border-forest/20 text-moss flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-jakarta">
            <div className="flex items-center gap-2.5">
              <Wrench size={16} className="text-clay flex-shrink-0" />
              <span>
                Logged in as Field Technician (<strong>{user.name}</strong>). Reports will be credited to your technician account, or you can switch to Citizen mode.
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoginAsDemoCitizen}
              className="text-xs py-1.5 px-3 self-start sm:self-auto flex-shrink-0"
            >
              <UserCheck size={13} /> Switch to Citizen (Vineel S.)
            </Button>
          </div>
        )}

        {/* Dedicated Report Form Section (Reused Component) */}
        <ReportSection
          user={user}
          onAuthSuccess={onAuthSuccess}
          preselectedCategory={initialCategory}
          onComplaintCreated={(complaint) => {
            if (onComplaintCreated) onComplaintCreated(complaint);
          }}
          onSwitchToWorkerAndScroll={(complaintId) => {
            switchToDemoRole('worker');
            navigate(`/worker-jobs?id=${complaintId}`);
          }}
          onTrackComplaint={(complaintId) => {
            navigate(`/track-verify?id=${complaintId}`);
          }}
        />
      </div>
    </div>
  );
}

export default ReportPage;
