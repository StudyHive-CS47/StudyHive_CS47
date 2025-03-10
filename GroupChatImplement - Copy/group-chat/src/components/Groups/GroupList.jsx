import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import JoinGroupModal from './JoinGroupModal';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';

const GroupList = () => {
  const navigate = useNavigate();
  const { groups, setGroups } = useGroup();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    // Get email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetchGroups(userEmail);
    }
  }, []);

  const fetchGroups = async (email) => {
    try {
      const response = await api.getMyGroups(email);
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  };

  const handleJoinClick = (group) => {
    setSelectedGroup(group);
    setJoinError(null);
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async (formData) => {
    try {
      await api.joinGroup(selectedGroup.id, {
        email: formData.email,
        university: formData.university
      });
      setShowJoinModal(false);
      setJoinError(null);
      alert('Join request sent successfully!');
    } catch (error) {
      setJoinError(error.response?.data || 'Error sending join request');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search groups by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p className="text-gray-600">{group.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                University: {group.university}
              </p>
              <p className="text-sm text-gray-500">
                Members: {group.memberEmails?.length || 0}
              </p>
              <button
                onClick={() => handleJoinClick(group)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join Group
              </button>
            </div>
          ))}
        </div>
      )}

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => {
            setShowJoinModal(false);
            setJoinError(null);
          }}
          onSubmit={handleJoinSubmit}
          error={joinError}
          groupUniversity={selectedGroup?.university}
        />
      )}
    </div>
  );
};

export default GroupList; 