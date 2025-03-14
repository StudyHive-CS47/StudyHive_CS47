import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';

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

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    degree: '',
    module: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createGroup } = useGroup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createGroup(formData);
      navigate('/my-groups');
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error creating group:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Group</h1>
      
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">University</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Module</label>
          <input
            type="text"
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup; 