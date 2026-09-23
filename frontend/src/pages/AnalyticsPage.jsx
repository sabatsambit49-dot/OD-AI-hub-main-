import React, { useState, useEffect } from 'react';
import { institutionApi } from '../api/institutionApi';
import { graphApi } from '../api/graphApi';
import SeatsEnrolledChart from '../components/analytics/SeatsEnrolledChart';
import CapacityMetricCards from '../components/analytics/CapacityMetricCards';
import EmptyState from '../components/common/EmptyState';

const AnalyticsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstId, setSelectedInstId] = useState('');
  const [graphStats, setGraphStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await institutionApi.getInstitutions();
        setInstitutions(data);
        if (data.length > 0) {
          setSelectedInstId(data[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (!selectedInstId) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await graphApi.getInstitutionStats(selectedInstId);
        setGraphStats(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedInstId]);

  const handleExportGraphCsv = async () => {
    if (!graphStats) return;
    try {
      const blob = await graphApi.exportGraphCsv(graphStats.branch_graph);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `graph_analytics_${selectedInstId}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">insights</span>
            Deep Visual Analytics Hub
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Real-time visual data metrics comparing total seats versus enrolled student strength.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Select Institution */}
          <select
            value={selectedInstId}
            onChange={(e) => setSelectedInstId(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>

          {graphStats && (
            <button
              onClick={handleExportGraphCsv}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </div>
      ) : !graphStats || institutions.length === 0 ? (
        <EmptyState
          title="No Analytics Available"
          description="Populate institution courses and academic years via the Management Console to automatically generate graph analytics."
          icon="analytics"
        />
      ) : (
        <div className="space-y-6">
          <CapacityMetricCards
            totalSeats={graphStats.total_seats}
            totalEnrolled={graphStats.total_enrolled}
            totalCourses={graphStats.total_courses}
            occupancyRate={graphStats.occupancy_rate}
          />
          <SeatsEnrolledChart
            graphData={graphStats.branch_graph}
            title={`${graphStats.institution_name} - Seat Allocation vs Student Strength`}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
