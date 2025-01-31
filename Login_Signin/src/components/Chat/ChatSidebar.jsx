import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import './ChatSidebar.css';

const ChatSidebar = ({ isOpen, onToggle, onCreateGroup, selectedGroup, onGroupSelect }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    useEffect(() => {
        // Fetch groups from Firebase
        const q = query(
            collection(db, 'groups'),
            where('members', 'array-contains', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groupData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGroups(groupData);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="user-info">
                    <img 
                        src={currentUser.photoURL || '/default-avatar.png'} 
                        alt={currentUser.displayName} 
                        className="user-avatar"
                    />
                    <span className="user-name">{currentUser.displayName}</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </button>
                <button className="close-button" onClick={onToggle}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="create-group-btn" onClick={onCreateGroup}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            <div className="groups-list">
                {filteredGroups.map(group => (
                    <div
                        key={group.id}
                        className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                        onClick={() => onGroupSelect(group)}
                    >
                        <div className="group-avatar">
                            {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="group-info">
                            <h3>{group.name}</h3>
                            <p>{group.lastMessage || 'No messages yet'}</p>
                        </div>
                        {group.unreadCount > 0 && (
                            <span className="unread-count">{group.unreadCount}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar; 