import React, { useState, useEffect } from 'react';
import FileList from '../browse/FileList';
import FilePreview from '../browse/FilePreview';
import UploadPage from '../../pages/UploadPage';
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

    const renderContent = () => {
        switch (activeTab) {
            case 'browse':
                return (
                    <div className="row g-4">
                        <div className="col-md-6 d-flex flex-column">
                            <FileList onSelectFile={setSelectedFile} files={files} loading={loading} error={error} />
                        </div>
                        <div className="col-md-6 d-flex flex-column">
                            <FilePreview selectedFile={selectedFile} />
                        </div>
                    </div>
                );
            case 'upload':
                return <UploadPage />;
            default:
                return null;
        }
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
                    <button 
                        className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('browse')}
                    >
                        Browse Notes
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload Notes
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Tabs;