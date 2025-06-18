
import type React from 'react';

interface BallIconProps extends React.SVGProps<SVGSVGElement> {}

const Ball4Icon: React.FC<BallIconProps> = (props) => {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="gradBall4BrownMaroon" cx="35%" cy="35%" r="65%">
          {/* Updated to brownish-maroon colors */}
          <stop offset="0%" style={{ stopColor: '#853B3B' }} /> {/* Lighter brownish-maroon */}
          <stop offset="100%" style={{ stopColor: '#6A2E2E' }} /> {/* Main brownish-maroon */}
        </radialGradient>
        <filter id="dropShadowBall4" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
          <feOffset dx="0.5" dy="0.5" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#gradBall4BrownMaroon)" filter="url(#dropShadowBall4)" />
      <circle cx="20" cy="20" r="8" fill="white" stroke="#BDBDBD" strokeWidth="0.3" />
      <text x="20" y="20" dy=".35em" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1F2937"> {/* Dark Gray for text */}
        4
      </text>
      <path d="M 12 12 A 15 15 0 0 1 28 12 A 12 12 0 0 0 12 12 Z" fill="white" fillOpacity="0.3"/>
    </svg>
  );
};

export default Ball4Icon;
