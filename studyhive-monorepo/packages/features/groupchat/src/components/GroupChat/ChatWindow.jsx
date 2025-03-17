// src/components/GroupChat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { supabase } from '../../config/supabase';

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadMessages();
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `group_id=eq.${groupId}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Get user emails in a separate query
      if (messages?.length) {
        const userIds = [...new Set(messages.map(m => m.user_id))];
        const { data: users } = await supabase
          .from('profiles') // or use auth.users directly
          .select('id, email')
          .in('id', userIds);

        const userMap = users?.reduce((acc, user) => {
          acc[user.id] = user.email;
          return acc;
        }, {});

        const messagesWithUsers = messages.map(message => ({
          ...message,
          sender: { email: userMap[message.user_id] || 'Unknown User' }
        }));

        setMessages(messagesWithUsers);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          content: newMessage.trim(),
          group_id: groupId,
          user_id: user.id
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.user_id === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <div className="text-xs mb-1">
                  {message.sender?.email || 'Unknown User'}
                </div>
                <div>{message.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;