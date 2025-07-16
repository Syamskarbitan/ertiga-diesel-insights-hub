import React from 'react';

interface TurboLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export const TurboLogo: React.FC<TurboLogoProps> = ({ 
  size = 40, 
  className = "",
  animated = false 
}) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? "animate-turbo-spin" : ""}
      >
        {/* Turbocharger housing */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="hsl(var(--card))"
        />
        
        {/* Inner turbo blades */}
        <g className={animated ? "animate-turbo-spin origin-center" : ""}>
          {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
            <path
              key={index}
              d={`M 50 50 L ${50 + 25 * Math.cos((rotation * Math.PI) / 180)} ${50 + 25 * Math.sin((rotation * Math.PI) / 180)}`}
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </g>
        
        {/* Central hub */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="hsl(var(--primary))"
          className="animate-pulse-glow"
        />
        
        {/* Intake and exhaust ports */}
        <rect
          x="5"
          y="45"
          width="15"
          height="10"
          rx="2"
          fill="hsl(var(--muted))"
        />
        <rect
          x="80"
          y="45"
          width="15"
          height="10"
          rx="2"
          fill="hsl(var(--muted))"
        />
      </svg>
    </div>
  );
};