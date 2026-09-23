import React from 'react';

const CapacityMetricCards = ({ totalSeats = 0, totalEnrolled = 0, totalCourses = 0, occupancyRate = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">event_seat</span>
        </div>
        <div>
          <span className="font-label text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">Total Approved Seats</span>
          <span className="font-headline text-2xl font-bold text-on-surface">{totalSeats.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">groups</span>
        </div>
        <div>
          <span className="font-label text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">Students Enrolled</span>
          <span className="font-headline text-2xl font-bold text-on-surface">{totalEnrolled.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">percent</span>
        </div>
        <div>
          <span className="font-label text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">Seat Occupancy</span>
          <span className="font-headline text-2xl font-bold text-on-surface">{occupancyRate}%</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">auto_stories</span>
        </div>
        <div>
          <span className="font-label text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">Offered Courses</span>
          <span className="font-headline text-2xl font-bold text-on-surface">{totalCourses}</span>
        </div>
      </div>
    </div>
  );
};

export default CapacityMetricCards;
