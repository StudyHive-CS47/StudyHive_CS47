import React, { useState, useEffect } from 'react';
import FileList from '../browse/FileList';
import FilePreview from '../browse/FilePreview';
import UploadPage from '../../pages/UploadPage';
import MyNotesPage from '../../pages/MyNotesPage';
import api from '../../services/api';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('browse'); // State to manage the active tab
    const [selectedFile, setSelectedFile] = useState(null); // State to manage the selected file
    const [files, setFiles] = useState([]); // State to store all files
    const [filteredFiles, setFilteredFiles] = useState([]); // State to store filtered files
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [searchQuery, setSearchQuery] = useState(''); // State to manage search query
    const [filters, setFilters] = useState({
        university: '',
        module: '',
        level: '',
        uploader: '',
    }); // State to manage advanced filters

    // Fetch files from the backend
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                const data = await api.getAllFiles();
                setFiles(data);
                setFilteredFiles(data); // Initialize filtered files with all files
            } catch (error) {
                console.error('Failed to fetch files:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        applyFilters(searchQuery, { ...filters, [name]: value });
    };

    // Apply filters and search
    const applyFilters = (query, filters) => {
        const filtered = files.filter((file) => {
            const matchesSearch =
                file.filename.toLowerCase().includes(query) ||
                file.uploaderName.toLowerCase().includes(query) ||
                file.moduleCode.toLowerCase().includes(query) ||
                file.fileDescription.toLowerCase().includes(query);

            const matchesFilters =
                (filters.university === '' || file.universityName === filters.university) &&
                (filters.module === '' || file.moduleCode === filters.module) &&
                (filters.level === '' || file.moduleLevel === filters.level) &&
                (filters.uploader === '' || file.uploaderName.toLowerCase().includes(filters.uploader.toLowerCase()));

            return matchesSearch && matchesFilters;
        });
        setFilteredFiles(filtered);
    };

    // Handle clear search and filters
    const handleClear = () => {
        setSearchQuery('');
        setFilters({
            university: '',
            module: '',
            level: '',
            uploader: '',
        });
        setFilteredFiles(files); // Reset to all files
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4">StudyHive Note Sharing System</h1>

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
                        onClick={() => setActiveTab('browse')}
                    >
                        Browse Notes
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload Notes
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'my-notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-notes')}
                    >
                        My Notes
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content" id="myTabContent">
                {/* Browse Tab */}
                <div
                    className={`tab-pane fade ${activeTab === 'browse' ? 'show active' : ''}`}
                    id="browse"
                    role="tabpanel"
                >
                    {/* Search and Filter Options */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search files by name..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-primary">
                                    <i className="bi bi-search"></i> Search
                                </button>
                                <button className="btn btn-secondary" onClick={handleClear}>
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#filterCollapse"
                            >
                                <i className="bi bi-funnel"></i> Advanced Filters
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="collapse mb-4" id="filterCollapse">
                        <div className="card card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label htmlFor="universityFilter" className="form-label">
                                            University:
                                        </label>
                                        <select
                                            className="form-select"
                                            id="universityFilter"
                                            name="university"
                                            value={filters.university}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Universities</option>
                                            <option value="University A">University A</option>
                                            <option value="University B">University B</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label htmlFor="moduleFilter" className="form-label">
                                            Module:
                                        </label>
                                        <select
                                            className="form-select"
                                            id="moduleFilter"
                                            name="module"
                                            value={filters.module}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Modules</option>
                                            <option value="CS101">CS101</option>
                                            <option value="CS102">CS102</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label htmlFor="levelFilter" className="form-label">
                                            Level:
                                        </label>
                                        <select
                                            className="form-select"
                                            id="levelFilter"
                                            name="level"
                                            value={filters.level}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">All Levels</option>
                                            <option value="Level 4">Level 4</option>
                                            <option value="Level 5">Level 5</option>
                                            <option value="Level 6">Level 6</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label htmlFor="uploaderFilter" className="form-label">
                                            Uploader:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="uploaderFilter"
                                            name="uploader"
                                            placeholder="Filter by uploader..."
                                            value={filters.uploader}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <button className="btn btn-primary" onClick={() => applyFilters(searchQuery, filters)}>
                                    Apply Filters
                                </button>
                                <button className="btn btn-outline-secondary" onClick={handleClear}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* File List and Preview Section */}
                    <div className="row">
                        {/* File List Section */}
                        <div className="col-md-6">
                            <FileList files={filteredFiles} onSelectFile={setSelectedFile} loading={loading} />
                        </div>

                        {/* Preview Section */}
                        <div className="col-md-6">
                            <FilePreview fileId={selectedFile?._id} />
                        </div>
                    </div>
                </div>

                {/* Upload Tab */}
                <div
                    className={`tab-pane fade ${activeTab === 'upload' ? 'show active' : ''}`}
                    id="upload"
                    role="tabpanel"
                >
                    <UploadPage />
                </div>

                {/* My Notes Tab */}
                <div
                    className={`tab-pane fade ${activeTab === 'my-notes' ? 'show active' : ''}`}
                    id="my-notes"
                    role="tabpanel"
                >
                    <MyNotesPage />
                </div>
            </div>
        </div>
    );
};

export default Tabs;