import React from 'react';
import { useState, useEffect } from "react";
import "./QnA.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import userAvatar from "../components/assets/avatar.png";
import 'font-awesome/css/font-awesome.min.css';

function QnA() {
    // Sample data for popular questions
    const popularQuestions = [
      {
        id: 1,
        title: "What is the difference bet...",
        members: "72.5k Members",
        icon: "📊",
      },
      {
        id: 2,
        title: "What are the OOP principl...",
        members: "18.3k Members",
        icon: "🔮",
      },
      {
        id: 3,
        title: "Logical ERD...",
        members: "13.6k Members",
        icon: "📝",
      },
    ]
  
    // Sample data for posts
    const posts = [
      {
        id: 1,
        category: "Robotics Principles",
        author: "Sally White",
        timeAgo: "1 day ago",
        content:
          "What is the difference between forward kinematics and inverse kinematics in robotics, and how are they applied in robotic arm motion planning?",
          image: 'https://t3.ftcdn.net/jpg/00/60/46/76/360_F_60467600_edVkJvDs6Zl0HMo6x6IdZoO5Qv3WZQ64.jpg',
        likes: 10,
        comments: 5,
        saved: false,
      },
    ]
  
    return (
      <div className="qna-container">
        <Header />
  
        <main className="qna-main">
          <div className="qna-sidebar">
            <div className="popular-questions">
              <h3>
                Popular Questions <span className="arrow-icon">›</span>
              </h3>
  
              {popularQuestions.map((question) => (
                <div className="question-item" key={question.id}>
                  <div className="question-icon">{question.icon}</div>
                  <div className="question-info">
                    <p className="question-title">{question.title}</p>
                    <p className="question-members">{question.members}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="qna-content">
            <div className="post-creation">
              <img src={userAvatar || "/placeholder.svg"} alt="User" className="user-avatar" />
              <div className="post-input">
                <input type="text" placeholder="Share your questions or a post" />
                <div className="post-actions">
                  <button className="post-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                        fill="#CCCCCC"
                      />
                    </svg>
                  </button>
                  <button className="post-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"
                        fill="#CCCCCC"
                      />
                    </svg>
                  </button>
                  <button className="post-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"
                        fill="#CCCCCC"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            <div className="posts-container">
              {posts.map((post) => (
                <div className="post-card" key={post.id}>
                  <div className="post-header">
                    <div className="post-category">
                      <img src={userAvatar || "/placeholder.svg"} alt="Category" className="category-icon" />
                      <h4>{post.category}</h4>
                    </div>
                    <div className="post-author">
                      <span className="author-name">{post.author}</span>
                      <span className="post-time">{post.timeAgo}</span>
                    </div>
                  </div>
  
                  <div className="post-content">
                    <p>
                      {post.content} <span className="view-more">...view more</span>
                    </p>
                    {post.image && (
                      <div className="post-image">
                        <img src={post.image || "/placeholder.svg"} alt="Post attachment" />
                      </div>
                    )}
                    <div className="post-stats">
                      <span>
                        {post.likes} likes · {post.comments} comments
                      </span>
                    </div>
                  </div>
  
                  <div className="post-actions-bar">
                    <button className="post-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 21H5V9H1V21ZM23 10C23 8.9 22.1 8 21 8H14.69L15.64 3.43L15.67 3.11C15.67 2.7 15.5 2.32 15.23 2.05L14.17 1L7.59 7.59C7.22 7.95 7 8.45 7 9V19C7 20.1 7.9 21 9 21H18C18.83 21 19.54 20.5 19.84 19.78L22.86 12.73C22.95 12.5 23 12.26 23 12V10Z"
                          fill="#666666"
                        />
                      </svg>
                      Like
                    </button>
                    <button className="post-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21.99 4C21.99 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22L21.99 4ZM18 14H6V12H18V14ZM18 11H6V9H18V11ZM18 8H6V6H18V8Z"
                          fill="#666666"
                        />
                      </svg>
                      Comment
                    </button>
                    <button className="post-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.9 3 5.01 3.9 5.01 5L5 21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="#666666" />
                      </svg>
                      Save
                    </button>
                    <div className="share-action">
                      <button className="post-action">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"
                            fill="#666666"
                          />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
  
        <Footer />
      </div>
    )
  }
  
  export default QnA;