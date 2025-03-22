import React, { useState } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { supabase } from '../../config/supabase';

const universities = [
  "Aquinas College of Higher Studies (ACHS)",
  "Benedict XVI Catholic Institute of Higher Education (BCI)",
  "Bhiksu University of Sri Lanka (BUSL)",
  "Buddhist and Pali University of Sri Lanka (BPU)",
  "Business Management School (BMS)",
  "Colombo International Nautical and Engineering College (CINEC)",
  "Eastern University, Sri Lanka (EUSL)",
  "Esoft Metro Campus (ESOFT)",
  "Gampaha Wickramarachchi University of Indigenous Medicine (GWUIM)",
  "General Sir John Kotelawala Defence University (KDU)",
  "Horizon Campus (HC)",
  "Informatics Institute of Technology (IIT)",
  "Institute of Chartered Accountants of Sri Lanka (CA Sri Lanka)",
  "Institute of Chemistry Ceylon (IChemC)",
  "Institute of Surveying and Mapping (ISM)",
  "Institute of Technological Studies (ITS)",
  "International College of Business and Technology (ICBT)",
  "International Institute of Health Science (IIHS)",
  "KAATSU International University (KIU)",
  "National Institute of Business Management (NIBM)",
  "National Institute of Social Development (NISD)",
  "National School of Business Management (NSBM)",
  "Ocean University of Sri Lanka (OCSL)",
  "Open University of Sri Lanka (OUSL)",
  "Rajarata University of Sri Lanka (RUSL)",
  "Royal Institute Colombo (RIC)",
  "Sabaragamuwa University of Sri Lanka (SUSL)",
  "Saegis Campus (SAEGIS)",
  "SANASA Campus (SANASA)",
  "South Asian Institute of Technology and Medicine (SAITM)",
  "South Eastern University of Sri Lanka (SEUSL)",
  "Sri Lanka Institute of Development Administration (SLIDA)",
  "Sri Lanka Institute of Information Technology (SLIIT)",
  "Sri Lanka Institute of Nanotechnology (SLINTEC)",
  "Sri Lanka International Buddhist Academy (SIBA)",
  "Sri Lanka Technological Campus (SLTC)",
  "University of Colombo (UOC)",
  "University of Jaffna (UOJ)",
  "University of Kelaniya (UOK)",
  "University of Moratuwa (UOM)",
  "University of Peradeniya (UOP)",
  "University of Ruhuna (UOR)",
  "University of Sri Jayewardenepura (USJ)",
  "University of the Visual and Performing Arts (UVPA)",
  "University of Vavuniya (UOV)",
  "University of Vocational Technology (UNIVOTEC)",
  "Uva Wellassa University (UWU)",
  "Wayamba University of Sri Lanka (WUSL)"
].sort();

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
      // Add console logs to debug the comparison
      console.log('Selected university:', university);
      console.log('Group university:', group.university);
      
      // Normalize both strings by trimming whitespace and converting to lowercase
      const normalizedSelected = university.trim().toLowerCase();
      const normalizedGroup = (group.university || '').trim().toLowerCase();
      
      console.log('Normalized selected:', normalizedSelected);
      console.log('Normalized group:', normalizedGroup);

      if (normalizedSelected === normalizedGroup) {
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
        setError(`Your university "${university}" does not match the group requirement "${group.university}"`);
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
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
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