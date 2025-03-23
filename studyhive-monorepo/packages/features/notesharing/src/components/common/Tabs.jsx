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
            <h1 className="mb-4">StudyHive Note Sharing System</h1>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Browse Notes</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload Notes</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'my-notes' ? 'active' : ''}`} onClick={() => setActiveTab('my-notes')}>My Notes</button>
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
                                            <option value="University A">University A</option>
                                            <option value="University B">University B</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="moduleFilter">Module:</label>
                                        <select className="form-select" name="moduleCode" value={filters.moduleCode} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="CS101">CS101</option>
                                            <option value="CS102">CS102</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="levelFilter">Level:</label>
                                        <select className="form-select" name="moduleLevel" value={filters.moduleLevel} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="Level 4">Level 4</option>
                                            <option value="Level 5">Level 5</option>
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
                <div className={`tab-pane fade ${activeTab === 'my-notes' ? 'show active' : ''}`}>
                    <MyNotesPage />
                </div>
            </div>
        </div>
    );
};

export default Tabs;