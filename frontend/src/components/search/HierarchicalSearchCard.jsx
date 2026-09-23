import React, { useState, useEffect } from 'react';
import { hierarchyApi } from '../../api/hierarchyApi';

const HierarchicalSearchCard = ({ onSearch }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statesData, typesData] = await Promise.all([
          hierarchyApi.getStates(),
          hierarchyApi.getInstitutionTypes()
        ]);
        setStates(statesData);
        setTypes(typesData);
      } catch (err) {
        console.error("Error loading search hierarchy:", err);
      }
    };
    fetchInitialData();
  }, []);

  // When State changes, fetch Districts for that State
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const data = await hierarchyApi.getDistricts(selectedState);
        setDistricts(data);
        setSelectedDistrict('');
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      state_id: selectedState ? parseInt(selectedState) : null,
      district_id: selectedDistrict ? parseInt(selectedDistrict) : null,
      type_id: selectedType ? parseInt(selectedType) : null,
    });
  };

  return (
    <div className="glass-panel w-full max-w-5xl rounded-[1.5rem] p-8 md:p-12 shadow-[0_24px_40px_-12px_rgba(27,28,29,0.06)] relative overflow-visible mx-auto">
      <div className="absolute -top-4 right-8 bg-tertiary text-on-tertiary font-label text-xs font-bold px-4 py-1 rounded-full shadow-sm flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">verified</span>
        Curated Hierarchy Index
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: State */}
          <div className="flex flex-col gap-2 text-left">
            <label className="font-label text-sm text-on-surface-variant font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">1</span>
              State Jurisdiction
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-base rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:bg-surface-container-low/50"
              >
                <option value="">Select Region / State...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Step 2: District */}
          <div className="flex flex-col gap-2 text-left">
            <label className="font-label text-sm text-on-surface-variant font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">2</span>
              Administrative District
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState || loadingDistricts}
                className={`w-full appearance-none bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-base rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  !selectedState ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-container-low/50'
                }`}
              >
                <option value="">
                  {loadingDistricts ? 'Loading Districts...' : selectedState ? 'Select District...' : 'Select State First'}
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Step 3: Institution Type */}
          <div className="flex flex-col gap-2 text-left">
            <label className="font-label text-sm text-on-surface-variant font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">3</span>
              Classification
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-base rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:bg-surface-container-low/50"
              >
                <option value="">Select Type (College/School)...</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex justify-center border-t border-outline-variant/20">
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-label text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden min-w-[280px]"
          >
            <span>Search Institutions</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default HierarchicalSearchCard;
