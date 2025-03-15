import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ShareModal = ({ show, onHide, shareLink }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = (e) => {
        const linkInput = e.target.closest('.input-group').querySelector('input');
        linkInput.select();
        document.execCommand('copy');

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Share Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Copy this link to share your notes:</p>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control share-modal-content"
                        value={shareLink}
                        readOnly
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleCopyLink}
                    >
                        <i className="bi bi-clipboard"></i> {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShareModal;
