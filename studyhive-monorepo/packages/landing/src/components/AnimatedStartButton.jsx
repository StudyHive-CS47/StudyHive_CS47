import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@shared/routes';

function AnimatedStartButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(routes.public.signup)}
      className="bg-[#3f87a6] text-white px-8 py-3 rounded-lg hover:bg-[#2d6380] transform hover:-translate-y-1 transition-all duration-300"
    >
      Get Started
    </button>
  );
}

export default AnimatedStartButton; 