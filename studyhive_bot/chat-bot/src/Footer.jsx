import React from 'react';
import './Footer.css';
import ChatAssistant from './components/Chatbot_new';
// Comment out or update the logo import to the correct path
// import logo from './assets/logo.png';

function Footer() {
  return (
    <>
      <ChatAssistant />
      <footer className="footer">
        <div className="footer-left">
          {/* Temporarily remove or update the logo image until you have the correct path */}
          {/* <img src={logo} alt="StudyHive" className="footer-logo" /> */}
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
          <a href="https://www.facebook.com/profile.php?id=61570160061839" className="social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/studyhive_edu/profilecard/?igsh=Zmo1cHlrc3E5dGht" className="social-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/company/studyhive/" className="social-link">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer; 