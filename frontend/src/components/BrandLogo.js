import React from 'react';

const BrandLogo = ({ size = 32, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(255,75,75,0.4)]"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="100%" stopColor="#8B1E3F" />
          </linearGradient>
        </defs>
        {/* Modern Geometric Book/Shelf Concept */}
        <rect x="20" y="20" width="15" height="60" rx="4" fill="url(#logoGradient)" opacity="0.6" />
        <rect x="42.5" y="10" width="15" height="80" rx="4" fill="url(#logoGradient)" />
        <rect x="65" y="30" width="15" height="40" rx="4" fill="url(#logoGradient)" opacity="0.8" />
        
        {/* Accent dots */}
        <circle cx="50" cy="50" r="5" fill="white" opacity="0.2" />
      </svg>
    </div>
  );
};

export default BrandLogo;
