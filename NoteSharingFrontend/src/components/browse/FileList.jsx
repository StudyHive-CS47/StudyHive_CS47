import React from 'react';

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return i === 0 ? `${bytes} ${sizes[i]}` : `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// File List Component
const FileList = ({ files = [], onSelectFile, loading, error }) => {

    // Handle file download
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
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Failed to download file. Please try again.');
        }
    };

    // Handle file preview
    const handlePreview = (file) => {
        if (onSelectFile) {
            onSelectFile(file);
        }
    };

    return (
        <div className="card">
            {/* Card Header */}
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Files</h5>
                <span className="badge bg-primary">{files.length}</span>
            </div>

            {/* Card Body */}
            <div className="card-body file-container">

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading Indicator */}
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ul className="list-group">
                        {files.length > 0 ? (
                            files.map(({ id, filename, uploaderName, moduleCode, universityName, fileSize, uploadDate, downloads, rating }) => (
                                <li key={id} className="list-group-item file-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{filename}</h6>
                                            <small className="text-muted">
                                                Uploaded by {uploaderName} | {moduleCode} | {universityName}
                                            </small>
                                        </div>
                                        <div className="text-end">
                                            <small className="text-muted">
                                                {formatFileSize(fileSize)} | {new Date(uploadDate).toLocaleDateString()} | {downloads || 0} downloads | ⭐ {rating || 'N/A'}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleDownload(id, filename)}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handlePreview({ id, filename })}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="text-center p-3">
                                <p className="text-muted">No files found</p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileList;
