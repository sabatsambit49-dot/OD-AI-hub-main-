import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';
import PillarRing from '../components/public/PillarRing';
import SectionReveal from '../components/public/SectionReveal';

const PillarLandingPage = () => {
  const { slug } = useParams();
  const [pillar, setPillar] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pillarData, sectionsData] = await Promise.all([
          websiteApi.getPillar(slug),
          websiteApi.getPillarSections(slug)
        ]);
        setPillar(pillarData);
        setSections(sectionsData.filter(s => s.status === 'published'));
        setError(null);
      } catch (err) {
        setError('Failed to load pillar data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  const handleEnquire = (offering) => {
    // Navigate to contact page with pre-filled enquiry
    window.location.href = `/contact?offering=${encodeURIComponent(offering.title)}&pillar=${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading {slug}...</p>
        </div>
      </div>
    );
  }

  if (error || !pillar) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center p-12">
          <BookOpen className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Page Not Found</h2>
          <p className="text-on-surface-variant">The pillar "{slug}" could not be found.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: pillar?.accent_color || '#0b5ed7' }}>
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Pillar Hero */}
        <div
          className="mb-16 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden"
          style={{ backgroundColor: pillar.accent_color }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-label mb-6">
              <span className="material-symbols-outlined">{pillar.icon || 'category'}</span>
              {pillar.name}
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
              {pillar.tagline || 'Empowering innovation and excellence'}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 font-body">
              {pillar.description || 'Explore our comprehensive programs and offerings designed to accelerate your growth.'}
            </p>
          </div>
        </div>

        {/* Pillar Ring + Section Reveal */}
        <div className="space-y-12">
          {!activeSection ? (
            <>
              <div className="mb-8">
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
                  Explore {pillar.name} Programs
                </h2>
                <p className="text-on-surface-variant max-w-2xl">
                  Click on any program below to explore its offerings and courses.
                </p>
              </div>

              <PillarRing
                sections={sections}
                accentColor={pillar.accent_color}
                onSectionClick={handleSectionClick}
              />
            </>
          ) : (
            <SectionReveal
              section={activeSection}
              offerings={activeSection.offerings || []}
              accentColor={pillar.accent_color}
              onBack={handleBack}
              onEnquire={handleEnquire}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PillarLandingPage;
