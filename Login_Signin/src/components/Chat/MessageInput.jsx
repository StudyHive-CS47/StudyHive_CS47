import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './MessageInput.css';

const MessageInput = ({ groupId, currentUser }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await addDoc(collection(db, `groups/${groupId}/messages`), {
                text: message.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userPhoto: currentUser.photoURL,
                timestamp: serverTimestamp()
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isSubmitting}
            />
            <button 
                type="submit" 
                disabled={!message.trim() || isSubmitting}
                className="send-button"
            >
                <i className="fas fa-paper-plane"></i>
            </button>
        </form>
    );
};

export default MessageInput; 