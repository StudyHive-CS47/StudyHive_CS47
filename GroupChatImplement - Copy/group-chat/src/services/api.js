// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Simulating a logged-in user - replace with actual auth
const currentUserEmail = "user@example.com"; 

export const api = {
  createGroup: async (groupData) => {
    const response = await axios.post(`${BASE_URL}/groups`, {
      ...groupData,
      adminEmail: currentUserEmail,
      memberEmails: [currentUserEmail],
      fileIds: [],
      createdAt: Date.now()
    });
    return response;
  },

  getMyGroups: async () => {
    const response = await axios.get(`${BASE_URL}/groups?userEmail=${currentUserEmail}`);
    return response;
  },

  getGroupMessages: async (groupId) => {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/messages`);
    return response.data;
  },

  sendMessage: async (groupId, message) => {
    const response = await axios.post(`${BASE_URL}/groups/${groupId}/messages`, message);
    return response.data;
  },

  uploadFile: async (groupId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}/groups/${groupId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getGroupFiles: async (groupId) => {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/files`);
    return response.data;
  },

  joinGroup: async (groupId, userData) => {
    const response = await axios.post(`${BASE_URL}/groups/${groupId}/join`, userData);
    return response.data;
  },

  approveJoinRequest: async (requestId) => {
    const response = await axios.post(`${BASE_URL}/groups/approve-request/${requestId}`);
    return response.data;
  }
};