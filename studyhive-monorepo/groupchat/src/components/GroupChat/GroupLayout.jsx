import React from 'react';
import { useGroup } from '../../contexts/GroupContext';
import ChatWindow from './ChatWindow';

const GroupLayout = () => {
  const { currentGroup } = useGroup();

  if (!currentGroup) {
    return (
      <div className="flex items-center justify-center h-full">
        Select a group to start chatting
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatWindow groupId={currentGroup.id} />
    </div>
  );
};

export default GroupLayout; 