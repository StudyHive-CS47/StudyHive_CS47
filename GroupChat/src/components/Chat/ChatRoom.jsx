import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, chatApi, groupApi, fileApi } from '../../services/supabase';
import FileUpload from '../GroupChat/FileUpload';
import MembersList from '../GroupChat/MembersList';

const ChatRoom = ({ groupId }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!groupId || !userEmail) {
      return;
    }
    fetchGroupDetails();
    setupSupabaseSubscription();
  }, [groupId, userEmail]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const groupData = await groupApi.getGroupById(groupId);
      if (!groupData) {
        throw new Error('Group not found');
      }

      setGroup(groupData);
      
      const filesData = await fileApi.getGroupFiles(groupId);
      setFiles(filesData || []);

      const messagesData = await chatApi.getMessages(groupId);
      setMessages(messagesData || []);

    } catch (err) {
      console.error('Error fetching group details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupSupabaseSubscription = () => {
    const channel = supabase
      .channel(`room-${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`
      }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => channel.unsubscribe();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatApi.sendMessage(groupId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Group not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{group?.name || 'Loading...'}</h2>
          <p className="text-sm text-gray-500">{group?.memberEmails?.length || 0} members</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_email === userEmail ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 ${
              message.sender_email === userEmail 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-white text-gray-700 rounded-bl-none shadow'
            }`}>
              <div className="text-xs opacity-75 mb-1">
                {message.sender_email === userEmail ? 'You' : message.sender_email}
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom; 