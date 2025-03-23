import React, { useState, useEffect } from 'react';
import RatingModal from '../common/RatingModal.jsx';
import ReportModal from '../common/ReportModal.jsx';
import ShareModal from '../common/ShareModal.jsx';
import api from '../../services/api';

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
                            className="btn btn-sm btn-primary" 
                            onClick={downloadFile}
                            disabled={loading}
                        >
                            <i className="bi bi-download me-1"></i>
                            {loading ? 'Downloading...' : 'Download'}
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-primary"
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
                        <div className="bg-light rounded p-3 mb-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-person-circle fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-secondary">Uploader</small>
                                            <div className="fw-medium">{file.uploaderName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-building fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-secondary">University</small>
                                            <div className="fw-medium">{file.universityName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-book fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-secondary">Module Code</small>
                                            <div className="fw-medium">{file.moduleCode}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-layers fs-4 text-primary me-2"></i>
                                        <div>
                                            <small className="text-secondary">Level</small>
                                            <div className="fw-medium">{file.moduleLevel}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="preview-container mb-4">
                            {previewUrl ? (
                                <iframe
                                    src={previewUrl}
                                    className="w-100 h-100 rounded"
                                    style={{ minHeight: "400px" }}
                                    frameBorder="0"
                                    title={`Preview of ${file.filename}`}
                                ></iframe>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-file-earmark-x fs-1 text-secondary"></i>
                                    <p className="text-secondary mt-3">Preview not available</p>
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <button 
                                    className="btn btn-outline-success me-2"
                                    onClick={() => setShowRatingModal(true)}
                                >
                                    <i className="bi bi-star-fill me-1"></i>
                                    Rate
                                </button>
                            </div>
                            <button 
                                className="btn btn-outline-danger"
                                onClick={() => setShowReportModal(true)}
                            >
                                <i className="bi bi-flag-fill me-1"></i>
                                Report
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-file-earmark fs-1 text-secondary"></i>
                        <p className="text-secondary mt-3">Select a file to preview</p>
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