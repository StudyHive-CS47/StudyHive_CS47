import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './CreateGroupModal.css';

const CreateGroupModal = ({ onClose, currentUser }) => {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await addDoc(collection(db, 'groups'), {
                name: groupName.trim(),
                description: description.trim(),
                createdBy: currentUser.uid,
                createdAt: serverTimestamp(),
                members: [currentUser.uid],
                memberCount: 1,
                lastMessage: null,
                lastMessageTime: null
            });
            onClose();
        } catch (error) {
            console.error('Error creating group:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="groupName">Group Name</label>
                        <input
                            type="text"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter group description"
                            rows="3"
                        />
                    </div>
                    <div className="modal-actions">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!groupName.trim() || isSubmitting}
                            className="create-btn"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal; 