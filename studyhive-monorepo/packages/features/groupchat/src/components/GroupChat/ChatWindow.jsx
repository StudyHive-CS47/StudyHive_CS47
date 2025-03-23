// src/components/GroupChat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '@shared/contexts/AuthContext';

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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

      if (messages?.length) {
        const userIds = [...new Set(messages.map(m => m.user_id))];
        const { data: users } = await supabase
          .from('profiles')
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#EEF4FE]">
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 messages-container"
        style={{
          height: 'calc(100vh - 16rem)',
          backgroundColor: '#ffffff',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E3E8FD' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed'
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4051B5]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="bg-red-100 text-red-500 px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p className="mb-2 font-medium">No messages yet</p>
              <p className="text-sm">Be the first to send a message!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.user_id === user.id;
            const showSender = index === 0 || 
              messages[index - 1].user_id !== message.user_id;

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[65%] rounded-xl px-4 py-2.5 shadow-sm
                    ${isCurrentUser 
                      ? 'bg-[#4051B5] text-white' 
                      : 'bg-white text-gray-800'
                    }
                    ${showSender ? 'mt-4' : 'mt-1'}
                  `}
                >
                  {showSender && !isCurrentUser && (
                    <div className="absolute -top-5 left-0 text-xs font-medium text-[#4051B5]">
                      {message.sender?.email.split('@')[0]}
                    </div>
                  )}
                  <div className="break-words">{message.content}</div>
                  <div className={`text-[0.65rem] text-right mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {formatTime(message.created_at)}
                    {isCurrentUser && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatWindow;