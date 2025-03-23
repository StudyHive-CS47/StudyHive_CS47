import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@shared/contexts/AuthContext';
import Header from '@shared/components/Header/Header';
import Footer from './components/Footer/Footer';
import SEO from '@shared/components/SEO/SEO';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary';
import { routes } from '@shared/routes';
import LoadingSpinner from '@shared/components/LoadingSpinner/LoadingSpinner';
import './App.css';

// Lazy load components for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const QnA = lazy(() => import('@features/qna/src/pages/QnA'));
const Quiz = lazy(() => import('@features/quiz/src/App'));
const ChatBot = lazy(() => import('@features/chat_bot/src/App'));
const NoteSharing = lazy(() => import('@features/notesharing/src/App'));
const Summarizer = lazy(() => import('@features/summarizer/src/App'));
const GroupChat = lazy(() => import('@features/groupchat/src/App'));

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <div className="app">
            <SEO />
            <ConnectionStatus />
            <Header />
            <main className="main-content">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/login" element={
                    <>
                      <SEO 
                        title="Login to StudyHive - Access Your Learning Resources"
                        description="Log in to StudyHive to access your personalized learning resources, shared notes, and collaborative study tools."
                        keywords="student login, academic portal, study resources, educational platform"
                      />
                      <LoginPage />
                    </>
                  } />
                  <Route path="/signup" element={
                    <>
                      <SEO 
                        title="Join StudyHive - Start Your Collaborative Learning Journey"
                        description="Sign up for StudyHive to join a community of students sharing notes, participating in group discussions, and enhancing their academic success."
                        keywords="student signup, join academic community, study collaboration, educational platform registration"
                      />
                      <SignupPage />
                    </>
                  } />
                  <Route path="/qna/*" element={
                    <>
                      <SEO 
                        title="StudyHive Q&A - Get Answers to Your Academic Questions"
                        description="Ask questions, share knowledge, and get expert answers from the StudyHive community. Join academic discussions and enhance your understanding."
                        keywords="academic Q&A, student questions, study help, educational discussions, peer learning"
                      />
                      <QnA />
                    </>
                  } />
                  <Route path="/quiz/*" element={
                    <>
                      <SEO 
                        title="StudyHive Quiz - Test Your Knowledge"
                        description="Take quizzes, create assessments, and track your learning progress with StudyHive's interactive quiz platform."
                        keywords="academic quizzes, study assessment, learning evaluation, educational testing"
                      />
                      <Quiz />
                    </>
                  } />
                  <Route path="/chatbot/*" element={
                    <>
                      <SEO 
                        title="StudyHive AI Chatbot - Your 24/7 Study Assistant"
                        description="Get instant help with your studies using StudyHive's AI-powered chatbot. Available 24/7 for academic assistance and guidance."
                        keywords="AI study assistant, academic chatbot, learning support, educational AI"
                      />
                      <ChatBot />
                    </>
                  } />
                  <Route path="/notes/*" element={
                    <>
                      <SEO 
                        title="StudyHive Notes - Share and Access Study Materials"
                        description="Access and share high-quality study notes, lecture materials, and academic resources. Collaborate with peers and enhance your learning experience."
                        keywords="study notes, lecture materials, academic resources, note sharing, collaborative learning"
                      />
                      <NoteSharing />
                    </>
                  } />
                  <Route path="/summarizer/*" element={
                    <>
                      <SEO 
                        title="StudyHive Summarizer - Create Concise Study Materials"
                        description="Transform lengthy academic content into concise, easy-to-understand summaries with StudyHive's AI-powered summarization tool."
                        keywords="text summarization, study notes, content summary, academic tools"
                      />
                      <Summarizer />
                    </>
                  } />
                  <Route path="/chat/*" element={
                    <>
                      <SEO 
                        title="StudyHive Group Chat - Collaborate with Fellow Students"
                        description="Join study groups, participate in academic discussions, and collaborate with peers in real-time through StudyHive's group chat feature."
                        keywords="study groups, academic chat, student collaboration, group discussions"
                      />
                      <GroupChat />
                    </>
                  } />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App; 