import React from 'react';
import Header from './components/Header/Header';
import Summarizer from './components/Summarizer';
import Footer from './components/Footer/Footer';
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