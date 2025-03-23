import React from 'react';
import api from '../../services/api';


// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 Bytes';

    bytes = Number(bytes);
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;

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
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Files</h5>
                <span className="badge bg-primary">{files.length}</span>
            </div>
            <div className="card-body file-container">
                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ul className="list-group">
                        {files.length > 0 ? (
                            files.map((file) => (
                                <li key={file.id} className="list-group-item file-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{file.filename}</h6>
                                            <small className="text-muted">
                                                Uploaded by {file.uploaderName} | {file.moduleCode} | {file.universityName}
                                            </small>
                                        </div>
                                        <div className="text-end">
                                            <small className="text-muted">
                                                {formatFileSize(file.fileSize)} | {new Date(file.uploadDate).toLocaleDateString()} | {file.downloads || 0} downloads | ⭐ {file.rating || 'N/A'}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleDownload(file.id, file.filename)}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handlePreview(file)}
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