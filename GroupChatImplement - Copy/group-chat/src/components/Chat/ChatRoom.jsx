import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { api } from '../../services/api';
import FileUpload from '../GroupChat/FileUpload';
import MembersList from '../GroupChat/MembersList';

const ChatRoom = () => {
  const { groupId } = useParams();
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
      navigate('/');
      return;
    }
    fetchGroupDetails();
    setupSupabaseSubscription();
  }, [groupId, userEmail]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch group details from MongoDB
      const groupData = await api.getGroupById(groupId);
      console.log('Fetched group data:', groupData); // Debug log

      if (!groupData) {
        throw new Error('Group not found');
      }

      // Ensure memberEmails is always an array
      const sanitizedGroupData = {
        ...groupData,
        memberEmails: Array.isArray(groupData.memberEmails) ? groupData.memberEmails : []
      };

      setGroup(sanitizedGroupData);
      
      // Fetch files from MongoDB
      const filesData = await api.getGroupFiles(groupId);
      setFiles(filesData || []);

      // Fetch messages from Supabase
      const messagesData = await api.getMessages(groupId);
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
      const { error } = await supabase
        .from('messages')
        .insert([{
          group_id: groupId,
          sender_email: userEmail,
          content: newMessage.trim(),
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
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
    <div className="flex h-screen">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Group header */}
        <div className="bg-white border-b p-4">
          <h1 className="text-xl font-semibold">{group?.name || 'Loading...'}</h1>
          <p className="text-sm text-gray-500">{group?.description}</p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[70%] ${
                message.sender_email === userEmail ? 'ml-auto' : ''
              }`}
            >
              <div className="bg-white rounded-lg shadow p-3">
                <div className="font-medium text-sm">
                  {message.sender_email === userEmail ? 'You' : message.sender_email}
                </div>
                <div className="mt-1">{message.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-l p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Files</h3>
          <FileUpload 
            groupId={groupId} 
            onFileUpload={(newFile) => setFiles(prev => [...prev, newFile])}
          />
          <div className="mt-2">
            {files.map(file => (
              <div key={file.id} className="text-sm text-blue-500 hover:underline">
                {file.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Members</h3>
          {group && (
            <MembersList 
              members={group.memberEmails || []}
              adminEmail={group.adminEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 