import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="StudyHive" className="footer-logo" />
        <h2 className="footer-brand">StudyHive</h2>
      </div>
      <div className="footer-center">
        <Link to="/about">About</Link>
        <Link to="/features">Features</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/donate">Donate</Link>
        <Link to="/team">Team</Link>
      </div>
      <div className="footer-right">
        <a 
          href="https://www.facebook.com/profile.php?id=61570160061839" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a 
          href="https://www.instagram.com/studyhive_edu/profilecard/?igsh=Zmo1cHlrc3E5dGht" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a 
          href="https://www.linkedin.com/company/studyhive/" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a 
          href="https://github.com/StudyHive-CS47" 
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer; 