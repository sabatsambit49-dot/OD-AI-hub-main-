import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { institutionApi } from '../api/institutionApi';
import InstitutionCard from '../components/institutions/InstitutionCard';
import DirectSearchBar from '../components/search/DirectSearchBar';
import EmptyState from '../components/common/EmptyState';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const stateId = searchParams.get('state_id');
  const districtId = searchParams.get('district_id');
  const typeId = searchParams.get('type_id');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const payload = {
          query: query || null,
          state_id: stateId ? parseInt(stateId) : null,
          district_id: districtId ? parseInt(districtId) : null,
          type_id: typeId ? parseInt(typeId) : null,
        };
        const results = await institutionApi.searchInstitutions(payload);
        setInstitutions(results);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, stateId, districtId, typeId]);

  const handleDirectSearch = (newTerm) => {
    setSearchParams({ q: newTerm });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      {/* Page Header & Search Filter */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-4">
          Institution Search Index
        </h1>
        <DirectSearchBar onSearch={handleDirectSearch} initialValue={query} />
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
        <span className="font-label text-sm text-on-surface-variant font-semibold">
          Showing {institutions.length} verified institution entries
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </div>
      ) : institutions.length === 0 ? (
        <EmptyState
          title="No Institutions Found"
          description="No institution matches your search filters. Try adjusting your region or search keywords, or manually add new entries via Management Console."
          icon="search_off"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
