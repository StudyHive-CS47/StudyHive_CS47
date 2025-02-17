import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import QuizHome from './components/Quiz/QuizHome';
import CreateQuiz from './components/Quiz/CreateQuiz';
import QuizQuestion from './components/Quiz/QuizQuestion';
import SearchQuiz from './components/Quiz/SearchQuiz';
import QuizHistory from './components/Quiz/QuizHistory';
import Leaderboard from './components/Quiz/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/quizzes" replace />} />
            <Route path="/quizzes" element={<QuizHome />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/quiz/:id" element={<QuizQuestion />} />
            <Route path="/search-quizzes" element={<SearchQuiz />} />
            <Route path="/quiz-history" element={<QuizHistory />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 