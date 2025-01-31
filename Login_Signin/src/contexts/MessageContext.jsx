import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState({});

  // Function to listen to messages for a specific group
  const subscribeToGroupMessages = (groupId) => {
    return onSnapshot(
      query(
        collection(db, 'messages'),
        where('groupId', '==', groupId),
        orderBy('createdAt', 'asc')
      ),
      (snapshot) => {
        const groupMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(prev => ({
          ...prev,
          [groupId]: groupMessages
        }));
      }
    );
  };

  // Function to send a message
  const sendMessage = async (groupId, userId, content) => {
    try {
      await addDoc(collection(db, 'messages'), {
        groupId,
        userId,
        content,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <MessageContext.Provider value={{
      messages,
      subscribeToGroupMessages,
      sendMessage
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext); 