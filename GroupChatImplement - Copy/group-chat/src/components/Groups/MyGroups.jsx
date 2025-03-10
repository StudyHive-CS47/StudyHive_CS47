import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log('Fetching groups for email:', userEmail);
      
      if (!userEmail) {
        setError('No user email found. Please log in again.');
        return;
      }
      
      const response = await api.getMyGroups(userEmail);
      console.log('MyGroups response:', response.data);
      
      // Filter to include both member and admin groups
      const myGroups = response.data.filter(group => 
        group.memberEmails.includes(userEmail) || group.adminEmail === userEmail
      );
      
      setGroups(myGroups);
    } catch (error) {
      console.error('Error in fetchMyGroups:', error);
      setError('Failed to fetch my groups');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/chat/${groupId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Groups</h2>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/explore')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Explore Groups
          </button>
          <button
            onClick={() => navigate('/create-group')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Group
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : groups.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No groups found. Create or join a group to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div 
              key={group.id} 
              className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => handleGroupClick(group.id)}
            >
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.university}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {group.adminEmail === localStorage.getItem('userEmail') ? 
                    <span className="text-green-600 font-semibold">Admin</span> : 
                    <span className="text-blue-600">Member</span>
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {group.memberEmails?.length || 0} members
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups; 