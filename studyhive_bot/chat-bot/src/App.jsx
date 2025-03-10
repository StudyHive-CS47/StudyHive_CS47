import React from 'react';
import ChatAssistant from './components/Chatbot_new';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="top-bar">
        <div className="nav-container">
          <img src="/studyhive-logo.png" alt="" className="logo" />
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/note">Note Sharing & Search</a>
            <a href="/chatbot">ChatBot</a>
            <a href="/qa">Q & A</a>
            <a href="/group-chat">Group chat</a>
            <a href="/summarize">Summarize AI</a>
            <a href="/quiz">Quiz</a>
            <a href="/settings">Settings</a>
          </div>
        </div>
      </div>
      <div className="main-content">
        <ChatAssistant />
      </div>
      <Footer />
    </div>
  );
}

export default App;
