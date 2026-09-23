import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import OfferingCard from './OfferingCard';

const SectionReveal = ({ section, offerings, accentColor, onBack, onEnquire }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  const totalPages = Math.ceil(offerings.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);
  const pageItems = offerings.slice(currentPage * itemsPerView, (currentPage + 1) * itemsPerView);

  return (
    <div className="animate-slide-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to {section?.pillar?.name || 'Pillar'}
      </button>

      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {section.icon || section.title?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-on-surface">{section.title}</h2>
            <p className="text-sm font-medium" style={{ color: accentColor }}>
              {section.slug}
            </p>
          </div>
        </div>
        <p className="text-on-surface-variant leading-relaxed max-w-3xl">{section.description}</p>
      </div>

      {/* Offerings Grid */}
      {offerings.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <p className="text-on-surface-variant">No offerings available for this section yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pageItems.map((offering) => (
              <OfferingCard
                key={offering.id}
                offering={offering}
                accentColor={accentColor}
                onEnquire={onEnquire}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - itemsPerView))}
                disabled={currentPage === 0}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-on-surface-variant font-medium">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(offerings.length - itemsPerView, prev + itemsPerView))}
                disabled={currentPage === totalPages - 1}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionReveal;