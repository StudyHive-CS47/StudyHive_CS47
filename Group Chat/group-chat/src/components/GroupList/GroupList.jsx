import React from 'react';
import './GroupList.css';

function GroupList({ 
  groups, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  searchTerm,
  onSearchChange,
  onGroupSelect,
  currentGroupId
}) {
  return (
    <div className="group-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search study groups or topics"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="group-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="groups-list">
        {groups.map(group => (
          <div
            key={group.id}
            className={`group-item ${currentGroupId === group.id ? 'active' : ''}`}
            onClick={() => onGroupSelect(group.id)}
          >
            <div className="group-info">
              <h3>{group.name}</h3>
              <span className="course">{group.course}</span>
              <div className="group-meta">
                <span>{group.schedule}</span>
                <span>{group.members} members</span>
              </div>
              {group.lastMessage && (
                <p className="last-message">
                  <span className="sender">{group.lastMessage.sender}:</span> {group.lastMessage.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupList; 