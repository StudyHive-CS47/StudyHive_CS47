import React from 'react';
import Header from './Header';
import NavBar from './NavBar';

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <NavBar />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </>
  );
};

export default PageLayout; 