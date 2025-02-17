import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function QuizHome() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Link 
          to="/create-quiz" 
          className="bg-white text-[#091057] border border-[#3B71CA] p-8 rounded-lg hover:bg-[#1E2A5E] hover:text-white transition-colors duration-300 text-center shadow-md min-h-[160px] flex items-center justify-center text-lg font-medium"
        >
          Create New Quiz
        </Link>
        <Link 
          to="/search-quizzes" 
          className="bg-white text-[#091057] border border-[#3B71CA] p-8 rounded-lg hover:bg-[#1E2A5E] hover:text-white transition-colors duration-300 text-center shadow-md min-h-[160px] flex items-center justify-center text-lg font-medium"
        >
          Search Quizzes
        </Link>
        <Link 
          to="/quiz-history" 
          className="bg-white text-[#091057] border border-[#3B71CA] p-8 rounded-lg hover:bg-[#1E2A5E] hover:text-white transition-colors duration-300 text-center shadow-md min-h-[160px] flex items-center justify-center text-lg font-medium"
        >
          My Quiz History
        </Link>
        <Link 
          to="/leaderboard" 
          className="bg-white text-[#091057] border border-[#3B71CA] p-8 rounded-lg hover:bg-[#1E2A5E] hover:text-white transition-colors duration-300 text-center shadow-md min-h-[160px] flex items-center justify-center text-lg font-medium"
        >
          Leaderboard
        </Link>
      </div>

      {/* Main Quiz Button */}
      <div className="flex justify-center">
        <Link 
          to="/quiz/main"
          className="bg-white text-[#091057] border-2 border-[#3B71CA] px-12 py-6 rounded-lg hover:bg-[#1E2A5E] hover:text-white transition-colors duration-300 text-center shadow-lg text-xl font-bold"
        >
          Start Main Quiz
        </Link>
      </div>
    </div>
  );
}

export default QuizHome; 