import React, { useState } from 'react';
import GroupList from './GroupList';
import ChatRoom from '../Chat/ChatRoom';

const GroupLayout = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState(null);

  const handleGroupSelect = (group) => {
    try {
      if (!group?.id) {
        console.error('Invalid group selected:', group);
        return;
      }
      setSelectedGroup(group);
    } catch (err) {
      console.error('Error selecting group:', err);
      setError('Failed to select group');
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button 
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Left Panel - Group List */}
      <div className="w-full md:w-[380px] border-r">
        <GroupList onGroupSelect={handleGroupSelect} />
      </div>
      
      {/* Right Panel - Chat Area */}
      <div className="hidden md:flex flex-1 bg-gray-50 flex-col">
        {selectedGroup ? (
          <ChatRoom 
            groupId={selectedGroup.id} 
            key={selectedGroup.id}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to StudyHive Chat</h2>
            <p className="text-gray-500">Select a group to start chatting with your study mates</p>
          </div>
        )}
      </div>

      {/* Mobile Chat View */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <button 
            onClick={() => setSelectedGroup(null)}
            className="absolute top-4 left-4 p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <ChatRoom groupId={selectedGroup.id} />
        </div>
      )}
    </div>
  );
};

export default GroupLayout; 