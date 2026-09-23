import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

const OfferingCard = ({ offering, accentColor, onEnquire }) => {
  return (
    <div
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        {offering.is_featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}

        <h3 className="font-headline font-bold text-lg text-on-surface mb-3">{offering.title}</h3>

        {offering.short_description && (
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2">
            {offering.short_description}
          </p>
        )}

        {offering.highlights && offering.highlights.length > 0 && (
          <div className="space-y-2 mb-4">
            {offering.highlights.slice(0, 4).map((highlight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                <span>{highlight}</span>
              </div>
            ))}
            {offering.highlights.length > 4 && (
              <p className="text-xs text-on-surface-variant/70">
                +{offering.highlights.length - 4} more highlights
              </p>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-outline-variant/20">
        <button
          onClick={() => onEnquire?.(offering)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: accentColor }}
        >
          Enquire Now
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OfferingCard;