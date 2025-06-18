
import type React from 'react';

interface BallIconProps extends React.SVGProps<SVGSVGElement> {}

const Ball5Icon: React.FC<BallIconProps> = (props) => {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="gradBall5Blue" cx="35%" cy="35%" r="65%">
          {/* Updated to slightly darker blue */}
          <stop offset="0%" style={{ stopColor: '#0EA5E9' }} /> {/* Was sky-400 (#38BDF8), now sky-500 for highlight */}
          <stop offset="100%" style={{ stopColor: '#0284C7' }} /> {/* Was sky-500 (#0EA5E9), now sky-600 for main body */}
        </radialGradient>
        <filter id="dropShadowBall5" x="-20%" y="-20%" width="140%" height="140%">
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
      <circle cx="20" cy="20" r="18" fill="url(#gradBall5Blue)" filter="url(#dropShadowBall5)" />
      <circle cx="20" cy="20" r="8" fill="white" stroke="#BDBDBD" strokeWidth="0.3" />
      <text x="20" y="20" dy=".35em" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1F2937"> {/* Dark Gray for text */}
        5
      </text>
      <path d="M 12 12 A 15 15 0 0 1 28 12 A 12 12 0 0 0 12 12 Z" fill="white" fillOpacity="0.3"/>
    </svg>
  );
};

export default Ball5Icon;
