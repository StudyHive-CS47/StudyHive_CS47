import React, { useState } from 'react';
import FileList from '../components/browse/FileList';
import FilePreview from '../components/browse/FilePreview';

const BrowsePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="container py-4">
            <h1 className="mb-4">StudyHive Note Sharing System</h1>

            <div className="row">
                <div className="col-md-6">
                    <FileList onSelectFile={setSelectedFile} />
                </div>
                <div className="col-md-6">
                    <FilePreview file={selectedFile} />
                </div>
            </div>
        </div>
    );
};

export default BrowsePage;