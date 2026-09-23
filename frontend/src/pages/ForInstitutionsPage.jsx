import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, School, ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';
import PillarRing from '../components/public/PillarRing';
import SectionReveal from '../components/public/SectionReveal';

const ForInstitutionsPage = () => {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await websiteApi.getInstitutionAudiences();
        setAudiences(data.filter(a => a.is_active));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAudienceClick = (audience) => {
    setSelectedAudience(audience);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
    } else {
      setSelectedAudience(null);
    }
  };

  const handleEnquire = (offering) => {
    window.location.href = `/contact?offering=${encodeURIComponent(offering.title)}&audience=${selectedAudience?.slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <GraduationCap className="w-4 h-4" />
            For Institutions
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            Empowering Educational Institutions
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body">
            Tailored programs for colleges and schools to bridge the gap between academia and industry.
          </p>
        </div>

        {!selectedAudience && !activeSection ? (
          /* Audience Selector Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {audiences.map((audience) => (
              <button
                key={audience.id}
                onClick={() => handleAudienceClick(audience)}
                className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30 hover:shadow-xl hover:border-primary/30 transition-all text-left flex flex-col items-start"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white mb-6" style={{ backgroundColor: '#0f766e' }}>
                  {audience.slug === 'colleges' ? <GraduationCap className="w-8 h-8" /> : <School className="w-8 h-8" />}
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">{audience.title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">{audience.description}</p>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white" style={{ backgroundColor: '#0f766e' }}>
                  Explore Programs <ExternalLink className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        ) : activeSection ? (
          /* Section Reveal */
          <SectionReveal
            section={activeSection}
            offerings={activeSection.offerings || []}
            accentColor="#0f766e"
            onBack={handleBack}
            onEnquire={handleEnquire}
          />
        ) : (
          /* Sub-sections Ring for selected audience */
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline text-2xl font-bold text-on-surface">
                  {selectedAudience.title} Programs
                </h2>
                <button
                  onClick={() => setSelectedAudience(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
              <p className="text-on-surface-variant max-w-2xl">
                Select a program area to explore offerings.
              </p>
            </div>

            <PillarRing
              sections={selectedAudience.sections || []}
              accentColor="#0f766e"
              onSectionClick={handleSectionClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ForInstitutionsPage;
