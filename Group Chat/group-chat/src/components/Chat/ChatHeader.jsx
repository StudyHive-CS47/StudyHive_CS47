import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ group, onMenuClick }) => {
    return (
        <div className="chat-header">
            <button className="menu-button" onClick={onMenuClick}>
                <i className="fas fa-bars"></i>
            </button>
            <div className="group-info">
                <h2>{group.name}</h2>
                <span>{group.memberCount} members</span>
            </div>
            <div className="header-actions">
                <button className="action-button">
                    <i className="fas fa-search"></i>
                </button>
                <button className="action-button">
                    <i className="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader; 