import axios from "axios"

const API_BASE_URL = "http://localhost:8081/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Questions API
export const questionsApi = {
  getAll: (page = 0, size = 10, userId) =>
    api.get(`/questions?page=${page}&size=${size}${userId ? `&userId=${userId}` : ""}`),

  getById: (id, userId) => api.get(`/questions/${id}${userId ? `?userId=${userId}` : ""}`),

  getByCategory: (category, page = 0, size = 10, userId) =>
    api.get(`/questions/category/${category}?page=${page}&size=${size}${userId ? `&userId=${userId}` : ""}`),

  getPopular: (page = 0, size = 10, userId) =>
    api.get(`/questions/popular?page=${page}&size=${size}${userId ? `&userId=${userId}` : ""}`),

  search: (keyword, page = 0, size = 10, userId) =>
    api.get(`/questions/search?keyword=${keyword}&page=${page}&size=${size}${userId ? `&userId=${userId}` : ""}`),

  create: (question) => api.post("/questions", question),

  update: (id, question) => api.put(`/questions/${id}`, question),

  delete: (id) => api.delete(`/questions/${id}`),

  like: (id, userId) => api.post(`/questions/${id}/like?userId=${userId}`),

  save: (id, userId) => api.post(`/questions/${id}/save?userId=${userId}`),
}

// Comments API
export const commentsApi = {
  getByQuestionId: (questionId, page = 0, size = 10) =>
    api.get(`/comments/question/${questionId}?page=${page}&size=${size}`),

  create: (comment) => api.post("/comments", comment),

  update: (id, comment) => api.put(`/comments/${id}`, comment),

  delete: (id) => api.delete(`/comments/${id}`),
}

// Categories API
export const categoriesApi = {
  getAll: () => api.get("/categories"),

  getPopular: () => api.get("/categories/popular"),

  getById: (id) => api.get(`/categories/${id}`),
}

// File Upload API
export const uploadApi = {
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append("file", file)

    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}

export default {
  questions: questionsApi,
  comments: commentsApi,
  categories: categoriesApi,
  upload: uploadApi,
}

