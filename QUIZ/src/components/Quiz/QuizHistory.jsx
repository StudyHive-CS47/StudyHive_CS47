import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';

function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (
            title,
            creator_name,
            questions
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#091057] mb-4">Quiz History</h1>
            <p className="text-xl text-gray-600">View your past quiz attempts and scores</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading history...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#091057] mb-2">No Quiz History</h3>
                  <p className="text-gray-600">You haven't attempted any quizzes yet</p>
                </div>
              ) : (
                history.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-100"
                  >
                    <h3 className="text-2xl font-bold text-[#091057] mb-4">
                      {attempt.quizzes?.title || 'Untitled Quiz'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">📊</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Score:</span>{' '}
                          {attempt.score}/{attempt.total_questions}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Creator:</span>{' '}
                          {attempt.quizzes?.creator_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">🕒</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(attempt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizHistory; 