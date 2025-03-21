import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '@shared/contexts/AuthContext';
import GroupChat from '../GroupChat/GroupChat';
import NavBar from '../Navigation/NavBar';
import { useNavigate } from 'react-router-dom';

const WelcomePlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full bg-[#F0F2F5] text-center px-4">
    <div className="mb-8">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-32 w-32 text-gray-400" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9s9 4.03 9 9c0 1.42-.34 2.76-.92 3.96L21 21l-3.92-.08A8.94 8.94 0 0 1 12 21z" />
        <path d="M8 13h.01" />
        <path d="M12 13h.01" />
        <path d="M16 13h.01" />
        <circle cx="8" cy="13" r="1" />
        <circle cx="12" cy="13" r="1" />
        <circle cx="16" cy="13" r="1" />
      </svg>
    </div>
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Welcome to StudyHive Chat</h2>
    <p className="text-gray-500 mb-6">Select a group to start chatting or explore new groups to join!</p>
  </div>
);

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      if (memberships?.length) {
        const groupIds = memberships.map(m => m.group_id);
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .in('id', groupIds);

        if (groupsError) throw groupsError;
        setGroups(groupsData);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load your groups');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="relative min-h-screen bg-[#EEF4FE]">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden ml-24 mx-auto max-w-[1400px]" 
           style={{ height: 'calc(120vh - 180px)', margin: '2px 24px 90px 48px' }}>
        {/* Left Sidebar - Groups List */}
        <div className="w-[350px] flex flex-col border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">My Groups</h2>
              <button
                onClick={() => navigate('/chat/explore')}
                className="text-blue-500 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : groups.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>You haven't joined any groups yet.</p>
                <button
                  onClick={() => navigate('/chat/explore')}
                  className="mt-2 text-blue-500 hover:text-blue-600"
                >
                  Explore Groups
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => handleGroupClick(group)}
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedGroup?.id === group.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold text-lg mr-3">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{group.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1">
          {selectedGroup ? (
            <GroupChat groupId={selectedGroup.id} />
          ) : (
            <WelcomePlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGroups; 