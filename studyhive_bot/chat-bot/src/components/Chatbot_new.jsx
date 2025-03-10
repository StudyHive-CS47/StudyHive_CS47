import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "**WELCOME! I'M BUZZBUDDY**",
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
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [hasPdfLoaded, setHasPdfLoaded] = useState(false);

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
    if (messages.length > 1) {
      const newChat = {
        id: Date.now(),
        title: messages[1].content.substring(0, 30) + "...",
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        messages: [...messages],
        isPdfMode: isPdfMode,
        hasPdfLoaded: hasPdfLoaded
      };
      setChatHistory(prev => [newChat, ...prev]);
    }
  };

  // Function to start new chat
  const startNewChat = () => {
    saveToHistory();
    setMessages([{
      role: 'assistant',
      content: "**WELCOME! I'M BUZZBUDDY**",
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
    setIsPdfMode(false);
  };

  // Function to load a chat from history
  const loadChat = (chat) => {
    setMessages(chat.messages);
    setSelectedChat(chat.id);
    setIsPdfMode(chat.isPdfMode || false);
    setHasPdfLoaded(chat.hasPdfLoaded || false);
  };

  // Add a function to clear chat history
  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      localStorage.removeItem('chatHistory');
      setChatHistory([]);
    }
  };

  // Add this new function to handle individual chat deletion
  const deleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      if (selectedChat === chatId) {
        setSelectedChat(null);
        startNewChat();
      }
    }
  };

  const formatBotResponse = (text) => {
    // Handle bullet points and numbered lists
    text = text.replace(/•/g, '\n•');
    text = text.replace(/(\d+\.\s)/g, '\n$1');

    // Handle code blocks
    text = text.replace(/```(.*?)```/gs, (match) => `\n${match}\n`);

    // Add spacing after punctuation
    text = text.replace(/([.!?])\s*/g, '$1\n\n');

    // Remove extra newlines
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
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
        setHasPdfLoaded(true);
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

  const handleModeToggle = () => {
    if (!hasPdfLoaded && !isPdfMode) {
      alert('Please upload a PDF file first');
      return;
    }
    setIsPdfMode(!isPdfMode);
  };

  // Handle file input click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update message content rendering
  const renderMessageContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('```')) {
        return (
          <pre key={index} className="code-block">
            <code>{line.replace(/```/g, '').trim()}</code>
          </pre>
        );
      } else if (line.trim().startsWith('•')) {
        return <li key={index} className="bullet-point">{formatTextWithBold(line.trim())}</li>;
      } else if (line.trim().match(/^\d+\./)) {
        return <li key={index} className="numbered-list">{formatTextWithBold(line.trim())}</li>;
      } else {
        return <p key={index} className="text-line">{formatTextWithBold(line)}</p>;
      }
    });
  };

  // Update the formatTextWithBold function
  const formatTextWithBold = (text) => {
    // Split by pairs of asterisks
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove double asterisks and wrap in bold tag
        return <strong key={index} className="bold-text">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Add useEffect to save chatHistory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button
            onClick={startNewChat}
            className="new-chat-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>New chat</span>
          </button>
          <button
            onClick={clearChatHistory}
            className="clear-history-button"
            title="Clear all chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {chat.isPdfMode ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    )}
                  </svg>
                  <div className="history-text">
                    <span className="history-title">
                      {chat.title}
                      {chat.isPdfMode && <span className="history-pdf-indicator">PDF</span>}
                    </span>
                    <span className="history-date">{chat.timestamp}</span>
                  </div>
                  <button
                    className="delete-chat-button"
                    onClick={(e) => deleteChat(chat.id, e)}
                    title="Delete chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <div className="chat-header">
          <div className="chat-title">
            BuzzBuddy {isPdfMode && <span className="pdf-mode-indicator">(PDF Mode)</span>}
          </div>
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
                <div className="message-content">
                  {renderMessageContent(msg.content)}
                </div>
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
            <div className="mode-toggle">
              <span className={`mode-label ${!isPdfMode ? 'active' : ''}`}>AI</span>
              <button
                type="button"
                className={`toggle-switch ${isPdfMode ? 'active' : ''} ${!hasPdfLoaded ? 'disabled' : ''}`}
                onClick={handleModeToggle}
                title={!hasPdfLoaded ? 'Upload a PDF first' : 'Switch between General and PDF mode'}
              >
                <span className="toggle-slider"></span>
              </button>
              <span className={`mode-label ${isPdfMode ? 'active' : ''}`}>PDF</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isPdfMode ? "Ask questions about the PDF..." : "Message BuzzBuddy..."}
              className="message-input"
            />
            <div className="input-actions">
              <button 
                type="button" 
                className="attach-button"
                onClick={handleFileClick}
                title="Attach PDF"
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
              accept=".pdf"
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatAssistant;