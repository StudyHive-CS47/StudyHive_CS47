import React from 'react';
import { Link } from 'react-router-dom';

function QuizHome() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link 
          to="/create-quiz" 
          className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-2xl font-bold text-[#091057] mb-4">Create New Quiz</h2>
          <p className="text-gray-600">Create your own quiz with multiple choice questions</p>
        </Link>

        <Link 
          to="/search-quizzes" 
          className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-2xl font-bold text-[#091057] mb-4">Search Quizzes</h2>
          <p className="text-gray-600">Find and attempt quizzes by name, creator, or code</p>
        </Link>
      </div>
    </div>
  );
}

export default QuizHome; 