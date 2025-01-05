import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import logo2 from '../../assets/logo2.png';

function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/chat');
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <img src={logo} alt="StudyHive Logo" className="logo-small" />
          
          <h1>Log into an account</h1>
          {error && <p className="error-message">{error}</p>}
          <p className="subtitle">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="text-input"
              value={formData.email}
              onChange={handleChange}
            />
            
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="text-input"
              value={formData.password}
              onChange={handleChange}
            />
            
            <p className="password-hint">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="checkbox-input"
              />
              Show password
            </label>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <button 
              type="button" 
              className="google-button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="google-icon" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
        
        <div className="login-right">
          <img src={logo2} alt="StudyHive Logo White" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 