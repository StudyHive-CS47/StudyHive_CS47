import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Signup/Signup.jsx';
import LandingPage from './pages/Landing/Landing.jsx'
import HomePage from './pages/Home/Home.jsx';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import ErrorBoundary from './components/PrivateRoute/ErrorBoundary.jsx';
import './App.css';
import "./index.css"; // Make sure this is at the top


function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <div className="las_app">
                        <ConnectionStatus />
                        <Header />
                        <main className="las_main-content">
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <Routes>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/home" element={<HomePage />} />
                                    <Route path="/Landing" element={<LandingPage />} />
                                    <Route path="/" element={<LoginPage/>} /> {/* Default to LoginPage */}
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
