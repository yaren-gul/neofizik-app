import React from 'react';
import { colors, font } from '../theme';

export default function ProgressRing({ percent = 0, size = 120, label, sublabel }) {
  const inner = size - 26;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        style={{
          width: size, height: size, borderRadius: '50%',
          background: `conic-gradient(${colors.coral} ${percent * 3.6}deg, ${colors.tealSoft} 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: inner, height: inner, borderRadius: '50%', backgroundColor: colors.cream,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: font.heading, fontSize: size * 0.19, fontWeight: 700, color: colors.tealDark, lineHeight: 1 }}>
            %{percent}
          </span>
          {label && (
            <span style={{ fontFamily: font.body, fontSize: '10px', color: colors.textMuted, fontWeight: 600, marginTop: '4px', textAlign: 'center' }}>
              {label}
            </span>
          )}
          {sublabel && (
            <span style={{ fontFamily: font.body, fontSize: '9.5px', color: colors.textMuted, textAlign: 'center' }}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      <span style={{ position: 'absolute', top: '2px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.coral }} />
    </div>
  );
}
