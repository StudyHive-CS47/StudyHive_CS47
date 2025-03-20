import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div 
      className={`fixed left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl shadow-lg transition-all duration-300 z-50
        ${isExpanded ? 'w-48 px-4' : 'w-16 px-2'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-6 space-y-6">
        <NavItem
          path="/chat/explore"
          isActive={isActive('/explore')}
          onClick={() => navigate('/chat/explore')}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          }
          label="Explore"
          isExpanded={isExpanded}
        />
        
        <NavItem
          path="/chat/my-groups"
          isActive={isActive('/my-groups')}
          onClick={() => navigate('/chat/my-groups')}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          }
          label="Groups"
          isExpanded={isExpanded}
        />
        
        <NavItem
          path="/chat/create"
          isActive={isActive('/create')}
          onClick={() => navigate('/chat/create')}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          }
          label="Create"
          isExpanded={isExpanded}
        />
      </div>

      {/* Indicator dot for navigation presence */}
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

const NavItem = ({ isActive, onClick, icon, label, isExpanded }) => (
  <div
    onClick={onClick}
    className={`flex items-center cursor-pointer group transition-all duration-200
      ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-3 rounded-xl transition-colors duration-200 
      ${isActive ? 'bg-blue-50' : 'group-hover:bg-gray-100'}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <span 
      className={`ml-3 font-medium transition-all duration-300 whitespace-nowrap
        ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'}`}
    >
      {label}
    </span>
  </div>
);

export default NavBar; 