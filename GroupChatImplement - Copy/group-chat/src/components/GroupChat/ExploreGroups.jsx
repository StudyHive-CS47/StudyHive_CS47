import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import SearchBar from '../common/SearchBar';
import JoinGroupModal from '../Groups/JoinGroupModal';

const ExploreGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.getAllGroups();
      setGroups(response.data);
    } catch (error) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = (group) => {
    setSelectedGroup(group);
    setShowJoinModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-1/4">
          <div className="form-card p-6">
            <h2 className="section-title">Find Groups</h2>
            <SearchBar 
              placeholder="Search Groups"
              className="mb-6"
            />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-800">Browse by Category</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
                  All Groups
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50">
                  Popular
                </button>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-blue-800 flex items-center">
                  <span>Trending Groups</span>
                  <svg className="w-4 h-4 ml-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                  </svg>
                </h3>
                <div className="space-y-3 mt-3">
                  {groups.slice(0, 3).map(group => (
                    <div key={group.id} className="flex justify-between items-center text-sm">
                      <span>{group.name}</span>
                      <span className="text-gray-500">{group.memberEmails?.length || 0} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="section-title">Explore Groups</h1>
            <span className="text-blue-600">Showing {groups.length} groups</span>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                      {group.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.university}</p>
                      <p className="text-sm text-gray-500 mt-2">{group.description}</p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {group.memberEmails?.length || 0} students
                      </div>
                      <button 
                        onClick={() => handleJoinClick(group)}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinClick}
          groupUniversity={selectedGroup?.university}
        />
      )}
    </div>
  );
};

export default ExploreGroups;