import React, { useState, useEffect } from 'react';

function QuizQuestion({ question, onAnswer, timeLimit }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      onAnswer(null);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    onAnswer(index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 text-lg rounded-lg transition-colors
                ${selectedAnswer === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white hover:bg-gray-100'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizQuestion; 