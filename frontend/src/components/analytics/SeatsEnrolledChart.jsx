import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SeatsEnrolledChart = ({ graphData, title = "Capacity vs Enrolled Students Metrics" }) => {
  if (!graphData || !graphData.years || graphData.years.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-container-low/50 rounded-2xl text-on-surface-variant font-body text-sm">
        No seats or enrollment data available for visualization yet.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = graphData.years.map((year, idx) => {
    const item = { name: year };
    graphData.datasets.forEach((dataset) => {
      item[dataset.label] = dataset.data[idx] || 0;
    });
    return item;
  });

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-headline text-lg font-bold text-on-surface">{title}</h4>
          <p className="font-body text-xs text-on-surface-variant">Real-time Seat Capacity vs Student Enrollment Comparison</p>
        </div>
        <div className="bg-primary-container/10 px-3 py-1 rounded-full text-xs font-label font-bold text-primary">
          Occupancy Rate: {graphData.occupancy_rate}%
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d5" opacity={0.3} />
            <XAxis dataKey="name" stroke="#434653" fontSize={12} tickLine={false} />
            <YAxis stroke="#434653" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#c3c6d5',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Total Seats" fill="#3366cc" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Students Enrolled" fill="#d97706" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeatsEnrolledChart;
