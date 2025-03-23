import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';
import { Dropdown } from 'semantic-ui-react';
import { supabase } from '@shared/config/supabase';
import 'semantic-ui-css/semantic.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './SignupPage.css';
import logo from '../../assets/logo.png';
import logo2 from '../../assets/logo2.png';
import Footer from '@shared/components/Footer/Footer';

// University and Academic Level data
const universities = [
  "Aquinas College of Higher Studies (ACHS)",
  "Benedict XVI Catholic Institute of Higher Education (BCI)",
  "Bhiksu University of Sri Lanka (BUSL)",
  "Buddhist and Pali University of Sri Lanka (BPU)",
  "Business Management School (BMS)",
  "Colombo International Nautical and Engineering College (CINEC)",
  "Eastern University, Sri Lanka (EUSL)",
  "Esoft Metro Campus (ESOFT)",
  "Gampaha Wickramarachchi University of Indigenous Medicine (GWUIM)",
  "General Sir John Kotelawala Defence University (KDU)",
  "Horizon Campus (HC)",
  "Informatics Institute of Technology (IIT)",
  "Institute of Chartered Accountants of Sri Lanka (CA Sri Lanka)",
  "Institute of Chemistry Ceylon (IChemC)",
  "Institute of Surveying and Mapping (ISM)",
  "Institute of Technological Studies (ITS)",
  "International College of Business and Technology (ICBT)",
  "International Institute of Health Science (IIHS)",
  "KAATSU International University (KIU)",
  "National Institute of Business Management (NIBM)",
  "National Institute of Social Development (NISD)",
  "National School of Business Management (NSBM)",
  "Ocean University of Sri Lanka (OCSL)",
  "Open University of Sri Lanka (OUSL)",
  "Rajarata University of Sri Lanka (RUSL)",
  "Royal Institute Colombo (RIC)",
  "Sabaragamuwa University of Sri Lanka (SUSL)",
  "Saegis Campus (SAEGIS)",
  "SANASA Campus (SANASA)",
  "South Asian Institute of Technology and Medicine (SAITM)",
  "South Eastern University of Sri Lanka (SEUSL)",
  "Sri Lanka Institute of Development Administration (SLIDA)",
  "Sri Lanka Institute of Information Technology (SLIIT)",
  "Sri Lanka Institute of Nanotechnology (SLINTEC)",
  "Sri Lanka International Buddhist Academy (SIBA)",
  "Sri Lanka Technological Campus (SLTC)",
  "University of Colombo (UOC)",
  "University of Jaffna (UOJ)",
  "University of Kelaniya (UOK)",
  "University of Moratuwa (UOM)",
  "University of Peradeniya (UOP)",
  "University of Ruhuna (UOR)",
  "University of Sri Jayewardenepura (USJ)",
  "University of the Visual and Performing Arts (UVPA)",
  "University of Vavuniya (UOV)",
  "University of Vocational Technology (UNIVOTEC)",
  "Uva Wellassa University (UWU)",
  "Wayamba University of Sri Lanka (WUSL)"
].sort();

const academicLevels = [
  "Foundation",
  "1st Year / Level 4",
  "2nd Year / Level 5",
  "3rd Year / Level 6",
  "4th Year / Level 7",
  "Masters",
  "PhD"
];

// Convert universities array to Semantic UI format
const universityOptions = universities.map(uni => ({
  key: uni.toLowerCase().replace(/\s+/g, '-'),
  text: uni,
  value: uni,
}));

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    academicLevel: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

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

  const passwordStrength = checkPasswordStrength(formData.password);

  const validateEmail = (email) => {
    const universityDomains = ['.edu', '.ac'];
    const isUniversityEmail = universityDomains.some(domain => email.toLowerCase().includes(domain));
    
    if (!isUniversityEmail) {
      return {
        isValid: false,
        message: "StudyHive only allows users to use their university email address (.edu or .ac domain)"
      };
    }
    return { isValid: true, message: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing again
    if (error) setError('');

    // Validate email when it changes
    if (name === 'email') {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        setError(emailValidation.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (authError) throw authError;

      // Create profile
      await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          university: formData.university,
          academic_level: formData.academicLevel,
          bio: ''
        });

      // Store email for verification message
      setVerificationEmail(formData.email);
      
      // Show verification message
      setShowVerification(true);

      // Clear the form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        academicLevel: ''
      });

      // Redirect to login page after 10 seconds
      setTimeout(() => {
        navigate('/login');
      }, 10000);

    } catch (error) {
      console.error('Signup error:', error);
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please login instead.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityChange = (e, { value }) => {
    setFormData(prev => ({
      ...prev,
      university: value
    }));
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-left">
            <img src={logo} alt="StudyHive" className="logo-small" />
            <h1>Create Account</h1>
            <p className="subtitle">
              <span>Collaborate</span>
              <span className="bullet">•</span>
              <span>Learn</span>
              <span className="bullet">•</span>
              <span>Succeed</span>
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            {showVerification ? (
              <div className="verification-message">
                <div className="verification-icon">✉️</div>
                <h3>Check Your University Email!</h3>
                <p>A verification link has been sent to:</p>
                <p className="email-highlight">{verificationEmail}</p>
                <div className="verification-steps">
                  <p>1. Open your university email inbox</p>
                  <p>2. Look for an email with subject: "Please Confirm Your Signup for StudyHive"</p>
                  <p>3. Check your spam folder if you don't see it</p>
                  <p>4. Click the confirmation link in the email</p>
                </div>
                <p className="note">You must verify your email before logging in.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="name-fields">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <input
                  type="email"
                  name="email"
                  placeholder="University Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>

                {formData.password && (
                  <div className="password-strength">
                    <div 
                      className="strength-bar" 
                      style={{ 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength)
                      }}
                    ></div>
                    <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                )}
                
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                
                <Dropdown
                  placeholder="Select University"
                  fluid
                  search
                  selection
                  options={universityOptions}
                  value={formData.university}
                  onChange={handleUniversityChange}
                  className="university-dropdown"
                  required
                />

                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Academic Level</option>
                  {academicLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            )}
            
            <div className="login-link">
              Already have an account? <Link to={routes.public.login}>Log In</Link>
            </div>
          </div>
          
          <div className="signup-right">
            <img src={logo2} alt="StudyHive" className="glowing-logo" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 

