import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [group, setGroup] = useState(null);
  const [files, setFiles] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    let stompClientInstance = null;
    
    const initializeWebSocket = async () => {
      try {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            login: userEmail,
          },
          debug: (str) => {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          console.log('WebSocket Connected');
          setStompClient(client);
          stompClientInstance = client;
          
          client.subscribe(`/topic/group/${groupId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, receivedMessage]);
          });
        };

        client.onStompError = (frame) => {
          console.error('STOMP Error:', frame);
        };

        client.activate();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    const initialize = async () => {
      await fetchGroupDetails();
      await fetchMessages();
      await fetchFiles();
      await initializeWebSocket();
    };

    initialize();

    return () => {
      if (stompClientInstance) {
        stompClientInstance.deactivate();
      }
    };
  }, [groupId, userEmail]);

  const fetchGroupDetails = async () => {
    try {
      const groupData = await api.getGroupById(groupId);
      setGroup(groupData);
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError('Error fetching group details. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await api.getGroupMessages(groupId);
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const files = await api.getGroupFiles(groupId);
      setFiles(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (!stompClient?.active) {
        throw new Error('WebSocket not connected');
      }

      const messageData = {
        groupId,
        senderEmail: userEmail,
        content: newMessage,
        timestamp: new Date().toISOString()
      };

      stompClient.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(messageData)
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please refresh the page.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSize) {
        throw new Error('File size should be less than 5MB');
      }

      const response = await api.uploadFile(groupId, file);
      console.log('File upload successful:', response);
      await fetchFiles(); // Refresh files list
      event.target.value = ''; // Reset file input
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error.response?.data?.message || 'Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Group Details Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        {loading ? (
          <div>Loading group details...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : group ? (
          <>
            <h2 className="text-xl font-bold mb-4">{group.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{group.university}</p>
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Members ({group.memberEmails?.length})</h3>
              <ul className="text-sm">
                {group.memberEmails?.map((email, index) => (
                  <li key={index} className="mb-1">
                    {email === group.adminEmail ? (
                      <span className="text-green-600">{email} (Admin)</span>
                    ) : (
                      email
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* File Upload Section */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Files</h3>
              <input
                type="file"
                onChange={handleFileUpload}
                className="mb-2"
                accept=".pdf,.doc,.docx,.txt" // Limit file types
              />
              {uploadError && (
                <p className="text-red-500 text-sm mb-2">{uploadError}</p>
              )}
              <ul className="text-sm">
                {files.map((file, index) => (
                  <li key={index} className="mb-1">
                    <a 
                      href={file.url} 
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[70%] ${
                msg.senderEmail === userEmail
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <p className="text-sm font-semibold">{msg.senderEmail}</p>
              <p>{msg.content}</p>
              <p className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom; 