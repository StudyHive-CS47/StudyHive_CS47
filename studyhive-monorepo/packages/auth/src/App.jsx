import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@shared/contexts/AuthContext';
import Header from '@shared/components/Header/Header';
import Footer from './components/Footer/Footer';
import { LoginPage, SignupPage } from './pages';
import QnA from '@features/qna/src/pages/QnA';
import Quiz from '@features/quiz/src/App';
import ChatBot from '@features/chat_bot/src/App';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary';
import { routes } from '@shared/routes';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <ConnectionStatus />
          <Header />
          <main className="main-content">
            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/qna/*" element={<QnA />} />
                <Route path="/quiz/*" element={<Quiz />} />
                <Route path="/chatbot/*" element={<ChatBot />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 