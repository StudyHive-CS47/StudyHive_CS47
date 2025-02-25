import React, { useState, useEffect } from 'react';
import './Chat.css';
import { API_KEY, API_URL, testAPI } from '../config/openai';

function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Add useEffect to test API on component mount
  useEffect(() => {
    testAPI().then(result => {
      console.log('API Test Result:', result);
    });
  }, []);

  console.log('API Key available:', !!API_KEY); // Will log true if API key exists
  // State for chat messages and chat history
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'Current Chat',
      messages: [
        {
          type: 'bot',
          text: "I'm StudyHive Bot, your AI study assistant. How can I help you today?"
        }
      ],
      active: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle new chat creation
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(), // Simple way to generate unique ID
      title: 'New Chat',
      messages: [
        {
          type: 'bot',
          text: "Hello! I'm StudyHive Bot, your AI study assistant. How can I help you today?"
        }
      ],
      active: true
    };

    // Update all other chats to be inactive
    const updatedChats = chats.map(chat => ({
      ...chat,
      active: false
    }));

    // Add new chat to the beginning of the list
    setChats([newChat, ...updatedChats]);
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage.trim()
    };

    // Update UI with user message
    const updatedChats = chats.map(chat => {
      if (chat.active) {
        return {
          ...chat,
          title: inputMessage.split(' ').slice(0, 3).join(' ') + '...',
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botMessage = {
          type: 'bot',
          text: data.choices[0].message.content
        };

        setChats(prevChats => prevChats.map(chat => {
          if (chat.active) {
            return {
              ...chat,
              messages: [...chat.messages, botMessage]
            };
          }
          return chat;
        }));
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setChats(prevChats => prevChats.map(chat => {
        if (chat.active) {
          return {
            ...chat,
            messages: [...chat.messages, {
              type: 'bot',
              text: `Error: ${error.message}. Please try again.`
            }]
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat selection
  const handleChatSelect = (selectedId) => {
    setChats(chats.map(chat => ({
      ...chat,
      active: chat.id === selectedId
    })));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get the active chat
  const activeChat = chats.find(chat => chat.active) || chats[0];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      
      <div className="chat-container">
        <div className={`chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button className="new-chat-button" onClick={handleNewChat}>
              <span>+ New chat</span>
            </button>
          </div>
          <div className="chat-history">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`history-item ${chat.active ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <span>{chat.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-messages">
            {activeChat.messages.map((message, index) => (
              <div key={index} className={`message-group ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="message-avatar">
                    <img src="/studyhive-bot.png" alt="StudyHive Bot" />
                  </div>
                )}
                <div className="message-content">
                  {message.type === 'bot' && (
                    <div className="message-header">
                      <span className="bot-name">StudyHive Bot</span>
                    </div>
                  )}
                  <div className="message-text">
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-group bot">
                <div className="message-avatar">
                  <img src="/studyhive-bot.png" alt="StudyHive Bot" />
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="bot-name">StudyHive Bot</span>
                  </div>
                  <div className="message-text loading">
                    <span className="typing-indicator"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea 
                className="chat-input"
                placeholder="Send a message..."
                rows="1"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="chat-input-footer">
              <span>StudyHive may produce inaccurate information. Consider checking important information.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat; 