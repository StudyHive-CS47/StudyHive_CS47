import React from 'react';
import Header from './Header';
import NavBar from './NavBar';

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <NavBar />
      <main className="pt-16 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          {/* Content */}
          <div className="relative">{children}</div>
        </div>
      </main>
    </>
  );
};

export default PageLayout; 