import React, { useState, useEffect } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { supabase } from '../../config/supabase';
import JoinGroupModal from './JoinGroupModal';

const ExploreGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setError(null);
      
      // Get user's memberships
      const { data: memberGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const memberGroupIds = (memberGroups || []).map(g => g.group_id);

      // Get all groups
      const { data: allGroups, error } = await supabase
        .from('groups')
        .select('*');

      if (error) throw error;

      // Filter out groups the user is already a member of
      const availableGroups = allGroups
        .filter(group => !memberGroupIds.includes(group.id))
        .map(group => ({
          ...group,
          admin: group.admin_id === user.id ? { email: user.email } : { email: 'Group Admin' }
        }));

      setGroups(availableGroups);
    } catch (err) {
      console.error('Error loading groups:', err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleJoinSuccess = () => {
    setSelectedGroup(null);
    loadGroups();
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadGroups}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Explore Groups</h1>
      
      {groups.length === 0 ? (
        <p className="text-center text-gray-500">No groups available to join</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {group.university} • {group.degree}
              </p>
              <p className="text-sm text-gray-500 mb-4">{group.module}</p>
              <p className="text-sm mb-4">{group.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Admin: {group.admin.email}
                </span>
                <button
                  onClick={() => handleJoinGroup(group)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Join Group
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedGroup && (
        <JoinGroupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default ExploreGroups; 