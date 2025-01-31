import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import Header from './components/Header/Header';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import GroupChatPage from './pages/GroupChat/GroupChatPage';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/group-chat" element={
                  <ProtectedRoute>
                    <GroupChatPage />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/group-chat" />} />
              </Routes>
            </main>
          </div>
        </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 