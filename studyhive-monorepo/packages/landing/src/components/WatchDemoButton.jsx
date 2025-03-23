import { useNavigate } from 'react-router-dom';
import { routes } from '@shared/routes';

const WatchDemoButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routes.public.login);
  };

  return (
    <button 
      onClick={handleClick}
      className="relative px-6 py-3 font-bold text-[#3f87a6] text-base
                     transition-all duration-500 bg-transparent border-none
                     hover:text-white group">
      Already a member?
      <div className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#3f87a6] 
                    transition-all duration-500 group-hover:w-full"></div>
      <div className="absolute left-0 bottom-0 w-full h-0 bg-[#3f87a6] -z-10
                    transition-all duration-400 group-hover:h-full"></div>
    </button>
  );
}

export default WatchDemoButton; 