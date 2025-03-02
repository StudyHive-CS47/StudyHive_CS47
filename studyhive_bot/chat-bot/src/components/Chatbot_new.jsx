import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { API_KEY, API_URL } from '../config/api';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "WELCOME! I'M BUZZBUDDY",
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }
  ]);
  
  // Remove the static chatHistory and use the dynamic one
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add these new functions
  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/history');
      const data = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${chatId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/new', {
        method: 'POST'
      });
      const data = await response.json();
      setCurrentChatId(data.id);
      setMessages([{
        role: 'assistant',
        content: "WELCOME! I'M BUZZBUDDY",
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      }]);
      await fetchChatHistory();
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const formatBotResponse = (text) => {
    // Split by sentences (considering multiple punctuation marks)
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Join sentences with line breaks and proper spacing
    return sentences
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .join('\n\n');
  };

  const getBotResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: userMessage,
          chatId: currentChatId 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Bot response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Format the response before returning
      return formatBotResponse(data.response);
    } catch (error) {
      console.error('Error getting bot response:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get and add bot response
    const botResponse = await getBotResponse(input);
    const botMessage = {
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Add file handling function
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the selected file here
      console.log('Selected file:', file.name);
      // You can add logic to upload or process the file
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add useEffect to fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Add click handler for chat history items
  const handleChatClick = async (chatId) => {
    setCurrentChatId(chatId);
    await fetchChatMessages(chatId);
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        {/* New Chat Button */}
        <button onClick={handleNewChat} className="new-chat-button">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        {/* History Section */}
        <div className="history-section">
          <div className="history-header">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </div>
          
          {/* Group chats by date */}
          {['Today', 'Previous 7 Days'].map(date => (
            <div key={date} className="date-group">
              <div className="date-header">{date}</div>
              <div className="chat-list">
                {chatHistory
                  .filter(chat => chat.date === date)
                  .map(chat => (
                    <div 
                      key={chat.id} 
                      className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      {chat.title}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-title">BuzzBuddy</div>
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message-wrapper">
              {msg.file && (
                <div className="file-preview">
                  <span>{msg.file.name}</span>
                  <span className="file-url">{msg.file.url}</span>
                </div>
              )}
              <div className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? (
                    <img src="/user-avatar.png" alt="User" className="avatar" />
                  ) : (
                    <img src="/bot-avatar.png" alt="BuzzBuddy" className="avatar" />
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper">
              <div className="message assistant">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message to BuzzBuddy..."
            className="message-input"
          />
          {/* Add hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden-file-input"
          />
          {/* Update attachment button to trigger file input */}
          <button 
            type="button" 
            className="attach-button"
            onClick={handleFileClick}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button 
            type="submit" 
            className="send-button" 
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant; 