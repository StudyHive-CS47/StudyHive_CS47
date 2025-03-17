import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';
import './SignupPage.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password);
      navigate(routes.public.login);
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account. ' + error.message);
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
    <div className="signup-container">
      <h2>Create your StudyHive Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="University Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="signup-button"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div className="auth-links">
        <Link to={routes.public.login}>Already have an account? Login</Link>
      </div>
    </div>
  );
} 
