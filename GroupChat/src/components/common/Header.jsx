import React from 'react';

const Header = () => {
  return (
    <div className="h-16 bg-white border-b fixed top-0 left-0 right-0 z-10">
      <div className="h-full flex items-center px-6">
        <h1 className="text-xl font-semibold text-gray-800">Study Group Chat</h1>
      </div>
    </div>
  );
};

export default Header; 