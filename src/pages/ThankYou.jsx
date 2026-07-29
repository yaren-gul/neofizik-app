import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { colors, radius, font } from '../theme';

export default function ThankYou() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFinish = async (goTo) => {
    setSaving(true);
    try {
      if (auth.currentUser && feedback.trim()) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { feedback: feedback.trim() });
      }
    } catch (e) {
      console.error('Geri bildirim kaydedilemedi:', e);
    } finally {
      setSaving(false);
      navigate(goTo);
    }
  };

  return (
    <PhoneShell>
      <Screen align="center">
        <div style={{ flex: '0 0 10px' }} />

        <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: '4px' }}>🎉👶🎉</div>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: colors.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '4px auto 18px auto' }}>
          ✓
        </div>

        <h1 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '0 0 20px 0' }}>
          Teşekkür Ederiz
        </h1>

        <div style={{ width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '16px', marginBottom: '12px' }}>
          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.text, lineHeight: 1.65, margin: 0 }}>
            Araştırma kapsamındaki eğitim ve değerlendirme süreçlerini tamamladınız. Katılımınız ve katkınız için teşekkür ederiz.
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: colors.tealSoft, borderRadius: radius.sm, padding: '12px 14px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px' }}>🔒</span>
          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.tealDark, lineHeight: 1.6, margin: 0 }}>
            Yanıtlarınız katılımcı kodunuzla güvenli biçimde kaydedilmiştir.
          </p>
        </div>

        <div style={{ width: '100%', marginBottom: '16px', textAlign: 'left' }}>
          <p style={{ fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark, margin: '0 0 4px 0' }}>Görüş ve Önerileriniz</p>
          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted, margin: '0 0 8px 0' }}>Görüş ve önerileriniz varsa yazabilirsiniz.</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
            rows={4}
            style={{
              width: '100%', border: `1.5px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '12px',
              fontFamily: font.body, fontSize: '13px', color: colors.text, resize: 'none', boxSizing: 'border-box',
            }}
          />
          <p style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint, textAlign: 'right', margin: '4px 0 0 0' }}>{feedback.length}/500</p>
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '20px' }}>
          <span style={{ fontSize: '24px' }}>🎖️</span>
          <div>
            <p style={{ fontFamily: font.heading, fontSize: '13px', fontWeight: 700, color: colors.tealDark, margin: '0 0 3px 0' }}>Katılım Belgeniz Hazır</p>
            <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted, margin: 0, lineHeight: 1.5 }}>
              Eğitim ve değerlendirme süreçlerini tamamladığınız için katılım belgesi almaya hak kazandınız.
            </p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={() => handleFinish('/certificate')} disabled={saving} icon={false}>
          Katılım Belgemi Gör
        </PrimaryButton>
        <div style={{ height: '10px' }} />
        <SecondaryButton onClick={() => handleFinish('/')}>Ana Sayfaya Dön</SecondaryButton>

        <p style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint, textAlign: 'center', margin: '14px 0 0 0', lineHeight: 1.6 }}>
          Eğitim içeriklerini tekrar inceleyebilirsiniz.<br />
          Kişisel Bilgi Formu, ön test, son test ve ölçekler yeniden yanıtlanamaz.
        </p>
      </Screen>
    </PhoneShell>
  );
}
