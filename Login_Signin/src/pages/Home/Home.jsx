import React, { useState, useEffect } from 'react';
import { useGroups } from '../../contexts/GroupContext';
import { useMessages } from '../../contexts/MessageContext';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  
  const { groups, loading: groupsLoading } = useGroups();
  const { messages, subscribeToGroupMessages, sendMessage } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedGroup) {
      const unsubscribe = subscribeToGroupMessages(selectedGroup.id);
      return () => unsubscribe();
    }
  }, [selectedGroup]);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage(selectedGroup.id, user.id, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      {/* Left Side - Groups List */}
      <div className="groups-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="groups-list">
          {filteredGroups.map(group => (
            <div 
              key={group.id}
              className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              <div className="group-icon">👥</div>
              <div className="group-info">
                <h4>{group.name}</h4>
                <p>{group.description}</p>
              </div>
              {group.unread && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="chat-area">
        {selectedGroup ? (
          <>
            <div className="chat-header">
              <h2>{selectedGroup.name}</h2>
              <div className="header-actions">
                <button className="leave-btn">Leave</button>
                <button className="more-btn">More</button>
              </div>
            </div>

            <div className="messages">
              {messages[selectedGroup.id]?.map(message => (
                <div className={`message ${message.userId === user.id ? 'reply' : ''}`}>
                  <p>{message.content}</p>
                  <span className="time">{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className="send-btn" onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 