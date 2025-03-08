import React from 'react';

const Header = () => {
  return (
    <div className="h-16 bg-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="h-full flex items-center justify-center">
        <h1 className="text-xl font-semibold">Study Group Chat</h1>
      </div>
    </div>
  );
};

export default Header; 