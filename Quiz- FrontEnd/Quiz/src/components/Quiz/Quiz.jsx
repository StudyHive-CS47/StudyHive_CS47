import { useState } from 'react';
import './Quiz.css';
import questions from './questions';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(questions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  console.log('Total questions:', questions.length);

  const handleAnswerSelect = (answer) => {
    if (!isAnswerChecked) {
      setSelectedOption(answer);
    }
  };

  const handleNext = () => {
    if (!isAnswerChecked && selectedOption) {
      // First click: Check answer
      setIsAnswerChecked(true);
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestion] = selectedOption;
      setSelectedAnswers(newSelectedAnswers);
      
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    } else {
      // Second click: Next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      }
    }
  };

  const progress = Math.round((selectedAnswers.filter(answer => answer !== null).length / questions.length) * 100);

  return (
    <>
    <div className="search-container">
      <input type="text" placeholder="Search a different quiz" className="search-input" />
    </div>
    <div className="quiz-container">
      <div className="quiz-navigation">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`nav-button ${currentQuestion === index ? 'active' : ''} 
                       ${selectedAnswers[index] === questions[index].correctAnswer ? 'correct' : 
                         selectedAnswers[index] !== null ? 'incorrect' : ''}`}
            onClick={() => {
              if (!isAnswerChecked || currentQuestion !== index) {
                setCurrentQuestion(index);
                setSelectedOption(selectedAnswers[index]);
                setIsAnswerChecked(selectedAnswers[index] !== null);
              }
            }}
          >
            Question {index + 1}
          </button>
        ))}
      </div>
      
      <div className="quiz-content">
        <h1 className="quiz-title">OOP Basics-Quiz</h1>

        <div className="question-card">
          <h2>Question {currentQuestion + 1}</h2>
          <p className="question-text">{questions[currentQuestion].question}</p>
          
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option-button 
                  ${selectedOption === option ? 
                    (isAnswerChecked ? 
                      (option === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect')
                      : 'selected') 
                    : ''}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswerChecked}
              >
                {option}
              </button>
            ))}
          </div>

          {isAnswerChecked && (
            <div className={`feedback ${selectedOption === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}`}>
              {selectedOption === questions[currentQuestion].correctAnswer ? 
                'Correct!' : 
                `Incorrect. The correct answer is: ${questions[currentQuestion].correctAnswer}`}
            </div>
          )}
        </div>

        <div className="quiz-footer">
          <div className="progress-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4caf50"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
              />
              <text x="18" y="20.35" className="percentage">{progress}%</text>
            </svg>
          </div>
          <button 
            className="next-button" 
            onClick={handleNext} 
            disabled={!selectedOption}
          >
            {!isAnswerChecked ? 'Check Answer' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="StudyHive" className="footer-logo" />
        <h2 className="footer-brand">StudyHive</h2>
      </div>
      <div className="footer-center">
        <a href="/about">About</a>
        <a href="/features">Features</a>
        <a href="/feedback">Feedback</a>
        <a href="/donate">Donate</a>
        <a href="/team">Team</a>
      </div>
      <div className="footer-right">
        <a href="https://www.facebook.com/profile.php?id=61570160061839" className="social-link" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/studyhive_edu/profilecard/?igsh=Zmo1cHlrc3E5dGht" className="social-link" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/company/studyhive/" className="social-link" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>
    </footer>
    </>
  );
};

export default Quiz; 