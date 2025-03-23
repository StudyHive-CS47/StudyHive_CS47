import React, { useState } from 'react';
import UploadForm from '../components/upload/UploadForm';

const UploadPage = () => {
    return (
        <div className="container-fluid py-4" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <div className="w-100 p-4" style={{ maxWidth: '1200px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h1 className="mb-4 text-center">Upload Your Notes</h1>
                <UploadForm />
            </div>
        </div>
    );
};

export default UploadPage;


