import React from 'react';
import { Link } from 'react-router-dom';

function BackButton() {
  return (
    <Link 
      to="/quizzes"
      className="inline-flex items-center text-[#091057] hover:text-[#1E2A5E] mb-6"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      Back to Home
    </Link>
  );
}

export default BackButton; 