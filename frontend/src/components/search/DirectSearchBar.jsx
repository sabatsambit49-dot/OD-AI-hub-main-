import React, { useState } from 'react';

const DirectSearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative flex items-center">
      <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-2xl pointer-events-none">search</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Lookup institution by name or location (e.g. Stanford, Harvard)..."
        className="w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body text-base rounded-2xl pl-12 pr-28 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all"
      />
      <button
        type="submit"
        className="absolute right-2.5 bg-primary hover:bg-primary-container text-on-primary font-label font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
      >
        Search
      </button>
    </form>
  );
};

export default DirectSearchBar;
