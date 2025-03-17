import React from 'react';
import Header from '@shared/components/Header';
import Summarizer from './components/Summarizer';
import Footer from '@shared/components/Footer';
import './styles/styles.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Summarizer />
      </main>
      <Footer />
    </div>
  );
}

export default App; 