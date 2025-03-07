import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase'; // Import supabase
import './UserProfilePage.css'; // Create this CSS file for styling

const avatars = [
  '/src/assets/avatars/avatar1.png',
  '/src/assets/avatars/avatar2.png',
  '/src/assets/avatars/avatar3.png',
  '/src/assets/avatars/avatar4.png',
  '/src/assets/avatars/avatar5.png',
  '/src/assets/avatars/avatar6.png',
  '/src/assets/avatars/avatar7.png',
  '/src/assets/avatars/avatar8.png',
  '/src/assets/avatars/avatar9.png',
  '/src/assets/avatars/avatar10.png',
];

export default function UserProfilePage() {
  const { user, logout, updatePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id) // Fetch profile by user ID
        .single();

      if (error) {
        setError('Failed to fetch profile.');
        console.error('Profile fetch error:', error);
      } else {
        setProfile(data);
        setSelectedAvatar(data.avatar || '/assets/avatars/default-avatar.png'); // Set the selected avatar from the profile
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleAvatarChange = async (avatar) => {
    setSelectedAvatar(avatar);
    const { error } = await supabase
      .from('profiles')
      .update({ avatar })
      .eq('id', user.id);

    if (error) {
      setError('Failed to update avatar.');
      console.error('Avatar update error:', error);
    } else {
      setSuccess('Avatar updated successfully!');
      setShowAvatarSelection(false); // Close the avatar selection
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if old password is correct
    const { error: oldPasswordError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (oldPasswordError) {
      setError('Old password is incorrect. Please try again.');
      return;
    }

    // Validate new password
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please ensure both fields are identical.');
      return;
    }

    try {
      await updatePassword(newPassword); // Update the password
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Failed to update password. Please try again.');
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
      <div className="avatar-container" onClick={() => setShowAvatarSelection(!showAvatarSelection)}>
        <img src={selectedAvatar} alt="Profile Avatar" className="profile-avatar" />
      </div>
      
      <div className={`avatar-selection ${showAvatarSelection ? 'show' : ''}`}>
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => handleAvatarChange(avatar)}
          />
        ))}
      </div>

      <div className="profile-details">
        <p className="user-email">Email: {profile?.email}</p>
        <p className="user-name">First Name: {profile?.first_name}</p>
        <p className="user-name">Last Name: {profile?.last_name}</p>
        <p className="user-university">University: {profile?.university}</p>
        <p className="user-level">Academic Level: {profile?.academic_level}</p>
      </div>
      
      <button onClick={() => setShowPasswordReset(!showPasswordReset)} className="reset-password-button">
        {showPasswordReset ? "Cancel Password Reset" : "Reset Password"}
      </button>

      {showPasswordReset && (
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="password-field">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="password-input"
            />
          </div>
          <div className="password-field">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="password-input"
            />
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
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      )}

      <button onClick={handleLogout} className="logout-button">Logout</button>

      <p>
        <Link to="/help" className="help-link">Need Help? Our customer support agents are here for you.</Link>
      </p>
    </div>
  );
} 