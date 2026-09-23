import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { institutionApi } from '../../api/institutionApi';
import { graphApi } from '../../api/graphApi';
import SeatsEnrolledChart from '../analytics/SeatsEnrolledChart';
import CapacityMetricCards from '../analytics/CapacityMetricCards';
import EmptyState from '../common/EmptyState';

const InstitutionDetailView = () => {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [graphStats, setGraphStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('courses'); // courses, events, analytics

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [detailData, statsData] = await Promise.all([
          institutionApi.getInstitutionDetail(id),
          graphApi.getInstitutionStats(id)
        ]);
        setInstitution(detailData);
        setGraphStats(statsData);
      } catch (err) {
        console.error("Error fetching institution detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!institution) {
    return <EmptyState title="Institution Not Found" description="The requested institution record could not be retrieved." icon="search_off" />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header Breadcrumb */}
      <div className="flex items-center gap-2 font-label text-sm text-on-surface-variant mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-primary transition-colors">Institutions</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">{institution.name}</span>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-container/15 text-primary font-label text-xs font-bold px-3 py-1 rounded-full uppercase">
                {institution.institution_type_name || 'Institution'}
              </span>
              {institution.state_name && (
                <span className="bg-surface-container-high text-on-surface-variant font-label text-xs font-semibold px-3 py-1 rounded-full">
                  {institution.state_name}
                </span>
              )}
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
              {institution.name}
            </h1>
            <p className="font-body text-base text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">location_on</span>
              {institution.address ? `${institution.address}, ${institution.district_name || ''}` : institution.district_name || 'Address Not Available'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                institutionApi.exportInstitutionCsv(id).then((blob) => {
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `institution_${id}_report.csv`);
                  document.body.appendChild(link);
                  link.click();
                });
              }}
              className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Capacity Analytics Metric Strip */}
        {graphStats && (
          <CapacityMetricCards
            totalSeats={graphStats.total_seats}
            totalEnrolled={graphStats.total_enrolled}
            totalCourses={graphStats.total_courses}
            occupancyRate={graphStats.occupancy_rate}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/30 mb-8 gap-8">
        <button
          onClick={() => setActiveTab('courses')}
          className={`font-headline text-base font-bold pb-3 border-b-2 transition-all ${
            activeTab === 'courses' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          Academic Hierarchy & Courses ({institution.courses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`font-headline text-base font-bold pb-3 border-b-2 transition-all ${
            activeTab === 'events' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          Events ({institution.events?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`font-headline text-base font-bold pb-3 border-b-2 transition-all ${
            activeTab === 'analytics' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          Visual Analytics Graph
        </button>
      </div>

      {/* Tab 1: Academic Hierarchy */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {!institution.courses || institution.courses.length === 0 ? (
            <EmptyState
              title="No Courses Enrolled"
              description="No courses have been added to this institution yet."
              icon="school"
            />
          ) : (
            institution.courses.map((course) => (
              <div key={course.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface">{course.name}</h3>
                    {course.description && <p className="font-body text-sm text-on-surface-variant mt-1">{course.description}</p>}
                  </div>
                </div>

                {/* Branches */}
                <div className="space-y-4 mt-4 pt-4 border-t border-outline-variant/15">
                  <h4 className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">Branches & Academic Years</h4>
                  {!course.branches || course.branches.length === 0 ? (
                    <p className="font-body text-sm text-on-surface-variant italic">No branches configured under this course.</p>
                  ) : (
                    course.branches.map((branch) => (
                      <div key={branch.id} className="bg-surface-container-low/40 rounded-xl p-4 border border-outline-variant/20">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-headline text-lg font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">account_tree</span>
                            {branch.name}
                          </span>
                        </div>

                        {/* Academic Years Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-body text-sm">
                            <thead>
                              <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase">
                                <th className="py-2">Academic Year</th>
                                <th className="py-2">Approved Seats</th>
                                <th className="py-2">Student Strength</th>
                                <th className="py-2">Syllabus PDF</th>
                              </tr>
                            </thead>
                            <tbody>
                              {branch.academic_years && branch.academic_years.length > 0 ? (
                                branch.academic_years.map((year) => (
                                  <tr key={year.id} className="border-b border-outline-variant/15 last:border-0 hover:bg-surface-container-low/80">
                                    <td className="py-3 font-semibold text-on-surface">{year.year_label}</td>
                                    <td className="py-3 text-on-surface">{year.total_seats}</td>
                                    <td className="py-3 text-on-surface">{year.student_strength}</td>
                                    <td className="py-3">
                                      {year.syllabi && year.syllabi.length > 0 ? (
                                        year.syllabi.map((s) => (
                                          <a
                                            key={s.id}
                                            href={s.file_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-label font-bold text-primary hover:underline mr-2"
                                          >
                                            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                            {s.title}
                                          </a>
                                        ))
                                      ) : (
                                        <span className="text-xs text-on-surface-variant italic">No Syllabus File</span>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="py-3 text-xs text-on-surface-variant italic">No academic years added.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Events */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {!institution.events || institution.events.length === 0 ? (
            <EmptyState title="No Events Scheduled" description="No academic events recorded for this institution." icon="event_busy" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institution.events.map((event) => (
                <div key={event.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline text-lg font-bold text-on-surface">{event.name}</h4>
                    <span className="bg-primary-container/10 text-primary text-xs font-label font-bold px-2.5 py-1 rounded-full">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  {event.description && <p className="font-body text-sm text-on-surface-variant mt-2">{event.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Visual Analytics Graph */}
      {activeTab === 'analytics' && graphStats && (
        <div className="space-y-6">
          <SeatsEnrolledChart graphData={graphStats.branch_graph} title={`${institution.name} Capacity & Enrolled Comparison`} />
        </div>
      )}
    </div>
  );
};

export default InstitutionDetailView;
