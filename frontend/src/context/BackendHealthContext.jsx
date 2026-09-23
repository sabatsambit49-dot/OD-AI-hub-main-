import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/client';

const BackendHealthContext = createContext(null);

export const BackendHealthProvider = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'healthy' | 'waking_up' | 'unreachable'
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastCheck, setLastCheck] = useState(null);
  const timerRef = useRef(null);

  // Ping backend /health endpoint
  const checkHealth = useCallback(async () => {
    try {
      // Use short timeout for check, but standard client handles retries
      const res = await api.get('/health', { timeout: 15000 });
      if (res.status === 200) {
        setStatus('healthy');
        setLastCheck(new Date());
        setElapsedTime(0);
        return true;
      }
    } catch (err) {
      console.warn("Backend health check failed or timed out (backend may be sleeping):", err?.message);
      setStatus('waking_up');
    }
    return false;
  }, []);

  // Timer counter for waking up state
  useEffect(() => {
    if (status === 'waking_up') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Initial check & setup window event listeners from client.js
  useEffect(() => {
    checkHealth();

    const handleWakingUp = () => {
      setStatus((prev) => (prev !== 'healthy' ? 'waking_up' : prev));
    };

    const handleHealthy = () => {
      setStatus('healthy');
      setLastCheck(new Date());
    };

    window.addEventListener('backend-waking-up', handleWakingUp);
    window.addEventListener('backend-healthy', handleHealthy);

    return () => {
      window.removeEventListener('backend-waking-up', handleWakingUp);
      window.removeEventListener('backend-healthy', handleHealthy);
    };
  }, [checkHealth]);

  // Keep-alive interval: ping backend every 4 minutes (240,000 ms) while tab is open
  useEffect(() => {
    const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutes
    const interval = setInterval(() => {
      checkHealth();
    }, KEEP_ALIVE_INTERVAL);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const value = {
    status,
    elapsedTime,
    lastCheck,
    checkHealth,
    isWakingUp: status === 'waking_up',
    isUnreachable: status === 'unreachable',
    isHealthy: status === 'healthy'
  };

  return (
    <BackendHealthContext.Provider value={value}>
      {children}
    </BackendHealthContext.Provider>
  );
};

export const useBackendHealth = () => useContext(BackendHealthContext);
