import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css'; // Create this CSS file for styling

export default function UserProfilePage() {
  const { user, logout, updatePassword, login } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please ensure both fields are identical.');
      return;
    }

    try {
      // Verify old password
      const { error: loginError } = await login(user.email, oldPassword);
      if (loginError) {
        setError('Old password is incorrect. Please try again.');
        return;
      }

      await updatePassword(newPassword); // Update the password
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.message.includes('password')) {
        setError('Failed to update password. Please ensure your new password meets the requirements.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error('Password change error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      <p className="user-email">Email: {user?.email}</p>
      <form onSubmit={handlePasswordChange} className="password-form">
        <div className="password-field">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="password-input"
          />
          <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
            {showOldPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="password-field">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="password-input"
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="password-field">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="password-input"
          />
        </div>
        <button type="submit" className="change-password-button">Change Password</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
} 