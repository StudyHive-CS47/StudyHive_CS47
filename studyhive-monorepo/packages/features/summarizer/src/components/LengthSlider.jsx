import React from 'react';
import './LengthSlider.css';

function LengthSlider({ value, onChange }) {
  return (
    <div className="length-slider">
      <label className="slider-label">
        {value === 100 ? 'Mode: Paraphrase' : `Summary Length: ${value}%`}
      </label>
      <div className="slider-container">
        <input
          type="range"
          min="25"
          max="100"
          step="25"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
        />
        <div className="slider-marks">
          <div className="mark" style={{ left: '0%' }}>
            <span className="mark-label">25%</span>
          </div>
          <div className="mark" style={{ left: '33.33%' }}>
            <span className="mark-label">50%</span>
          </div>
          <div className="mark" style={{ left: '66.66%' }}>
            <span className="mark-label">75%</span>
          </div>
          <div className="mark" style={{ left: '100%' }}>
            <span className="mark-label">Paraphrase</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LengthSlider; 