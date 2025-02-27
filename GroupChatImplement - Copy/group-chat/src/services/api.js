// src/services/api.js
import axios from 'axios';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'http://localhost:8080/api';

// Simulating a logged-in user - replace with actual auth
const currentUserEmail = "user@example.com"; 

let stompClient = null;

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
    if (stompClient && stompClient.connected) {
      await stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify({
          groupId,
          senderEmail: currentUserEmail,
          content: message,
          timestamp: new Date().toISOString()
        })
      });
    } else {
      throw new Error('WebSocket not connected');
    }
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
  },

  connectToChat: (groupId, onMessageReceived) => {
    if (stompClient) {
      stompClient.deactivate();
    }

    stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        login: currentUserEmail,
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
      onError: (error) => {
        console.error('WebSocket Error:', error);
      }
    });

    stompClient.activate();
    
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }
};