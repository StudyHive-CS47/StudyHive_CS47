import React from 'react';

function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <span className="text-lg font-semibold text-gray-700">StudyHive</span>
          </div>
          <nav className="flex-grow flex justify-center space-x-8 mx-4">
            <a href="#" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Feedback</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Donate</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Team</a>
          </nav>
          <div className="flex space-x-6 flex-shrink-0">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-900 transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-900 transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-900 transition-colors">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 