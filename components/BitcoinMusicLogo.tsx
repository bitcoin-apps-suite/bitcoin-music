import React from 'react'

interface BitcoinMusicLogoProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

const BitcoinMusicLogo: React.FC<BitcoinMusicLogoProps> = ({ 
  size = 40, 
  className = '',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Background Circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#bgGradient)"
        opacity="0.1"
      />
      
      {/* Main Circle with Purple Gradient */}
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="url(#purpleGradient)"
        stroke="url(#borderGradient)"
        strokeWidth="3"
      />
      
      {/* Left Half - Music Symbol (Speaker/Sound Waves) */}
      <g clipPath="url(#leftClip)">
        {/* Speaker Icon */}
        <path
          d="M 40 90 L 55 90 L 75 70 L 75 130 L 55 110 L 40 110 Z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Sound Waves */}
        <path
          d="M 85 85 Q 95 100 85 115"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 92 75 Q 107 100 92 125"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </g>
      
      {/* Center Divider */}
      <rect
        x="98"
        y="40"
        width="4"
        height="120"
        fill="white"
        opacity="0.8"
      />
      
      {/* Right Half - Bitcoin Symbol */}
      <g clipPath="url(#rightClip)">
        <text
          x="130"
          y="120"
          fontSize="60"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
        >
          ₿
        </text>
      </g>
      
      {/* Glossy Effect */}
      <ellipse
        cx="100"
        cy="60"
        rx="70"
        ry="35"
        fill="url(#glossGradient)"
        opacity="0.3"
      />
      
      {/* Definitions */}
      <defs>
        {/* Background Gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        
        {/* Main Purple Gradient */}
        <radialGradient id="purpleGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        
        {/* Border Gradient */}
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        
        {/* Gloss Gradient */}
        <linearGradient id="glossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        
        {/* Clipping Paths */}
        <clipPath id="leftClip">
          <rect x="0" y="0" width="100" height="200" />
        </clipPath>
        <clipPath id="rightClip">
          <rect x="100" y="0" width="100" height="200" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default BitcoinMusicLogo