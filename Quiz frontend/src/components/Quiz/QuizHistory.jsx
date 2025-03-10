import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../api/quiz';
import BackButton from '../common/BackButton';

function QuizHistory() {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    fetchUserHistory();
    const refreshInterval = setInterval(fetchUserHistory, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchUserHistory = async () => {
    try {
      const userId = '123'; // Replace with actual user ID from auth
      const [attempts, searches, created] = await Promise.all([
        quizService.getQuizHistory(userId),
        quizService.getSearchHistory(userId),
        quizService.getCreatedQuizzes(userId)
      ]);
      
      setRecentAttempts(attempts);
      setSearchHistory(searches);
      setCreatedQuizzes(created);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8 text-[#091057]">My Quiz History</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'recent'
              ? 'bg-[#1E2A5E] text-white'
              : 'bg-white text-[#091057] border border-[#3B71CA]'
          }`}
        >
          Recent Attempts
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'search'
              ? 'bg-[#1E2A5E] text-white'
              : 'bg-white text-[#091057] border border-[#3B71CA]'
          }`}
        >
          Search History
        </button>
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'created'
              ? 'bg-[#1E2A5E] text-white'
              : 'bg-white text-[#091057] border border-[#3B71CA]'
          }`}
        >
          Created Quizzes
        </button>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {activeTab === 'recent' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAttempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="px-6 py-4">{attempt.quizTitle}</td>
                  <td className="px-6 py-4">{attempt.score}/{attempt.totalQuestions}</td>
                  <td className="px-6 py-4">{new Date(attempt.dateTaken).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'search' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Search Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchHistory.map((search) => (
                <tr key={search.id}>
                  <td className="px-6 py-4">{search.searchTerm}</td>
                  <td className="px-6 py-4">{search.quizCreator}</td>
                  <td className="px-6 py-4">{new Date(search.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      search.attempted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {search.attempted ? 'Completed' : 'Not Taken'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'created' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students Attempted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {createdQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4">{quiz.title}</td>
                  <td className="px-6 py-4">{new Date(quiz.dateCreated).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{quiz.studentsAttempted} students</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default QuizHistory; 