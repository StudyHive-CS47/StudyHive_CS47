import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Summarizer from './components/Summarizer';
import './styles/styles.css';

function App() {
  return (
    <div className="min-h-screen">
      <main>
        <Routes>
          <Route path="/" element={<Summarizer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 