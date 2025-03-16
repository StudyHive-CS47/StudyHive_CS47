import React, { useState } from 'react';

const MyNotesPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notes, setNotes] = useState([]);

    // Simulate login/logout
    const handleLogin = () => {
        setIsLoggedIn(true);
        // Simulate fetching notes from an API
        setTimeout(() => {
            const mockNotes = [
                {
                    id: 1,
                    title: 'Lecture 1 Notes',
                    module: 'CS101',
                    uploaded: '2023-10-01',
                    downloads: 25,
                    rating: 4.5,
                },
                {
                    id: 2,
                    title: 'Lecture 2 Notes',
                    module: 'CS102',
                    uploaded: '2023-10-05',
                    downloads: 15,
                    rating: 4.0,
                },
            ];
            setNotes(mockNotes);
        }, 1000);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setNotes([]);
    };

    return (
        <div className="container py-4">

            {/* Login/Logout Button */}
            <div className="mb-4">
                {isLoggedIn ? (
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Log Out
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={handleLogin}>
                        Log In
                    </button>
                )}
            </div>


            {!isLoggedIn && (
                <div className="alert alert-info" role="alert">
                    <i className="bi bi-info-circle"></i> Please log in to view your uploaded notes.
                </div>
            )}


            {isLoggedIn && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">My Uploaded Notes</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Module</th>
                                    <th>Uploaded</th>
                                    <th>Downloads</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {notes.map((note) => (
                                    <tr key={note.id}>
                                        <td>{note.title}</td>
                                        <td>{note.module}</td>
                                        <td>{note.uploaded}</td>
                                        <td>{note.downloads}</td>
                                        <td>{note.rating}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary me-2">
                                                <i className="bi bi-download"></i> Download
                                            </button>
                                            <button className="btn btn-sm btn-danger">
                                                <i className="bi bi-trash"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNotesPage;