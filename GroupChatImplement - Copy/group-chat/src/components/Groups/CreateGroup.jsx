import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    university: '',
    degree: '',
    module: '',
    adminEmail: '',
    memberEmails: [] // Initialize empty array for members
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Store email in localStorage
      localStorage.setItem('userEmail', formData.adminEmail);
      
      const groupData = {
        ...formData,
        adminEmail: formData.adminEmail,
        memberEmails: [formData.adminEmail]
      };
      
      await api.createGroup(groupData);
      alert('Group created successfully!');
      navigate('/my-groups');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="adminEmail"
          value={formData.adminEmail}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      {/* Other form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      {/* Add other fields similarly */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Group
      </button>
    </form>
  );
};

export default CreateGroup; 