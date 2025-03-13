import React from 'react';
import './Footer.css';
import logo from './assets/logo.jpeg';
import 'font-awesome/css/font-awesome.min.css';

function Footer() {
  return (
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
      <a href="https://www.facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
       <i className="fab fa-facebook-f"></i>
      </a>
      <a href="https://www.instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="https://www.linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin"></i>
      </a>
      <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github"></i>
      </a>
      </div>

    </footer>
  );
}

export default Footer;
