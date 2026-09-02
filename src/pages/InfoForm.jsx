import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import {
  PrimaryButton, SecondaryButton, TopBar, Card, Badge,
  ProgressBar, InlineNote, Modal, RadioOption, CheckboxOption, NumberField,
} from '../components/ui';
import { colors, font } from '../theme';

// Tez önerisi EK-2: Kişisel Bilgi Formu — 13 soru, gerçek içerik.
const QUESTIONS = [
  { text: 'Yaşınız', type: 'number', unit: 'yaş' },
  { text: 'Öğrenim gördüğünüz dönem', type: 'single', options: ['1. Dönem', '2. Dönem', '3. Dönem', '4. Dönem', '5. Dönem', '6. Dönem', '7. Dönem', '8. Dönem'] },
  { text: 'Akademik not ortalamanız', type: 'number', unit: '' },
  { text: 'Yenidoğan sağlığı ve hastalıklarına yönelik almış olduğunuz ders not ortalamanız nedir?', type: 'number', unit: '/ 100' },
  { text: 'Yenidoğan sağlığı ve hastalıkları dersine yönelik almış olduğunuz ders dışında, yenidoğanın fizik muayenesine yönelik herhangi bir eğitim aldınız mı?', type: 'single', options: ['Evet', 'Hayır'] },
  { text: 'Yenidoğanın fizik muayenesinin uygulanışını daha önce gözlemlediniz mi?', type: 'single', options: ['Evet', 'Hayır'] },
  { text: 'Daha önce bir yenidoğanın fizik muayenesine katıldınız mı?', type: 'single', options: ['Evet', 'Hayır'] },
  { text: 'Daha önce bir yenidoğanın fizik muayenesini uyguladınız mı?', type: 'single', options: ['Evet', 'Hayır'] },
  { text: 'Yenidoğanın fizik muayenesine yaklaşık olarak kaç kez katıldınız?', type: 'single', options: ['Hiç', '1–2 kez', '3–5 kez', '6–10 kez', '11 kez ve üzeri'] },
  { text: 'Yenidoğanın fizik muayenesini yaklaşık olarak kaç kez uyguladınız?', type: 'single', options: ['Hiç', '1–2 kez', '3–5 kez', '6–10 kez', '11 kez ve üzeri'] },
  {
    text: 'Yenidoğanın fizik muayenesini hangi klinik alan veya alanlarda gözlemlediniz ya da uyguladınız? Birden fazla seçenek işaretleyebilirsiniz.',
    type: 'multi',
    options: ['Doğum salonu', 'Doğum sonu servisi', 'Sağlıklı yenidoğan/bebek odası', 'Yenidoğan yoğun bakım ünitesi', 'Diğer', 'Yenidoğan fizik muayenesini gözlemlemedim veya uygulamadım'],
    hasOther: 'Diğer',
  },
  { text: 'Daha önce eğitim amacıyla hazırlanmış bir mobil uygulama kullandınız mı?', type: 'single', options: ['Evet', 'Hayır'] },
  { text: 'Yenidoğan Sağlığı ve Hastalıkları dersi kapsamında simülasyon laboratuvarında eğitim aldınız mı?', type: 'single', options: ['Evet', 'Hayır'] },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

function InfoForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = giriş ekranı, 1..13 = sorular
  const [answers, setAnswers] = useState({}); // { [index]: string | string[] }
  const [otherTexts, setOtherTexts] = useState({}); // { [index]: string }
  const [showError, setShowError] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentIndex = step - 1;
  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex];

  const isAnswered = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'number') return currentAnswer !== undefined && currentAnswer !== '';
    if (currentQuestion.type === 'multi') return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return currentAnswer !== undefined;
  };

  const handleNumberChange = (e) => setAnswers({ ...answers, [currentIndex]: e.target.value });

  const handleSingleSelect = (option) => setAnswers({ ...answers, [currentIndex]: option });

  const handleMultiToggle = (option) => {
    const prev = Array.isArray(currentAnswer) ? currentAnswer : [];
    const next = prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option];
    setAnswers({ ...answers, [currentIndex]: next });
  };

  const handleNext = () => {
    if (!isAnswered()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (step < TOTAL_QUESTIONS) setStep(step + 1);
    else setShowSaveModal(true);
  };

  const handlePrev = () => {
    setShowError(false);
    if (step > 1) setStep(step - 1);
    else setStep(0);
  };

  const buildAnswersLog = () => {
    return QUESTIONS.map((q, i) => {
      const value = answers[i];
      return {
        question: q.text,
        answer: q.type === 'multi'
          ? (value || []).map((v) => (v === q.hasOther && otherTexts[i] ? `${v}: ${otherTexts[i]}` : v))
          : value,
      };
    });
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, "infoForms", auth.currentUser.uid), {
          answers: buildAnswersLog(),
          submittedAt: new Date().toISOString(),
        }, { merge: true });
      }
      navigate('/pre-efficacy-scale');
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
          <TopBar />

          <h1 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 18px 0', textAlign: 'center' }}>
            Kişisel Bilgi Formu
          </h1>

          <Card style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: font.body, fontSize: '13.5px', color: colors.text, lineHeight: 1.7, margin: 0 }}>
              Değerli Katılımcı,<br /><br />
              Bu form, ebelik öğrencilerinin tanıtıcı özellikleri ile yenidoğanın fizik muayenesine yönelik önceki
              eğitim ve uygulama deneyimlerini belirlemek amacıyla hazırlanmıştır. Lütfen aşağıdaki soruları
              dikkatlice okuyarak size uygun seçeneği işaretleyiniz veya ilgili alanı doldurunuz.<br /><br />
              Verdiğiniz bilgiler gizli tutulacak ve yalnızca bilimsel amaçlarla kullanılacaktır.<br /><br />
              Katılımınız için teşekkür ederiz.
            </p>
            <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, margin: '14px 0 0 0' }}>
              Yaklaşık 3–4 dakika
            </p>
          </Card>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={() => setStep(1)}>Forma Başla</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- 1..13: Soru ekranları ---------- */
  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={handlePrev} badge="Kişisel Bilgi Formu" onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <Badge>{step}/{TOTAL_QUESTIONS}</Badge>
        </div>
        <ProgressBar value={step} total={TOTAL_QUESTIONS} />

        <div
          style={{
            width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`,
            borderRadius: '16px', padding: '18px', marginBottom: '16px', boxSizing: 'border-box',
          }}
        >
          <p style={{ fontFamily: font.body, fontSize: '14.5px', fontWeight: 600, color: colors.tealDark, lineHeight: 1.55, margin: 0, textAlign: 'left' }}>
            {step}. {currentQuestion.text}
          </p>
        </div>

        {currentQuestion.type === 'number' && (
          <NumberField
            value={currentAnswer || ''}
            onChange={handleNumberChange}
            unit={currentQuestion.unit}
            placeholder="Değer giriniz"
          />
        )}

        {currentQuestion.type === 'single' && (
          <div style={{ width: '100%' }}>
            {currentQuestion.options.map((opt) => (
              <RadioOption key={opt} label={opt} selected={currentAnswer === opt} onClick={() => handleSingleSelect(opt)} />
            ))}
          </div>
        )}

        {currentQuestion.type === 'multi' && (
          <div style={{ width: '100%' }}>
            {currentQuestion.options.map((opt) => (
              <CheckboxOption
                key={opt}
                label={opt}
                checked={Array.isArray(currentAnswer) && currentAnswer.includes(opt)}
                onClick={() => handleMultiToggle(opt)}
              />
            ))}
            {currentQuestion.hasOther && Array.isArray(currentAnswer) && currentAnswer.includes(currentQuestion.hasOther) && (
              <input
                type="text"
                value={otherTexts[currentIndex] || ''}
                onChange={(e) => setOtherTexts({ ...otherTexts, [currentIndex]: e.target.value })}
                placeholder="Belirtiniz..."
                style={{
                  width: '100%', boxSizing: 'border-box', border: `1.5px solid ${colors.tealBorder}`,
                  borderRadius: '10px', padding: '10px 14px', fontFamily: font.body, fontSize: '13px',
                  color: colors.text, marginTop: '2px', marginBottom: '10px',
                }}
              />
            )}
          </div>
        )}

        {showError && <InlineNote tone="error">Lütfen bu soruyu yanıtlayınız.</InlineNote>}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
          <SecondaryButton onClick={handlePrev} style={{ flex: '0 0 96px', width: 'auto' }}>Önceki</SecondaryButton>
          <PrimaryButton onClick={handleNext} icon={false} style={{ flex: 1, width: 'auto' }}>
            {step === TOTAL_QUESTIONS ? 'Tamamla' : 'Sonraki'}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <PrimaryButton onClick={handleConfirmSave} disabled={saving} icon={false}>
                {saving ? 'Kaydediliyor...' : 'Kaydet ve Devam Et'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowSaveModal(false)}>Forma Dön</SecondaryButton>
            </div>
          </Modal>
        )}
      </Screen>
    </PhoneShell>
  );
}

export default InfoForm;
