import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-error text-white',
    info: 'bg-primary text-white',
    warning: 'bg-amber-600 text-white',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg font-label text-sm transition-all duration-300 transform translate-y-0 ${bgColors[type]}`}>
      <span className="material-symbols-outlined text-lg">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-3 hover:opacity-80">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};

export default Toast;
