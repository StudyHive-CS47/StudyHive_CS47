import React from 'react';
import LoadingHoneycomb from './LoadingHoneycomb/LoadingHoneycomb';

function SummaryOutput({ summary, onRegenerate, onDownload, isLoading }) {
  if (isLoading) {
    return (
      <div className="summary-output">
        <div className="loading-container">
          <LoadingHoneycomb />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="summary-output">
      <div className="summary-text">
        {summary}
      </div>
      <div className="summary-actions">
        <button onClick={onRegenerate} className="button regenerate-btn">
          <div className="dots_border"></div>
          <span className="text_button">Regenerate</span>
        </button>
        <button onClick={onDownload} className="button download-btn">
          <div className="dots_border"></div>
          <span className="text_button">Download</span>
        </button>
      </div>
    </div>
  );
}

export default SummaryOutput; 