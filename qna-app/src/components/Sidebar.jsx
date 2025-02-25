import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ popularQuestions }) => {
  return (
    <div className="sidebar">
      <h3>Popular Questions</h3>
      <ul>
        {popularQuestions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
