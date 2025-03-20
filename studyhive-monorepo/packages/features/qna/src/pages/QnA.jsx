import React, { useState, useEffect } from "react";
import "./QnA.css";
import { supabase } from "../pages/client";
import Footer from '@shared/components/Footer/Footer';

function QnA() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionImage, setNewQuestionImage] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answerImages, setAnswerImages] = useState({}); // State to track answer images

  // Hardcoded user ID and username for now
  const HARDCODED_USER_ID = "2c78ac84-f50b-4d50-bcaf-e7d837e028a5"; // TODO: Replace with actual logged-in user ID in the future
  const HARDCODED_USERNAME = "StudyHiveUser"; // Default username
  const [popularQuestions, setPopularQuestions] = useState([]);

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          users(username),
          answers(*, users(username), created_at)
        `)
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else {
        const formattedQuestions = data.map((question) => ({
          ...question,
          author: question.users?.username || "Anonymous",
          answers: question.answers.map((answer) => ({
            ...answer,
            author: answer.users?.username || "Anonymous",
            timestamp: answer.created_at,
            image: answer.image_url, // Map image_url to image
          })),
        }));
        setQuestions(formattedQuestions);
      }
    };
    fetchQuestions();
  }, []);

  // Add a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    let imageUrl = null;
    if (newQuestionImage) {
      if (!newQuestionImage.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const fileName = `question-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, newQuestionImage);
      if (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        return;
      }
      // Use getPublicUrl() to correctly fetch the image URL
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
      if (!imageUrl) {
        alert("Failed to retrieve uploaded image URL.");
        return;
      }
    }
    // Insert into Supabase
    const { data: questionData, error: questionError } = await supabase.from("questions").insert([
      {
        text: newQuestion,
        user_id: HARDCODED_USER_ID,
        image_url: imageUrl, // This should now be correctly set
      },
    ]).select(); // Use .select() to retrieve inserted data
    if (questionError) {
      console.error("Error inserting question:", questionError);
      alert("Failed to add question. Please try again.");
      return;
    }
    setQuestions([
      {
        ...questionData[0], // Ensure `questionData` is an array before accessing index 0
        author: HARDCODED_USERNAME,
        answers: [],
      },
      ...questions,
    ]);
    setNewQuestion("");
    setNewQuestionImage(null);
  };

  // Add an answer to a specific question
  const handleAddAnswer = async (questionId, answerText, answerImage) => {
    if (!answerText.trim()) return;
    let imageUrl = null;
    if (answerImage) {
      const fileName = `answer-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, answerImage);
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }
      // Fetch the public URL correctly
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
      if (!imageUrl) {
        console.error("Failed to retrieve uploaded image URL.");
        return;
      }
    }
    // Insert answer into the database
    const { data: answerData, error: answerError } = await supabase
      .from("answers")
      .insert([
        {
          question_id: questionId,
          text: answerText,
          user_id: HARDCODED_USER_ID,
          image_url: imageUrl,
        },
      ])
      .select(); // Ensure inserted data is returned
    if (answerError) {
      console.error("Error inserting answer:", answerError);
      return;
    }
    if (!answerData || answerData.length === 0) {
      console.error("No data returned from Supabase insert operation.");
      return;
    }
    // Update state
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: [
                { ...answerData[0], author: HARDCODED_USERNAME },
                ...question.answers,
              ],
            }
          : question
      )
    );
  };

  // Like a question
  const handleLikeQuestion = async (questionId) => {
    const { data, error } = await supabase
      .from("questions")
      .update({ likes: questions.find((q) => q.id === questionId).likes + 1 })
      .eq("id", questionId);
    if (error) console.error(error);
    else {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId
            ? { ...question, likes: question.likes + 1 }
            : question
        )
      );
    }
  };

  // Like an answer
  const handleLikeAnswer = async (answerId) => {
    const { data, error } = await supabase
      .from("answers")
      .update({
        likes: questions.flatMap((q) => q.answers).find((a) => a.id === answerId).likes + 1,
      })
      .eq("id", answerId);
    if (error) console.error(error);
    else {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.answers.some((a) => a.id === answerId)
            ? {
                ...question,
                answers: question.answers.map((answer) =>
                  answer.id === answerId ? { ...answer, likes: answer.likes + 1 } : answer
                ),
              }
            : question
        )
      );
    }
  };

  // View a question
  const handleViewQuestion = async (questionId) => {
    const { data, error } = await supabase
      .from("questions")
      .update({ views: questions.find((q) => q.id === questionId).views + 1 })
      .eq("id", questionId);
    if (error) console.error(error);
    else {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId ? { ...question, views: question.views + 1 } : question
        )
      );
    }
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
    const sorted = [...questions].sort((a, b) => b.likes - a.likes).slice(0, 5);
    setPopularQuestions(sorted);
  }, [questions]);

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF4FE]">
      <div className="qna-hero w-full">
        <div className="qna-hero-content">
          <h1>Ask & Answer</h1>
          <p>Share your knowledge, learn from others</p>
        </div>
      </div>

      <div className="qna-content">
        {/* Main Content */}
        <div className="qna-main">
          <div className="post-creation">
            <h3>Ask Your Question</h3>
            <form onSubmit={handleAddQuestion} className="post-input">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to ask..."
                rows="4"
              />
              <div className="form-actions">
                <div className="image-upload">
                  <label className="image-upload-label">
                    <span className="upload-icon">📎</span>
                    Add Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewQuestionImage(e.target.files[0])}
                      className="file-input"
                    />
                  </label>
                  {newQuestionImage && (
                    <div className="image-preview">
                      <img
                        src={URL.createObjectURL(newQuestionImage)}
                        alt="Question preview"
                      />
                      <button
                        type="button"
                        onClick={() => setNewQuestionImage(null)}
                        className="remove-image-button"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <button type="submit" className="post-question-button">
                  Post Question
                </button>
              </div>
            </form>
          </div>

          {/* Questions List */}
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
                      <div className="avatar">{question.author?.charAt(0).toUpperCase() || "A"}</div>
                      <div className="author-details">
                        <span className="author-name">{question.author || "Anonymous"}</span>
                        <span className="post-time">{formatTimeAgo(question.created_at)}</span>
                      </div>
                    </div>
                    <div className="question-stats">
                      <span className="views-count" title="Views">
                        <span className="view-icon">👀</span> {question.views}
                      </span>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{question.text}</p>
                    {question.image_url && (
                      <div className="question-image-container">
                        <img src={question.image_url} alt="question" className="question-image" />
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
                      className={`answer-toggle ${expandedQuestionId === question.id ? "active" : ""}`}
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
                          const answerImage = e.target.answerImage.files[0];
                          handleAddAnswer(question.id, answerText, answerImage);
                          e.target.reset();

                          // Reset the answer image state for this question
                          setAnswerImages((prev) => {
                            const newState = { ...prev };
                            delete newState[question.id];
                            return newState;
                          });
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
                            <label
                              htmlFor={`answerImage-${question.id}`}
                              className="image-upload-label"
                            >
                              <span className="upload-icon">📷</span>
                              <span>
                                {answerImages[question.id] ? "Change Image" : "Add Image"}
                              </span>
                            </label>
                            {answerImages[question.id] && (
                              <button
                                type="button"
                                className="remove-image-button"
                                onClick={() =>
                                  setAnswerImages((prev) => {
                                    const newState = { ...prev };
                                    delete newState[question.id];
                                    return newState;
                                  })
                                }
                              >
                                Remove
                              </button>
                            )}
                            <input
                              id={`answerImage-${question.id}`}
                              name="answerImage"
                              type="file"
                              accept="image/*"
                              className="file-input"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  setAnswerImages((prev) => ({
                                    ...prev,
                                    [question.id]: e.target.files[0],
                                  }));
                                }
                              }}
                            />
                          </div>
                          <button type="submit" className="submit-answer-button">
                            Submit Answer
                          </button>
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
                        {question.answers && question.answers.length > 0 ? (
                          question.answers.map((answer) => (
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
                                {answer.image_url && (
                                  <div className="answer-image-container">
                                    <img src={answer.image_url} alt="answer" className="answer-image" />
                                  </div>
                                )}
                              </div>
                              <div className="answer-actions">
                                <button
                                  className="like-button"
                                  onClick={() => handleLikeAnswer(answer.id)}
                                >
                                  <span className="heart-icon">❤️</span>
                                  <span className="like-count">{answer.likes}</span>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="qna-sidebar">
          <div className="sidebar-content">
            <h3>Popular Questions</h3>
            {popularQuestions.length === 0 ? (
              <div className="no-popular">No popular questions yet</div>
            ) : (
              <ul className="popular-questions-list">
                {popularQuestions.map((question) => (
                  <li
                    key={question.id}
                    className="popular-question-item"
                    onClick={() => {
                      setExpandedQuestionId(question.id);
                      document.getElementById(`question-${question.id}`).scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                  >
                    <div className="popular-question-content">
                      <p>{question.text.length > 60 ? question.text.substring(0, 60) + "..." : question.text}</p>
                      <div className="popular-question-stats">
                        <span>❤️ {question.likes}</span>
                        <span>💬 {question.answers.length}</span>
                        <span>👀 {question.views}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QnA;