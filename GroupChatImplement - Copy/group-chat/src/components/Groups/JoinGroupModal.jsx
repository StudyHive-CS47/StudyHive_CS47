import React, { useState } from 'react';

const JoinGroupModal = ({ onClose, onSubmit, error, groupUniversity }) => {
  const [formData, setFormData] = useState({
    email: '',
    university: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate university match before submitting
      if (formData.university.toLowerCase() !== groupUniversity.toLowerCase()) {
        throw new Error("University must match the group's university");
      }
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Join Group</h2>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <p className="mb-4 text-sm text-gray-600">
          Note: You must be from {groupUniversity} to join this group
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              University
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal; 