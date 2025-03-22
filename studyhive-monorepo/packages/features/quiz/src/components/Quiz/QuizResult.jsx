import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

function QuizResult({ questions, userAnswers, onRetry }) {
  const navigate = useNavigate();
  const correctAnswers = questions.filter((q, index) => q.correct_answer === userAnswers[index]).length;
  const score = Math.round((correctAnswers / questions.length) * 100);

  useEffect(() => {
    if (score > 60) {
      // Trigger confetti animation for good scores
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-[#091057] mb-6">Quiz Results</h2>
      
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2">
          {score}%
        </div>
        <div className="text-gray-600">
          {correctAnswers} out of {questions.length} correct
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {questions.map((question, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              userAnswers[index] === question.correct_answer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="font-medium mb-2">{question.question}</p>
            <div className="grid gap-2">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`p-2 rounded ${
                    optIndex === question.correct_answer
                      ? 'bg-green-100 text-green-800'
                      : optIndex === userAnswers[index]
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-50'
                  }`}
                >
                  {option}
                  {optIndex === question.correct_answer && ' ✓'}
                  {optIndex === userAnswers[index] && optIndex !== question.correct_answer && ' ✗'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate('..')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default QuizResult; 