import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SuccessPage.css';
import logo from '../../assets/logo.png';

export default function SuccessPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <img src={logo} alt="StudyHive" className="logo-small" />
        <h1>Successfully Logged In</h1>
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </div>
  );
} 