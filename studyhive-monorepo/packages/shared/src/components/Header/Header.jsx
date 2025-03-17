import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { routes } from '../../routes';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(routes.public.login);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src={logo} alt="StudyHive" className="header-logo" />
          <h1 className="header-title">StudyHive</h1>
        </div>
        <nav className="header-nav">
          <Link to={routes.protected.home}>Home</Link>
          <Link to={routes.protected.notesharing}>Note Sharing</Link>
          <Link to={routes.protected.chatbot}>ChatBot</Link>
          <Link to={routes.protected.qna}>Q & A</Link>
          <Link to={routes.protected.groupchat}>Group Chat</Link>
          <Link to={routes.protected.summarizer}>Summarize AI</Link>
          <Link to={routes.protected.quiz}>Quiz</Link>
        </nav>
        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header; 