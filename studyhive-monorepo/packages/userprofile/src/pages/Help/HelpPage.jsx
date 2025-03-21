import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './HelpPage.css'; // Ensure this file exists and is correctly linked

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

    emailjs.sendForm('service_pf9sfno', 'template_w1hb9bi', form.current, 'JNclWd0Not-_7lGaz')
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
        <p className="intro-text">Our customer support agents are here for you. If you ever forget your password, email us at <strong>studyhive47@gmail.com</strong>, and our 24/7 support assistant will get to you shortly.</p>
        <p>You can also reach us via phone: <strong>+94 72 132 7316</strong></p>
        <p>For immediate assistance, feel free to contact us on WhatsApp: <a href="https://wa.link/jaam45" target="_blank" rel="noopener noreferrer">Chat with us</a></p>
        <p>Follow us on social media:</p>
        <ul>
          <li><a href="https://www.linkedin.com/company/studyhive/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://www.instagram.com/studyhive_edu/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://github.com/StudyHive-CS47" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
        <form ref={form} onSubmit={handleSubmit} className="help-form">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            required 
            onChange={handleChange}
            value={formData.fullName}
          />
          <input 
            type="text" 
            name="university" 
            placeholder="University" 
            required 
            onChange={handleChange}
            value={formData.university}
          />
          <input 
            type="text" 
            name="level" 
            placeholder="Academic Level" 
            required 
            onChange={handleChange}
            value={formData.level}
          />
          <input 
            type="text" 
            name="subject" 
            placeholder="Subject" 
            required 
            onChange={handleChange}
            value={formData.subject}
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            required 
            onChange={handleChange}
            value={formData.message}
          ></textarea>
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone Number" 
            required 
            onChange={handleChange}
            value={formData.phone}
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            required 
            onChange={handleChange}
            value={formData.email}
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default HelpPage; 