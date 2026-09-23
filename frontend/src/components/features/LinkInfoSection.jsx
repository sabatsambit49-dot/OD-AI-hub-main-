import React, { useState } from 'react';
import { linksApi } from '../../api/linksApi';
import { useAuth } from '../../context/AuthContext';

const LinkInfoSection = () => {
  const { isEditor, isAdmin } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Feature restricted to editor and admin
  if (!isEditor && !isAdmin) return null;

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await linksApi.processLink(url);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to fetch link info. Ensure the URL is correct and public.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm mb-8">
      <div className="mb-6">
        <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">link</span>
          Link Information Extractor
        </h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Paste a URL below to automatically extract the page title, description, image, and main content.
        </p>
      </div>

      <form onSubmit={handleFetch} className="flex gap-3 mb-6">
        <input
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm font-body text-on-surface focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3 rounded-xl hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-lg">search</span>
          )}
          {loading ? 'Processing...' : 'Fetch'}
        </button>
      </form>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 font-body text-sm mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {result.image ? (
              <div className="w-full md:w-1/3 h-48 md:h-auto bg-surface-container-highest shrink-0 border-b md:border-b-0 md:border-r border-outline-variant/20">
                <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full md:w-1/3 h-48 md:h-auto bg-surface-container-highest flex items-center justify-center shrink-0 text-on-surface-variant border-b md:border-b-0 md:border-r border-outline-variant/20">
                <span className="material-symbols-outlined text-4xl opacity-30">image</span>
              </div>
            )}
            
            <div className="p-6 flex flex-col justify-center flex-1">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2 leading-tight">
                {result.title || "No Title Found"}
              </h3>
              <p className="font-body text-sm text-on-surface-variant mb-4 italic border-l-2 border-primary/40 pl-3">
                {result.description || "No description available."}
              </p>
              <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 text-xs text-on-surface font-body leading-relaxed max-h-32 overflow-y-auto shadow-inner">
                <span className="font-bold block mb-1.5 text-primary">Extracted Content Preview:</span>
                {result.content ? result.content : "No main text content found."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkInfoSection;
