import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
const Navbar = () => {
  const { user, logout, isViewer } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="bg-surface-container-lowest/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <Link to="/" className="font-headline text-2xl font-bold text-primary tracking-tight flex items-center gap-3">
            <img src="/logo.jpg" alt="OD AI HUB Logo" className="w-9 h-9 rounded-full object-cover shadow-sm border border-outline-variant/30" />
            <span>OD AI HUB</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-headline text-base tracking-tight transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/search"
                  className={`font-headline text-base tracking-tight transition-colors hover:text-primary ${
                    isActive('/search') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
                  }`}
                >
                  Institutions
                </Link>
                <Link
                  to="/course-matrix"
                  className={`font-headline text-base tracking-tight transition-colors hover:text-primary ${
                    isActive('/course-matrix') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
                  }`}
                >
                  Course Matrix
                </Link>
                <Link
                  to="/analytics"
                  className={`font-headline text-base tracking-tight transition-colors hover:text-primary ${
                    isActive('/analytics') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
                  }`}
                >
                  Analytics Hub
                </Link>
              </>
            )}
            {!isViewer && (
              <Link
                to="/management"
                className={`font-headline text-base tracking-tight transition-colors hover:text-primary ${
                  isActive('/management') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
                }`}
              >
                Management Console
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin/users"
                className={`font-headline text-base tracking-tight transition-colors hover:text-primary flex items-center gap-1.5 ${
                  isActive('/admin/users') || isActive('/users') ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-lg">group</span>
                Users
              </Link>
            )}
          </div>

          {/* User Auth Action */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="font-label text-sm font-bold text-on-surface">{user.username}</span>
                  <span className="font-label text-xs uppercase px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold w-fit ml-auto">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-xl text-sm font-label font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors shadow-sm focus:outline-none"
                  title="Existing User / User Profile"
                  aria-label="User Profile"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-semibold text-sm px-4 py-2 rounded-xl scale-95 active:scale-90 transition-all hover:shadow-md"
                >
                  Existing User
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-label font-semibold text-sm px-3.5 py-2 rounded-xl border border-primary/20 transition-all"
                >
                  New User
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
        />
      )}
    </>
  );
};

export default Navbar;