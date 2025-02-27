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
  }
};