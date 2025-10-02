"use client";

import { useMemo } from "react";

export const LogoMark = ({ size = 40 }: { size?: number }) => {
  const blueGradId = useMemo(
    () => `blue-grad-${Math.random().toString(36).slice(2, 8)}`,
    []
  );
  const orangeGradId = useMemo(
    () => `orange-grad-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
      role="img"
      aria-label="kotlinify logo"
    >
      <defs>
        <linearGradient id={blueGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B9DD9" stopOpacity="1" />
          <stop offset="100%" stopColor="#3D5A8C" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={orangeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB84D" stopOpacity="1" />
          <stop offset="100%" stopColor="#F47B3C" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect x="10" y="15" width="35" height="90" rx="2" fill={`url(#${blueGradId})`} />
      <path d="M 50 15 L 90 15 L 65 60 L 50 60 Z" fill={`url(#${orangeGradId})`} />
      <path d="M 50 60 L 65 60 L 90 105 L 50 105 Z" fill="#D96531" />
      <path d="M 75 35 L 110 35 L 110 85 Z" fill="#FFB84D" opacity="0.95" />
    </svg>
  );
};
