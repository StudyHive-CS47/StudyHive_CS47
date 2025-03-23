import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import logo from '../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-medium no-underline' : 'text-gray-600 hover:text-blue-500 no-underline';
  };

  const navLinks = [
    { path: routes.protected.home, label: 'Home' },
    { path: routes.protected.notesharing, label: 'Note Sharing' },
    { path: routes.protected.chatbot, label: 'ChatBot' },
    { path: routes.protected.qna, label: 'Q & A' },
    { path: routes.protected.groupchat, label: 'Group Chat' },
    { path: routes.protected.summarizer, label: 'Summarize AI' },
    { path: routes.protected.quiz, label: 'Quiz' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={routes.protected.home} className="flex items-center no-underline">
              <img src={logo} alt="StudyHive" className="h-8 w-auto" />
              <h1 className="ml-2.5 text-xl font-bold text-blue-700">StudyHive</h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path)} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap no-underline`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div className="hidden md:flex md:items-center">
            <Link 
              to={routes.protected.profile} 
              className="ml-4 p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors duration-150 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path)} block px-3 py-2.5 rounded-md text-base font-medium text-center no-underline`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex justify-center items-center px-3">
              <Link 
                to={routes.protected.profile} 
                className="text-gray-500 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 transition-colors duration-150 no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 