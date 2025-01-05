import React, { useState, useRef, useEffect } from 'react';
import './ChatArea.css';

function ChatArea({ group, messages, isLoading, onSendMessage }) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  if (!group) {
    return (
      <div className="chat-area-container empty-state">
        <h2>Select a group to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="chat-area-container">
      <div className="chat-header">
        <div className="group-info">
          <h2>{group.name}</h2>
          <div className="group-meta">
            <span>{group.course}</span>
            <span>•</span>
            <span>{group.instructor}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="resources-btn">
            <i className="fas fa-book"></i>
            Resources
          </button>
          <button className="deadlines-btn">
            <i className="fas fa-calendar"></i>
            Deadlines
          </button>
          <button className="leave-btn">Leave</button>
        </div>
      </div>

      <div className="chat-messages">
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
            >
              <div className="message-header">
                <span className="sender">{message.sender}</span>
                <span className="time">{message.time}</span>
              </div>
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              <div className="message-actions">
                <button>
                  <i className="fas fa-thumbs-up"></i>
                  <span>{message.likes || 0}</span>
                </button>
                <button>
                  <i className="fas fa-reply"></i>
                </button>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask a question or share something..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default ChatArea; 