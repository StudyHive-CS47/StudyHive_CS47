import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      // Get email from local storage or state management
      const userEmail = localStorage.getItem('userEmail'); // You need to set this when user enters email
      const response = await api.getMyGroups(userEmail);
      setGroups(response.data);
    } catch (error) {
      setError('Failed to fetch my groups');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Groups</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.university}</p>
              <p className="text-sm text-gray-500">
                {group.adminEmail === localStorage.getItem('userEmail') ? 'Admin' : 'Member'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups; 