import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@shared/routes';

function GetStartedButton() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(routes.public.signup);
  };

  return (
    <button 
      onClick={handleGetStarted}
      className="get-started-button"
    >
      Get Started
    </button>
  );
}

export default GetStartedButton; 