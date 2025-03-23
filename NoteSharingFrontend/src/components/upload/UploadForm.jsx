import React, { useState } from 'react';
import TermsModal from '../../components/common/TermsModal.jsx';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import api from '../../services/api';


const UploadForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('No file selected');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    
    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    
    // Handle file removal
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName('No file selected');
    };

    
    // Handle drag-and-drop functionality
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');
    };

    
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        // Reset messages
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);

        // Create FormData object to send file and form data
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('uploaderName', document.getElementById('uploaderName').value);
        formData.append('universityName', document.getElementById('universityName').value);
        formData.append('moduleCode', document.getElementById('moduleCode').value);
        formData.append('moduleLevel', document.getElementById('moduleLevel').value);
        formData.append('fileDescription', document.getElementById('fileDescription').value);

        // Add tags if provided
        const tags = document.getElementById('fileTags').value;
        if (tags) {
            formData.append('tags', tags);
        }

        try {
            // Use the api service to upload the file
            const response = await api.uploadFile(formData);

            if (response) {
                console.log("Success response:", response);
                setSuccessMessage('File uploaded successfully!');

                // Reset form
                setSelectedFile(null);
                setFileName('No file selected');
                event.target.reset();
            } else {
                setErrorMessage('Upload failed: Unknown error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setErrorMessage('Upload failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Upload New Note</h5>
            </div>
            <div className="card-body">
                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form id="uploadForm" onSubmit={handleSubmit}>
                    {/* Uploader Name and University */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="uploaderName" className="form-label">
                                Your Name*
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="uploaderName"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="universityName" className="form-label">
                                University*
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="universityName"
                                list="universities"
                                required
                            />
                            <datalist id="universities">
                                {/* Universities will be populated dynamically */}
                            </datalist>
                        </div>
                    </div>

                    {/* Module Code and Level */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="moduleCode" className="form-label">
                                Module Code/Name*
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="moduleCode"
                                list="modules"
                                required
                            />
                            <datalist id="modules">
                                {/* Modules will be populated dynamically */}
                            </datalist>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="moduleLevel" className="form-label">
                                Module Level*
                            </label>
                            <select className="form-select" id="moduleLevel" required>
                                <option value="">Select Level...</option>
                                <option value="Level 4">Level 4</option>
                                <option value="Level 5">Level 5</option>
                                <option value="Level 6">Level 6</option>
                            </select>
                        </div>
                    </div>

                    {/* Note Description */}
                    <div className="mb-3">
                        <label htmlFor="fileDescription" className="form-label">
                            Note Description*
                        </label>
                        <textarea
                            className="form-control"
                            id="fileDescription"
                            rows="3"
                            required
                            placeholder="Briefly describe what these notes cover..."
                        ></textarea>
                    </div>

                    {/* Tags */}
                    <div className="mb-3">
                        <label htmlFor="fileTags" className="form-label">
                            Tags
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="fileTags"
                            placeholder="E.g., midterm, lecture, final, week1 (comma separated)"
                        />
                        <div className="form-text text-muted">
                            Add tags to make your notes easier to find
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="form-label">File Upload*</label>
                        <div
                            className="upload-container"
                            id="dropArea"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <i className="bi bi-cloud-upload fs-1 text-primary"></i>
                            <p>Drag and drop files here or click to browse</p>
                            <input
                                type="file"
                                id="fileInput"
                                className="d-none"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                Browse Files
                            </button>
                            <div id="filePreview" className={`mt-3 ${selectedFile ? '' : 'd-none'}`}>
                                <div className="alert alert-success d-flex align-items-center">
                                    <i className="bi bi-file-earmark-check me-2"></i>
                                    <span id="selectedFileName">{fileName}</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto"
                                        onClick={handleRemoveFile}
                                    ></button>
                                </div>
                            </div>
                        </div>
                        <div className="form-text text-muted">
                            Supported formats: PDF, DOC, PPT, TXT, MD, JPG, PNG (Max 50MB)
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="termsCheck"
                            required
                        />
                        <label className="form-check-label" htmlFor="termsCheck">
                            I confirm that I have the right to share these notes and agree to the{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowTermsModal(true);
                            }}>
                                terms of service
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Upload Notes
                        </button>
                    </div>
                </form>

                {/* Terms of Service Modal */}
                <TermsModal show={showTermsModal} onHide={() => setShowTermsModal(false)} />

                {/* Loading Overlay */}
                {isLoading && <LoadingOverlay />}
            </div>
        </div>
    );
};

export default UploadForm;
