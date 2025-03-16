import React, { useState, useEffect } from "react";
import "./QnA.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function QnA() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionImage, setNewQuestionImage] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [userName, setUserName] = useState("Anonymous");
  const [popularQuestions, setPopularQuestions] = useState([]);
  
  // Add a new question
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQuestionObj = {
      id: Date.now(),
      text: newQuestion,
      author: userName,
      likes: 0,
      views: 0,
      answers: [],
      image: newQuestionImage,
      timestamp: new Date(),
    };

    setQuestions([newQuestionObj, ...questions]); // Add to the beginning
    setNewQuestion(""); 
    setNewQuestionImage(null);
  };

  // Add an answer to a specific question
  const handleAddAnswer = (questionId, answerText, answerImage) => {
    if (!answerText.trim()) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: [
                { 
                  id: Date.now(), 
                  text: answerText, 
                  author: userName,
                  likes: 0, 
                  image: answerImage,
                  timestamp: new Date(),
                },
                ...question.answers,
              ],
            }
          : question
      )
    );
  };

  // Like a question
  const handleLikeQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, likes: question.likes + 1 } : question
      )
    );
  };

  // Like an answer
  const handleLikeAnswer = (questionId, answerId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId ? { ...answer, likes: answer.likes + 1 } : answer
              ),
            }
          : question
      )
    );
  };

  // View a question
  const handleViewQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, views: question.views + 1 } : question
      )
    );
  };

  // Toggle answer section visibility
  const toggleAnswerSection = (questionId) => {
    if (expandedQuestionId !== questionId) {
      handleViewQuestion(questionId);
    }
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  // Format time difference
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  // Update popular questions when the questions state changes
  useEffect(() => {
    // Sort questions by likes and limit to top 5
    const sorted = [...questions].sort((a, b) => b.likes - a.likes).slice(0, 5);
    setPopularQuestions(sorted);
  }, [questions]);

  return (
    <div className="qna-container">
      <Header />

      <div className="qna-hero">
        <div className="qna-hero-content">
          <h1>Ask & Answer</h1>
          <p>Share your knowledge, learn from others</p>
        </div>
      </div>

      <div className="qna-content">
        {/* Sidebar with Popular Questions */}
        <aside className="qna-sidebar">
          <div className="sidebar-content">
            <h3>Popular Questions</h3>
            {popularQuestions.length === 0 ? (
              <p className="no-popular">No popular questions yet</p>
            ) : (
              <ul className="popular-questions-list">
                {popularQuestions.map(question => (
                  <li 
                    key={question.id} 
                    className="popular-question-item"
                    onClick={() => {
                      setExpandedQuestionId(question.id);
                      document.getElementById(`question-${question.id}`).scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                  >
                    <div className="popular-question-content">
                      <p>{question.text.length > 60 ? question.text.substring(0, 60) + "..." : question.text}</p>
                      <div className="popular-question-stats">
                        <span>❤️ {question.likes}</span>
                        <span>💬 {question.answers.length}</span>
                        <span>👁️ {question.views}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="user-identity">
              <h3>Your Identity</h3>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="username-input"
              />
            </div>
          </div>
        </aside>

        <main className="qna-main">
          {/* Question Input Form */}
          <div className="post-creation">
            <h3>Ask Your Question</h3>
            <form onSubmit={handleAddQuestion} className="post-input">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to ask..."
                required
                rows="3"
              />
              <div className="form-actions">
                <div className="image-upload">
                  <label htmlFor="questionImage" className="image-upload-label">
                    <span className="upload-icon">📷</span>
                    <span>{newQuestionImage ? "Change Image" : "Add Image"}</span>
                  </label>
                  <input
                    id="questionImage"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNewQuestionImage(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    accept="image/*"
                    className="file-input"
                  />
                </div>
                <button type="submit" className="post-question-button">Post Question</button>
              </div>
              {newQuestionImage && (
                <div className="image-preview">
                  <img src={newQuestionImage} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image" 
                    onClick={() => setNewQuestionImage(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Display Questions */}
          <div className="posts-container">
            {questions.length === 0 ? (
              <div className="no-questions">
                <p>No questions yet. Be the first to ask!</p>
              </div>
            ) : (
              questions.map((question) => (
                <div id={`question-${question.id}`} key={question.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <div className="avatar">{question.author.charAt(0).toUpperCase()}</div>
                      <div className="author-details">
                        <span className="author-name">{question.author}</span>
                        <span className="post-time">{formatTimeAgo(question.timestamp)}</span>
                      </div>
                    </div>
                    <div className="question-stats">
                      <span className="views-count" title="Views">
                        <span className="view-icon">👁️</span> {question.views}
                      </span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{question.text}</p>
                    {question.image && (
                      <div className="question-image-container">
                        <img src={question.image} alt="question" className="question-image" />
                      </div>
                    )}
                  </div>
                  <div className="post-stats">
                    <button 
                      className="like-button" 
                      onClick={() => handleLikeQuestion(question.id)}
                    >
                      <span className="heart-icon">❤️</span>
                      <span className="like-count">{question.likes}</span>
                    </button>
                    <button
                      className={`answer-toggle ${expandedQuestionId === question.id ? 'active' : ''}`}
                      onClick={() => toggleAnswerSection(question.id)}
                    >
                      <span className="answer-icon">💬</span>
                      <span className="answer-count">{question.answers.length}</span>
                      <span className="toggle-text">
                        {expandedQuestionId === question.id ? "Hide Answers" : "Show Answers"}
                      </span>
                    </button>
                  </div>

                  {/* Answer Section */}
                  {expandedQuestionId === question.id && (
                    <div className="answers-section">
                      <h4>Add Your Answer</h4>
                      <form
                        className="answer-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const answerText = e.target.answerText.value;
                          const answerImage = e.target.answerImage.files[0]
                            ? URL.createObjectURL(e.target.answerImage.files[0])
                            : null;
                          handleAddAnswer(question.id, answerText, answerImage);
                          e.target.reset();
                        }}
                      >
                        <textarea
                          name="answerText"
                          placeholder="Share your knowledge..."
                          required
                          rows="2"
                        />
                        <div className="form-actions">
                          <div className="image-upload">
                            <label htmlFor={`answerImage-${question.id}`} className="image-upload-label">
                              <span className="upload-icon">📷</span>
                              <span>Add Image</span>
                            </label>
                            <input
                              id={`answerImage-${question.id}`}
                              name="answerImage"
                              type="file"
                              accept="image/*"
                              className="file-input"
                            />
                          </div>
                          <button type="submit" className="submit-answer-button">Submit Answer</button>
                        </div>
                      </form>

                      {/* Display Answers Count */}
                      <div className="answers-count">
                        <h4>
                          {question.answers.length === 0
                            ? "No answers yet"
                            : `${question.answers.length} ${
                                question.answers.length === 1 ? "Answer" : "Answers"
                              }`}
                        </h4>
                      </div>

                      {/* Display Answers */}
                      <div className="answers-list">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="answer-card">
                            <div className="answer-header">
                              <div className="author-info">
                                <div className="avatar">{answer.author?.charAt(0).toUpperCase() || "A"}</div>
                                <div className="author-details">
                                  <span className="author-name">{answer.author || "Anonymous"}</span>
                                  <span className="post-time">{formatTimeAgo(answer.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="answer-content">
                              <p>{answer.text}</p>
                              {answer.image && (
                                <div className="answer-image-container">
                                  <img src={answer.image} alt="answer" className="answer-image" />
                                </div>
                              )}
                            </div>
                            <div className="answer-actions">
                              <button
                                className="like-button"
                                onClick={() => handleLikeAnswer(question.id, answer.id)}
                              >
                                <span className="heart-icon">❤️</span>
                                <span className="like-count">{answer.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default QnA;