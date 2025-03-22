import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import BackButton from '../common/BackButton';
import SuccessPopup from '../common/SuccessPopup';
import Footer from '@shared/components/Footer/Footer';

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

  // Add this new state for option errors
  const [optionErrors, setOptionErrors] = useState(
    questions.map(() => Array(4).fill(''))
  );

  const addQuestion = () => {
    if (questions.length < 20) {
      setQuestions([...questions, {
        question: '',
        options: ['', '', '', ''],
        correct_answer: null,
        order: questions.length
      }]);
      setOptionErrors([...optionErrors, Array(4).fill('')]);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      newQuestions[index].options[value.index] = value.text;
      
      // Validate the new option value
      const validationError = validateOptionInput(index, value.index, value.text);
      const newErrors = [...optionErrors];
      newErrors[index][value.index] = validationError;
      setOptionErrors(newErrors);
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const validateUniqueAnswers = (question, questionIndex) => {
    const answers = new Set();
    let duplicates = [];
    
    question.options.forEach((option, index) => {
      if (option.trim() === '') return;
      
      if (answers.has(option.toLowerCase())) {
        duplicates.push(index + 1);
      } else {
        answers.add(option.toLowerCase());
      }
    });
    
    if (duplicates.length > 0) {
      return `Question ${questionIndex + 1} has duplicate answers: Option ${duplicates.join(' and Option ')}`;
    }
    return null;
  };

  const validateOptionInput = (questionIndex, optionIndex, value) => {
    const question = questions[questionIndex];
    const otherOptions = question.options
      .filter((_, idx) => idx !== optionIndex)
      .map(opt => opt.trim().toLowerCase());

    if (value.trim() && otherOptions.includes(value.trim().toLowerCase())) {
      return 'This answer already exists';
    }
    return '';
  };

  const handleSubmit = async () => {
    // Validate basic fields
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    if (!creatorName.trim()) {
      alert('Please enter your name');
      return;
    }

    // Validate questions
    let hasError = false;
    let errorMessage = '';

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // Check for empty question
      if (!q.question.trim()) {
        errorMessage = `Please enter question ${i + 1}`;
        hasError = true;
        break;
      }
      
      // Check for empty options
      const emptyOption = q.options.findIndex(opt => !opt.trim());
      if (emptyOption !== -1) {
        errorMessage = `Please fill in all options for question ${i + 1}`;
        hasError = true;
        break;
      }

      // Check for duplicate answers
      const duplicateError = validateUniqueAnswers(q, i);
      if (duplicateError) {
        errorMessage = duplicateError;
        hasError = true;
        break;
      }

      // Check if correct answer is selected
      if (q.correct_answer === null) {
        errorMessage = `Please select the correct answer for question ${i + 1}`;
        hasError = true;
        break;
      }
    }

    if (hasError) {
      // Create and show custom error popup
      const errorPopup = document.createElement('div');
      errorPopup.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">⚠️</span>
              </div>
              <h2 class="text-2xl font-bold text-red-600">Error</h2>
            </div>
            <p class="text-gray-600 mb-6">${errorMessage}</p>
            <button
              class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onclick="this.parentElement.parentElement.remove()"
            >
              Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(errorPopup);
      return;
    }

    // If all validations pass, proceed with quiz creation
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="container mx-auto px-4 max-w-4xl py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#091057] mb-4">Create New Quiz</h1>
            <p className="text-xl text-gray-600">Design your perfect quiz and share it with others</p>
          </div>

          {currentStep === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100">
              <div className="space-y-8">
                <div className="flex items-center gap-8 p-6 bg-blue-50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="flex-grow">
                    <label className="block text-[#091057] font-semibold mb-2 text-lg">Your Name</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-8 p-6 bg-blue-50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="flex-grow">
                    <label className="block text-[#091057] font-semibold mb-2 text-lg">Quiz Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300 transition-colors"
                      placeholder="Enter quiz title"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-8 p-6 bg-blue-50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="flex-grow">
                    <label className="flex items-center space-x-3 text-lg">
                      <input
                        type="checkbox"
                        checked={hasTimer}
                        onChange={(e) => setHasTimer(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
                      />
                      <span className="text-[#091057] font-semibold">Enable Timer</span>
                    </label>
                    {hasTimer && (
                      <div className="mt-4">
                        <label className="block text-[#091057] font-semibold mb-2">Time per question (seconds)</label>
                        <input
                          type="number"
                          value={timerSeconds}
                          onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                          className="w-32 p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-300"
                          min="20"
                          max="300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    if (!title.trim() || !creatorName.trim()) {
                      alert('Please fill in all fields');
                      return;
                    }
                    setCurrentStep(1);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  Next: Add Questions
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-100">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h2 className="text-2xl font-bold text-[#091057]">Add Your Questions</h2>
                <p className="text-gray-600">Create up to 20 multiple choice questions</p>
              </div>

              {questions.map((q, index) => (
                <div key={index} className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#091057]">Question {index + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        onClick={() => {
                          const newQuestions = questions.filter((_, i) => i !== index);
                          setQuestions(newQuestions);
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2"
                      >
                        <span className="text-lg">🗑️</span>
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    className="w-full p-3 border-2 border-blue-100 rounded-lg mb-4 focus:outline-none focus:border-blue-300"
                    placeholder="Enter your question"
                    required
                  />

                  <div className="space-y-3">
                    <p className="text-[#091057] font-semibold mb-2">Select the correct answer:</p>
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-blue-100">
                          <input
                            type="radio"
                            name={`correct_${index}`}
                            checked={q.correct_answer === optIndex}
                            onChange={() => updateQuestion(index, 'correct_answer', optIndex)}
                            className="w-5 h-5 text-blue-600"
                            required
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              updateQuestion(index, 'option', { 
                                index: optIndex, 
                                text: e.target.value 
                              });
                            }}
                            className={`flex-1 p-2 border-2 ${
                              optionErrors[index][optIndex] 
                                ? 'border-red-200' 
                                : 'border-blue-50'
                            } rounded-lg focus:outline-none focus:border-blue-200`}
                            placeholder={`Option ${optIndex + 1}`}
                            required
                          />
                        </div>
                        {optionErrors[index][optIndex] && (
                          <p className="text-sm text-red-500 ml-11">
                            {optionErrors[index][optIndex]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <div className="space-x-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={addQuestion}
                    disabled={questions.length >= 20}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Add Question
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transform hover:-translate-y-1 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
                navigate('..');
              }}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateQuiz; 