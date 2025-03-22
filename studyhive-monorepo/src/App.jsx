import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';
import Header from '@shared/components/Header/Header';

const LoginPage = React.lazy(() => import('@auth/pages/Login/LoginPage'));
const SignupPage = React.lazy(() => import('@auth/pages/Signup/SignupPage'));
const Landing = React.lazy(() => import('@landing/App'));
const Home = React.lazy(() => import('@home/App'));
const NoteSharing = React.lazy(() => import('@notesharing/App'));
const QnA = React.lazy(() => import('@qna/App'));
const GroupChat = React.lazy(() => import('@groupchat/App'));
const Summarizer = React.lazy(() => import('@summarizer/App'));
const Quiz = React.lazy(() => import('@quiz/App'));
const ChatBot = React.lazy(() => import('@chat_bot/App'));
const UserProfile = React.lazy(() => import('@userprofile/App'));
const Help = React.lazy(() => import('@userprofile/pages/Help/HelpPage'));

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to={routes.public.login} />;
}

function App() {
  const { user } = useAuth();
  const showHeader = user && window.location.pathname !== routes.public.landing;

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      {showHeader && <Header />}
      <main className="flex-1 overflow-auto">
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
              path={`${routes.protected.groupchat}/*`}
              element={
                <ProtectedRoute>
                  <GroupChat />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.protected.summarizer}/*`}
              element={
                <ProtectedRoute>
                  <Summarizer />
                </ProtectedRoute>
              }
            />
            <Route
              path={`${routes.protected.quiz}/*`}
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
            <Route
              path={routes.protected.profile}
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes to home if logged in, otherwise to landing */}
            <Route 
              path="*" 
              element={user ? <Navigate to={routes.protected.home} /> : <Navigate to={routes.public.landing} />} 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App; 