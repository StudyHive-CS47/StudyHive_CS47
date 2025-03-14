import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

const JoinGroupModal = ({ group, onClose, onSuccess }) => {
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if university matches
      if (university.toLowerCase() === group.university.toLowerCase()) {
        // Add to group_members
        const { error: memberError } = await supabase
          .from('group_members')
          .insert([{
            group_id: group.id,
            user_id: user.id
          }]);

        if (memberError) throw memberError;

        // Add successful join request record
        await supabase
          .from('join_requests')
          .insert([{
            group_id: group.id,
            user_id: user.id,
            status: 'APPROVED',
            university: university
          }]);

        onSuccess();
      } else {
        // Store rejected request
        await supabase
          .from('join_requests')
          .insert([{
            group_id: group.id,
            user_id: user.id,
            status: 'REJECTED',
            university: university
          }]);

        setError('Your university does not match the group requirements');
      }
    } catch (err) {
      console.error('Error joining group:', err);
      setError('Failed to process join request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Join {group.name}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your University
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal; 