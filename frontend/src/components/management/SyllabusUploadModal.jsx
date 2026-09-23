import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { syllabusApi } from '../../api/syllabusApi';
import { hierarchyApi } from '../../api/hierarchyApi';

const SyllabusUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [branches, setBranches] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await hierarchyApi.getBranches();
        setBranches(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchBranches();
  }, [isOpen]);

  useEffect(() => {
    const fetchYears = async () => {
      if (selectedBranch) {
        try {
          const data = await hierarchyApi.getAcademicYears(selectedBranch);
          setAcademicYears(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setAcademicYears([]);
      }
    };
    fetchYears();
  }, [selectedBranch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedYear) {
      setError("Please select an Academic Year.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('academic_year_id', selectedYear);
      formData.append('title', title);
      formData.append('content_text', contentText || '');
      if (file) {
        formData.append('file', file);
      }

      await syllabusApi.uploadSyllabus(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Syllabus Entry (PDF)">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-sm font-body">{error}</div>}

        <div>
          <label className="block text-sm font-label font-semibold text-on-surface mb-1">Filter Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="">Select Branch...</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-label font-semibold text-on-surface mb-1">Target Academic Year</label>
          <select
            required
            disabled={!selectedBranch}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
          >
            <option value="">Select Academic Year...</option>
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>{y.year_label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-label font-semibold text-on-surface mb-1">Syllabus Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Data Structures & Algorithms Syllabus 2026..."
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-label font-semibold text-on-surface mb-1">Overview / Structured Content</label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Key topic summary or module outline..."
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-label font-semibold text-on-surface mb-1">PDF File (Max 10MB)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-container/20 file:text-primary hover:file:bg-primary-container/30 cursor-pointer"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label text-sm font-semibold hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            {loading ? 'Uploading...' : 'Upload Syllabus'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SyllabusUploadModal;
