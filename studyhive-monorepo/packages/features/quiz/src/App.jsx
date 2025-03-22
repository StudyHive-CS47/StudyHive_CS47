import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizHome from './components/Quiz/QuizHome';
import CreateQuiz from './components/Quiz/CreateQuiz';
import QuizQuestion from './components/Quiz/QuizQuestion';
import SearchQuiz from './components/Quiz/SearchQuiz';
import QuizHistory from './components/Quiz/QuizHistory';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route index element={<QuizHome />} />
          <Route path="create" element={<CreateQuiz />} />
          <Route path="search" element={<SearchQuiz />} />
          <Route path="history" element={<QuizHistory />} />
          <Route path=":code" element={<QuizQuestion />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 