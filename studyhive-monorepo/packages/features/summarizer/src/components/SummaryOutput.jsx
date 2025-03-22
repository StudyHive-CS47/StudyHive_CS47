import React from 'react';

const SummaryOutput = ({ 
  summary, 
  onRegenerate, 
  onDownload, 
  isLoading,
  wordCount
}) => {
  if (isLoading) {
    return (
      <div className="summary-output">
        <div className="summary-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="summary-output">
        <div className="summary-content">
          <div className="summary-placeholder">
            Your summarized text will appear here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-output">
      <div className="summary-header">
        <span className="summary-title">Summary</span>
        <div className="summary-info">
          <span className="word-count">{wordCount} words</span>
          <div className="summary-actions">
            <button className="action-button" onClick={onRegenerate}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Regenerate
            </button>
            <button className="action-button" onClick={onDownload}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
      <div className="summary-content">
        {summary}
      </div>
    </div>
  );
};

export default SummaryOutput; 