/**
 * src/pages/TrackVerifyPage.jsx
 * Route: /track-verify
 * Dedicated Complaint Tracking & Citizen Verification Handshake Page.
 * Reuses TrackSection with full-width responsive layout and query parameter search support.
 */
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TrackSection } from '../components/sections/TrackSection.jsx';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function TrackVerifyPage({
  user,
  onAuthSuccess,
  complaintRefreshTrigger,
  onComplaintUpdated,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'DEMO-1002';

  const handleSelectComplaint = (id) => {
    if (id && searchParams.get('id') !== id) {
      setSearchParams({ id }, { replace: true });
    }
  };

  return (
    <div className="w-full flex flex-col py-8 md:py-16">
      <div className="layout-fluid">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-outfit text-muted hover:text-moss transition-colors"
          >
            <ArrowLeft size={13} /> Back to Homepage
          </button>

          <span className="text-xs font-mono-cf text-muted">
            TELEMETRY // CITIZEN HANDSHAKE
          </span>
        </div>

        {/* Dedicated Track Section Component */}
        <TrackSection
          user={user}
          onAuthSuccess={onAuthSuccess}
          initialComplaintId={initialId}
          complaintRefreshTrigger={complaintRefreshTrigger}
          onComplaintUpdated={onComplaintUpdated}
          onSelectComplaint={handleSelectComplaint}
        />
      </div>
    </div>
  );
}

export default TrackVerifyPage;
