import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import MembersList from './MembersList';
import { useGroup } from '../../contexts/GroupContext';
import { supabase } from '../../config/supabase';
import { useAuth } from '@shared/contexts/AuthContext';

const GroupChat = ({ groupId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!groupId) return;
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;

      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        throw new Error('You are not a member of this group');
      }

      // Fetch all member IDs
      const { data: membersList, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (membersError) throw membersError;

      // Get member emails in a separate query
      if (membersList?.length) {
        const memberIds = membersList.map(m => m.user_id);
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('email')
          .in('id', memberIds);

        if (!usersError && users) {
          setMembers(users.map(u => u.email));
        }
      }

      // Get admin email
      const { data: adminUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', groupData.admin_id)
        .single();

      setGroup({
        ...groupData,
        admin: { email: adminUser?.email || 'Admin' }
      });
    } catch (err) {
      console.error('Error loading group:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
      navigate('/my-groups');
    } catch (err) {
      console.error('Error leaving group:', err);
      setError('Failed to leave group');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-100 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Group not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#1A237E]">{group.name}</h2>
          <p className="text-sm text-gray-500">{group.description}</p>
        </div>
        <button
          onClick={() => setShowGroupInfo(!showGroupInfo)}
          className="p-2 text-[#4051B5] hover:bg-[#EEF4FE] rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow groupId={groupId} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-[#4051B5] hover:bg-[#EEF4FE] rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-[#F8FAFF] rounded-xl px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-[#4051B5] focus:ring-1 focus:ring-[#4051B5]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2.5 rounded-lg transition-colors ${
              newMessage.trim() 
                ? 'bg-[#4051B5] text-white hover:bg-[#1A237E]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={() => {}} // TODO: Implement file upload
          />
        </form>
      </div>

      {/* Right Sidebar - Group Info */}
      {showGroupInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l shadow-lg transform transition-transform duration-200 ease-in-out">
          <div className="h-16 border-b flex items-center justify-between px-6">
            <h3 className="font-semibold text-[#1A237E]">Group Info</h3>
            <button 
              onClick={() => setShowGroupInfo(false)}
              className="p-2 text-gray-500 hover:bg-[#EEF4FE] rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-[#4051B5] mb-4">About</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{group.description}</p>
            </div>

            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#4051B5]">
                  {members.length} members
                </h3>
              </div>
              <MembersList 
                members={members}
                adminEmail={group.admin?.email}
              />
            </div>

            <div className="p-6">
              <button 
                onClick={handleLeaveGroup}
                className="flex w-full items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-3 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Exit group</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat; 