import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';
import GroupChat from '../GroupChat/GroupChat';

const MyGroups = () => {
  const { groups, loading, error, selectGroup, refreshGroups, currentGroup } = useGroup();
  const navigate = useNavigate();

  const handleGroupClick = (group) => {
    selectGroup(group);
    navigate(`/chat/${group.id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={refreshGroups}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <button
          onClick={() => navigate('/create')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
          <button
            onClick={() => navigate('/explore')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Explore Groups
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white rounded-lg shadow-sm p-4 border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleGroupClick(group)}
            >
              <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {group.university} • {group.degree}
              </p>
              <p className="text-sm text-gray-500 mb-4">{group.module}</p>
              <p className="text-sm mb-4">{group.description}</p>
              <div className="text-sm text-gray-500">
                Admin: {group.admin.email}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentGroup && (
        <GroupChat group={currentGroup} />
      )}
    </div>
  );
};

export default MyGroups; 