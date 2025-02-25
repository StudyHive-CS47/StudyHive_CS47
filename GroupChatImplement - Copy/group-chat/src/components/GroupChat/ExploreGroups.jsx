import React, { useState, useEffect } from 'react';
import { SearchBar } from '../common/SearchBar';

const ExploreGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch groups from API
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      // API call to fetch groups will go here
      const mockGroups = [
        {
          id: 1,
          name: 'Mechanics of Solid 2 (ME3031)',
          university: 'Sri Lanka Institute of Information Technology',
          memberCount: 2,
        },
        {
          id: 2,
          name: 'HND in Computing',
          university: 'ESOFT Metro Campus',
          memberCount: 937,
        },
      ];
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search logic here
  };

  const handleJoinRequest = async (groupId) => {
    try {
      // API call to request joining group
      console.log('Requesting to join group:', groupId);
    } catch (error) {
      console.error('Error requesting to join group:', error);
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
      
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.university}</p>
                <p className="text-sm text-gray-500">{group.memberCount} students</p>
              </div>
              <button
                onClick={() => handleJoinRequest(group.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Join +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreGroups;