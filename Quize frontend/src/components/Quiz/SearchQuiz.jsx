import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SearchQuiz() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Quizzes</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, subject, or creator..."
            className="flex-grow px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                By {quiz.creator}
              </span>
              <Link 
                to={`/quiz/${quiz.id}`}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Take Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchQuiz; 