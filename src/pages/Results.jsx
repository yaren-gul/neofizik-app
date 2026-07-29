import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton } from '../components/ui';
import { colors, radius, font } from '../theme';

function Results() {
  const navigate = useNavigate();

  const answerLog = JSON.parse(localStorage.getItem('preTestAnswerLog') || '[]');
  const total = answerLog.length || Number(localStorage.getItem('correctCount') || 0);

  return (
    <PhoneShell>
      <Screen align="center">
        <div style={{ flex: 1 }} />

        <div
          style={{
            width: '96px', height: '96px', borderRadius: '50%', backgroundColor: colors.tealSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative',
          }}
        >
          <div
            style={{
              width: '96px', height: '96px', borderRadius: '50%',
              border: `3px solid ${colors.teal}`, position: 'absolute', top: 0, left: 0,
            }}
          />
          <span style={{ fontSize: '38px', color: colors.teal }}>✓</span>
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.coral }} />
        </div>

        <h1 style={{ fontFamily: font.heading, fontSize: '21px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '0 0 10px 0' }}>
          Ön Test Tamamlandı
        </h1>
        <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 26px 0' }}>
          Ön test başarıyla tamamlandı. Eğitim modüllerine geçebilirsiniz.
        </p>

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' }}>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>📄</span>
            <div style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark }}>{total}/{total}</div>
            <div style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted, textAlign: 'center' }}>Soru Yanıtlandı</div>
          </div>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>☁️</span>
            <div style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark }}>Yanıtlar</div>
            <div style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted, textAlign: 'center' }}>Kaydedildi</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={() => navigate('/education-modules')}>Eğitime Başla</PrimaryButton>
      </Screen>
    </PhoneShell>
  );
}

export default Results;
