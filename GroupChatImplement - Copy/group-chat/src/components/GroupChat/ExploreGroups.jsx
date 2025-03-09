import React, { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import { api } from '../../services/api';
import JoinGroupModal from '../Groups/JoinGroupModal';

const ExploreGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGroups();
  }, [searchTerm, filter]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.searchGroups(searchTerm);
      let filteredGroups = response.data || [];
      
      if (filter === 'popular') {
        filteredGroups = filteredGroups.sort((a, b) => 
          (b.memberEmails?.length || 0) - (a.memberEmails?.length || 0)
        );
      }
      
      setGroups(filteredGroups);
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
    setShowJoinModal(true);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Keep existing NavBar */}
      <div className="w-20 bg-gray-100 rounded-r-3xl">
        {/* NavBar component remains */}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Explore Groups</h1>
            <span className="text-gray-500">Showing {groups.length} groups</span>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="space-y-6">
              {/* Filter Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => setFilter('all')}
                  className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                >
                  All Groups
                </button>
                <button 
                  onClick={() => setFilter('popular')}
                  className={`filter-tab ${filter === 'popular' ? 'active' : ''}`}
                >
                  Popular
                </button>
              </div>
            </div>
          </div>

          {/* Trending Groups Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Trending Groups</h2>
            <div className="space-y-2">
              {groups
                .sort((a, b) => (b.memberEmails?.length || 0) - (a.memberEmails?.length || 0))
                .slice(0, 3)
                .map(group => (
                  <div key={group.id} className="trending-group-item">
                    <span>{group.name}</span>
                    <span className="text-gray-500">{group.memberEmails?.length || 0} students</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map(group => (
                <div key={group.id} className="modern-group-card">
                  <div className="flex items-start space-x-4">
                    <div className="group-avatar">
                      {group.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{group.university}</p>
                      <p className="text-gray-700 mb-4">{group.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {group.memberEmails?.length || 0} students
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinClick(group)}
                    className="modern-join-btn"
                  >
                    Join Group
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keep existing modal */}
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