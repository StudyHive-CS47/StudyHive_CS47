import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import SuccessPage from './pages/Success/SuccessPage';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="app">
            <ConnectionStatus />
            <Header />
            <main className="main-content">
              <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="/" element={<LoginPage />} />
                </Routes>
              </React.Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 