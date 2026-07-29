import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import {
  PrimaryButton, SecondaryButton, TextLink, TopBar, Card, Badge,
  ProgressBar, InlineNote, Modal,
} from '../components/ui';
import { colors, radius, font } from '../theme';

const TOTAL_QUESTIONS = 10;

function InfoForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = giriş ekranı, 1..10 = sorular
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (step < TOTAL_QUESTIONS) setStep(step + 1);
    else setShowSaveModal(true);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    else setStep(0);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, "infoForms", auth.currentUser.uid), {
          submittedAt: new Date().toISOString(),
        }, { merge: true });
      }
      navigate('/pre-test');
    } catch (e) {
      console.error("Form kaydedilemedi:", e);
      alert("Form kaydedilirken bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- 0: Giriş ekranı ---------- */
  if (step === 0) {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar onLogout={() => { localStorage.clear(); navigate('/login'); }} />

          <h1 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 10px 0', textAlign: 'center' }}>
            Kişisel Bilgi Formu
          </h1>
          <div style={{ marginBottom: '14px' }}><Badge>{TOTAL_QUESTIONS} Soru</Badge></div>

          <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '18px' }}>
            📋
          </div>

          <Card style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: font.body, fontSize: '13.5px', color: colors.text, lineHeight: 1.7, margin: 0 }}>
              Değerli Katılımcı,<br /><br />
              Bu form, ebelik öğrencilerinin tanıtıcı özellikleri ile yenidoğanın fizik muayenesine yönelik önceki
              eğitim ve uygulama deneyimlerini belirlemek amacıyla hazırlanmıştır. Lütfen aşağıdaki soruları
              dikkatlice okuyarak size uygun seçeneği işaretleyiniz veya ilgili alanı doldurunuz.<br /><br />
              Verdiğiniz bilgiler gizli tutulacak ve yalnızca bilimsel amaçlarla kullanılacaktır.<br /><br />
              Katılımınız için teşekkür ederiz.
            </p>
          </Card>

          <div style={{ margin: '6px 0 20px 0' }}><Badge>Yaklaşık 3–4 dakika</Badge></div>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={() => setStep(1)}>Forma Başla</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- 1..10: Soru ekranları (yer tutucu - içerik netleşince doldurulacak) ---------- */
  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={handlePrev} badge="Kişisel Bilgi Formu" onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <Badge>{step}/{TOTAL_QUESTIONS}</Badge>
        </div>
        <ProgressBar value={step} total={TOTAL_QUESTIONS} />

        {/* Soru metni - yer tutucu */}
        <div
          style={{
            width: '100%', backgroundColor: colors.card, border: `1.5px dashed ${colors.tealBorder}`,
            borderRadius: '16px', padding: '18px', marginBottom: '16px', boxSizing: 'border-box',
          }}
        >
          <p style={{ fontFamily: font.body, fontSize: '14.5px', fontWeight: 600, color: colors.textFaint, lineHeight: 1.55, margin: 0, textAlign: 'left' }}>
            {step}. Soru metni belirlenecek…
          </p>
        </div>

        <InlineNote>Bu ekranın soru ve şıkları henüz netleşmedi — içerik onaylanınca doldurulacak.</InlineNote>

        {/* Boş şık yer tutucuları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                border: `1.5px dashed ${colors.border}`, borderRadius: radius.sm,
                padding: '14px 16px', boxSizing: 'border-box',
              }}
            >
              <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${colors.textFaint}`, flexShrink: 0 }} />
              <span style={{ fontFamily: font.body, fontSize: '13.5px', color: colors.textFaint }}>Seçenek {n}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
          <SecondaryButton onClick={handlePrev}>Önceki</SecondaryButton>
          <PrimaryButton onClick={handleNext} icon={false}>
            {step === TOTAL_QUESTIONS ? 'Formu Tamamla' : 'Sonraki'}
          </PrimaryButton>
        </div>

        {showSaveModal && (
          <Modal>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px auto', color: colors.teal }}>
              ✓
            </div>
            <h3 style={{ fontFamily: font.heading, color: colors.tealDark, margin: '0 0 8px 0' }}>Formu Kaydet</h3>
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.6, margin: '0 0 20px 0' }}>
              Kişisel Bilgi Formunu kaydetmek istediğinizden emin misiniz? Form kaydedildikten sonra yanıtlarınızda değişiklik yapamayacaksınız.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <SecondaryButton onClick={() => setShowSaveModal(false)}>Forma Dön</SecondaryButton>
              <PrimaryButton onClick={handleConfirmSave} disabled={saving} icon={false}>
                {saving ? 'Kaydediliyor...' : 'Kaydet ve Devam Et'}
              </PrimaryButton>
            </div>
          </Modal>
        )}
      </Screen>
    </PhoneShell>
  );
}

export default InfoForm;
