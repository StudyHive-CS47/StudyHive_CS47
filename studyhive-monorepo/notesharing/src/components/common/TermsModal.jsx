import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TermsModal = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Terms of Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>1. Content Ownership</h5>
                <p>
                    By uploading content to our platform, you certify that you have the right to share this material and grant us a
                    non-exclusive license to host and distribute it.
                </p>

                <h5>2. Prohibited Content</h5>
                <p>You may not upload content that:</p>
                <ul>
                    <li>Infringes copyright or intellectual property rights</li>
                    <li>Contains exam solutions or assessment answers not permitted for sharing</li>
                    <li>Contains personally identifiable information</li>
                    <li>Violates university policies or academic integrity standards</li>
                </ul>

                <h5>3. User Responsibility</h5>
                <p>
                    Users are responsible for all content they upload. The platform reserves the right to remove content that
                    violates these terms.
                </p>

                <h5>4. Academic Integrity</h5>
                <p>
                    This platform is designed to facilitate learning through shared notes. Users should adhere to their
                    university's academic integrity policies when using these materials.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    I Understand
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TermsModal;