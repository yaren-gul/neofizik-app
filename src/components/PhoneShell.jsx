import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, radius, shadow, font } from '../theme';

const HIDDEN_PATHS = ['/', '/login', '/register'];

export function PhoneShell({ children, scroll = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const showClose = !HIDDEN_PATHS.includes(location.pathname);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `radial-gradient(circle at 20% 20%, #12878d 0%, #0a4448 55%, #082f33 100%)`,
        fontFamily: font.body,
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '375px',
          maxWidth: '100%',
          height: '780px',
          maxHeight: '92vh',
          backgroundColor: colors.cream,
          borderRadius: radius.phone,
          boxShadow: shadow.phone,
          position: 'relative',
          overflow: 'hidden',
          border: '10px solid #16211f',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '130px',
            height: '26px',
            backgroundColor: '#16211f',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px',
            zIndex: 20,
          }}
        />

        {showClose && (
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Çıkış"
            title="Çıkış"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(14,69,80,0.35)',
              color: '#fff',
              fontSize: '14px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 25,
            }}
          >
            ⏻
          </button>
        )}

        {confirmOpen && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(8,30,33,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              padding: '26px',
            }}
          >
            <div
              style={{
                backgroundColor: colors.cream,
                borderRadius: radius.lg,
                padding: '24px 20px',
                width: '100%',
                boxShadow: shadow.phone,
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: font.body, fontSize: '14.5px', color: colors.text, margin: '0 0 18px 0' }}>
                Çıkmak istediğinize emin misiniz?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setConfirmOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: radius.pill,
                    border: `1.5px solid ${colors.teal}`,
                    backgroundColor: 'transparent',
                    color: colors.teal,
                    fontFamily: font.heading,
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Hayır
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    navigate('/');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: radius.pill,
                    border: 'none',
                    backgroundColor: colors.coral,
                    color: '#fff',
                    fontFamily: font.heading,
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Evet
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflowY: scroll ? 'auto' : 'hidden',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '38px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function Screen({ children, align = 'stretch', pad = '26px' }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        padding: pad,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
