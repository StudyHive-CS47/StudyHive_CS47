import React, { useState, useRef } from 'react';

export default function FileUpload({ onFileContent }) {
  const [fileName, setFileName] = useState('');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    try {
      const text = await file.text();
      onFileContent(text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setUrlError('');
    setIsLoading(true);

    if (!url.trim()) {
      setUrlError('Please enter a URL');
      setIsLoading(false);
      return;
    }

    try {
      const urlObj = new URL(url);
      
      // Handle Google Docs URLs
      if (urlObj.hostname.includes('docs.google.com')) {
        if (!url.includes('/edit') && !url.includes('/view')) {
          setUrlError('Please make sure the Google Doc is publicly accessible and use the "Share" link');
          setIsLoading(false);
          return;
        }
        // Convert to export URL
        const docId = url.split('/d/')[1].split('/')[0];
        const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
        
        try {
          const response = await fetch(exportUrl);
          if (!response.ok) throw new Error('Failed to fetch document content');
          const text = await response.text();
          onFileContent(text);
        } catch (error) {
          setUrlError('Could not access the Google Doc. Please make sure it\'s publicly accessible');
        }
      }
      // Handle Microsoft Office Online URLs
      else if (urlObj.hostname.includes('office.com') || urlObj.hostname.includes('live.com')) {
        setUrlError('Microsoft Office Online documents are not supported yet. Please download and upload the file instead.');
      }
      // Handle PDF URLs
      else if (url.toLowerCase().endsWith('.pdf')) {
        setUrlError('PDF files are not supported yet. Please convert to text and try again.');
      }
      // Handle other URLs
      else {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch content');
          const text = await response.text();
          
          // Try to extract main content from HTML
          const doc = new DOMParser().parseFromString(text, 'text/html');
          const content = doc.body.textContent.trim();
          
          if (!content) {
            throw new Error('No text content found');
          }
          
          onFileContent(content);
        } catch (error) {
          setUrlError('Could not extract content from this URL. Please try a different format.');
        }
      }
    } catch (error) {
      setUrlError('Please enter a valid URL');
    }
    
    setIsLoading(false);
  };

  const handleTextChange = (text) => {
    setInputText(text);
    onFileContent(text);
  };

  const renderTextInput = () => (
    <div className="tab-content">
      <textarea
        placeholder="Enter or paste your text here..."
        value={inputText}
        onChange={(e) => handleTextChange(e.target.value)}
      />
    </div>
  );

  const renderFileInput = () => (
    <div className="tab-content">
      <div className="file-input-wrapper">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.doc,.docx,.pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <button 
          className="primary-button"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Choose File
        </button>
        {fileName && <p className="file-name">{fileName}</p>}
      </div>
    </div>
  );

  const renderUrlInput = () => (
    <div className="tab-content">
      <div className="url-input-wrapper">
        <form onSubmit={handleUrlSubmit} className="url-input-container">
          <input
            type="url"
            className={`url-input ${urlError ? 'error' : ''}`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter document URL (e.g., Google Docs)"
          />
          <button 
            type="submit" 
            className="fetch-button primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>
        
        {urlError && (
          <div className="url-error">
            {urlError}
          </div>
        )}
        
        <div className="url-info">
          <p>Supported document types:</p>
          <ul>
            <li>Google Docs (must be publicly accessible)</li>
            <li>Web pages with readable content</li>
          </ul>
          <p>Note: For best results, ensure documents are publicly accessible and contain plain text content.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="input-section">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Text
        </button>
        <button 
          className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          File
        </button>
        <button 
          className={`tab-button ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          URL
        </button>
      </div>
      {activeTab === 'text' && renderTextInput()}
      {activeTab === 'file' && renderFileInput()}
      {activeTab === 'url' && renderUrlInput()}
    </div>
  );
} 