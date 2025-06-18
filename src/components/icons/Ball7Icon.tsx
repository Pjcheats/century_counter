
import type React from 'react';

interface BallIconProps extends React.SVGProps<SVGSVGElement> {}

const Ball7Icon: React.FC<BallIconProps> = (props) => {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="gradBall7Black" cx="35%" cy="35%" r="65%">
          <stop offset="0%" style={{ stopColor: '#374151' }} /> {/* Lighter Black/Gray (gray-700) */}
          <stop offset="100%" style={{ stopColor: '#111827' }} /> {/* Main Black/Dark Gray (gray-900) */}
        </radialGradient>
        <filter id="dropShadowBall7" x="-20%" y="-20%" width="140%" height="140%">
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
      <circle cx="20" cy="20" r="18" fill="url(#gradBall7Black)" filter="url(#dropShadowBall7)" />
      <circle cx="20" cy="20" r="8" fill="white" stroke="#BDBDBD" strokeWidth="0.3" />
      <text x="20" y="20" dy=".35em" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1F2937"> {/* Dark Gray for text */}
        7
      </text>
      <path d="M 12 12 A 15 15 0 0 1 28 12 A 12 12 0 0 0 12 12 Z" fill="white" fillOpacity="0.2"/> {/* Slightly less opaque shine for black ball */}
    </svg>
  );
};

export default Ball7Icon;
