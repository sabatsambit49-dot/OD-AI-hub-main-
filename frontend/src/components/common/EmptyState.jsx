import React from 'react';

const EmptyState = ({ title = "No Data Found", description = "No entries exist yet in this section.", icon = "folder_off", actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-2xl max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{title}</h3>
      <p className="font-body text-sm text-on-surface-variant mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary font-label font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
