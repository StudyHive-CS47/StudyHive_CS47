const AnimatedStartButton = () => {
  return (
    <button className="relative flex items-center gap-1 px-9 py-4 text-[#3f87a6] 
                     font-semibold text-base bg-transparent border-4 border-transparent 
                     rounded-[100px] overflow-hidden transition-all duration-600
                     hover:rounded-xl hover:text-white
                     shadow-[0_0_0_2px_#3f87a6] hover:shadow-[0_0_0_12px_transparent]
                     active:scale-95 active:shadow-[0_0_0_4px_#3f87a6]
                     group">
      <svg viewBox="0 0 24 24" 
           className="absolute w-6 fill-[#3f87a6] z-[9] transition-all duration-800
                    left-[-25%] group-hover:left-4 group-hover:fill-white">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      
      <span className="relative z-[1] transform -translate-x-3 transition-transform duration-800
                     group-hover:translate-x-3">
        Get Started Free
      </span>
      
      <span className="absolute top-1/2 left-1/2 w-5 h-5 bg-[#3f87a6] rounded-full
                     -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-800
                     group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"></span>
      
      <svg viewBox="0 0 24 24" 
           className="absolute w-6 fill-[#3f87a6] z-[9] transition-all duration-800
                    right-4 group-hover:right-[-25%] group-hover:fill-white">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
  );
}

export default AnimatedStartButton; 