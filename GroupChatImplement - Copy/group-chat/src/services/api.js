// src/services/api.js
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_URL}/api`;
const WS_URL = `${API_URL}/ws`;

// Simulating a logged-in user - replace with actual auth
const currentUserEmail = "user@example.com"; 

let stompClient = null;

export const api = {
  // MongoDB operations
  createGroup: async (groupData) => {
    try {
      const response = await axios.post(`${BASE_URL}/groups`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  getGroupById: async (groupId) => {
    try {
      const response = await axios.get(`${BASE_URL}/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw error;
    }
  },

  getMyGroups: async (email) => {
    if (!email) {
      throw new Error('Email is required');
    }
    try {
      const response = await axios.get(`${BASE_URL}/groups/my-groups?email=${email}`);
      return response;
    } catch (error) {
      console.error('Error fetching my groups:', error);
      throw error;
    }
  },

  // File operations (MongoDB)
  uploadFile: async (groupId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${BASE_URL}/groups/${groupId}/files`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  getGroupFiles: async (groupId) => {
    try {
      const response = await axios.get(`${BASE_URL}/groups/${groupId}/files`);
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  },

  // Supabase chat operations
  sendMessage: async (groupId, content, senderEmail) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          group_id: groupId,
          sender_email: senderEmail,
          content: content,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getMessages: async (groupId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  getGroupMessages: async (groupId) => {
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/messages`);
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