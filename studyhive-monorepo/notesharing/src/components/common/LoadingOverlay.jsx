import React from 'react';

const LoadingOverlay = ({ show }) => {
    return (
        <div className={`loading-overlay ${show ? 'show' : ''}`}>
            <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;