import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import { colors, radius, font } from '../theme';
import { userKey } from '../utils/session';

const SCALES = [
  { id: 1, title: 'Klinik Beceri Özyeterliliği Ölçeği', url: 'https://forms.google.com/' },
  { id: 2, title: 'Mobil Öğrenme Motivasyon Ölçeği', url: 'https://forms.google.com/' },
  { id: 3, title: 'Sistem Kullanılabilirlik Ölçeği', url: 'https://forms.google.com/' },
];

export default function ScalesModule() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(() => {
    if (localStorage.getItem(userKey('scalesCompleted')) === 'true') {
      return SCALES.reduce((acc, s) => ({ ...acc, [s.id]: true }), {});
    }
    return {};
  });

  const doneCount = Object.values(completed).filter(Boolean).length;
  const allDone = doneCount === SCALES.length;

  const openForm = (scale) => {
    window.open(scale.url, '_blank', 'noopener,noreferrer');
    const updated = { ...completed, [scale.id]: true };
    setCompleted(updated);
    if (Object.values(updated).filter(Boolean).length === SCALES.length) {
      localStorage.setItem(userKey('scalesCompleted'), 'true');
    }
  };

  if (allDone) {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => navigate('/final-test')} />
          <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 22px 0', textAlign: 'center' }}>
            Değerlendirme Ölçekleri
          </h1>

          <ProgressRing percent={100} size={120} label={`${SCALES.length}/${SCALES.length}`} sublabel="Ölçek Tamamlandı" />

          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', margin: '18px 0 20px 0' }}>
            Tüm değerlendirme ölçeklerini tamamladınız.
          </p>

          <div style={{ width: '100%' }}>
            {SCALES.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.tealSoft, color: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: font.heading, fontSize: '13px', fontWeight: 700, color: colors.tealDark }}>{s.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Tamamlandı • Doğrulandı</div>
                </div>
                <span style={{ color: colors.teal, fontSize: '16px' }}>✓</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={() => navigate('/final-report')}>Raporu Gör</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={() => navigate('/final-test')} />
        <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 10px 0', textAlign: 'center' }}>
          Değerlendirme Ölçekleri
        </h1>
        <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', margin: '0 0 20px 0', lineHeight: 1.6 }}>
          Sonuç raporunuzu görüntüleyebilmek için aşağıdaki üç ölçeği tamamlayınız.
        </p>

        <div style={{ width: '100%' }}>
          {SCALES.map((s, i) => (
            <Card key={s.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.tealSoft, color: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark }}>{s.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: '11.5px', color: completed[s.id] ? colors.success : colors.textMuted }}>
                    {completed[s.id] ? 'Tamamlandı' : 'Bekliyor'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => openForm(s)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%',
                  border: `1.5px solid ${colors.teal}`, color: colors.teal, background: 'none', borderRadius: radius.pill,
                  padding: '9px', fontFamily: font.body, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                ↗ Google Formu Aç
              </button>
            </Card>
          ))}
        </div>

        <div style={{ backgroundColor: colors.tealSoft, borderRadius: radius.sm, padding: '12px 14px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px' }}>ℹ️</span>
          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.tealDark, lineHeight: 1.6, margin: 0 }}>
            Formu doldurduktan sonra uygulamaya geri dönünüz. Tamamlanma durumu doğrulandığında ölçek işaretlenecektir.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton disabled={!allDone} icon={false}>
          🔒 Raporu Gör
        </PrimaryButton>
        {!allDone && (
          <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, textAlign: 'center', marginTop: '8px' }}>
            Tüm ölçekler tamamlanmadan sonuç raporu açılamaz.
          </p>
        )}
      </Screen>
    </PhoneShell>
  );
}
