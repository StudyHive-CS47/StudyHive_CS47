import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';
import SuccessPopup from '../common/SuccessPopup';

function CreateQuiz() {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState('');
  const [title, setTitle] = useState('');
  const [hasTimer, setHasTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [questions, setQuestions] = useState([{
    question: '',
    options: ['', '', '', ''],
    correct_answer: null,
    order: 0
  }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdQuizCode, setCreatedQuizCode] = useState('');

  const addQuestion = () => {
    if (questions.length < 20) {
      setQuestions([...questions, {
        question: '',
        options: ['', '', '', ''],
        correct_answer: null,
        order: questions.length
      }]);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      newQuestions[index].options[value.index] = value.text;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    if (!creatorName.trim()) {
      alert('Please enter your name');
      return;
    }

    const isValid = questions.every((q, qIndex) => {
      if (!q.question.trim()) {
        alert(`Please enter question ${qIndex + 1}`);
        return false;
      }
      
      const emptyOption = q.options.findIndex(opt => !opt.trim());
      if (emptyOption !== -1) {
        alert(`Please fill in all options for question ${qIndex + 1}`);
        return false;
      }

      if (q.correct_answer === null) {
        alert(`Please select the correct answer for question ${qIndex + 1}`);
        return false;
      }

      return true;
    });

    if (!isValid) return;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          title,
          creator_name: creatorName,
          has_timer: hasTimer,
          timer_seconds: hasTimer ? timerSeconds : null,
          questions
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedQuizCode(data.code);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8 text-[#091057]">Create New Quiz</h1>

      {currentStep === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hasTimer}
                onChange={(e) => setHasTimer(e.target.checked)}
                className="mr-2"
              />
              Enable Timer
            </label>
            {hasTimer && (
              <div className="mt-2">
                <label className="block text-gray-700 mb-2">Time per question (seconds)</label>
                <input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                  className="p-2 border rounded"
                  min="20"
                  max="300"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!title.trim() || !creatorName.trim()) {
                alert('Please fill in all fields');
                return;
              }
              setCurrentStep(1);
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Next: Add Questions
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {questions.map((q, index) => (
            <div key={index} className="mb-8 p-4 border rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Question {index + 1}</h3>
                {questions.length > 1 && (
                  <button
                    onClick={() => {
                      const newQuestions = questions.filter((_, i) => i !== index);
                      setQuestions(newQuestions);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Question
                  </button>
                )}
              </div>

              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter your question"
                required
              />

              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-2">Select the correct answer:</p>
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center bg-gray-50 p-3 rounded">
                    <input
                      type="radio"
                      name={`correct_${index}`}
                      checked={q.correct_answer === optIndex}
                      onChange={() => updateQuestion(index, 'correct_answer', optIndex)}
                      className="mr-3 h-4 w-4 text-blue-600"
                      required
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateQuestion(index, 'option', { index: optIndex, text: e.target.value })}
                      className="flex-1 p-2 border rounded"
                      placeholder={`Option ${optIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
              
              {q.correct_answer === null && (
                <p className="text-red-500 text-sm mt-2">Please select a correct answer</p>
              )}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <div>
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Back
              </button>
              <button
                onClick={addQuestion}
                disabled={questions.length >= 20}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Add Question
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <SuccessPopup
          message="Quiz created successfully! Share this code with others:"
          code={createdQuizCode}
          onClose={() => {
            setShowSuccessPopup(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}

export default CreateQuiz; 