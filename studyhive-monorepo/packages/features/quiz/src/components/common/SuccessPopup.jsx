import React from 'react';

function SuccessPopup({ message, code, onClose }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[#091057] mb-4">Success!</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex items-center gap-4 mb-6">
          <code className="bg-gray-100 px-4 py-2 rounded flex-1">{code}</code>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
