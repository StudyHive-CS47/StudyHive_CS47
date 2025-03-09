import React, { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import { api } from '../../services/api';
import JoinGroupModal from '../Groups/JoinGroupModal';
import NavBar from '../common/NavBar';

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
      {/* Left Navigation Bar */}
      <div className="w-20 bg-gray-100">
        <NavBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6">
        {/* Left Section */}
        <div className="w-1/3 pr-8 border-r">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Find Groups</h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filter Buttons */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => setFilter('all')}
                className={`category-btn ${filter === 'all' ? 'active' : ''}`}
              >
                All Groups
              </button>
              <button 
                onClick={() => setFilter('popular')}
                className={`category-btn ${filter === 'popular' ? 'active' : ''}`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Trending Groups */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
              </svg>
              Trending Groups
            </h2>
            <div className="space-y-3">
              {groups
                .sort((a, b) => (b.memberEmails?.length || 0) - (a.memberEmails?.length || 0))
                .slice(0, 3)
                .map(group => (
                  <div key={group.id} className="trending-item">
                    <span className="font-medium">{group.name}</span>
                    <span className="text-sm text-gray-500">{group.memberEmails?.length || 0} students</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-2/3 pl-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Explore Groups</h1>
            <span className="text-gray-500">Showing {groups.length} groups</span>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="flex items-start space-x-4">
                    <div className="group-avatar">
                      {group.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.university}</p>
                      <p className="text-sm text-gray-700 mt-2">{group.description}</p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {group.memberEmails?.length || 0} students
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinClick(group)}
                    className="join-group-btn"
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