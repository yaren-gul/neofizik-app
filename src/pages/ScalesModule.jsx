import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import LikertForm from '../components/LikertForm';
import { colors, radius, font } from '../theme';
import { userKey } from '../utils/session';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { POST_SCALES } from '../data/scalesData';

export default function ScalesModule() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(() => {
    if (localStorage.getItem(userKey('scalesCompleted')) === 'true') {
      return POST_SCALES.reduce((acc, s) => ({ ...acc, [s.key]: true }), {});
    }
    return {};
  });
  const [activeScaleKey, setActiveScaleKey] = useState(null);
  const [saving, setSaving] = useState(false);

  const doneCount = Object.values(completed).filter(Boolean).length;
  const allDone = doneCount === POST_SCALES.length;
  const activeScale = POST_SCALES.find((s) => s.key === activeScaleKey);

  const handleScaleComplete = async (answers) => {
    setSaving(true);
    try {
      if (auth.currentUser) {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { postScales: { [activeScale.key]: { answers, completedAt: new Date().toISOString() } } },
          { merge: true }
        );
      }
      const updated = { ...completed, [activeScale.key]: true };
      setCompleted(updated);
      setActiveScaleKey(null);
      if (Object.values(updated).filter(Boolean).length === POST_SCALES.length) {
        localStorage.setItem(userKey('scalesCompleted'), 'true');
        if (auth.currentUser) {
          setDoc(
            doc(db, 'users', auth.currentUser.uid),
            { scalesCompleted: true, scalesCompletedAt: new Date().toISOString() },
            { merge: true }
          ).catch((e) => console.error("Ölçek durumu Firestore'a yazılamadı:", e));
        }
      }
    } catch (e) {
      console.error('Ölçek kaydedilemedi:', e);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Tek bir ölçeği doldurma ekranı ---------- */
  if (activeScale) {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => setActiveScaleKey(null)} />
          <h1 style={{ fontFamily: font.heading, fontSize: '17px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '4px 0 14px 0' }}>
            {activeScale.title}
          </h1>
          <LikertForm scale={activeScale} onComplete={handleScaleComplete} submitLabel="Ölçeği Tamamla" saving={saving} />
        </Screen>
      </PhoneShell>
    );
  }

  if (allDone) {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => navigate('/final-test')} />
          <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 22px 0', textAlign: 'center' }}>
            Değerlendirme Ölçekleri
          </h1>

          <ProgressRing percent={100} size={120} label={`${POST_SCALES.length}/${POST_SCALES.length}`} sublabel="Ölçek Tamamlandı" />

          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', margin: '18px 0 20px 0' }}>
            Tüm değerlendirme ölçeklerini tamamladınız.
          </p>

          <div style={{ width: '100%' }}>
            {POST_SCALES.map((s, i) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.tealSoft, color: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: font.heading, fontSize: '13px', fontWeight: 700, color: colors.tealDark }}>{s.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Tamamlandı</div>
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
          {POST_SCALES.map((s, i) => (
            <Card key={s.key}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.tealSoft, color: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark }}>{s.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: '11.5px', color: completed[s.key] ? colors.success : colors.textMuted }}>
                    {completed[s.key] ? 'Tamamlandı' : `${s.items.length} madde`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveScaleKey(s.key)}
                disabled={completed[s.key]}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%',
                  border: `1.5px solid ${completed[s.key] ? colors.border : colors.teal}`,
                  color: completed[s.key] ? colors.textFaint : colors.teal, background: 'none', borderRadius: radius.pill,
                  padding: '9px', fontFamily: font.body, fontSize: '12.5px', fontWeight: 600,
                  cursor: completed[s.key] ? 'default' : 'pointer',
                }}
              >
                {completed[s.key] ? '✓ Tamamlandı' : 'Ölçeği Doldur'}
              </button>
            </Card>
          ))}
        </div>

        <div style={{ backgroundColor: colors.tealSoft, borderRadius: radius.sm, padding: '12px 14px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px' }}>ℹ️</span>
          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.tealDark, lineHeight: 1.6, margin: 0 }}>
            Her ölçek uygulama içinde doldurulur, dış bir siteye yönlendirilmezsiniz.
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
