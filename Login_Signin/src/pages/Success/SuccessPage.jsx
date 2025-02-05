import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SuccessPage.css';

function SuccessPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <h1>Login Successful!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SuccessPage; 