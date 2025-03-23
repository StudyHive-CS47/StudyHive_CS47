import React, { useState } from 'react';
import FileUpload from './FileUpload';
import LengthSlider from './LengthSlider';
import SummaryOutput from './SummaryOutput';
import RotatingText from './RotatingText/RotatingText';

function Summarizer() {
  const [inputText, setInputText] = useState('');
  const [summaryLength, setSummaryLength] = useState(25);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  // Log environment variables during component initialization
  console.log('Environment variables available:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
  
  // OpenRouter configuration
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  // Debug log for API key
  console.log('API Key available:', !!OPENROUTER_API_KEY);

  // Calculate target token length based on input and summary percentage
  const calculateTargetLength = (text, percentage) => {
    const wordCount = text.split(/\s+/).length;
    if (percentage === 100) return wordCount; // For paraphrasing, keep same length
    return Math.max(20, Math.floor(wordCount * (percentage / 100)));
  };

  const handleSummarize = async () => {
    if (!inputText) return;
    
    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing');
      alert('API key configuration is missing. Please check your environment setup.');
      return;
    }
    
    setIsLoading(true);
    try {
      const wordCount = inputText.split(/\s+/).length;
      const targetLength = calculateTargetLength(inputText, summaryLength);
      const isParaphrasing = summaryLength === 100;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'StudyHive Summarizer'
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: isParaphrasing
                ? `You are an expert paraphraser. Your task is to rewrite text while:
                   1. Maintaining the exact same meaning and information
                   2. Using different vocabulary and sentence structure
                   3. Keeping approximately the same length
                   4. Preserving the original tone and style
                   5. Ensuring natural and fluent language

                   Aim to make the text feel fresh while keeping all key points intact.`
                : `You are a precise text summarizer with strict word count control.
                   
                   CURRENT TASK:
                   - Input length: ${wordCount} words
                   - Required length: EXACTLY ${targetLength} words (${summaryLength}%)
                   
                   STRICT REQUIREMENTS:
                   1. Word count MUST be EXACTLY ${targetLength} words
                   2. Include ONLY the most important information
                   3. Maintain logical flow and readability
                   4. Use clear, concise language
                   5. Preserve key facts and main ideas
                   
                   PROCESS:
                   1. First, identify the core message and key points
                   2. Draft a summary focusing on essential information
                   3. Count words carefully
                   4. Adjust length to EXACTLY ${targetLength} words
                   5. Ensure coherence and completeness
                   
                   The word count requirement is absolute - not one word more or less than ${targetLength}.`
            },
            {
              role: "user",
              content: isParaphrasing
                ? `Paraphrase this text with different wording while keeping the same meaning and length:\n\n${inputText}`
                : `Create a ${targetLength}-word summary of this text. Count words carefully to ensure EXACTLY ${targetLength} words:\n\n${inputText}`
            }
          ],
          temperature: isParaphrasing ? 0.8 : 0.5, // Even lower temperature for more precise summarization
          max_tokens: Math.min(1500, targetLength * 4),
          top_p: isParaphrasing ? 0.9 : 0.6, // Lower top_p for more focused outputs
          frequency_penalty: isParaphrasing ? 0.5 : 0.2, // Lower for summarization to stay more focused
          presence_penalty: isParaphrasing ? 0.3 : 0.1 // Add presence penalty to help with length control
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error (${response.status}): ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const summaryText = data.choices[0]?.message?.content?.trim();
      if (!summaryText) {
        throw new Error('No summary generated');
      }

      // Verify the output length and potentially retry if significantly off
      const summaryWords = summaryText.split(/\s+/).length;
      const targetWords = calculateTargetLength(inputText, summaryLength);
      console.log(`Output length: ${summaryWords} words (target: ${targetWords} words)`);
      
      // Add a warning if the length is significantly off
      if (!isParaphrasing && Math.abs(summaryWords - targetWords) > Math.min(5, targetWords * 0.1)) {
        console.warn(`Warning: Summary length (${summaryWords}) differs from target (${targetWords})`);
        // You could implement a retry mechanism here if needed
      }

      setSummary(summaryText);
    } catch (error) {
      console.error('Error details:', error);
      alert('Error generating summary. Please try again in a few moments.');
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
    <div className="summarizer-container">
      <div className="summarizer-header">
        <h1>
          Summarize
          <RotatingText 
            texts={['docs', 'Texts', 'Files', 'Notes','Webpages']}
            mainClassName="rotating-text-wrapper"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </h1>
        <p>Create concise summaries and paraphrases of your content</p>
      </div>

      <div className="summarizer">
        <div className="input-section">
          <div className="length-slider">
            <div className="length-slider-header">
              <label className="length-slider-label">
                Summary Length: {summaryLength}%
              </label>
              <span className="word-count">
                {inputText ? `${inputText.split(/\s+/).length} words` : '0 words'}
              </span>
            </div>
            <div className="length-slider-container">
              <input
                type="range"
                min="25"
                max="100"
                step="25"
                value={summaryLength}
                onChange={(e) => setSummaryLength(Number(e.target.value))}
              />
              <div className="slider-marks">
                <span className="slider-mark">25%</span>
                <span className="slider-mark">50%</span>
                <span className="slider-mark">75%</span>
                <span className="slider-mark">Paraphrase</span>
              </div>
            </div>
          </div>

          <FileUpload onFileContent={setInputText} />
          
          <button 
            className="primary-button summarize-button"
            onClick={handleSummarize}
            disabled={!inputText || isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>Summarize</span>
              </>
            )}
          </button>
        </div>

        <SummaryOutput 
          summary={summary}
          onRegenerate={handleSummarize}
          onDownload={handleDownload}
          isLoading={isLoading}
          wordCount={summary ? summary.split(/\s+/).length : 0}
          originalWordCount={inputText ? inputText.split(/\s+/).length : 0}
          isParaphrasing={summaryLength === 100}
        />
      </div>
    </div>
  );
}

export default Summarizer; 