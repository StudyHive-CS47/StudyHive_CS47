import React from 'react';

function LengthSlider({ value, onChange }) {
  return (
    <div className="length-slider">
      <label>Summary Length: {value}%</label>
      <form className="slider-form" style={{ '--min': 0, '--max': 100, '--val': value }}>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Summary length"
        />
      </form>
    </div>
  );
}

export default LengthSlider; 