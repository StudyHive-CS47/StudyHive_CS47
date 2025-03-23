import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { routes } from '@shared/routes';

const CreativeCard = ({ title, description, image, buttonText, route, className = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent double navigation from card and button clicks
    
    if (!user) {
      // Redirect to login page if not authenticated
      navigate(routes.public.login, { 
        state: { 
          redirectTo: route,
          message: `Please log in to access ${title}`
        } 
      });
      return;
    }

    if (route) {
      navigate(route);
    }
  };

  return (
    <div className={`group relative ${className}`}>
      <div className="card relative w-[350px] h-[320px] rounded-[20px] bg-white p-6
                    border-2 border-[#1A237E]/10 transition-all duration-500 overflow-visible
                    hover:border-[#1A237E] hover:shadow-lg hover:shadow-[#1A237E]/20
                    mx-auto cursor-pointer"
           onClick={handleClick}>
        {/* Card Content */}
        <div className="card-details h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 mb-2">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h3 className="text-title text-xl font-bold text-[#1A237E]">
            {title}
          </h3>
          
          <p className="text-body text-[#1A237E]/70 text-sm leading-relaxed max-w-[280px]">
            {description}
          </p>
        </div>

        {/* Hover Button */}
        <button 
          onClick={handleClick}
          className="card-button absolute left-1/2 bottom-0 w-[60%] 
                        translate-x-[-50%] translate-y-[125%]
                        bg-[#1A237E] text-white rounded-xl py-2.5 px-5
                        opacity-0 transition-all duration-300 text-sm font-medium
                        hover:bg-[#4051B5] group-hover:translate-y-[50%] 
                        group-hover:opacity-100 shadow-lg">
          {!user ? 'Login to Access' : buttonText}
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
  route: PropTypes.string,
  className: PropTypes.string,
};

export default CreativeCard; 