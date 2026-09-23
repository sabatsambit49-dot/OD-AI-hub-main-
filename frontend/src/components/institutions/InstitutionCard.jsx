import React from 'react';
import { Link } from 'react-router-dom';

const InstitutionCard = ({ institution }) => {
  const { id, name, address, district, institution_type } = institution;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
          <span className="bg-primary-container/15 text-primary text-xs font-label font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {institution_type?.name || 'Institution'}
          </span>
          {district?.state && (
            <span className="text-xs font-label text-on-surface-variant font-medium">
              {district.state.name}
            </span>
          )}
        </div>

        <h3 className="font-headline text-xl font-bold text-on-surface group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {name}
        </h3>

        <p className="font-body text-sm text-on-surface-variant flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-base">location_on</span>
          {address ? `${address}, ${district?.name || ''}` : district?.name || 'Address Not Provided'}
        </p>
      </div>

      <div className="pt-4 border-t border-outline-variant/15 flex items-center justify-between">
        <span className="font-label text-xs text-on-surface-variant font-semibold">
          Curated Profile
        </span>
        <Link
          to={`/institution/${id}`}
          className="inline-flex items-center gap-1 text-sm font-label font-bold text-primary group-hover:translate-x-1 transition-transform"
        >
          View Profile
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      </div>
    </div>
  );
};

export default InstitutionCard;
