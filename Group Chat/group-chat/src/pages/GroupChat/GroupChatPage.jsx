import React, { useState } from 'react';
import ChatSidebar from '../../components/Chat/ChatSidebar';
import ChatHeader from '../../components/Chat/ChatHeader';
import ChatMessages from '../../components/Chat/ChatMessages';
import MessageInput from '../../components/Chat/MessageInput';
import CreateGroupModal from '../../components/Groups/CreateGroupModal';
import { useAuth } from '../../contexts/AuthContext';
import './GroupChatPage.css';

const GroupChatPage = () => {
    const { currentUser } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="group-chat-container">
            <ChatSidebar 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onCreateGroup={() => setIsCreateGroupModalOpen(true)}
                selectedGroup={selectedGroup}
                onGroupSelect={setSelectedGroup}
            />
            
            <div className="chat-main">
                {selectedGroup ? (
                    <>
                        <ChatHeader 
                            group={selectedGroup}
                            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                        <ChatMessages 
                            groupId={selectedGroup.id}
                            currentUser={currentUser}
                        />
                        <MessageInput 
                            groupId={selectedGroup.id}
                            currentUser={currentUser}
                        />
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <img src="/studyhive-logo.png" alt="StudyHive" className="watermark" />
                        <h2>Welcome to StudyHive Group Chat</h2>
                        <p>Select a group to start chatting or create a new one</p>
                    </div>
                )}
            </div>

            {isCreateGroupModalOpen && (
                <CreateGroupModal 
                    onClose={() => setIsCreateGroupModalOpen(false)}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default GroupChatPage; 