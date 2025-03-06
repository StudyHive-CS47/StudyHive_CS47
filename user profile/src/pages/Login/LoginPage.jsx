import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import logo2 from '../../assets/logo2.png';
import logo from '../../assets/logo.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const { error } = await login(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
          setError('Please verify your email before logging in. Check your university email inbox (including spam folder) for the verification link.');
          return;
        }
        throw error;
      }
      
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Failed to sign in. Please check your credentials or confirm your account via email first.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <img src={logo} alt="StudyHive" className="logo-small" />
          <h1>Welcome Back</h1>
          <p className="subtitle">Log in to continue to StudyHive</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              ref={emailRef}
            />
            
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                ref={passwordRef}
              />
              <div className="show-password-toggle">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword">Show password</label>
              </div>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="signup-link">
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </div>
        </div>
        
        <div className="login-right">
          <img src={logo2} alt="StudyHive" className="glowing-logo" />
        </div>
      </div>
    </div>
  );
} 