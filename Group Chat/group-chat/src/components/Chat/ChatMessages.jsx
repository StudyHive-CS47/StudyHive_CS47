import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './ChatMessages.css';

const ChatMessages = ({ groupId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!groupId) return;

        const q = query(
            collection(db, `groups/${groupId}/messages`),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [groupId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-messages">
            {messages.map((message) => (
                <div 
                    key={message.id} 
                    className={`message ${message.userId === currentUser.uid ? 'own' : ''}`}
                >
                    {message.userId !== currentUser.uid && (
                        <img 
                            src={message.userPhoto || '/default-avatar.png'} 
                            alt={message.userName} 
                            className="user-avatar"
                        />
                    )}
                    <div className="message-content">
                        {message.userId !== currentUser.uid && (
                            <span className="user-name">{message.userName}</span>
                        )}
                        <div className="message-bubble">
                            {message.text}
                            <span className="message-time">
                                {formatTime(message.timestamp)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages; 