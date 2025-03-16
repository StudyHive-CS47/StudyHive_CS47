import PropTypes from 'prop-types';

const AnimatedCard = ({ title, description, image, buttonText, className = '' }) => {
  return (
    <div className={`group relative w-full max-w-md mx-auto ${className}`}>
      <div className="anim-container relative w-full aspect-[4/3] bg-transparent rounded-xl overflow-hidden
                    shadow-[0px_0px_5px_rgba(0,0,0,0.438)] hover:shadow-[0px_0px_15px_rgba(0,77,32,0.432)]
                    transition-shadow duration-300">
        {/* Animated background blobs */}
        <div className="absolute top-[-20px] left-[-20px] w-[100px] h-[100px] 
                      bg-[rgba(0,174,169,0.4)] rounded-full
                      group-hover:left-[190px] group-hover:scale-120
                      transition-all duration-500 ease-linear
                      animate-[spin_5s_linear_infinite]" />
        <div className="absolute top-[70%] left-[70%] w-[100px] h-[100px] 
                      bg-[rgba(0,174,169,0.3)] rounded-full
                      group-hover:left-[-10px] group-hover:scale-120
                      transition-all duration-500 ease-linear
                      animate-[spin_5s_linear_infinite_3s]" />

        {/* Card content */}
        <div className="anim-card relative h-full w-full z-10 p-6
                      bg-[rgba(255,255,255,0.074)] backdrop-blur-xl
                      border border-[rgba(255,255,255,0.222)]
                      rounded-xl transition-all duration-300
                      group-hover:bg-[rgba(255,255,255,0.15)]">
          <div className="flex flex-col h-full">
            {image && (
              <div className="flex-shrink-0 mb-4">
                <img src={image} alt={title} className="w-full h-32 object-contain" />
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-2xl font-serif font-bold mb-2 text-gray-800">{title}</h3>
              <p className="text-gray-600 font-serif mb-4">{description}</p>
            </div>
            <button className="group/btn bg-[rgba(0,174,169,0.9)] text-white px-6 py-2 rounded-lg
                           transition-all duration-300 transform
                           hover:bg-[rgba(0,174,169,1)] hover:scale-105
                           font-serif text-sm uppercase tracking-wider">
              {buttonText}
              <span className="inline-block ml-2 transform group-hover/btn:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AnimatedCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default AnimatedCard; 