import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot' | 'reset'

  React.useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor'); // default role editor for easy testing
  
  // Password reset states
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetFormState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetFormState();
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetFormState();

    // Constant role assignment based on email address
    const cleanEmail = email.trim().toLowerCase();
    let assignedRole = 'editor';
    if (cleanEmail === 'odaihubadmin@gmail.com') {
      assignedRole = 'admin';
    } else if (cleanEmail === 'odaihubeditor@gmail.com') {
      assignedRole = 'editor';
    }

    try {
      await authApi.register({ username, email: cleanEmail, password, role: assignedRole });
      await login(username, password);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetFormState();
    try {
      const res = await authApi.forgotPassword(email);
      setSuccessMessage(res.message);
      if (res.reset_token) {
        setResetToken(res.reset_token);
        setMode('reset');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Request failed. Verify registered email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetFormState();
    try {
      const res = await authApi.resetPassword(resetToken, newPassword);
      setSuccessMessage(res.message || "Password reset successfully!");
      setTimeout(() => {
        setMode('login');
        resetFormState();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to reset password. Check reset token.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'register') return 'Create User Account';
    if (mode === 'forgot') return 'Forgot Password';
    if (mode === 'reset') return 'Reset Password';
    return 'Existing User Login';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-sm font-body">{error}</div>}
        {successMessage && <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 text-sm font-body">{successMessage}</div>}

        {/* Mode: Login (Existing User) */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-label font-semibold text-on-surface">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    resetFormState();
                  }}
                  className="font-label text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-base font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? 'Signing In...' : 'Existing User Login'}
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-base font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? 'Registering...' : 'Register Account'}
              </button>
            </div>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className="font-label text-sm text-primary hover:underline"
              >
                Already have an account? Existing User Login
              </button>
            </div>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <p className="font-body text-xs text-on-surface-variant">
              Enter your registered email address below. A password reset token will be generated for your account.
            </p>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="pt-2 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label text-sm font-semibold hover:bg-surface-container-low"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                {loading ? 'Processing...' : 'Generate Reset Token'}
              </button>
            </div>
          </form>
        )}

        {/* Mode: Reset Password */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Reset Token</label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Reset Token"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="pt-2 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFormState();
                }}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label text-sm font-semibold hover:bg-surface-container-low"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
