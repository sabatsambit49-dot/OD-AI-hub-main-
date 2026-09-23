import React, { useState, useEffect } from 'react';
import { useBackendHealth } from '../../context/BackendHealthContext';
import { Zap, RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';

const ServerWakeupBanner = () => {
  const { isWakingUp, isHealthy, elapsedTime, checkHealth } = useBackendHealth();
  const [justWokeUp, setJustWokeUp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (isHealthy && elapsedTime > 0) {
      setJustWokeUp(true);
      const timer = setTimeout(() => {
        setJustWokeUp(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isHealthy, elapsedTime]);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    await checkHealth();
    setIsRetrying(false);
  };

  if (dismissed && !isWakingUp) return null;

  if (justWokeUp) {
    return (
      <div className="bg-emerald-600 text-white text-sm py-2 px-4 shadow-md transition-all duration-300 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
          <CheckCircle2 className="w-5 h-5 animate-bounce" />
          <span className="font-medium">
            ⚡ Backend server is awake and connected! System fully operational.
          </span>
        </div>
      </div>
    );
  }

  if (!isWakingUp) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-sm py-2.5 px-4 shadow-lg transition-all duration-300 border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-100"></span>
            </span>
          </div>

          <div>
            <span className="font-semibold text-white">
              Backend Server Waking Up (Free Tier Cold Start)
            </span>
            <span className="hidden md:inline text-amber-100/90 ml-2">
              • Server spins down after inactivity. Resuming services ({elapsedTime}s elapsed)...
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/40 text-amber-100 border border-amber-400/30">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Auto-retrying requests
          </span>

          <button
            onClick={handleManualRetry}
            disabled={isRetrying}
            className="hover:bg-amber-700/60 active:bg-amber-800 text-xs px-3 py-1 rounded bg-amber-950/30 border border-amber-300/30 font-medium transition flex items-center space-x-1"
            title="Ping backend health endpoint manually"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Checking...' : 'Check Status'}</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-amber-200 hover:text-white p-1 rounded"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerWakeupBanner;
