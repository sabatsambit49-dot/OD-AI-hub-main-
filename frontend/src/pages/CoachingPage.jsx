import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Building2, Loader2, AlertCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCoachings, fetchCities } from '../api/coachingApi';
import AddCoachingModal from '../components/coaching/AddCoachingModal';
import CoachingDetailPanel from '../components/coaching/CoachingDetailPanel';

const CoachingPage = () => {
  const { isEditor, isAdmin } = useAuth();
  const [coachings, setCoachings] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoaching, setSelectedCoaching] = useState(null);
  const [addCoachingModalOpen, setAddCoachingModalOpen] = useState(false);
  const [editingCoaching, setEditingCoaching] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coachingsData, citiesData] = await Promise.all([
        fetchCoachings(selectedCity || undefined),
        fetchCities()
      ]);
      setCoachings(coachingsData.coachings || coachingsData || []);
      setCities(citiesData);
      setError(null);
    } catch (err) {
      setError('Failed to load coaching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCity]);

  const filteredCoachings = useMemo(() => {
    return coachings.filter(coaching => {
      const matchesSearch = coaching.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [coachings, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingCoaching(null);
    setAddCoachingModalOpen(true);
  };

  const handleEditCoaching = (coaching) => {
    setEditingCoaching(coaching);
    setAddCoachingModalOpen(true);
  };

  const handleDeleteCoaching = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coaching center? This will also delete all its courses.')) return;
    try {
      const { deleteCoaching } = await import('../api/coachingApi');
      await deleteCoaching(id);
      setCoachings(prev => prev.filter(c => c.id !== id));
      if (selectedCoaching?.id === id) {
        setSelectedCoaching(null);
      }
    } catch (err) {
      console.error('Failed to delete coaching:', err);
      alert('Failed to delete coaching center');
    }
  };

  const handleCoachingSaved = () => {
    setAddCoachingModalOpen(false);
    setEditingCoaching(null);
    loadData();
  };

  const handleCoachingSelect = (coaching) => {
    setSelectedCoaching(coaching);
  };

  const handleCloseDetail = () => {
    setSelectedCoaching(null);
  };

  const handleDetailRefresh = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-3xl shadow-md text-on-primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-headline text-4xl font-bold mb-4 flex items-center gap-3">
                <Building2 className="w-10 h-10" />
                Coaching Center Finder
              </h1>
              <p className="text-on-primary/90 text-lg max-w-2xl font-body">
                Discover coaching centers, their courses, prices, and syllabi. Filter by city or search by name.
              </p>
            </div>
            {isEditor && (
              <button
                onClick={handleOpenAddModal}
                className="bg-on-primary text-primary px-6 py-3 rounded-xl font-label font-semibold flex items-center gap-2 hover:bg-on-primary/90 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Coaching
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-on-surface-variant font-label text-lg">Loading coaching centers...</p>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex items-center gap-4">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold font-headline text-lg">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/30 sticky top-24 space-y-6">
                <h2 className="font-headline text-xl font-semibold text-on-surface mb-2">Filters</h2>

                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    Search Coaching Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="e.g. Aakash..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface text-on-surface border border-outline rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3">Results</h3>
                  <p className="text-on-surface text-lg font-bold">{filteredCoachings.length} coaching center{filteredCoachings.length !== 1 ? 's' : ''} found</p>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3 space-y-6">
              {selectedCoaching ? (
                <CoachingDetailPanel
                  coaching={selectedCoaching}
                  onClose={handleCloseDetail}
                  onRefresh={handleDetailRefresh}
                />
              ) : (
                <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-headline text-2xl font-bold text-on-surface">
                      Coaching Centers
                    </h2>
                  </div>

                  {filteredCoachings.length === 0 ? (
                    <div className="text-center p-12 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/50">
                      <Building2 className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                      <h3 className="font-headline text-2xl font-bold text-on-surface-variant mb-2">No Coaching Centers Found</h3>
                      <p className="text-on-surface-variant font-body max-w-md mx-auto">
                        {selectedCity ? `No coaching centers found in ${selectedCity}.` : 'No coaching centers match your search criteria.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCoachings.map((coaching, idx) => (
                        <div
                          key={coaching.id}
                          onClick={() => handleCoachingSelect(coaching)}
                          className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors p-6 rounded-2xl shadow-sm border border-outline-variant/30 cursor-pointer flex items-start gap-4 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-headline font-bold text-on-surface text-lg mb-1 leading-tight truncate">
                              {coaching.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-label mb-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{coaching.city || 'City not specified'}</span>
                            </div>
                            {coaching.address && (
                              <p className="text-on-surface-variant/70 text-sm font-body line-clamp-1">
                                {coaching.address}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-center p-2 text-on-surface-variant/50 group-hover:text-primary transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Coaching Modal */}
        {addCoachingModalOpen && (
          <AddCoachingModal
            isOpen={addCoachingModalOpen}
            onClose={() => {
              setAddCoachingModalOpen(false);
              setEditingCoaching(null);
            }}
            onSuccess={handleCoachingSaved}
            initialData={editingCoaching}
          />
        )}
      </div>
    </div>
  );
};

export default CoachingPage;