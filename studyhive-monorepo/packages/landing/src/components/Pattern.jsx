import PropTypes from 'prop-types';

const Pattern = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0"
        style={{
          background: `
            /* Horizontal lines */
            linear-gradient(
              transparent 0,
              transparent calc(25px - 1px),
              rgba(63, 135, 166, 0.15) calc(25px - 1px),
              rgba(63, 135, 166, 0.15) 25px,
              transparent 25px
            ),
            /* Vertical red line */
            linear-gradient(
              90deg,
              transparent 40px,
              rgba(199, 48, 48, 0.25) 40px,
              rgba(199, 48, 48, 0.25) 41px,
              transparent 41px
            ),
            /* Subtle grid for texture */
            linear-gradient(
              rgba(63, 135, 166, 0.05) 1px,
              transparent 1px
            ),
            /* Background color */
            linear-gradient(
              #ebf8e1 0%,
              #ebf8e1 100%
            )
          `,
          backgroundSize: `
            100% 25px,  /* Horizontal lines */
            100% 100%,  /* Vertical line */
            25px 25px,  /* Grid */
            100% 100%   /* Background */
          `,
          backgroundPosition: `
            0 0,
            0 0,
            40px 0,
            0 0
          `,
          backgroundRepeat: `
            repeat,
            no-repeat,
            repeat,
            no-repeat
          `
        }}
      />
    </div>
  );
};

Pattern.propTypes = {
  className: PropTypes.string
};

export default Pattern; 