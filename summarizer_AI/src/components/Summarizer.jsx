import React, { useState } from 'react';
import FileUpload from './FileUpload';
import LengthSlider from './LengthSlider';
import SummaryOutput from './SummaryOutput';

function Summarizer() {
  const [inputText, setInputText] = useState('');
  const [summaryLength, setSummaryLength] = useState(25);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_TOKEN = "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"; // Replace with your API token
  const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

  const handleSummarize = async () => {
    if (!inputText) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: inputText,
          parameters: {
            max_length: Math.floor(inputText.split(' ').length * (summaryLength / 100)),
            min_length: Math.floor(inputText.split(' ').length * (summaryLength / 200)),
          }
        }),
      });
      
      const data = await response.json();
      setSummary(Array.isArray(data) ? data[0].summary_text : data.summary_text);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Error generating summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="summarizer">
      <div className="input-section">
        <LengthSlider 
          value={summaryLength} 
          onChange={setSummaryLength} 
        />
        
        <FileUpload 
          onTextChange={setInputText} 
          inputText={inputText} 
        />
        
        <button 
          className="button summarize-btn"
          onClick={handleSummarize}
          disabled={!inputText || isLoading}
        >
          <div className="dots_border"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle">
            <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="white" fill="white" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"></path>
          </svg>
          <span className="text_button">{isLoading ? 'Summarizing...' : 'Summarize'}</span>
        </button>
      </div>

      <div className="output-section">
        <SummaryOutput 
          summary={summary} 
          onRegenerate={handleSummarize}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Summarizer; 