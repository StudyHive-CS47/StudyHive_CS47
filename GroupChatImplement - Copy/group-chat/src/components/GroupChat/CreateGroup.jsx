import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { useGroup } from '../../contexts/GroupContext';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { setGroups } = useGroup();
  const [error, setError] = useState('');
  const [groupData, setGroupData] = useState({
    name: '',
    university: '',
    degree: '',
    module: '',
    description: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.createGroup(groupData);
      
      if (response.data) {
        setGroups(prevGroups => [...prevGroups, response.data]);
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Group</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.name}
              onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.university}
              onChange={(e) => setGroupData({ ...groupData, university: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.degree}
              onChange={(e) => setGroupData({ ...groupData, degree: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Module</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.module}
              onChange={(e) => setGroupData({ ...groupData, module: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.description}
              onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupData.email}
              onChange={(e) => setGroupData({ ...groupData, email: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Group
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;