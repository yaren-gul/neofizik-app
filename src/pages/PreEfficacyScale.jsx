import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar } from '../components/ui';
import { colors, font } from '../theme';
import { userKey } from '../utils/session';
import LikertForm from '../components/LikertForm';
import { EFFICACY_SCALE } from '../data/scalesData';

// Tez önerisi 3. Aşama: içerik açılmadan önce Kişisel Bilgi Formu'nun ardından,
// ön testten (Bilgi Testi A) önce bu ölçek uygulanır (EK-5).
export default function PreEfficacyScale() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleComplete = async (answers) => {
    setSaving(true);
    try {
      localStorage.setItem(userKey('preEfficacyScaleCompleted'), 'true');
      if (auth.currentUser) {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { preEfficacyScaleCompleted: true, preEfficacyScaleAnswers: answers, preEfficacyScaleCompletedAt: new Date().toISOString() },
          { merge: true }
        );
      }
      navigate('/pre-test');
    } catch (e) {
      console.error("Ölçek kaydedilemedi:", e);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={false} />

        <h1 style={{ fontFamily: font.heading, fontSize: '18px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '4px 0 4px 0' }}>
          {EFFICACY_SCALE.title}
        </h1>
        <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          Eğitim içeriğine başlamadan önce, mevcut klinik beceri öz-yeterlik düzeyinizi ölçen kısa bir form dolduracaksınız.
        </p>

        <LikertForm scale={EFFICACY_SCALE} onComplete={handleComplete} submitLabel="Devam Et" saving={saving} />
      </Screen>
    </PhoneShell>
  );
}
