import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';

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
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8 text-[#091057]">Search Quizzes</h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:border-blue-300 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#091057]">{quiz.title}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Creator:</span> {quiz.creator_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quiz Code:</span>{' '}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {quiz.code}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Questions:</span>{' '}
                  {quiz.questions.length}
                </p>
                {quiz.has_timer && (
                  <p className="text-gray-600">
                    <span className="font-medium">Time Limit:</span>{' '}
                    {quiz.timer_seconds} seconds per question
                  </p>
                )}
              </div>
              <Link
                to={`/quiz/${quiz.code}`}
                className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Take Quiz
              </Link>
            </div>
          ))}
          {!loading && searchTerm && quizzes.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No quizzes found for your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchQuiz; 