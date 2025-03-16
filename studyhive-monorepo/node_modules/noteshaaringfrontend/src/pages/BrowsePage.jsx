import React, { useState } from 'react';
import FileList from '../components/browse/FileList';
import FilePreview from '../components/browse/FilePreview';

const BrowsePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="container py-4">
            <h1 className="mb-4">StudyHive Note Sharing System</h1>

            <div className="row g-4">
                <div className="col-md-6 d-flex flex-column">
                    <FileList onSelectFile={setSelectedFile} />
                </div>
                <div className="col-md-6 d-flex flex-column">
                    <FilePreview selectedFile={selectedFile} />
                </div>
            </div>
        </div>
    );
};

export default BrowsePage;