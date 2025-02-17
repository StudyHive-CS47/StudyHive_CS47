import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: 20
      }
    ]
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          timeLimit: 20
        }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementation for saving quiz
    // Navigate to quiz home after saving
    navigate('/quizzes');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({...quiz, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Question {index + 1}</h3>
            <input
              type="text"
              value={question.question}
              onChange={(e) => {
                const newQuestions = [...quiz.questions];
                newQuestions[index].question = e.target.value;
                setQuiz({...quiz, questions: newQuestions});
              }}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Enter your question"
              required
            />

            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...quiz.questions];
                    newQuestions[index].options[optionIndex] = e.target.value;
                    setQuiz({...quiz, questions: newQuestions});
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-gray-600"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Save Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz; 