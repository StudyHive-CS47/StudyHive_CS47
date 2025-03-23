import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@shared/routes';

function AnimatedStartButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(routes.public.signup)}
      className="bg-[#1A237E] text-white px-8 py-3 rounded-lg hover:bg-[#4051B5] transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[#1A237E]/20"
    >
      Get Started
    </button>
  );
}

export default AnimatedStartButton; 