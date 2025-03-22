import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Summarizer from './components/Summarizer';
import Footer from '@shared/components/Footer/Footer';
import './styles/styles.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#EEF4FE] overflow-x-hidden">
      <div className="flex-1 w-full">
        <Routes>
          <Route index element={<Summarizer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App; 