import React from 'react';
import { colors, font } from '../theme';

export default function Logo({ size = 24, withDot = true }) {
  return (
    <span
      style={{
        fontFamily: font.heading,
        fontSize: `${size}px`,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
    >
      <span style={{ color: colors.teal }}>Neo</span>
      <span style={{ color: colors.tealDark, fontWeight: 800, position: 'relative' }}>
        Fizik
        {withDot && (
          <span
            style={{
              position: 'absolute',
              top: `${size * 0.02}px`,
              right: `${size * 0.34}px`,
              width: `${Math.max(4, size * 0.12)}px`,
              height: `${Math.max(4, size * 0.12)}px`,
              borderRadius: '50%',
              backgroundColor: colors.coral,
            }}
          />
        )}
      </span>
    </span>
  );
}
