import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const RatingModal = ({ show, onHide }) => {
    const [rating, setRating] = useState(0); // State to manage the selected rating
    const [feedback, setFeedback] = useState(''); // State to manage the feedback text
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track if the rating is submitted

    // Handle star click
    const handleStarClick = (value) => {
        setRating(value);
    };

    // Handle feedback change
    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    // Handle rating submission
    const handleSubmit = () => {
        console.log('Rating:', rating);
        console.log('Feedback:', feedback);
        setIsSubmitted(true);
        onHide(); // Close the modal after submission
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Rate this Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <div className="rating-stars fs-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <i
                                key={value}
                                className={`bi bi-star${rating >= value ? '-fill' : ''} rating-star`}
                                style={{ cursor: 'pointer', color: rating >= value ? '#ffc107' : '#d3d3d3' }}
                                onClick={() => handleStarClick(value)}
                            ></i>
                        ))}
                    </div>
                    <p className="mt-2" id="ratingText">
                        {rating === 0 ? 'Select a rating' : `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="mb-3">
                    <label htmlFor="ratingFeedback" className="form-label">
                        Feedback (optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="ratingFeedback"
                        rows="3"
                        placeholder="What did you like or dislike about these notes?"
                        value={feedback}
                        onChange={handleFeedbackChange}
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={rating === 0}>
                    Submit Rating
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;