import React from 'react';
import { colors } from '../theme';

export default function BabyOrbit({ size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" stroke={colors.tealBorder} strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="100" cy="100" r="74" stroke={colors.tealBorder} strokeWidth="1.2" />
      {/* Baby head */}
      <g stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M65 95c-2-28 15-48 35-48s37 20 35 48c8 2 12 10 8 18-4 7-12 8-17 5-4 14-15 26-26 26s-22-12-26-26c-5 3-13 2-17-5-4-8 0-16 8-18z" />
        <path d="M78 108c2 3 5 4 7 2" />
        <path d="M115 108c-2 3-5 4-7 2" />
        <path d="M92 118c2 2 6 2 8 0" />
        <path d="M70 92c3-3 8-4 11-1" />
        <path d="M119 92c-3-3-8-4-11-1" />
      </g>
      {/* Orbit accent dot */}
      <circle cx="150" cy="55" r="9" fill={colors.coralSoft} />
      <circle cx="150" cy="55" r="4.5" fill={colors.coral} />
      <circle cx="40" cy="150" r="3" fill={colors.teal} opacity="0.5" />
      <circle cx="165" cy="140" r="3" fill={colors.teal} opacity="0.5" />
      <circle cx="35" cy="70" r="2.5" fill={colors.teal} opacity="0.4" />
    </svg>
  );
}
