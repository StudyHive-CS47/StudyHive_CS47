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



    // Update when selectedFile changes
    useEffect(() => {
        if (selectedFile && selectedFile.id) {
            setFile(selectedFile);
            setPreviewUrl(api.getPreviewUrl(selectedFile.id));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    }, [selectedFile]);



    // Function to download the file
    const downloadFile = async () => {
        if (!file || !file.id) return;

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

            console.log("File downloaded successfully.");
        } catch (error) {
            console.error("Download error:", error);
            alert("Download failed. Please try again.");
        }
    };



    if (!selectedFile) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">File Preview</h5>
                </div>
                <div className="card-body">
                    <div className="preview-container">
                        <div className="text-center text-muted">
                            <i className="bi bi-file-earmark fs-1"></i>
                            <p>Select a file to preview</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">File Preview</h5>
                </div>
                <div className="card-body">
                    <p className="text-danger text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">File Preview</h5>
                </div>
                <div className="card-body">
                    <div className="preview-container">
                        <div className="text-center text-muted">
                            <i className="bi bi-file-earmark fs-1"></i>
                            <p>Loading preview...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">File Preview</h5>
            </div>
            <div className="card-body">
                {file && (
                    <>
                        <div id="fileMetadata" className="mb-3">
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">File Name:</div>
                                <div className="col-md-8">{file.filename || "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Uploader:</div>
                                <div className="col-md-8">{file.uploaderName || "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">University:</div>
                                <div className="col-md-8">{file.universityName || "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Module:</div>
                                <div className="col-md-8">{file.moduleCode || "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Module:</div>
                                <div className="col-md-8">{file.moduleLevel || "-"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Description:</div>
                                <div className="col-md-8">{file.fileDescription || "-"}</div>
                            </div>
                            <hr/>
                        </div>

                        <div className="preview-container">
                            {previewUrl ? (
                                <div className="text-center">
                                    <iframe
                                        src={previewUrl}
                                        width="100%"
                                        height="400px"
                                        frameBorder="0"
                                        title={`Preview of ${file.filename}`}
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="text-center text-muted">
                                    <i className="bi bi-file-earmark fs-1"></i>
                                    <p>Preview not available</p>
                                </div>
                            )}
                        </div>

                        <div className="d-flex mt-3">
                            <button className="btn btn-primary" onClick={downloadFile}>
                                <i className="bi bi-download"></i>
                            </button>
                            <button className="btn btn-secondary ms-2" onClick={() => setShowShareModal(true)}>
                                <i className="bi bi-share"></i>
                            </button>
                            <button className="btn btn-success ms-2" onClick={() => setShowRatingModal(true)}>
                                <i className="bi bi-star"></i>
                            </button>
                            <button className="btn btn-danger ms-auto" onClick={() => setShowReportModal(true)}>
                                <i className="bi bi-flag"></i>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            <RatingModal show={showRatingModal} onHide={() => setShowRatingModal(false)} />
            <ReportModal show={showReportModal} onHide={() => setShowReportModal(false)} />
            <ShareModal show={showShareModal} onHide={() => setShowShareModal(false)} />
        </div>
    );
};

export default FilePreview;