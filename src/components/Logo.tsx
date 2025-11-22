import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blue curved shape */}
      <path
        d="M20 15C20 15 25 20 35 25C45 30 50 35 50 45C50 55 45 60 35 65C25 70 20 75 20 75"
        stroke="url(#blueGradient)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cyan curved shape */}
      <path
        d="M60 15C60 15 55 20 45 25C35 30 30 35 30 45C30 55 35 60 45 65C55 70 60 75 60 75"
        stroke="url(#cyanGradient)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      <defs>
        <linearGradient
          id="blueGradient"
          x1="20"
          y1="15"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient
          id="cyanGradient"
          x1="60"
          y1="15"
          x2="30"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
    </svg>
  );
};
