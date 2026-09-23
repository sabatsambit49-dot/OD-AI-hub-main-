import React from 'react';
import UsersSection from '../components/admin/UsersSection';

const UsersAdminPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">manage_accounts</span>
            User & Session Management
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Real-time tracking of active logged-in sessions on ODAIHUB with one-click revocation and account removal.
          </p>
        </div>
      </div>

      <UsersSection />
    </div>
  );
};

export default UsersAdminPage;
