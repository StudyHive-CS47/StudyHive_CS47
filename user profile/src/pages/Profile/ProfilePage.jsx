import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import './ProfilePage.css';
import defaultAvatar from '../../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    university: user?.user_metadata?.university || '',
    avatarUrl: user?.user_metadata?.avatar_url || defaultAvatar
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, university, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfile({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            university: data.university || '',
            avatarUrl: data.avatar_url || defaultAvatar
          });
        } else {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              first_name: user?.user_metadata?.first_name || '',
              last_name: user?.user_metadata?.last_name || '',
              university: user?.user_metadata?.university || '',
              avatar_url: user?.user_metadata?.avatar_url || defaultAvatar,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }

          setProfile({
            firstName: user?.user_metadata?.first_name || '',
            lastName: user?.user_metadata?.last_name || '',
            university: user?.user_metadata?.university || '',
            avatarUrl: user?.user_metadata?.avatar_url || defaultAvatar
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile({
          firstName: user?.user_metadata?.first_name || '',
          lastName: user?.user_metadata?.last_name || '',
          university: user?.user_metadata?.university || '',
          avatarUrl: user?.user_metadata?.avatar_url || defaultAvatar
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset link has been sent to your email.' 
      });
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to send password reset link. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      if (!file) return;

      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const base64Image = reader.result;

          // Update profile in database
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              avatar_url: base64Image,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (profileError) throw profileError;

          // Update auth metadata
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: base64Image }
          });

          if (updateError) throw updateError;

          // Update local state
          setProfile(prev => ({ ...prev, avatarUrl: base64Image }));
          setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        } catch (error) {
          console.error('Error saving image:', error);
          setMessage({
            type: 'error',
            text: error.message || 'Failed to update profile picture. Please try again.'
          });
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setMessage({
          type: 'error',
          text: 'Failed to read image file. Please try again.'
        });
        setLoading(false);
      };

    } catch (error) {
      console.error('Error handling file:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to process image. Please try again.'
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          avatar_url: profile.avatarUrl
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          university: profile.university,
          avatar_url: profile.avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to log out.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1>Profile Settings</h1>
        
        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={handleImageClick}>
            <img 
              src={profile.avatarUrl || defaultAvatar} 
              alt="Profile" 
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <div className="avatar-overlay">
              <span>Change Photo</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              value={profile.university}
              disabled
              className="disabled-input"
            />
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button 
            type="button" 
            onClick={handlePasswordReset} 
            className="password-reset-btn"
            disabled={loading}
          >
            Send Password Reset Link
          </button>
        </form>

        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
} 