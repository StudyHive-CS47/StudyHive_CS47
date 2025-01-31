import React from 'react';
import './StudyResources.css';

function StudyResources({ group, onResourceClick }) {
  if (!group) return null;

  return (
    <div className="study-resources">
      <h3>Study Resources</h3>
      
      <div className="section">
        <h4>Course Materials</h4>
        <div className="resource-list">
          {group.resources?.map(resource => (
            <div 
              key={resource.id} 
              className="resource-item"
              onClick={() => onResourceClick(resource)}
            >
              <i className={`fas fa-file-${resource.type}`}></i>
              <span>{resource.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h4>Upcoming Deadlines</h4>
        <div className="deadline-list">
          {group.deadlines?.map(deadline => (
            <div key={deadline.id} className="deadline-item">
              <div className="deadline-info">
                <span className="deadline-title">{deadline.title}</span>
                <span className="deadline-date">
                  {new Date(deadline.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h4>Quick Links</h4>
        <div className="quick-links">
          <button className="quick-link">Course Syllabus</button>
          <button className="quick-link">Past Papers</button>
          <button className="quick-link">Study Guide</button>
        </div>
      </div>
    </div>
  );
}

export default StudyResources; 