import React from 'react';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src={logo} alt="StudyHive" className="header-logo" />
          <h1 className="header-title">StudyHive</h1>
        </div>
        <nav className="header-nav">
          <a href="#">Home</a>
          <a href="#">Note Sharing & Search</a>
          <a href="#">ChatBot</a>
          <a href="#">Q & A</a>
          <a href="#">Group chat</a>
          <a href="#">Summarize AI</a>
          <a href="#">Quiz</a>
          <a href="#">Settings</a>
        </nav>
        <div className="header-right">
          <button className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#666" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <button className="profile-button">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#666" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 