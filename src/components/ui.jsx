import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, radius, shadow, font } from '../theme';
import Logo from './Logo';

/* ---------- Butonlar ---------- */

export function PrimaryButton({ children, disabled, style, icon = true, ...props }) {
  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.coralPale : colors.coral,
        color: '#fff',
        border: 'none',
        padding: '16px 20px',
        borderRadius: radius.pill,
        fontFamily: font.heading,
        fontWeight: 600,
        fontSize: '15px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: disabled ? 'none' : shadow.button,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onMouseOver={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      {...props}
    >
      {children}
      {icon && <span aria-hidden="true">→</span>}
    </button>
  );
}

export function SecondaryButton({ children, style, ...props }) {
  return (
    <button
      style={{
        backgroundColor: 'transparent',
        color: colors.teal,
        border: `1.5px solid ${colors.teal}`,
        padding: '15px 20px',
        borderRadius: radius.pill,
        fontFamily: font.heading,
        fontWeight: 600,
        fontSize: '15px',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextLink({ children, style, ...props }) {
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: colors.textMuted,
        fontFamily: font.body,
        fontSize: '13.5px',
        cursor: 'pointer',
        marginTop: '10px',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------- Inputlar ---------- */

export function FieldInput({ label, icon, ...props }) {
  return (
    <div style={{ width: '100%', textAlign: 'left', marginBottom: '14px' }}>
      {label && (
        <label style={{ fontSize: '12.5px', fontWeight: 600, color: colors.tealDark, marginLeft: '6px' }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: colors.card,
          border: `1.5px solid ${colors.tealBorder}`,
          borderRadius: radius.pill,
          padding: '13px 18px',
          marginTop: label ? '6px' : 0,
          boxSizing: 'border-box',
        }}
      >
        {icon && <span style={{ color: colors.teal, fontSize: '15px', opacity: 0.8 }}>{icon}</span>}
        <input
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '14px',
            fontFamily: font.body,
            color: colors.text,
            backgroundColor: 'transparent',
            minWidth: 0,
          }}
          {...props}
        />
      </div>
    </div>
  );
}

/* ---------- Kartlar / Rozetler ---------- */

export function Card({ children, style }) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: colors.card,
        border: `1px solid ${colors.tealBorder}`,
        borderRadius: radius.md,
        padding: '18px',
        boxSizing: 'border-box',
        marginBottom: '14px',
        textAlign: 'left',
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'teal' }) {
  const map = {
    teal: { bg: colors.tealSoft, color: colors.teal },
    coral: { bg: colors.coralSoft, color: colors.coralDark },
  };
  const c = map[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: c.bg,
        color: c.color,
        fontWeight: 700,
        fontSize: '12.5px',
        padding: '5px 14px',
        borderRadius: radius.pill,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- İlerleme göstergeleri ---------- */

export function ProgressBar({ value, total }) {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      <div style={{ height: '8px', backgroundColor: colors.tealSoft, borderRadius: radius.pill, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: colors.coral,
            borderRadius: radius.pill,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

// Onboarding tarzı üstte noktalı adım göstergesi (1/4, 2/4 ...)
export function StepDots({ step, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '26px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={idx}>
            <div
              style={{
                width: active ? '16px' : '12px',
                height: active ? '16px' : '12px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: done ? colors.teal : active ? colors.coral : '#fff',
                border: active ? `3px solid ${colors.coralSoft}` : done ? 'none' : `2px solid ${colors.border}`,
                boxSizing: 'content-box',
              }}
            />
            {idx < total && (
              <div style={{ flex: 1, height: '2px', backgroundColor: done ? colors.teal : colors.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---------- Üst başlık (geri ok + logo + opsiyonel rozet) ---------- */

export function TopBar({ back, badge, onLogout }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '18px' }}>
      <button
        onClick={() => (back === false ? null : back ? back() : navigate(-1))}
        style={{
          visibility: back === false ? 'hidden' : 'visible',
          background: 'none', border: 'none', cursor: 'pointer',
          color: colors.teal, fontSize: '20px', padding: '4px', lineHeight: 1,
        }}
        aria-label="Geri"
      >
        ‹
      </button>
      <Logo size={19} />
      {badge ? (
        <Badge>{badge}</Badge>
      ) : onLogout ? (
        <button
          onClick={onLogout}
          title="Çıkış Yap"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: colors.textMuted }}
        >
          ⏻
        </button>
      ) : (
        <span style={{ width: '20px' }} />
      )}
    </div>
  );
}

/* ---------- Seçenek butonu (test soruları) ---------- */

export function OptionButton({ children, selected, correct, incorrect, ...props }) {
  let bg = colors.card, border = colors.border, color = colors.text;
  if (selected) { bg = colors.tealSoft; border = colors.teal; color = colors.tealDark; }
  if (correct) { bg = '#E9F7F1'; border = colors.success; color = colors.success; }
  if (incorrect) { bg = '#FCEAE7'; border = colors.error; color = colors.error; }
  return (
    <button
      style={{
        padding: '14px 16px',
        backgroundColor: bg,
        border: `1.5px solid ${border}`,
        borderRadius: radius.sm,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '13.5px',
        textAlign: 'left',
        width: '100%',
        boxSizing: 'border-box',
        color,
        fontFamily: font.body,
        transition: 'all 0.15s ease',
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------- Form seçenekleri (radio / checkbox satırı) ---------- */

export function RadioOption({ label, selected, ...props }) {
  return (
    <button
      type="button"
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        backgroundColor: selected ? colors.tealSoft : colors.card,
        border: `1.5px solid ${selected ? colors.teal : colors.tealBorder}`,
        borderRadius: radius.sm, padding: '14px 16px', marginBottom: '10px',
        cursor: 'pointer', boxSizing: 'border-box', textAlign: 'left',
      }}
      {...props}
    >
      <span
        style={{
          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? colors.teal : colors.textFaint}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {selected && <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: colors.teal }} />}
      </span>
      <span style={{ fontFamily: font.body, fontSize: '13.5px', color: selected ? colors.tealDark : colors.text, fontWeight: selected ? 600 : 500 }}>
        {label}
      </span>
    </button>
  );
}

export function CheckboxOption({ label, checked, ...props }) {
  return (
    <button
      type="button"
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        backgroundColor: checked ? colors.tealSoft : colors.card,
        border: `1.5px solid ${checked ? colors.teal : colors.tealBorder}`,
        borderRadius: radius.sm, padding: '13px 16px', marginBottom: '10px',
        cursor: 'pointer', boxSizing: 'border-box', textAlign: 'left',
      }}
      {...props}
    >
      <span
        style={{
          width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
          border: `2px solid ${checked ? colors.teal : colors.textFaint}`,
          backgroundColor: checked ? colors.teal : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '11px', fontWeight: 700,
        }}
      >
        {checked && '✓'}
      </span>
      <span style={{ fontFamily: font.body, fontSize: '13.5px', color: checked ? colors.tealDark : colors.text, fontWeight: checked ? 600 : 500 }}>
        {label}
      </span>
    </button>
  );
}

export function NumberField({ value, onChange, unit, placeholder }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card,
        border: `1.5px solid ${colors.tealBorder}`, borderRadius: radius.sm,
        padding: '14px 18px', width: '100%', boxSizing: 'border-box', marginBottom: '10px',
      }}
    >
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ border: 'none', outline: 'none', flex: 1, fontSize: '15px', fontFamily: font.body, color: colors.text, backgroundColor: 'transparent', minWidth: 0 }}
      />
      {unit && <span style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted }}>{unit}</span>}
    </div>
  );
}

export function InlineNote({ children, tone = 'info' }) {
  const map = {
    info: { color: colors.textMuted, icon: 'ℹ️' },
    error: { color: colors.error, icon: '⚠️' },
  };
  const c = map[tone];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', margin: '4px 0 14px 0' }}>
      <span style={{ fontSize: '12px' }}>{c.icon}</span>
      <span style={{ fontFamily: font.body, fontSize: '12px', color: c.color, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

export function Modal({ children }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, backgroundColor: colors.overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30, padding: '26px',
      }}
    >
      <div
        style={{
          backgroundColor: colors.card, borderRadius: radius.lg, padding: '26px 22px',
          width: '100%', boxShadow: shadow.card, textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <h2
      style={{
        fontFamily: font.heading,
        fontSize: '21px',
        fontWeight: 700,
        color: colors.tealDark,
        margin: '0 0 16px 0',
        textAlign: 'center',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </h2>
  );
}
