import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@shared/components/Footer/Footer';

function QuizHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#091057] mb-4">Interactive Quiz</h1>
          <p className="text-xl text-gray-600">Create, share, and test your knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Link 
            to="create" 
            className="bg-white p-12 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#091057] mb-4">Create New Quiz</h2>
              <p className="text-gray-600 text-lg">Design your own quiz with multiple choice questions and share it with others</p>
            </div>
          </Link>

          <Link 
            to="search" 
            className="bg-white p-12 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#091057] mb-4">Search Quizzes</h2>
              <p className="text-gray-600 text-lg">Find and attempt quizzes created by others using name, creator, or code</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-8 bg-white px-8 py-4 rounded-full shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl text-blue-600">✏️</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#091057]">Create</p>
                <p className="text-gray-600">Design your quiz</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl text-blue-600">🔄</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#091057]">Share</p>
                <p className="text-gray-600">Get a unique code</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl text-blue-600">🎯</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#091057]">Test</p>
                <p className="text-gray-600">Take quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QuizHome; 