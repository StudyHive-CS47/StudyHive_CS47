import React from 'react';
import Header from '@shared/components/Header';
import Footer from '@shared/components/Footer';
import ChatBot from './components/ChatBot'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <ChatBot />
      </main>
    </div>
  )
}

export default App
