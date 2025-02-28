import React, { useState, useEffect } from 'react';
import { SearchBar } from '../common/SearchBar';
import { api } from '../../services/api';
import JoinGroupModal from '../Groups/JoinGroupModal';

const ExploreGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [searchTerm]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.searchGroups(searchTerm);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleJoinClick = (group) => {
    setSelectedGroup(group);
    setJoinError(null);
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async (formData) => {
    try {
      // Store email in localStorage
      localStorage.setItem('userEmail', formData.email);
      
      const response = await api.joinGroup(selectedGroup.id, {
        email: formData.email,
        university: formData.university
      });
      
      if (response.status === 200) {
        setShowJoinModal(false);
        setJoinError(null);
        // Redirect to My Groups after successful join
        window.location.href = '/my-groups';
      }
    } catch (error) {
      setJoinError(error.response?.data || 'Error sending join request');
      alert(error.response?.data || 'Failed to join group');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <SearchBar 
          placeholder="Find new groups" 
          onSearch={handleSearch}
        />
      </div>
      
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-600">{group.university}</p>
                  <p className="text-sm text-gray-500">{group.memberEmails?.length || 0} students</p>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </div>
                <button
                  onClick={() => handleJoinClick(group)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Join +
                </button>
              </div>
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

export default ExploreGroups;