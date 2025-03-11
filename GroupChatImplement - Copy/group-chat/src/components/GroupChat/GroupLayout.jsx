import React, { useState } from 'react';
import GroupList from './GroupList';
import ChatRoom from '../Chat/ChatRoom';

const GroupLayout = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <div className="flex h-screen pt-16 pb-16">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
        <GroupList onGroupSelect={setSelectedGroup} />
      </div>
      
      {/* Right Panel */}
      <div className="hidden md:block w-2/3 bg-gray-50">
        {selectedGroup ? (
          <ChatRoom groupId={selectedGroup.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Open Chat connect with your friends
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupLayout; 