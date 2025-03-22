import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';
import QuizResult from './QuizResult';
import Footer from '@shared/components/Footer/Footer';

function QuizQuestion() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [code]);

  const fetchQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      if (!data) {
        setError('Quiz not found');
        return;
      }

      setQuiz(data);
      setUserAnswers(new Array(data.questions.length).fill(null));
      if (data.has_timer) {
        setTimeLeft(data.timer_seconds);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (quiz?.has_timer && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, timeLeft, currentQuestionIndex]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      moveToNextQuestion();
    } else {
      finishQuiz();
    }
  };

  const moveToNextQuestion = () => {
    // Save the current answer
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    if (quiz.has_timer) {
      setTimeLeft(quiz.timer_seconds);
    }
  };

  const finishQuiz = () => {
    // Save the last answer if selected
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);
    }
    setShowResults(true);
  };

  const handleRetry = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
    if (quiz.has_timer) {
      setTimeLeft(quiz.timer_seconds);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <BackButton />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <BackButton />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Quiz not found</h2>
            <p className="text-gray-600 mt-2 mb-4">{error || 'Unable to load the quiz'}</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
          <BackButton />
          <QuizResult
            questions={quiz.questions}
            userAnswers={userAnswers}
            onRetry={handleRetry}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <BackButton />
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#091057]">{quiz.title}</h1>
            <div className="text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mb-4 flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (selectedAnswer !== null) {
                    const newAnswers = [...userAnswers];
                    newAnswers[currentQuestionIndex] = selectedAnswer;
                    setUserAnswers(newAnswers);
                  }
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(userAnswers[index]);
                  if (quiz.has_timer) {
                    setTimeLeft(quiz.timer_seconds);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${currentQuestionIndex === index 
                    ? 'bg-blue-500 text-white'
                    : userAnswers[index] !== null
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {quiz.has_timer && (
            <div className="mb-4">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft < 5 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(timeLeft / quiz.timer_seconds) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-gray-600 mt-2">{timeLeft}s</div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`p-4 text-left rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                if (selectedAnswer !== null) {
                  const newAnswers = [...userAnswers];
                  newAnswers[currentQuestionIndex] = selectedAnswer;
                  setUserAnswers(newAnswers);
                }
                setCurrentQuestionIndex(prev => prev - 1);
                setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
                if (quiz.has_timer) {
                  setTimeLeft(quiz.timer_seconds);
                }
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  moveToNextQuestion();
                } else {
                  finishQuiz();
                }
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QuizQuestion; 