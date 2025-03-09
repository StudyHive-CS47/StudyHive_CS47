import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    degree: '',
    module: '',
    description: '',
    email: localStorage.getItem('userEmail') || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGroup(formData);
      navigate('/my-groups');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="modal w-full max-w-6xl flex overflow-hidden">
        {/* Left side - Instructions */}
        <div className="w-2/5 p-8">
          <h2 className="text-2xl font-bold mb-6">
            Create a Supportive Space for Your Batchmates
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-1">1. Start a group for your university</h3>
              <p className="text-sm text-gray-600">Focus on your own campus community.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">2. Make it module-specific</h3>
              <p className="text-sm text-gray-600">Create a space to discuss topics, assignments, or projects related to your academic modules.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">3. Support your batchmates</h3>
              <p className="text-sm text-gray-600">Invite peers from your batch to collaborate, share resources, and grow together.</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-3/5">
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">Create New Group</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">University</label>
                <select
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Module</label>
                <input
                  type="text"
                  value={formData.module}
                  onChange={(e) => setFormData({...formData, module: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-input"
                  rows="4"
                  required
                />
              </div>

              <div className="mt-6">
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup; 