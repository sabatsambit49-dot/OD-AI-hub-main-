import React, { useState } from 'react';
import Modal from '../common/Modal';
import {
  FileText,
  UploadCloud,
  ExternalLink,
  Download,
  Calendar,
  Building2,
  Tag,
  Award,
  Edit3,
  Trash2,
  Copy,
  Check,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProblemStatementDetailModal = ({
  isOpen,
  onClose,
  statement,
  onEdit,
  onDelete
}) => {
  const { isEditor, isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !statement) return null;

  const handleCopyText = () => {
    if (statement.description) {
      navigator.clipboard.writeText(statement.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Problem Statement Details"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Block */}
        <div className="border-b border-outline-variant/20 pb-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {statement.category && (
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-label font-bold rounded-full flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {statement.category}
              </span>
            )}
            {statement.difficulty && (
              <span className={`px-3 py-1 text-xs font-label font-bold rounded-full border ${getDifficultyColor(statement.difficulty)} flex items-center gap-1.5`}>
                <Award className="w-3.5 h-3.5" />
                {statement.difficulty}
              </span>
            )}
            {statement.organization && (
              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs font-label font-medium rounded-full flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {statement.organization}
              </span>
            )}
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface leading-snug">
            {statement.title}
          </h2>

          {statement.created_at && (
            <p className="text-xs text-on-surface-variant font-label mt-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Published {new Date(statement.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          )}
        </div>

        {/* Content Section: Text Description */}
        {statement.description && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Problem Description & Requirements
              </h3>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 text-xs font-label font-semibold text-on-surface-variant hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-surface-container-high"
                title="Copy text description"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="prose max-w-none text-on-surface font-body text-base whitespace-pre-wrap leading-relaxed">
              {statement.description}
            </div>
          </div>
        )}

        {/* Content Section: PDF Document */}
        {statement.file_url && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Attached PDF Document
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Full specification document / problem guidelines
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={statement.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-label font-semibold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <a
                  href={statement.file_url}
                  download
                  className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-label font-semibold flex items-center gap-1.5 hover:bg-surface-container-highest transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>

            {/* Embedded PDF preview */}
            <div className="w-full h-96 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low">
              <iframe
                src={`${statement.file_url}#toolbar=0`}
                title="Problem Statement PDF"
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Bottom Bar with Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            {isEditor && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(statement);
                  }}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2.5 rounded-xl font-label font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Statement
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete(statement.id);
                  }}
                  className="bg-error-container/30 hover:bg-error-container text-error px-4 py-2.5 rounded-xl font-label font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Statement
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-label font-semibold text-sm bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProblemStatementDetailModal;
