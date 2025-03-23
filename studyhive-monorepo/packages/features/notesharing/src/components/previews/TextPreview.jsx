import React, { useState, useEffect } from 'react';

const TextPreview = ({ url, file }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Failed to load text content');
        console.error('Text preview error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  const changeFontSize = (delta) => {
    setFontSize(prevSize => Math.min(Math.max(10, prevSize + delta), 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => changeFontSize(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Font -
        </button>
        <span className="flex items-center">
          Font Size: {fontSize}px
        </span>
        <button
          onClick={() => changeFontSize(1)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Font +
        </button>
      </div>

      <div className="w-full border rounded-lg shadow-lg overflow-auto max-h-[80vh] bg-gray-50">
        <pre
          className="p-4 font-mono whitespace-pre-wrap break-words"
          style={{ fontSize: `${fontSize}px` }}
        >
          {content}
        </pre>
      </div>
    </div>
  );
};

export default TextPreview; 