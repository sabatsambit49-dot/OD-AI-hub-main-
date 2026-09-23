import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileText,
  UploadCloud,
  Plus,
  Tag,
  Award,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
  Loader2,
  AlertCircle,
  Lightbulb,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProblemStatements,
  fetchCategories,
  deleteProblemStatement
} from '../api/problemStatementApi';
import AddProblemStatementModal from '../components/problemStatements/AddProblemStatementModal';
import ProblemStatementDetailModal from '../components/problemStatements/ProblemStatementDetailModal';

const ProblemStatementsPage = () => {
  const { isEditor, user } = useAuth();

  const [statements, setStatements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [formatFilter, setFormatFilter] = useState('all'); // all, pdf, text

  // Modals & Selection
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingStatement, setEditingStatement] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listRes, catRes] = await Promise.all([
        fetchProblemStatements(),
        fetchCategories()
      ]);
      setStatements(listRes.problem_statements || []);
      setCategories(catRes || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load problem statements:', err);
      setError('Failed to load problem statements. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredStatements = useMemo(() => {
    return statements.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.organization && item.organization.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesDifficulty =
        !selectedDifficulty ||
        (item.difficulty && item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

      const matchesFormat =
        formatFilter === 'all' ||
        (formatFilter === 'pdf' && Boolean(item.file_url)) ||
        (formatFilter === 'text' && Boolean(item.description));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFormat;
    });
  }, [statements, searchQuery, selectedCategory, selectedDifficulty, formatFilter]);

  const handleOpenAddModal = () => {
    setEditingStatement(null);
    setAddModalOpen(true);
  };

  const handleEdit = (statement) => {
    setEditingStatement(statement);
    setAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem statement? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteProblemStatement(id);
      setStatements((prev) => prev.filter((s) => s.id !== id));
      if (selectedStatement?.id === id) {
        setSelectedStatement(null);
        setDetailModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete problem statement:', err);
      alert('Failed to delete problem statement. Please check your permissions.');
    }
  };

  const handleCardClick = (statement) => {
    setSelectedStatement(statement);
    setDetailModalOpen(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'advanced':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
      case 'intermediate':
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-3xl shadow-md text-on-primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2.5 rounded-2xl bg-on-primary/10 backdrop-blur-md">
                  <Lightbulb className="w-8 h-8" />
                </span>
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                  Problem Statements
                </h1>
              </div>
              <p className="text-on-primary/90 text-base md:text-lg max-w-2xl font-body">
                Explore real-world challenges, hackathon briefs, and project themes. Add problem statements directly with text descriptions, PDF document attachments, or both!
              </p>
            </div>

            {/* Add button visible for admins/editors or any authenticated user */}
            <button
              onClick={handleOpenAddModal}
              className="bg-on-primary text-primary px-6 py-3.5 rounded-2xl font-label font-bold flex items-center gap-2.5 hover:bg-on-primary/95 transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add Problem Statement</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-on-surface-variant font-label text-lg">Loading problem statements...</p>
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
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  {(searchQuery || selectedCategory || selectedDifficulty || formatFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setSelectedDifficulty('');
                        setFormatFilter('all');
                      }}
                      className="text-xs font-label font-bold text-primary hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Search Input */}
                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    Search Keywords
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Title, keywords, org..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface text-on-surface border border-outline rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    Category / Domain
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Categories ({categories.length})</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="block text-sm font-label font-bold text-on-surface mb-2">
                    Content Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface rounded-xl border border-outline">
                    <button
                      type="button"
                      onClick={() => setFormatFilter('all')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-label font-bold transition-all text-center ${
                        formatFilter === 'all'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormatFilter('pdf')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-label font-bold transition-all text-center ${
                        formatFilter === 'pdf'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormatFilter('text')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-label font-bold transition-all text-center ${
                        formatFilter === 'text'
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Text
                    </button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-outline-variant/20">
                  <div className="text-xs font-label text-on-surface-variant uppercase tracking-wider font-semibold">
                    Matching Results
                  </div>
                  <div className="text-2xl font-headline font-bold text-on-surface mt-1">
                    {filteredStatements.length}
                    <span className="text-sm font-normal text-on-surface-variant ml-1.5">
                      statement{filteredStatements.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid Area */}
            <div className="lg:col-span-3 space-y-6">
              {filteredStatements.length === 0 ? (
                <div className="text-center p-12 md:p-16 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/60 shadow-sm space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">
                    No Problem Statements Found
                  </h3>
                  <p className="text-on-surface-variant font-body max-w-md mx-auto text-sm leading-relaxed">
                    {statements.length === 0
                      ? 'No problem statements have been added yet. Click the button below to add the first one with text and/or a PDF attachment!'
                      : 'No statements match your current search or filter criteria. Try adjusting your search query or reset filters.'}
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add Problem Statement
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredStatements.map((statement, idx) => (
                    <div
                      key={statement.id}
                      onClick={() => handleCardClick(statement)}
                      className="bg-surface-container-lowest hover:bg-surface-container-low/60 transition-all p-6 rounded-3xl shadow-sm border border-outline-variant/30 cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div>
                        {/* Top Meta row with sequential index badge */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
                            #{idx + 1}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 justify-end">
                            {statement.difficulty && (
                              <span className={`px-2.5 py-0.5 text-xs font-label font-bold rounded-full border ${getDifficultyColor(statement.difficulty)}`}>
                                {statement.difficulty}
                              </span>
                            )}
                            {statement.category && (
                              <span className="px-2.5 py-0.5 bg-primary-container/60 text-primary text-xs font-label font-bold rounded-full truncate max-w-[150px]">
                                {statement.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-headline font-bold text-on-surface text-lg mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {statement.title}
                        </h3>

                        {/* Organization */}
                        {statement.organization && (
                          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-label mb-3">
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{statement.organization}</span>
                          </div>
                        )}

                        {/* Text preview if available */}
                        {statement.description && (
                          <p className="text-on-surface-variant font-body text-sm line-clamp-3 mb-4 leading-relaxed">
                            {statement.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: format badges & detail prompt */}
                      <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {statement.file_url && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(statement.file_url, '_blank');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-label font-bold rounded-lg transition-colors cursor-pointer"
                              title="Click to open PDF directly"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              PDF Attached
                            </span>
                          )}

                          {statement.description && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-xs font-label font-medium rounded-lg">
                              <FileText className="w-3.5 h-3.5" />
                              Text Details
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-primary text-xs font-label font-bold group-hover:translate-x-1 transition-transform">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add / Edit Modal */}
        <AddProblemStatementModal
          isOpen={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setEditingStatement(null);
          }}
          onSuccess={loadData}
          initialData={editingStatement}
        />

        {/* Details Modal */}
        <ProblemStatementDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedStatement(null);
          }}
          statement={selectedStatement}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProblemStatementsPage;
