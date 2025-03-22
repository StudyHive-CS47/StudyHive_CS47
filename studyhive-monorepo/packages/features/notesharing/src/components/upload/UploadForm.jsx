import React, { useState, useEffect } from 'react';
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
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // List of universities in Sri Lanka
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
        "Uva Wellassa University (UWU)"
    ];

    // Auto-close success popup after 3 seconds
    useEffect(() => {
        let timer;
        if (showSuccessPopup) {
            timer = setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showSuccessPopup]);

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
                setShowSuccessPopup(true); // Show the popup

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

                {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="position-fixed top-50 start-50 translate-middle p-4 bg-success text-white rounded shadow-lg" style={{ zIndex: 1050 }}>
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill fs-1 me-3"></i>
                            <div>
                                <h4 className="mb-0">Success!</h4>
                                <p className="mb-0">Note uploaded successfully</p>
                            </div>
                        </div>
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
                            <select
                                className="form-select"
                                id="universityName"
                                required
                            >
                                <option value="">Select University...</option>
                                {universities.map((university, index) => (
                                    <option key={index} value={university}>
                                        {university}
                                    </option>
                                ))}
                            </select>
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
                                <option value="Foundation">Foundation</option>
                                <option value="1st Year / Level 4">1st Year / Level 4</option>
                                <option value="2nd Year / Level 5">2nd Year / Level 5</option>
                                <option value="3rd Year / Level 6">3rd Year / Level 6</option>
                                <option value="4th Year / Level 7">4th Year / Level 7</option>
                                <option value="Masters">Masters</option>
                                <option value="PhD">PhD</option>
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