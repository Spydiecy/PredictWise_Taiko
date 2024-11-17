const InfoBox = ({ title, value, icon }) => (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-[#ff3366]/50 to-[#ff6699]/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm" />
      
      {/* Main container */}
      <div className="relative flex items-center gap-4 p-4 bg-[#1a1b1f]/95 rounded-xl border border-[#2a2b2f] hover:border-[#2a2b2f]/0 transition duration-300">
        {/* Optional icon */}
        {icon && (
          <div className="text-gray-400 group-hover:text-[#ff3366] transition-colors duration-300">
            {icon}
          </div>
        )}
        
        <div className="flex flex-col">
          {/* Title */}
          <h4 className="text-gray-400 text-sm font-medium mb-1">
            {title}
          </h4>
          
          {/* Value */}
          <p className="text-white text-lg font-bold tracking-wide">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
  
  export default InfoBox;