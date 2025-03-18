import React from 'react';
import NavBar from './NavBar';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout; 