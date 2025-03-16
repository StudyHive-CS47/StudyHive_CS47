import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

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

const checkPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 0: return "Very Weak";
    case 1: return "Weak";
    case 2: return "Fair";
    case 3: return "Good";
    case 4: return "Strong";
    case 5: return "Very Strong";
    default: return "";
  }
};

const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0: return "#ff4444";
    case 1: return "#ffbb33";
    case 2: return "#ffbb33";
    case 3: return "#00C851";
    case 4: return "#007E33";
    case 5: return "#007E33";
    default: return "#eee";
  }
};

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
        .eq('id', user.id)
        .single();

      if (error) {
        setError('Failed to fetch profile.');
        console.error('Profile fetch error:', error);
      } else {
        setProfile(data);
        setSelectedAvatar(data.avatar || '/assets/avatars/default-avatar.png');
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
      setShowAvatarSelection(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordStrength = checkPasswordStrength(newPassword);
    if (passwordStrength < 3) {
      setError('Password is too weak. Please include uppercase, lowercase, numbers, and special characters.');
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
      });

      if (signInError) {
        setError('Current password is incorrect');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (updateError) throw updateError;

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordReset(false);
      setSuccess('Password updated successfully!');

    } catch (error) {
      console.error('Password update error:', error);
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Base color */}
      <div className="absolute inset-0 bg-blue-50"></div>
      
      {/* Graph paper pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center center'
      }}></div>
      
      {/* Subtle highlight */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 50% 50%, 
            rgba(255, 255, 255, 0.8) 0%, 
            rgba(255, 255, 255, 0.3) 50%, 
            transparent 100%)
        `
      }}></div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative z-10">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 relative">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 lg:px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-24 mb-8 flex justify-between items-end">
              <div className="relative">
                <img
                  src={selectedAvatar || '/assets/avatars/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                />
                <button 
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setShowPasswordReset(!showPasswordReset)}
                className="px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Change Password
              </button>
            </div>

            {/* User Info Section */}
            <div className="space-y-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h2>
              
              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                {/* Email */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user?.email}</p>
                </div>
                
                {/* University */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">University</p>
                  <p className="text-base text-gray-900">{profile?.university}</p>
                </div>
                
                {/* Academic Level */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Academic Level</p>
                  <p className="text-base text-gray-900">{profile?.academic_level}</p>
                </div>
                
                {/* Join Date */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p className="text-base text-gray-900">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Avatar Selection Modal */}
            {showAvatarSelection && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your avatar</h3>
                <div className="grid grid-cols-5 gap-6">
                  {avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-20 h-20 rounded-full cursor-pointer hover:ring-4 hover:ring-indigo-500/50 transition-all transform hover:scale-105"
                      onClick={() => handleAvatarChange(avatar)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Password Reset Form */}
            {showPasswordReset && (
              <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">Strength:</div>
                          <div 
                            className="text-sm font-medium"
                            style={{ color: getPasswordStrengthColor(checkPasswordStrength(newPassword)) }}
                          >
                            {getPasswordStrengthText(checkPasswordStrength(newPassword))}
                          </div>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${(checkPasswordStrength(newPassword) / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor(checkPasswordStrength(newPassword))
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={async () => {
                  try {
                    await logout();
                    navigate('/login');
                  } catch (error) {
                    setError('Failed to log out.');
                  }
                }}
                className="w-full py-3 border-2 border-black text-black rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
