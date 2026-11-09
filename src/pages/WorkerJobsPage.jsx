/**
 * src/pages/WorkerJobsPage.jsx
 * Route: /worker-jobs
 * Dedicated Field Worker Marketplace Page.
 * Reuses WorkerHubSection with full-width responsive layout and worker authentication gates.
 */
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WorkerHubSection } from '../components/sections/WorkerHubSection.jsx';
import { switchToDemoRole } from '../services/auth/index.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { ArrowLeft, Wrench, UserCheck, LogIn, AlertCircle } from 'lucide-react';

export function WorkerJobsPage({
  user,
  onAuthSuccess,
  complaintRefreshTrigger,
  onComplaintUpdated,
  onOpenAuthModal,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const targetArea = searchParams.get('area');
  const targetTab = searchParams.get('tab');

  const isWorker = user?.role === 'worker';

  const handleLoginAsDemoWorker = () => {
    const worker = switchToDemoRole('worker');
    if (onAuthSuccess) onAuthSuccess(worker);
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

          {!isWorker && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoginAsDemoWorker}
              className="text-xs py-1.5 px-3"
            >
              <UserCheck size={13} /> Log In as Demo Worker (Arjun K.)
            </Button>
          )}
        </div>

        {/* Worker Jobs Hub Component */}
        <WorkerHubSection
          user={user}
          onAuthSuccess={onAuthSuccess}
          complaintRefreshTrigger={complaintRefreshTrigger}
          onComplaintUpdated={onComplaintUpdated}
          targetComplaintId={targetId}
          targetArea={targetArea}
          targetTab={targetTab}
          onSwitchToCitizenAndVerify={(complaintId) => {
            switchToDemoRole('citizen');
            navigate(`/track-verify?id=${complaintId}`);
          }}
          onOpenAuthModal={onOpenAuthModal}
        />
      </div>
    </div>
  );
}

export default WorkerJobsPage;
