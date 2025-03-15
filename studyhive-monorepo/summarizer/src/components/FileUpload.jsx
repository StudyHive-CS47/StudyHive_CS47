import React, { useState } from 'react';

function FileUpload({ onTextChange, inputText }) {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlStatus, setUrlStatus] = useState(''); // 'success' or 'error'

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => onTextChange(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleUrlSubmit = async (url) => {
    try {
      setIsUrlLoading(true);
      setUrlStatus('');
      
      // Handle Google Docs URL
      if (url.includes('docs.google.com')) {
        // Extract document ID
        const docId = url.match(/\/d\/(.*?)(\/|$)/)?.[1];
        if (!docId) {
          throw new Error('Invalid Google Docs URL');
        }

        try {
          // Try to fetch using export API
          const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
          const response = await fetch(exportUrl);
          
          if (!response.ok) {
            throw new Error('Failed to access document. Make sure it\'s publicly accessible.');
          }

          const text = await response.text();
          if (!text.trim()) {
            throw new Error('No content found in the document');
          }

          onTextChange(text);
          setUrlInput('');
          setUrlStatus('success');
          return;

        } catch (error) {
          throw new Error(
            'Could not access Google Doc. Please ensure:\n' +
            '1. The document is shared with "Anyone with the link"\n' +
            '2. The URL is correct\n' +
            '3. The document contains text content'
          );
        }
      }

      // For other URLs
      try {
        // First try without CORS proxy
        const response = await fetch(url);
        const text = await response.text();
        onTextChange(text);
        setUrlInput('');
        setUrlStatus('success');
        return;
      } catch (error) {
        // If direct fetch fails, try with CORS proxy
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const response = await fetch(corsProxy + url, {
          headers: {
            'Origin': window.location.origin
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch URL content');
        }

        const contentType = response.headers.get('content-type');
        let text;

        if (contentType?.includes('text/html')) {
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          // Remove unwanted elements
          doc.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
          // Get text from body
          text = doc.body.textContent
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          text = await response.text();
        }

        if (!text.trim()) {
          throw new Error('No text content found in the URL');
        }

        onTextChange(text);
        setUrlInput('');
        setUrlStatus('success');
      }

    } catch (error) {
      console.error('Error fetching URL:', error);
      setUrlStatus('error');
      alert(error.message || 'Error fetching URL content. Please check the URL and try again.');
    } finally {
      setIsUrlLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
              </svg>
            </div>
          </div>
          <span>Text</span>
        </button>

        <button 
          className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
          </div>
          <span>File</span>
        </button>

        <button 
          className={`tab-button ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
              </svg>
            </div>
          </div>
          <span>URL</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'text' && (
          <textarea
            value={inputText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter text to summarize..."
          />
        )}
        {activeTab === 'file' && (
          <div className="file-input-wrapper">
            {!selectedFile ? (
              <label className="file-input-label">
                <svg viewBox="0 0 24 24" width="24" height="24" className="upload-icon">
                  <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,19.5V17.5H10.5V19.5H8L12,23L16,19.5H13.5M13,9H7V7H13V9M13,11H7V13H13V11M18,15H6V5H13V8H18V15Z" />
                </svg>
                <span>Choose File</span>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  accept=".txt,.doc,.docx,.pdf" 
                />
              </label>
            ) : (
              <div className="selected-file">
                <svg viewBox="0 0 24 24" width="24" height="24" className="file-icon">
                  <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M14,20H6V4H13V9H18V20Z" />
                </svg>
                <span className="file-name">{selectedFile.name}</span>
                <button 
                  className="remove-file"
                  onClick={() => {
                    setSelectedFile(null);
                    onTextChange('');
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'url' && (
          <div className="url-input-wrapper">
            <div className="url-input-container">
              <input
                type="url"
                className={`url-input ${urlStatus}`}
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlStatus('');
                }}
                placeholder="Enter document URL"
                disabled={isUrlLoading}
              />
              <button 
                className="proceed-btn"
                onClick={() => urlInput && handleUrlSubmit(urlInput)}
                disabled={isUrlLoading || !urlInput}
              >
                {isUrlLoading ? (
                  <div className="url-loading" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
                    </svg>
                    <span>Proceed</span>
                  </>
                )}
              </button>
            </div>
            {urlStatus === 'success' && (
              <div className="url-status success">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                </svg>
                URL content loaded successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload; 