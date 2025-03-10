const API_URL = 'your-backend-url';

export const quizService = {
  async createQuiz(quizData) {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });
    return response.json();
  },

  async getQuizzes() {
    const response = await fetch(`${API_URL}/quizzes`);
    return response.json();
  },

  async getQuizById(id) {
    const response = await fetch(`${API_URL}/quizzes/${id}`);
    return response.json();
  },

  async submitQuizAnswer(quizId, answers) {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    return response.json();
  },

  async getSearchHistory(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/search-history`);
    return response.json();
  },

  async getCreatedQuizzes(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/created-quizzes`);
    return response.json();
  },

  async searchQuizzes(searchTerm) {
    const response = await fetch(`${API_URL}/quizzes/search?subject=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async getQuizHistory(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/quiz-history`);
    return response.json();
  }
}; 