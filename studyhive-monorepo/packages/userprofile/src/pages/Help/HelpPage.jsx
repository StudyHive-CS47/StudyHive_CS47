import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './HelpPage.css'; // Ensure this file exists and is correctly linked
// Import icons individually from react-icons/fa
import { FaEnvelope } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaUniversity } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';

const HelpPage = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    level: '',
    subject: '',
    message: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Message sent successfully!');
        // Clear form after successful submission
        setFormData({
          fullName: '',
          university: '',
          level: '',
          subject: '',
          message: '',
          phone: '',
          email: '',
        });
      }, (err) => {
        console.error('FAILED...', err);
        alert('Failed to send message. Please try again later.');
      });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 px-4 sm:px-6 lg:px-8 bg-[#EEF2FF]">
      <div className="help-container">
        <h1>Need Help?</h1>
        <p className="intro-text">
          Our customer support agents are here for you. We're committed to providing you with the best possible assistance.
        </p>

        <div className="contact-info">
          <p>
            <FaEnvelope className="text-[#4051B5]" />
            Email us at: <strong>studyhive47@gmail.com</strong>
          </p>
          <p>
            <FaPhone className="text-[#4051B5]" />
            Call us: <strong>+94 72 132 7316</strong>
          </p>
          <p>
            <FaWhatsapp className="text-[#4051B5]" />
            WhatsApp: <a href="https://wa.link/jaam45" target="_blank" rel="noopener noreferrer">Chat with us</a>
          </p>
        </div>

        <div className="social-links">
          <a href="https://www.linkedin.com/company/studyhive/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="https://www.instagram.com/studyhive_edu/" target="_blank" rel="noopener noreferrer">
            <FaInstagram /> Instagram
          </a>
          <a href="https://github.com/StudyHive-CS47" target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
        </div>

        <form ref={form} onSubmit={handleSubmit} className="help-form">
          <div className="input-group">
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              required 
              onChange={handleChange}
              value={formData.fullName}
            />
            <FaUser className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="university" 
              placeholder="University" 
              required 
              onChange={handleChange}
              value={formData.university}
            />
            <FaUniversity className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="level" 
              placeholder="Academic Level" 
              required 
              onChange={handleChange}
              value={formData.level}
            />
            <FaGraduationCap className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="subject" 
              placeholder="Subject" 
              required 
              onChange={handleChange}
              value={formData.subject}
            />
            <FaBookOpen className="input-icon" />
          </div>

          <div className="input-group full-width">
            <textarea 
              name="message" 
              placeholder="Your Message" 
              required 
              onChange={handleChange}
              value={formData.message}
            ></textarea>
            <FaComments className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="phone" 
              placeholder="Phone Number" 
              required 
              onChange={handleChange}
              value={formData.phone}
            />
            <FaPhone className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
              onChange={handleChange}
              value={formData.email}
            />
            <FaEnvelope className="input-icon" />
          </div>

          <button type="submit">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpPage; 