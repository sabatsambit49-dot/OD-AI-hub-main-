import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { UploadCloud, FileText, X, AlertCircle, Loader2, CheckCircle2, FileUp } from 'lucide-react';
import { createProblemStatement, updateProblemStatement } from '../../api/problemStatementApi';

const DEFAULT_CATEGORIES = [
  'Artificial Intelligence / ML',
  'Smart Cities & IoT',
  'Healthcare & Medicine',
  'Agriculture & Rural Tech',
  'Cybersecurity & Blockchain',
  'Education & EdTech',
  'Clean Energy & Environment',
  'Robotics & Automation',
  'Web & Mobile Applications',
  'Disaster Management',
  'Open Innovation'
];

const AddProblemStatementModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [organization, setOrganization] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        if (DEFAULT_CATEGORIES.includes(initialData.category)) {
          setCategory(initialData.category);
          setCustomCategory('');
        } else if (initialData.category) {
          setCategory('__CUSTOM__');
          setCustomCategory(initialData.category);
        } else {
          setCategory('');
          setCustomCategory('');
        }
        setOrganization(initialData.organization || '');
        setDifficulty(initialData.difficulty || 'Intermediate');
        setDescription(initialData.description || '');
        setExistingFileUrl(initialData.file_url || null);
        setSelectedFile(null);
        setRemoveFile(false);
      } else {
        setTitle('');
        setCategory(DEFAULT_CATEGORIES[0]);
        setCustomCategory('');
        setOrganization('');
        setDifficulty('Intermediate');
        setDescription('');
        setSelectedFile(null);
        setExistingFileUrl(null);
        setRemoveFile(false);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file (.pdf).');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError('File size exceeds the 25MB limit.');
        return;
      }
      setSelectedFile(file);
      setRemoveFile(false);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file (.pdf).');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError('File size exceeds the 25MB limit.');
        return;
      }
      setSelectedFile(file);
      setRemoveFile(false);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the problem statement.');
      return;
    }

    const finalCategory = category === '__CUSTOM__' ? customCategory.trim() : category;

    // Must have either text description or PDF or both
    if (!description.trim() && !selectedFile && !existingFileUrl) {
      setError('Please provide at least a text description or upload a PDF document (or both).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (finalCategory) formData.append('category', finalCategory);
      if (organization) formData.append('organization', organization.trim());
      if (difficulty) formData.append('difficulty', difficulty);
      if (description) formData.append('description', description.trim());

      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (removeFile) {
        formData.append('remove_file', 'true');
      }

      if (initialData) {
        await updateProblemStatement(initialData.id, formData);
      } else {
        await createProblemStatement(formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.response?.data?.detail || 'Failed to save problem statement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Problem Statement' : 'Add New Problem Statement'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-primary-container/20 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <FileUp className="w-5 h-5" />
          </div>
          <div className="text-sm font-body text-on-surface-variant">
            <span className="font-bold text-on-surface">Dual Format Support:</span> You can provide a text description, upload a PDF document, or provide both together for maximum detail!
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-1.5">
            Problem Statement Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Smart AI Waste Segregation & Collection System"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Category & Difficulty Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-label font-bold text-on-surface mb-1.5">
              Category / Domain
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__CUSTOM__">+ Custom Category...</option>
            </select>

            {category === '__CUSTOM__' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category name"
                className="mt-2 w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-label font-bold text-on-surface mb-1.5">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="Beginner">Beginner (College / Freshers)</option>
              <option value="Intermediate">Intermediate (Undergraduate)</option>
              <option value="Advanced">Advanced (Industry / Research)</option>
            </select>
          </div>
        </div>

        {/* Organization / Origin */}
        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-1.5">
            Organization / Department / Hackathon Source (Optional)
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. Smart India Hackathon / Tech Council / Odisha Innovation Hub"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Section: Option 1 - Text Description */}
        <div className="border border-outline-variant/40 rounded-2xl p-5 bg-surface-container-lowest space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <label className="text-sm font-label font-bold text-on-surface">
                Option 1: Text Description & Scope
              </label>
            </div>
            <span className="text-xs font-label text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
              Markdown / Text Supported
            </span>
          </div>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem statement, background context, expected deliverables, target users, technical constraints, and evaluation criteria..."
            className="w-full bg-surface text-on-surface border border-outline rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-body leading-relaxed"
          />
        </div>

        {/* Section: Option 2 - PDF Document */}
        <div className="border border-outline-variant/40 rounded-2xl p-5 bg-surface-container-lowest space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              <label className="text-sm font-label font-bold text-on-surface">
                Option 2: PDF Document Attachment
              </label>
            </div>
            <span className="text-xs font-label text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
              Max 25MB (.pdf)
            </span>
          </div>

          {/* Existing PDF notice if editing */}
          {existingFileUrl && !removeFile && !selectedFile && (
            <div className="p-3 bg-secondary-container/20 border border-secondary-container/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-on-surface">
                <FileText className="w-4 h-4 text-primary" />
                <span>Existing attached PDF is preserved</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline font-bold px-2 py-1 hover:text-primary-container"
                >
                  Preview Current
                </a>
                <button
                  type="button"
                  onClick={() => setRemoveFile(true)}
                  className="text-xs text-error font-bold px-2 py-1 hover:bg-error-container/20 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {removeFile && (
            <div className="p-3 bg-error-container/20 border border-error/20 rounded-xl flex items-center justify-between text-xs text-error">
              <span>PDF attachment will be removed upon save.</span>
              <button
                type="button"
                onClick={() => setRemoveFile(false)}
                className="underline font-bold"
              >
                Undo
              </button>
            </div>
          )}

          {/* Selected New File */}
          {selectedFile ? (
            <div className="p-3.5 bg-primary-container/20 border border-primary/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-on-surface-variant">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1 text-on-surface-variant hover:text-error transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-primary bg-primary-container/20'
                  : 'border-outline-variant/60 hover:border-primary/60 bg-surface/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <UploadCloud className="w-9 h-9 text-primary/70 mx-auto mb-2" />
              <p className="font-label font-semibold text-sm text-on-surface">
                Click to upload PDF or drag and drop
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Official problem statement brief, challenge specs, guidelines (.pdf)
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-label font-semibold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Update Problem Statement' : 'Publish Problem Statement'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProblemStatementModal;
