import React, { useState, useEffect } from 'react';
import FileList from '../browse/FileList';
import FilePreview from '../browse/FilePreview';
import UploadPage from '../../pages/UploadPage';
import MyNotesPage from '../../pages/MyNotesPage';
import api from '../../services/api';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('browse');
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        universityName: '',
        moduleCode: '',
        moduleLevel: '',
        uploaderName: '',
    });
    const [allFiles, setAllFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async (query = '', filterParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            let data;

            if (Object.values(filterParams).some(value => value !== '')) {
                data = await api.searchFilesByCategory(filterParams);
            } else if (query) {
                data = await api.searchFilesByName(query);
            } else {
                data = await api.getAllFiles();
                setAllFiles(data);
            }

            setFiles(data);
        } catch (error) {
            console.error('Failed to fetch files:', error);
            setError('Failed to load files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        fetchFiles(event.target.value, filters);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);
    };

    const applyFilters = () => {
        fetchFiles(searchQuery, filters);
    };

    const handleClear = () => {
        setSearchQuery('');
        setFilters({
            universityName: '',
            moduleCode: '',
            moduleLevel: '',
            uploaderName: '',
        });
        fetchFiles();
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="container py-4">
            <style>
                {`
                .force-dropdown-down {
                  transform: translate3d(0px, 40px, 0px) !important;
                }
                `}
            </style>
            <h1 className="mb-4">StudyHive Note Sharing System</h1>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Browse Notes</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload Notes</button>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'browse' ? 'show active' : ''}`}>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Search files..." value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <div className="col-md-6 text-end">
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={toggleFilters}
                            >
                                <i className="bi bi-funnel"></i> Advanced Filters
                            </button>
                        </div>
                    </div>
                    {showFilters && (
                        <div className="mb-4">
                            <div className="card card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label htmlFor="universityFilter">University:</label>
                                        <select className="form-select" name="universityName" value={filters.universityName} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="Aquinas College of Higher Studies (ACHS)">Aquinas College of Higher Studies (ACHS)</option>
                                            <option value="Benedict XVI Catholic Institute of Higher Education (BCI)">Benedict XVI Catholic Institute of Higher Education (BCI)</option>
                                            <option value="Bhiksu University of Sri Lanka (BUSL)">Bhiksu University of Sri Lanka (BUSL)</option>
                                            <option value="Buddhist and Pali University of Sri Lanka (BPU)">Buddhist and Pali University of Sri Lanka (BPU)</option>
                                            <option value="Business Management School (BMS)">Business Management School (BMS)</option>
                                            <option value="Colombo International Nautical and Engineering College (CINEC)">Colombo International Nautical and Engineering College (CINEC)</option>
                                            <option value="Eastern University, Sri Lanka (EUSL)">Eastern University, Sri Lanka (EUSL)</option>
                                            <option value="Esoft Metro Campus (ESOFT)">Esoft Metro Campus (ESOFT)</option>
                                            <option value="Gampaha Wickramarachchi University of Indigenous Medicine (GWUIM)">Gampaha Wickramarachchi University of Indigenous Medicine (GWUIM)</option>
                                            <option value="General Sir John Kotelawala Defence University (KDU)">General Sir John Kotelawala Defence University (KDU)</option>
                                            <option value="Horizon Campus (HC)">Horizon Campus (HC)</option>
                                            <option value="Informatics Institute of Technology (IIT)">Informatics Institute of Technology (IIT)</option>
                                            <option value="Institute of Chartered Accountants of Sri Lanka (CA Sri Lanka)">Institute of Chartered Accountants of Sri Lanka (CA Sri Lanka)</option>
                                            <option value="Institute of Chemistry Ceylon (IChemC)">Institute of Chemistry Ceylon (IChemC)</option>
                                            <option value="Institute of Surveying and Mapping (ISM)">Institute of Surveying and Mapping (ISM)</option>
                                            <option value="Institute of Technological Studies (ITS)">Institute of Technological Studies (ITS)</option>
                                            <option value="International College of Business and Technology (ICBT)">International College of Business and Technology (ICBT)</option>
                                            <option value="International Institute of Health Science (IIHS)">International Institute of Health Science (IIHS)</option>
                                            <option value="KAATSU International University (KIU)">KAATSU International University (KIU)</option>
                                            <option value="National Institute of Business Management (NIBM)">National Institute of Business Management (NIBM)</option>
                                            <option value="National Institute of Social Development (NISD)">National Institute of Social Development (NISD)</option>
                                            <option value="National School of Business Management (NSBM)">National School of Business Management (NSBM)</option>
                                            <option value="Ocean University of Sri Lanka (OCSL)">Ocean University of Sri Lanka (OCSL)</option>
                                            <option value="Open University of Sri Lanka (OUSL)">Open University of Sri Lanka (OUSL)</option>
                                            <option value="Rajarata University of Sri Lanka (RUSL)">Rajarata University of Sri Lanka (RUSL)</option>
                                            <option value="Royal Institute Colombo (RIC)">Royal Institute Colombo (RIC)</option>
                                            <option value="Sabaragamuwa University of Sri Lanka (SUSL)">Sabaragamuwa University of Sri Lanka (SUSL)</option>
                                            <option value="Saegis Campus (SAEGIS)">Saegis Campus (SAEGIS)</option>
                                            <option value="SANASA Campus (SANASA)">SANASA Campus (SANASA)</option>
                                            <option value="South Asian Institute of Technology and Medicine (SAITM)">South Asian Institute of Technology and Medicine (SAITM)</option>
                                            <option value="South Eastern University of Sri Lanka (SEUSL)">South Eastern University of Sri Lanka (SEUSL)</option>
                                            <option value="Sri Lanka Institute of Development Administration (SLIDA)">Sri Lanka Institute of Development Administration (SLIDA)</option>
                                            <option value="Sri Lanka Institute of Information Technology (SLIIT)">Sri Lanka Institute of Information Technology (SLIIT)</option>
                                            <option value="Sri Lanka Institute of Nanotechnology (SLINTEC)">Sri Lanka Institute of Nanotechnology (SLINTEC)</option>
                                            <option value="Sri Lanka International Buddhist Academy (SIBA)">Sri Lanka International Buddhist Academy (SIBA)</option>
                                            <option value="Sri Lanka Technological Campus (SLTC)">Sri Lanka Technological Campus (SLTC)</option>
                                            <option value="University of Colombo (UOC)">University of Colombo (UOC)</option>
                                            <option value="University of Jaffna (UOJ)">University of Jaffna (UOJ)</option>
                                            <option value="University of Kelaniya (UOK)">University of Kelaniya (UOK)</option>
                                            <option value="University of Moratuwa (UOM)">University of Moratuwa (UOM)</option>
                                            <option value="University of Peradeniya (UOP)">University of Peradeniya (UOP)</option>
                                            <option value="University of Ruhuna (UOR)">University of Ruhuna (UOR)</option>
                                            <option value="University of Sri Jayewardenepura (USJ)">University of Sri Jayewardenepura (USJ)</option>
                                            <option value="University of the Visual and Performing Arts (UVPA)">University of the Visual and Performing Arts (UVPA)</option>
                                            <option value="University of Vavuniya (UOV)">University of Vavuniya (UOV)</option>
                                            <option value="University of Vocational Technology (UNIVOTEC)">University of Vocational Technology (UNIVOTEC)</option>
                                            <option value="Uva Wellassa University (UWU)">Uva Wellassa University (UWU)</option>
                                            <option value="Wayamba University of Sri Lanka (WUSL)">Wayamba University of Sri Lanka (WUSL)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="moduleFilter">Module:</label>
                                        <input type="text" className="form-control" name="moduleCode"
                                               value={filters.moduleCode} onChange={handleFilterChange}
                                               placeholder="Enter module code" />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="levelFilter">Level:</label>
                                        <select className="form-select" name="moduleLevel" value={filters.moduleLevel} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="Foundation">Foundation</option>
                                            <option value="1st Year / Level 4">1st Year / Level 4</option>
                                            <option value="2nd Year / Level 5">2nd Year / Level 5</option>
                                            <option value="3rd Year / Level 6">3rd Year / Level 6</option>
                                            <option value="4th Year / Level 7">4th Year / Level 7</option>
                                            <option value="Masters">Masters</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="uploaderFilter">Uploader:</label>
                                        <input type="text" className="form-control" name="uploaderName" value={filters.uploaderName} onChange={handleFilterChange} />
                                    </div>
                                </div>
                                <div className="text-end mt-3">
                                    <button className="btn btn-primary me-2" onClick={applyFilters}>Apply</button>
                                    <button className="btn btn-outline-secondary" onClick={handleClear}>Reset</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            <FileList files={files} onSelectFile={setSelectedFile} loading={loading} />
                        </div>
                        <div className="col-md-6">
                            <FilePreview selectedFile={selectedFile} />
                        </div>
                    </div>
                </div>

                <div className={`tab-pane fade ${activeTab === 'upload' ? 'show active' : ''}`}>
                    <UploadPage />
                </div>
            </div>
        </div>
    );
};

export default Tabs;