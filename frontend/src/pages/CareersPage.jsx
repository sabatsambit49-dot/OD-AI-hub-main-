import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { websiteApi } from '@/api/websiteApi';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus === 'open') params.is_open = true;
      else if (filterStatus === 'closed') params.is_open = false;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteApi.getJobListings(params);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBack = () => {
    setSelectedJob(null);
  };

  const handleApply = (job) => {
    window.location.href = `/contact?job=${encodeURIComponent(job.title)}&type=job_application`;
  };

  const getTypeBadge = (type) => {
    const colors = {
      'full-time': 'bg-blue-500/15 text-blue-700',
      'part-time': 'bg-purple-500/15 text-purple-700',
      contract: 'bg-green-500/15 text-green-700',
      internship: 'bg-orange-500/15 text-orange-700',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colors[type] || 'bg-gray-500/15 text-gray-700'}`}>
        {type.replace('-', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-label">Loading careers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-label mb-6">
            <Briefcase className="w-4 h-4" />
            Careers
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-6 text-on-surface">
            Build the Future of AI Education
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-body">
            Join a mission-driven team transforming how the world learns and applies AI technology.
          </p>
        </div>

        {selectedJob ? (
          /* Job Detail */
          <div className="max-w-3xl mx-auto animate-slide-up">
            <button
              onClick={handleBack}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Jobs
            </button>

            <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-3xl font-bold text-on-surface">{selectedJob.title}</h2>
                {getTypeBadge(selectedJob.type)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {selectedJob.department && (
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                    <Briefcase className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                    <div>
                      <p className="text-xs text-on-surface-variant">Department</p>
                      <p className="font-semibold text-on-surface">{selectedJob.department}</p>
                    </div>
                  </div>
                )}
                {selectedJob.location && (
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                    <MapPin className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                    <div>
                      <p className="text-xs text-on-surface-variant">Location</p>
                      <p className="font-semibold text-on-surface">{selectedJob.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <Clock className="w-6 h-6" style={{ color: '#0b5ed7' }} />
                  <div>
                    <p className="text-xs text-on-surface-variant">Type</p>
                    <p className="font-semibold text-on-surface capitalize">{selectedJob.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-on-surface-variant leading-relaxed">{selectedJob.description}</p>
              </div>

              <button
                onClick={() => handleApply(selectedJob)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all"
                style={{ backgroundColor: '#0b5ed7' }}
              >
                Apply Now <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Jobs Grid */
          <div>
            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <Briefcase className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                <h3 className="font-headline text-xl font-semibold text-on-surface-variant mb-2">No Open Positions</h3>
                <p className="text-on-surface-variant/70">Check back soon for new opportunities!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#0b5ed7' }} />
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-headline text-xl font-bold text-on-surface">{job.title}</h3>
                      {getTypeBadge(job.type)}
                    </div>

                    <div className="space-y-3 mb-6 text-sm text-on-surface-variant">
                      {job.department && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span>{job.department}</span>
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-on-surface-variant line-clamp-3 mb-4">{job.description}</p>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white transition-all"
                      style={{ backgroundColor: '#0b5ed7' }}
                    >
                      Apply <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPage;
