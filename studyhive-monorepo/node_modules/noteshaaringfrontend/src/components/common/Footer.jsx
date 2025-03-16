import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light py-4 mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>University Note Sharing System</h5>
                        <p className="text-muted">
                            Share and discover academic resources to enhance your learning experience.
                        </p>
                    </div>
                </div>
                <hr />
                <div className="text-center">
                    <p className="mb-0">&copy; 2025 University Note Sharing System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;