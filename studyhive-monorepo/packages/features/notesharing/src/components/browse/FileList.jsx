import React from 'react';
import api from '../../services/api';
import './FileList.css';

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const FileList = ({ files = [], onSelectFile, loading, error }) => {
    // Function to handle file download
    const handleDownload = async (fileId, filename) => {
        try {
            const response = await api.downloadFile(fileId);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    // Function to handle preview click
    const handlePreview = (file) => {
        // Call the onSelectFile callback to update the selected file in the parent component
        if (onSelectFile) {
            onSelectFile(file);
        }
    };

    return (
        <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Available Notes</h5>
                <span className="badge bg-primary">{files?.length || 0}</span>
            </div>
            <div className="card-body">
                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger m-3" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="file-list">
                        {files?.length > 0 ? (
                            files.map((file) => (
                                <div 
                                    key={file.id} 
                                    className="file-item p-3"
                                    onClick={() => onSelectFile(file)}
                                >
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <i className="bi bi-file-earmark-text fs-2 text-primary"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 text-primary">{file.filename}</h6>
                                            <div className="small text-secondary mb-2">
                                                <span className="me-2">
                                                    <i className="bi bi-person me-1"></i>
                                                    {file.uploaderName}
                                                </span>
                                                <span className="me-2">
                                                    <i className="bi bi-book me-1"></i>
                                                    {file.moduleCode}
                                                </span>
                                                <span>
                                                    <i className="bi bi-building me-1"></i>
                                                    {file.universityName}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="badge bg-light text-secondary">
                                                    <i className="bi bi-hdd me-1"></i>
                                                    {formatFileSize(file.fileSize)}
                                                </span>
                                                <span className="badge bg-light text-secondary">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    {new Date(file.uploadDate).toLocaleDateString()}
                                                </span>
                                                <span className="badge bg-light text-secondary">
                                                    <i className="bi bi-download me-1"></i>
                                                    {file.downloads || 0}
                                                </span>
                                                <span className="badge bg-light text-secondary">
                                                    <i className="bi bi-star-fill me-1 text-warning"></i>
                                                    {file.rating || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <i className="bi bi-chevron-right text-secondary"></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4">
                                <i className="bi bi-inbox fs-1 text-secondary"></i>
                                <p className="text-secondary mt-2">No notes available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileList;