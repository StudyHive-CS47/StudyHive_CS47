import PropTypes from 'prop-types';

const CreativeCard = ({ title, description, image, buttonText, className = '' }) => {
  return (
    <div className={`group relative ${className}`}>
      <div className="card relative w-[350px] h-[320px] rounded-[20px] bg-white p-6
                    border-2 border-[#e0e0e0] transition-all duration-500 overflow-visible
                    hover:border-[#3f87a6] hover:shadow-lg hover:shadow-[#3f87a6]/20
                    mx-auto">
        {/* Card Content */}
        <div className="card-details h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 mb-2">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h3 className="text-title text-xl font-bold text-gray-800">
            {title}
          </h3>
          
          <p className="text-body text-gray-600 text-sm leading-relaxed max-w-[280px]">
            {description}
          </p>
        </div>

        {/* Hover Button */}
        <button className="card-button absolute left-1/2 bottom-0 w-[60%] 
                        translate-x-[-50%] translate-y-[125%]
                        bg-[#3f87a6] text-white rounded-xl py-2.5 px-5
                        opacity-0 transition-all duration-300 text-sm font-medium
                        hover:bg-[#2d6a84] group-hover:translate-y-[50%] 
                        group-hover:opacity-100 shadow-lg">
          {buttonText}
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform inline-block">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

CreativeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CreativeCard; 