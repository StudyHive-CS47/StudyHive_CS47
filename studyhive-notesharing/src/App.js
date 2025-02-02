import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Extended top contributors data
  const topContributors = [
    { name: 'John Doe', place: '1st', notes: 150, percentage: 100, photo: '/api/placeholder/50/50' },
    { name: 'Jane Smith', place: '2nd', notes: 140, percentage: 93, photo: '/api/placeholder/50/50' },
    { name: 'Mike Johnson', place: '3rd', notes: 130, percentage: 87, photo: '/api/placeholder/50/50' },
    { name: 'Sarah Wilson', place: '4th', notes: 125, percentage: 83 },
    { name: 'Alex Brown', place: '5th', notes: 120, percentage: 80 },
    { name: 'Emily Davis', place: '6th', notes: 115, percentage: 77 },
    { name: 'Chris Taylor', place: '7th', notes: 110, percentage: 73 },
    { name: 'Lisa Anderson', place: '8th', notes: 105, percentage: 70 },
    { name: 'Tom Martin', place: '9th', notes: 100, percentage: 67 },
    { name: 'Amy White', place: '10th', notes: 95, percentage: 63 }
  ];

  const suggestionList = [
    'React.js',
    'JavaScript',
    'CSS Tricks',
    'Web Development',
    'HTML Basics',
    'Frontend Frameworks',
    'Backend Development',
    'Tailwind CSS',
    'Node.js',
    'GraphQL',
  ];

  // Animation for vertical bars
  useEffect(() => {
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach((bar) => {
      const height = bar.getAttribute('data-height');
      setTimeout(() => {
        bar.style.height = `${height}%`;
      }, 300);
    });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setSuggestions([]);
    } else {
      const filteredSuggestions = suggestionList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    addFiles(files);
  };

  const handleFileRename = (index, newName) => {
    setUploadedFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].newName = newName; // Add newName property to the file object
      return updatedFiles;
    });
  };

  const addFiles = (files) => {
    const supportedFiles = files.filter(file => {
      const supportedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'video/mp4',
        'application/pdf', 'application/psd', 'application/ai',
        'application/msword', 'application/vnd.ms-powerpoint'
      ];
      return supportedTypes.includes(file.type);
    });

    setUploadedFiles(prevFiles => [...prevFiles, ...supportedFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmitUpload = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please select files to upload first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(i);
      }

      // Here you would typically make an API call to your backend
      // const formData = new FormData();
      // uploadedFiles.forEach(file => {
      //   formData.append('files', file);
      // });
      // await axios.post('/api/upload', formData);

      alert('Files uploaded successfully!');
      setUploadedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <h1 className="heading">NoteSharing</h1>
        <div className="box-container">
          {/* Box 1 - Contributors */}
          <div className="box box1">
            <h2>Top Contributors</h2>
            
            {/* Vertical Bars for Top 3 */}
            <div className="top-performers">
              {topContributors.slice(0, 3).map((contributor, index) => (
                <div 
                  key={index} 
                  className={`vertical-bar ${index === 0 ? 'first-place' : index === 1 ? 'second-place' : 'third-place'}`}
                  style={{ height: `${contributor.percentage}%` }}
                >
                  <div className="profile-photo">
                    <img src={contributor.photo} alt={contributor.name} />
                  </div>
                  <div className="bar-fill" data-height={contributor.percentage} style={{ height: '0%' }} />
                  <span className="bar-label">{contributor.name}</span>
                </div>
              ))}
            </div>

            {/* Contributors Table */}
            <div className="contributors-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Place</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributors.map((contributor, index) => (
                    <tr key={index}>
                      <td>{contributor.name}</td>
                      <td>{contributor.place}</td>
                      <td>{contributor.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box 2 - File Upload */}
          <div className="box box2">
            <h2>Upload Files</h2>
            <div
              className={`upload-area ${isDragging ? 'drag-over' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <p>Drag & drop files here</p>
              <p>or</p>
              <label className="upload-button" htmlFor="file-input">
                Choose Files
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  accept=".jpg,.jpeg,.png,.gif,.mp4,.pdf,.psd,.ai,.doc,.docx,.ppt,.pptx"
                />
              </label>
            </div>
            <p className="supported-formats">
              Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
            </p>
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h3>Uploaded Files:</h3>
                <ul>
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>
                      <div className="file-info">
                        {/* Display the original file name */}
                        <span>{file.name}</span>
                        
                        {/* Input field for renaming */}
                        <input
                          type="text"
                          placeholder="Rename file"
                          value={file.newName || file.name} // If newName exists, show it; otherwise, show the original file name
                          onChange={(e) => handleFileRename(index, e.target.value)} // Update file name in state
                        />
                        {/* Remove button */}
                        <button onClick={() => removeFile(index)}>✕</button>
                      </div>
                    </li>
                  ))}
                </ul>

                {isUploading ? (
                  <div className="upload-progress">
                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                    <span>{uploadProgress}%</span>
                  </div>
                ) : (
                  <button
                    className="submit-upload-button"
                    onClick={handleSubmitUpload}
                    disabled={isUploading}
                  >
                    Upload Notes
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Box 3 - Search */}
          <div className="box box3">
            <h2>Search</h2>
            <input
              type="text"
              className="search-bar"
              placeholder="Type to search..."
              value={query}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;

