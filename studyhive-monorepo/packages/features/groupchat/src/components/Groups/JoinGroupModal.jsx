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
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!university) {
      setError('Please select your university');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: joinError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: group.id,
            user_id: user.id,
            university: university
          }
        ]);

      if (joinError) throw joinError;

      onSuccess();
    } catch (err) {
      console.error('Error joining group:', err);
      setError('Failed to join group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-5 sm:pb-4">
            {/* Header */}
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0">
                <span className="text-lg font-semibold text-blue-600">
                  {group.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Join {group.name}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {group.module}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {group.description}
                  </p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="space-y-3">
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                    Select Your University
                  </label>
                  <select
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a university</option>
                    {universities.map((uni) => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !university}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {loading ? (
                    <>
                      <svg className="mr-2 h-3 w-3 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    'Join Group'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal; 