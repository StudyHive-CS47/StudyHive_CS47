import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportModal = ({ show, onHide }) => {
    const [reportReason, setReportReason] = useState(''); // State to manage the selected reason
    const [reportDetails, setReportDetails] = useState(''); // State to manage the report details
    const [isConfirmed, setIsConfirmed] = useState(false); // State to manage the confirmation checkbox

    // Handle form submission
    const handleSubmit = () => {
        if (!reportReason || !isConfirmed) {
            alert('Please select a reason and confirm your report.');
            return;
        }
        console.log('Report Reason:', reportReason);
        console.log('Report Details:', reportDetails);
        onHide(); // Close the modal after submission
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Report Content</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Reason for Report */}
                    <Form.Group className="mb-3">
                        <Form.Label>Reason for Report</Form.Label>
                        <Form.Select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            required
                        >
                            <option value="">Select a reason...</option>
                            <option value="copyright">Copyright Violation</option>
                            <option value="inappropriate">Inappropriate Content</option>
                            <option value="plagiarism">Plagiarism</option>
                            <option value="exam">Contains Exam Solutions</option>
                            <option value="personal">Contains Personal Information</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Report Details */}
                    <Form.Group className="mb-3">
                        <Form.Label>Details</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Please provide more information about your report..."
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                        />
                    </Form.Group>

                    {/* Confirmation Checkbox */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            id="reportConfirm"
                            label="I confirm that this report is being made in good faith"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleSubmit} disabled={!reportReason || !isConfirmed}>
                    Submit Report
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportModal;