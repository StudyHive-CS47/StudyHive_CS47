import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';
import Footer from '@shared/components/Footer/Footer';

function SearchQuiz() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title', 'code', or 'creator'
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent quizzes on component mount
  useEffect(() => {
    fetchRecentQuizzes();
  }, []);

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

  // Real-time search function
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

      switch (type) {
        case 'code':
          query = query.ilike('code', `${term}%`);
          break;
        case 'creator':
          query = query.ilike('creator_name', `%${term}%`);
          break;
        default: // title
          query = query.ilike('title', `%${term}%`);
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

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchQuizzes(searchTerm, searchType);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#091057] mb-4">Search Quizzes</h1>
            <p className="text-xl text-gray-600">Find and attempt quizzes by title, creator, or code</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-100">
            <div className="flex items-center gap-8 p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex gap-4">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors bg-white text-[#091057] font-medium"
                  >
                    <option value="title">Search by Title</option>
                    <option value="code">Search by Code</option>
                    <option value="creator">Search by Creator</option>
                  </select>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${searchType}...`}
                    className="flex-1 px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading quizzes...</p>
          </div>
        ) : (
          <>
            {!searchTerm && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#091057] mb-2">Recently Added Quizzes</h2>
                <p className="text-gray-600">Start exploring our latest quizzes</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-4 text-[#091057]">{quiz.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Creator:</span> {quiz.creator_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🎯</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Questions:</span> {quiz.questions.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🔑</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Code:</span>{' '}
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {quiz.code}
                        </span>
                      </p>
                    </div>
                    {quiz.has_timer && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">⏱️</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Time Limit:</span>{' '}
                          {quiz.timer_seconds} seconds per question
                        </p>
                      </div>
                    )}
                  </div>
                  <Link
                    to={`../${quiz.code}`}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                  >
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
            
            {!loading && searchTerm && quizzes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-[#091057] mb-2">No Quizzes Found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse our recent quizzes</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchQuiz; 