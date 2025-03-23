import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (e, to) => {
    e.preventDefault();
    navigate('/auth/login');
  };

  const navLinks = [
    { to: "/note-sharing", label: "Note Sharing" },
    { to: "/chatbot", label: "ChatBot" },
    { to: "/q-and-a", label: "Q & A" },
    { to: "/group-chat", label: "Group Chat" },
    { to: "/summarize-ai", label: "Summarize AI" },
    { to: "/quiz", label: "Quiz" }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="StudyHive" className="h-10 w-auto" />
              <h1 className="ml-3 text-xl font-bold text-blue-700">StudyHive</h1>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavigation(e, link.to)}
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/auth/login"
              className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavigation(e, link.to);
                }}
                className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader; 