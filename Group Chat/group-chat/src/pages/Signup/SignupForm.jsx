import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SignupForm.css';
import { db } from '../../firebase/config';

const SignupForm = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        universityEmail: '',
        university: '',
        level: '',
        password: '',
        terms: false
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        universityEmail: '',
        university: '',
        level: '',
        password: ''
    });

    const universities = [
        "University of Colombo",
        "University of Peradeniya",
        "University of Sri Jayewardenepura",
        "University of Kelaniya",
        "University of Moratuwa",
        "University of Jaffna",
        "University of Ruhuna",
        "University of Eastern Sri Lanka",
        "Rajarata University",
        "Sabaragamuwa University",
        "Wayamba University",
        "Uva Wellassa University",
        "University of Visual & Performing Arts",
        "University of Vavuniya",
        "Eastern University",
        "South Eastern University",
        "SLIIT - Sri Lanka Institute of Information Technology",
        "IIT - Informatics Institute of Technology",
        "NSBM Green University",
        "APIIT Sri Lanka",
        "ANC Education",
        "British College of Applied Studies (BCAS)",
        "ICBT Campus",
        "KDU - General Sir John Kotelawala Defence University",
        "Horizon Campus",
        "CINEC Campus",
        "Australian College of Business and Technology (ACBT)",
        "Royal Institute of Colombo",
        "Sri Lanka Technological Campus (SLTC)",
        "Saegis Campus",
        "Colombo International Nautical and Engineering College (CINEC)",
        "Aquinas College of Higher Studies",
        "AIMS College",
        "American National College",
        "Imperial College of Business Studies",
        "Lanka Institute of Fashion Technology (LIFT)"
    ].sort();

    const filteredUniversities = universities.filter(uni =>
        uni.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUniversityDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const levels = [
        "Level 1 / First Year",
        "Level 2 / Second Year",
        "Level 3 / Third Year",
        "Level 4 / Fourth Year"
    ];

    // Enhanced password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = '';
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            noCommonWords: !/(password|123456|qwerty|admin)/i.test(password),
            noRepeatingChars: !/(.)\1{2,}/.test(password), // No character repeated more than twice
        };

        // Calculate score based on criteria
        if (checks.length) score += 1;
        if (checks.uppercase) score += 1;
        if (checks.lowercase) score += 1;
        if (checks.numbers) score += 1;
        if (checks.specialChars) score += 1;
        if (checks.noCommonWords) score += 1;
        if (checks.noRepeatingChars) score += 1;

        // Determine strength message
        if (score <= 2) {
            message = 'Weak';
        } else if (score <= 4) {
            message = 'Medium';
        } else {
            message = 'Strong';
        }

        // Generate requirements message
        const requirements = [];
        if (!checks.length) requirements.push('at least 8 characters');
        if (!checks.uppercase) requirements.push('an uppercase letter');
        if (!checks.lowercase) requirements.push('a lowercase letter');
        if (!checks.numbers) requirements.push('a number');
        if (!checks.specialChars) requirements.push('a special character');
        if (!checks.noRepeatingChars) requirements.push('no repeating characters');

        return {
            score: score,
            message: message,
            requirements: requirements,
            isValid: score >= 4 // Require at least medium strength
        };
    };

    // Email format validator
    const isValidEmail = (email) => {
        const eduDomains = ['.edu', '.edu.lk', '.ac.lk'];
        const hasEduDomain = eduDomains.some(domain => email.toLowerCase().endsWith(domain));
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && hasEduDomain;
    };

    // Form validation
    const validateForm = () => {
        const errors = {
            firstName: '',
            lastName: '',
            username: '',
            universityEmail: '',
            university: '',
            level: '',
            password: ''
        };
        let isValid = true;

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        if (!formData.universityEmail) {
            errors.universityEmail = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(formData.universityEmail)) {
            errors.universityEmail = 'Please use a valid university email address';
            isValid = false;
        }

        if (!formData.university) {
            errors.university = 'Please select your university';
            isValid = false;
        }

        if (!formData.level) {
            errors.level = 'Please select your level/year';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value
        }));

        // Check password strength when password changes
        if (id === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        // Clear validation error when field is being edited
        if (validationErrors[id]) {
            setValidationErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!formData.terms) {
            setError('Please accept the terms and conditions');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await signup(formData.universityEmail, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                university: formData.university,
                level: formData.level,
                role: 'student'
            });
            navigate('/');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="logo-section">
                    <img 
                        src="/studyhive-logo.png" 
                        alt="StudyHive Logo" 
                        className="logo"
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                </div>
                <div className="form-section">
                    <h1>Create an account</h1>
                    <div className="login-link">
                        <Link to="/login">log in instead</Link>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last name</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">User name</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="universityEmail">University Email</label>
                            <input 
                                type="email" 
                                id="universityEmail" 
                                value={formData.universityEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="university">University</label>
                            <div className="custom-select" ref={dropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Search university..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsUniversityDropdownOpen(true)}
                                    className="university-search"
                                />
                                {isUniversityDropdownOpen && (
                                    <div className="university-dropdown">
                                        {filteredUniversities.map(uni => (
                                            <div
                                                key={uni}
                                                className="university-option"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, university: uni }));
                                                    setSearchTerm(uni);
                                                    setIsUniversityDropdownOpen(false);
                                                }}
                                            >
                                                {uni}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="level">Level/ Year</label>
                            <select 
                                id="level" 
                                value={formData.level}
                                onChange={handleChange}
                            >
                                <option value="">Select Level/Year</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={validationErrors.password ? 'error' : ''}
                                />
                                <button 
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="password-strength">
                                    <div className={`password-strength-text ${passwordStrength.message.toLowerCase()}`}>
                                        Password strength: {passwordStrength.message}
                                    </div>
                                    <div className="password-strength-bar">
                                        <div 
                                            className={`strength-${passwordStrength.message.toLowerCase()}`}
                                            style={{ 
                                                width: `${(passwordStrength.score / 7) * 100}%`,
                                                backgroundColor: 
                                                    passwordStrength.message === 'Weak' ? '#ff4444' :
                                                    passwordStrength.message === 'Medium' ? '#ffbb33' : '#00C851'
                                            }}
                                        />
                                    </div>
                                    {passwordStrength.requirements.length > 0 && (
                                        <div className="password-requirements">
                                            Password must include {passwordStrength.requirements.join(', ')}
                                        </div>
                                    )}
                                </div>
                            )}
                            {validationErrors.password && (
                                <div className="error-message">{validationErrors.password}</div>
                            )}
                        </div>

                        <div className="terms-group">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            <label htmlFor="terms">
                                By creating an account, I agree to our 
                                <Link to="/terms">Terms of use</Link> and 
                                <Link to="/privacy">Privacy Policy</Link>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create an account'}
                        </button>
                    </form>
                </div>
            </div>
            <footer className="footer">
                <div>© 2024 StudyHive. All rights reserved.</div>
                <div className="footer-links">
                    <Link to="/about">About</Link>
                    <Link to="/features">Features</Link>
                    <Link to="/feedback">Feedback</Link>
                    <Link to="/donate">Donate</Link>
                    <Link to="/team">Team</Link>
                </div>
            </footer>
        </>
    );
};

export default SignupForm; 