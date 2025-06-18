
import type React from 'react';

interface Ball11IconProps extends React.SVGProps<SVGSVGElement> {
  // You can add any specific props if needed
}

const Ball11Icon: React.FC<Ball11IconProps> = (props) => {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="gradWhiteBall11" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#E0E0E0', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="dropShadowBall11" x="-20%" y="-20%" width="140%" height="140%">
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
        <clipPath id="ballClipPath11">
          <circle cx="20" cy="20" r="18" />
        </clipPath>
      </defs>
      {/* Main ball body */}
      <circle cx="20" cy="20" r="18" fill="url(#gradWhiteBall11)" filter="url(#dropShadowBall11)" />
      
      {/* Wider red stripe, clipped to ball */}
      <rect 
        x="2" 
        y="12"  /* (40 - 16) / 2 */
        width="36" 
        height="16" /* Increased from 14 */
        fill="#EF4444" /* Tailwind red-500 */
        clipPath="url(#ballClipPath11)" 
      />
      
      {/* White circle background for the number */}
      <circle cx="20" cy="20" r="7" fill="white" stroke="#BDBDBD" strokeWidth="0.3" />
      
      {/* Number 11 */}
      <text x="20" y="20" dy=".35em" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F2937"> {/* Dark Gray for text */}
        11
      </text>
      
      {/* Red outline for the entire ball */}
      <circle cx="20" cy="20" r="18" fill="transparent" stroke="#EF4444" strokeWidth="1"/>
    </svg>
  );
};

export default Ball11Icon;
