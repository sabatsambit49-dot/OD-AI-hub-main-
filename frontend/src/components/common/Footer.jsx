import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-dim w-full py-12 border-t border-outline-variant/20 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-2">
          <span className="font-headline text-xl text-on-surface-variant font-bold flex items-center gap-3">
            <img src="/logo.jpg" alt="ODAIHUB Logo" className="w-8 h-8 rounded-full object-cover shadow-sm border border-outline-variant/30" />
            ODAIHUB Educational Systems
          </span>
          <p className="font-body text-sm text-primary">
            © 2026 ODAIHUB Educational Systems. Production-Ready Analytics Infrastructure.
          </p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-6 font-body text-sm text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Archival Catalog</a>
          <a href="#" className="hover:text-primary transition-colors">Support & Docs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
