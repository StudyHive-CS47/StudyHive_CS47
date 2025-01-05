import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Header from './components/Header/Header';
import LoginPage from './pages/Login/LoginPage';
import SignupForm from './pages/Signup/SignupForm';
import GroupChatPage from './pages/GroupChat/GroupChatPage';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <GroupProvider>
                    <div className="app">
                        <Header />
                        <main className="main-content">
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupForm />} />
                                <Route 
                                    path="/chat" 
                                    element={
                                        <PrivateRoute>
                                            <GroupChatPage />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/" 
                                    element={<Navigate to="/chat" />} 
                                />
                            </Routes>
                        </main>
                    </div>
                </GroupProvider>
            </AuthProvider>
        </Router>
    );
}

export default App; 