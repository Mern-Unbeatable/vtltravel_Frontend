import React from 'react';

const Spinner = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    : "flex items-center justify-center min-h-[400px] w-full";

  return (
    <div className={containerClass}>
      <div className="relative w-10 h-10">
        {/* Outer track */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
        {/* Animated spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-l-primary animate-spin"></div>
      </div>
    </div>
  );
};

export default Spinner;

