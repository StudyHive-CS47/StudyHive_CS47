// src/services/api.js
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BASE_URL = 'http://localhost:8080/api';
const WS_URL = 'http://localhost:8080/ws';

// Simulating a logged-in user - replace with actual auth
const currentUserEmail = "user@example.com"; 

let stompClient = null;

export const api = {
  createGroup: async (groupData) => {
    const response = await axios.post(`${BASE_URL}/groups`, {
      ...groupData,
      adminEmail: groupData.adminEmail,
      memberEmails: [groupData.adminEmail],
      fileIds: [],
      createdAt: Date.now()
    });
    return response;
  },

  getMyGroups: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/groups/my-groups?email=${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.error('Error fetching my groups:', error);
      throw error;
    }
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
    try {
      const response = await axios.post(`${BASE_URL}/groups/${groupId}/join`, userData);
      // After successful join, refresh my groups
      await api.getMyGroups(userData.email);
      return response;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  approveJoinRequest: async (requestId) => {
    const response = await axios.post(`${BASE_URL}/groups/approve-request/${requestId}`);
    return response.data;
  },

  getGroupById: async (groupId) => {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}`);
    return response.data;
  },

  connectToChat: (groupId, onMessageReceived) => {
    try {
      if (stompClient) {
        stompClient.deactivate();
      }

      const socket = new SockJS(WS_URL);
      
      stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          login: currentUserEmail,
        },
        debug: (str) => {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Connected to WebSocket');
          stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              onMessageReceived(receivedMessage);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
        },
        onError: (error) => {
          console.error('WebSocket Error:', error);
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame);
        }
      });

      stompClient.activate();
      
      return () => {
        if (stompClient) {
          stompClient.deactivate();
        }
      };
    } catch (error) {
      console.error('Error in connectToChat:', error);
      return () => {};
    }
  },

  getAllGroups: async () => {
    const response = await axios.get(`${BASE_URL}/groups/all`);
    return response;
  },

  searchGroups: async (searchTerm) => {
    const url = searchTerm 
      ? `${BASE_URL}/groups/search?name=${encodeURIComponent(searchTerm)}`
      : `${BASE_URL}/groups/all`;
    const response = await axios.get(url);
    return response;
  },

  joinGroup: async (groupId, data) => {
    return axios.post(`${BASE_URL}/groups/${groupId}/join`, data);
  }
};