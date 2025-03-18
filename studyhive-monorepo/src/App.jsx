import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';
import Header from '@shared/components/Header/Header';

// Import auth pages directly instead of the whole auth App
const LoginPage = React.lazy(() => import('@auth/pages/Login/LoginPage'));
const SignupPage = React.lazy(() => import('@auth/pages/Signup/SignupPage'));
const Landing = React.lazy(() => import('@landing/App.jsx'));
const Home = React.lazy(() => import('@home/App.jsx'));
const NoteSharing = React.lazy(() => import('@notesharing/App.jsx'));
const QnA = React.lazy(() => import('@qna/App.jsx'));
const GroupChat = React.lazy(() => import('@groupchat/App.jsx'));
const Summarizer = React.lazy(() => import('@summarizer/App.jsx'));
const Quiz = React.lazy(() => import('@quiz/App.jsx'));
const ChatBot = React.lazy(() => import('@chat_bot/App.jsx'));

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to={routes.public.login} />;
}

function App() {
  const { user } = useAuth();
  const showHeader = user && window.location.pathname !== routes.public.landing;

  return (
    <>
      {showHeader && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path={routes.public.landing} element={<Landing />} />
          <Route 
            path={routes.public.login} 
            element={user ? <Navigate to={routes.protected.home} /> : <LoginPage />} 
          />
          <Route 
            path={routes.public.signup} 
            element={user ? <Navigate to={routes.protected.home} /> : <SignupPage />} 
          />

          {/* Protected Routes */}
          <Route
            path={routes.protected.home}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.notesharing}
            element={
              <ProtectedRoute>
                <NoteSharing />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.qna}
            element={
              <ProtectedRoute>
                <QnA />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.groupchat + "/*"}
            element={
              <ProtectedRoute>
                <GroupChat />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.summarizer}
            element={
              <ProtectedRoute>
                <Summarizer />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.quiz}
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.protected.chatbot}
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to={routes.public.landing} />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App; 