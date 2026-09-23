import React, { useState } from 'react';
import { berhampurColleges } from '../../data/berhampur_colleges';

const BerhampurUniversitySection = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const districts = [
    'Gajapati',
    'Ganjam',
    'Kandhamal',
    'Koraput',
    'Malkangiri',
    'Nabarangpur',
    'Rayagada',
  ];

  const filteredColleges = selectedDistrict
    ? berhampurColleges.filter((college) => college.district === selectedDistrict)
    : [];

  return (
    <div className="w-full bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 mt-12 relative overflow-hidden group">
      {/* Background accents */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/30 text-primary font-label text-xs mb-3">
            <span className="material-symbols-outlined text-[14px]">school</span>
            Affiliated Colleges
          </div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
            Berhampur University
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Explore affiliated institutions across various districts.
          </p>
        </div>

        <div className="w-full md:w-64 shrink-0 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg pointer-events-none">
            location_on
          </span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full appearance-none bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface rounded-xl pl-12 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium border border-outline-variant/30 cursor-pointer shadow-sm"
          >
            <option value="">Select a District...</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {selectedDistrict ? (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface border-b border-outline-variant/40">
                <th className="py-4 px-5 font-label font-semibold text-sm w-16 text-center">Sl.</th>
                <th className="py-4 px-5 font-label font-semibold text-sm">College Name</th>
                <th className="py-4 px-5 font-label font-semibold text-sm w-48">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college, index) => (
                  <tr
                    key={college.sl}
                    className={`border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors ${
                      index % 2 === 0 ? 'bg-surface' : 'bg-surface/50'
                    }`}
                  >
                    <td className="py-3 px-5 text-sm text-on-surface-variant text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-5 text-sm text-on-surface font-medium">
                      {college.name}
                    </td>
                    <td className="py-3 px-5 text-sm">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-container/30 text-on-secondary-container text-xs font-medium">
                        {college.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-on-surface-variant text-sm">
                    No colleges found for this district.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-lowest/50">
          <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-3xl">map</span>
          </div>
          <h3 className="text-on-surface font-medium text-lg mb-1">Select a District</h3>
          <p className="text-on-surface-variant text-sm max-w-sm">
            Choose a district from the dropdown above to view all its affiliated colleges in Berhampur University.
          </p>
        </div>
      )}
    </div>
  );
};

export default BerhampurUniversitySection;
