import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route path="/" element={<ChatBot />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
