import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "WELCOME! I'M BUZZBUDDY",
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Function to group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      const date = msg.timestamp.split(' ')[0]; // Get just the date part
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  // Function to save current chat to history
  const saveToHistory = () => {
    if (messages.length > 1) { // Only save if there are messages beyond the welcome message
      const newChat = {
        id: Date.now(),
        title: messages[1].content.substring(0, 30) + "...", // Use first user message as title
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        messages: [...messages]
      };
      setChatHistory(prev => [newChat, ...prev]);
    }
  };

  // Function to start new chat
  const startNewChat = () => {
    saveToHistory();
    setMessages([{
      role: 'assistant',
      content: "WELCOME! I'M BUZZBUDDY",
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }]);
    setSelectedChat(null);
  };

  // Function to load a chat from history
  const loadChat = (chat) => {
    setMessages(chat.messages);
    setSelectedChat(chat.id);
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
          usePdf: isPdfMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
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

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await getBotResponse(input);
    const botMessage = {
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setIsPdfMode(true);
        const botMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Error uploading PDF: ${error.message}`,
        timestamp: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Handle file input click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button
            onClick={startNewChat}
            className="new-chat-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New chat</span>
          </button>
        </div>

        <div className="chat-history">
          <div className="history-list">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat)}
                className={`history-item ${selectedChat === chat.id ? 'selected' : ''}`}
              >
                <div className="history-item-content">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span className="history-title">{chat.title}</span>
                </div>
                <span className="history-date">{chat.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <div className="chat-header">
          <div className="chat-title">BuzzBuddy</div>
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  <img src="/user-avatar.png" alt="User" className="avatar" />
                ) : (
                  <img src="/bot-avatar.png" alt="BuzzBuddy" className="avatar" />
                )}
              </div>
              <div className="message-bubble">
                <div className="message-timestamp">
                  {msg.timestamp}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleSubmit} className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message BuzzBuddy..."
              className="message-input"
            />
            <div className="input-actions">
              <button 
                type="button" 
                className="attach-button"
                onClick={handleFileClick}
                title="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button 
                type="submit" 
                className="send-button" 
                disabled={!input.trim()}
                title="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden-file-input"
              accept=".pdf,.doc,.docx,.txt"
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatAssistant;