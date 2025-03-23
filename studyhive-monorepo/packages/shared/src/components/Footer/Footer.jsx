import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';

const FontAwesomeScript = () => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return null;
};

function Footer() {
  return (
    <>
      <FontAwesomeScript />
      <footer className="footer">
        <div className="footer-left">
          <img src={logo} alt="StudyHive" className="footer-logo" />
          <h2 className="footer-brand">StudyHive</h2>
        </div>
        <div className="footer-center">
          <a href="https://www.studyhive-info.online" target="_blank" rel="noopener noreferrer">About</a>
          <a href="https://www.studyhive-info.online" target="_blank" rel="noopener noreferrer">Features</a>
          <a href="https://www.studyhive-info.online" target="_blank" rel="noopener noreferrer">Feedback</a>
          <a href="https://www.studyhive-info.online" target="_blank" rel="noopener noreferrer">Donate</a>
          <a href="https://www.studyhive-info.online" target="_blank" rel="noopener noreferrer">Team</a>
        </div>
        <div className="footer-right">
          <a href="https://www.facebook.com/profile.php?id=61570160061839" className="social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/studyhive_edu/profilecard/?igsh=Zmo1cHlrc3E5dGht" className="social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/company/studyhive/" className="social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/StudyHive-CS47" className="social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer; 