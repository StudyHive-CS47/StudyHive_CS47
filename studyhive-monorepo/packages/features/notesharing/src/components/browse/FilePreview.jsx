import React, { useState, useEffect } from 'react';
import RatingModal from '../common/RatingModal.jsx';
import ReportModal from '../common/ReportModal.jsx';
import ShareModal from '../common/ShareModal.jsx';
import api from '../../services/api';
import './FilePreview.css';

const FilePreview = ({ selectedFile }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedFile && selectedFile.id) {
            setFile(selectedFile);
            setPreviewUrl(api.getPreviewUrl(selectedFile.id));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    }, [selectedFile]);

    const downloadFile = async () => {
        if (!file || !file.id) return;
        setLoading(true);

        try {
            const response = await api.downloadFile(file.id);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.filename || "file_download");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            setError("Failed to download file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">File Preview</h5>
                {file && (
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-primary" 
                            onClick={downloadFile}
                            disabled={loading}
                        >
                            <i className="bi bi-download me-1"></i>
                            Download
                        </button>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => setShowShareModal(true)}
                        >
                            <i className="bi bi-share me-1"></i>
                            Share
                        </button>
                    </div>
                )}
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}
                
                {file ? (
                    <>
                        <div className="file-details">
                            <div className="row g-4">
                                <div className="col-6">
                                    <div className="detail-item d-flex align-items-center">
                                        <i className="bi bi-person-circle text-primary"></i>
                                        <div>
                                            <small className="text-muted d-block">Uploader</small>
                                            <span className="fw-medium">{file.uploaderName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="detail-item d-flex align-items-center">
                                        <i className="bi bi-building text-primary"></i>
                                        <div>
                                            <small className="text-muted d-block">University</small>
                                            <span className="fw-medium">{file.universityName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="detail-item d-flex align-items-center">
                                        <i className="bi bi-book text-primary"></i>
                                        <div>
                                            <small className="text-muted d-block">Module Code</small>
                                            <span className="fw-medium">{file.moduleCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="detail-item d-flex align-items-center">
                                        <i className="bi bi-layers text-primary"></i>
                                        <div>
                                            <small className="text-muted d-block">Level</small>
                                            <span className="fw-medium">{file.moduleLevel}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="description-section">
                            <div className="d-flex align-items-start">
                                <i className="bi bi-file-text me-3"></i>
                                <div>
                                    <small className="text-muted d-block mb-2">Description</small>
                                    <p className="mb-0">{file.fileDescription || 'No description provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="preview-container">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    title={`Preview of ${file.filename}`}
                                ></iframe>
                            ) : (
                                <div className="empty-state">
                                    <i className="bi bi-file-earmark-x"></i>
                                    <p>Preview not available</p>
                                </div>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="btn btn-outline-success"
                                onClick={() => setShowRatingModal(true)}
                            >
                                <i className="bi bi-star me-1"></i>
                                Rate
                            </button>
                            <button 
                                className="btn btn-outline-danger"
                                onClick={() => setShowReportModal(true)}
                            >
                                <i className="bi bi-flag me-1"></i>
                                Report
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <i className="bi bi-file-earmark"></i>
                        <p>Select a file to preview</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <RatingModal show={showRatingModal} onHide={() => setShowRatingModal(false)} fileId={file?.id} />
            <ReportModal show={showReportModal} onHide={() => setShowReportModal(false)} fileId={file?.id} />
            <ShareModal show={showShareModal} onHide={() => setShowShareModal(false)} shareLink={previewUrl} />
        </div>
    );
};

export default FilePreview;