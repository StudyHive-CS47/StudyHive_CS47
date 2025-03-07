import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase'; // Import supabase
import './UserProfilePage.css'; // Create this CSS file for styling

export default function UserProfilePage() {
  const { user, logout, updatePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

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
      <p className="user-email">Email: {profile?.email}</p>
      <p className="user-name">First Name: {profile?.first_name}</p>
      <p className="user-name">Last Name: {profile?.last_name}</p>
      <p className="user-university">University: {profile?.university}</p>
      <p className="user-level">Academic Level: {profile?.academic_level}</p>
      
      <button onClick={() => setShowPasswordReset(!showPasswordReset)} className="reset-password-button">
        {showPasswordReset ? "Cancel Password Reset" : "Reset Password"}
      </button>

      {showPasswordReset && (
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="password-input"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="change-password-button">Change Password</button>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      )}

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
} 