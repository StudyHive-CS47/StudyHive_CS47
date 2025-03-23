/**
 * SearchQuiz Component
 * 
 * This component provides a search interface for quizzes with the following features:
 * - Search by subject, code, or creator name
 * - Real-time search with debouncing
 * - Display of recently added quizzes
 * - Loading states and error handling
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';

function SearchQuiz() {
  // State management for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('subject'); // Options: 'subject', 'code', 'creator'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize component by fetching recent quizzes
  useEffect(() => {
    fetchRecentQuizzes();
  }, []);

  /**
   * Fetches the 12 most recently created quizzes
   * Used when component mounts and when search term is empty
   */
  const fetchRecentQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching recent quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Performs real-time search based on search term and type
   * @param {string} term - The search term entered by user
   * @param {string} type - Type of search (subject/code/creator)
   */
  const searchQuizzes = async (term, type) => {
    if (!term.trim()) {
      fetchRecentQuizzes();
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('quizzes')
        .select('*');

      // Apply different search conditions based on search type
      switch (type) {
        case 'code':
          query = query.ilike('code', `${term}%`); // Prefix match for codes
          break;
        case 'creator':
          query = query.ilike('creator_name', `%${term}%`); // Partial match for creator names
          break;
        default: // subject
          query = query.ilike('subject', `%${term}%`); // Partial match for subjects
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error searching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchQuizzes(searchTerm, searchType);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#091057] mb-4">Search Quizzes</h1>
            <p className="text-xl text-gray-600">Find and attempt quizzes by subject, creator, or code</p>
          </div>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-100">
            <div className="flex items-center gap-8 p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex gap-4">
                  {/* Search Type Selector */}
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors bg-white text-[#091057] font-medium"
                  >
                    <option value="subject">Search by Subject</option>
                    <option value="code">Search by Code</option>
                    <option value="creator">Search by Creator</option>
                  </select>
                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchType === 'subject' ? 
                      "Search by subject" : 
                      `Search by ${searchType}...`}
                    className="flex-1 px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading quizzes...</p>
          </div>
        ) : (
          <>
            {/* Recent Quizzes Header */}
            {!searchTerm && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#091057] mb-2">Recently Added Quizzes</h2>
                <p className="text-gray-600">Start exploring our latest quizzes</p>
              </div>
            )}
            
            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Quiz Subject */}
                  <h3 className="text-2xl font-bold mb-4 text-[#091057]">{quiz.subject}</h3>
                  <div className="space-y-3 mb-6">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">👨‍🎓</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Creator:</span> {quiz.creator_name}
                      </p>
                    </div>
                    {/* Question Count */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">📝</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Questions:</span> {quiz.questions.length}
                      </p>
                    </div>
                    {/* Quiz Code */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🎲</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Code:</span>{' '}
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {quiz.code}
                        </span>
                      </p>
                    </div>
                    {/* Timer Info (if enabled) */}
                    {quiz.has_timer && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">⏳</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Time Limit:</span>{' '}
                          {quiz.timer_seconds} seconds per question
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Take Quiz Button */}
                  <Link
                    to={`/quiz/${quiz.code}`}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                  >
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
            
            {/* No Results Message */}
            {!loading && searchTerm && quizzes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔎</span>
                </div>
                <h3 className="text-xl font-bold text-[#091057] mb-2">No Quizzes Found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse our recent quizzes</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchQuiz; 