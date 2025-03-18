import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.includes(path) ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link
            to="/chat/my-groups"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('my-groups')}`}
          >
            My Groups
          </Link>
          <Link
            to="/chat/explore"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('explore')}`}
          >
            Explore
          </Link>
          <Link
            to="/chat/create"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('create')}`}
          >
            Create Group
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 