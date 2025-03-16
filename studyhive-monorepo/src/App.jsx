import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';
import Header from '@shared/components/Header';

// Lazy load components with correct paths
const Landing = React.lazy(() => import('@landing/src/App'));
const Login = React.lazy(() => import('@auth/src/pages/Login/LoginPage'));
const Signup = React.lazy(() => import('@auth/src/pages/Signup/SignupPage'));
const Home = React.lazy(() => import('@home/src/App'));
const NoteSharing = React.lazy(() => import('@features/notesharing/src/App'));
const QnA = React.lazy(() => import('@features/qna/src/App'));
const GroupChat = React.lazy(() => import('@features/groupchat/src/App'));
const Summarizer = React.lazy(() => import('@features/summarizer/src/App'));
const Quiz = React.lazy(() => import('@features/quiz/src/App'));
const ChatBot = React.lazy(() => import('@features/chat_bot/src/App'));

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
          <Route path={routes.public.login} element={<Login />} />
          <Route path={routes.public.signup} element={<Signup />} />

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
            path={routes.protected.groupchat}
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