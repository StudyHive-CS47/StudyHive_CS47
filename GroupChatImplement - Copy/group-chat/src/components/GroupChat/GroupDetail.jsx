// src/components/GroupChat/GroupDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import FileUpload from './FileUpload';
import MembersList from './MembersList';
import { api } from '../../services/api';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [members, setMembers] = useState([]);


  useEffect(() => {
    const cleanup = api.connectToChat(id, (message) => {
      setMessages(prev => [...prev, message]);
    });
    return cleanup;
  }, [id]);

  const fetchGroupData = async () => {
    try {
      // Simulated data - replace with actual API calls
      const groupData = {
        id,
        name: "Software Engineering (SE2100)",
        university: "ESOFT Metro Campus",
        memberCount: 69,
        members: [
          { id: 1, name: "kalindu rantharaka", email: "kalindu@example.com", isAdmin: true },
          { id: 2, name: "Thejaka Sathruwan", email: "thejaka@example.com", isAdmin: false }
        ],
        files: [
          { id: 1, name: "lecture_notes.pdf", uploadedBy: "kalindu", date: "2024-02-16" },
          { id: 2, name: "assignment1.docx", uploadedBy: "thejaka", date: "2024-02-15" }
        ],
        messages: [
          { id: 1, sender: "kalindu rantharaka", content: "hi", timestamp: "2024-08-08" },
          { id: 2, sender: "Thejaka Sathruwan", content: "hi", timestamp: "2024-01-30" }
        ]
      };

      setGroup(groupData);
      setMembers(groupData.members);
      setFiles(groupData.files);
      setMessages(groupData.messages);
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Replace with actual API call
      // const response = await api.getGroupMessages(id);
      // setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      // Simulate sending message
      const newMessage = {
        id: messages.length + 1,
        sender: "Current User",
        content,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      // await api.sendMessage(id, { content });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      // Simulate file upload
      const newFile = {
        id: files.length + 1,
        name: file.name,
        uploadedBy: "Current User",
        date: new Date().toISOString().split('T')[0]
      };
      setFiles([...files, newFile]);
      // await api.uploadFile(id, file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!group) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Group Info & Members */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">{group.name}</h1>
          <p className="text-sm text-gray-600">{group.university}</p>
          <p className="text-sm text-gray-500 mt-2">{group.memberCount} members</p>
        </div>
        <MembersList members={members} memberCount={group.memberCount} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Right Sidebar - Files */}
      <div className="w-64 bg-white border-l">
        <div className="p-4 border-b">
          <h2 className="font-bold">Files</h2>
        </div>
        <FileUpload onUpload={handleFileUpload} />
        <div className="p-4">
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded by {file.uploadedBy} on {file.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;