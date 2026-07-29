import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton, SecondaryButton, StepDots, TopBar, Card } from '../components/ui';
import BabyOrbit from '../components/BabyOrbit';
import { colors, radius, font } from '../theme';

const TOTAL_STEPS = 4;

/* ---------- Adım 1: Hoş Geldiniz ---------- */
function StepWelcome() {
  const items = [
    {
      icon: '📖',
      text: 'NeoFizik, ebelik öğrencilerine erken yenidoğan döneminde fizik muayenenin sistematik biçimde öğrenilmesine yönelik eğitim içeriği sunmak amacıyla geliştirilmiştir.',
    },
    {
      icon: '📋🖼️🎬',
      text: 'Uygulamada yenidoğanın muayene bölgelerine ilişkin bilgi kartları, normal ve anormal bulguları gösteren görseller ve eğitim videoları yer almaktadır.',
    },
    {
      icon: '✓✓',
      text: 'Eğitim öncesinde ve sonrasında gerçekleştirilecek değerlendirmeler aracılığıyla öğrencilerin öğrenme süreci incelenecektir.',
    },
  ];
  return (
    <>
      <BabyOrbit size={104} />
      <div style={{ width: '100%', marginTop: '18px' }}>
        {items.map((it, i) => (
          <Card key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1.3 }}>{it.icon}</span>
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.text, lineHeight: 1.6, margin: 0 }}>{it.text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- Adım 2: Uygulamayı Nasıl Kullanacaksınız ---------- */
function StepHowToUse() {
  return (
    <>
      <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 16px 0' }}>
        Eğitim bölümleri yenidoğan görseli üzerinde gösterilecektir. Başlangıçta yalnızca ilk muayene bölgesi aktif
        olacaktır. Diğer muayene bölgeleri, önceki bölüm tamamlandıkça sırasıyla açılacaktır.
      </p>

      <Card>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>1</span>
          <p style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark, margin: 0 }}>Bilgi Kartlarını İnceleyin</p>
        </div>
        <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: '0 0 8px 34px' }}>
          İlgili muayene bölgesinin değerlendirme basamaklarını, normal ve anormal muayene bulgularını bilgi kartları üzerinden inceleyiniz.
        </p>
        <div style={{ marginLeft: '34px', fontFamily: font.body, fontSize: '11.5px', color: colors.teal, lineHeight: 1.9 }}>
          ✓ Bölge açıklamaları　✓ Muayene basamakları<br />
          ✓ Normal ve anormal bulgular<br />
          ✓ Bulgu görselleri　✓ Dikkat ve uyarı bilgileri
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.textFaint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>2</span>
          <div>
            <p style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark, margin: '0 0 4px 0' }}>Uygulama Videosunu İzleyin 🔒</p>
            <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
              Bilgi kartlarının tamamlanmasının ardından ilgili muayene bölgesine ait uygulama videosu erişime açılacaktır.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.textFaint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>3</span>
          <div>
            <p style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark, margin: '0 0 4px 0' }}>İlerlemenizi Takip Edin　%50 %100</p>
            <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
              Her muayene bölgesindeki tamamlanma durumunuzu yüzde göstergesi üzerinden takip edebilirsiniz.
            </p>
          </div>
        </div>
      </Card>

      <div style={{ backgroundColor: colors.tealSoft, borderRadius: radius.sm, padding: '12px 14px', display: 'flex', gap: '8px' }}>
        <span style={{ fontSize: '13px' }}>ℹ️</span>
        <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.tealDark, lineHeight: 1.6, margin: 0 }}>
          Bilgi kartları ve görseller tamamlandığında ilerleme %50'ye, uygulama videosu tamamlandığında %100'e ulaşacaktır.
        </p>
      </div>
    </>
  );
}

/* ---------- Adım 3: Eğitim Süreci Nasıl İlerleyecek ---------- */
function StepRoadmap() {
  const roadmap = [
    { title: 'Kişisel Bilgi Formu', desc: 'Araştırmaya başlamadan önce sizi tanımamıza yardımcı olacak kısa bir form doldurulacaktır.' },
    { title: 'Ön Test', desc: 'Yenidoğanın fizik muayenesine ilişkin ön bilginizi ölçen bir test uygulanacaktır.' },
    { title: 'Eğitim Modülleri', desc: 'Yenidoğanın muayene bölgelerine ilişkin bilgi kartları, görseller ve videolar üzerinden eğitim içeriklerine erişeceksiniz.', active: true },
    { title: 'Eğitimin Tamamlanması', desc: 'Bir muayene bölgesini %100 tamamladığınızda bir sonraki bölge açılacaktır.' },
    { title: 'İçeriklerin Tekrar İncelenmesi', desc: 'Tüm eğitim tamamlandığında içerikleri istediğiniz zaman tekrar inceleyebilirsiniz.' },
    { title: 'Son Değerlendirme', desc: 'Eğitim sonrası bilginizi ölçen son test ve değerlendirme ölçekleri uygulanacaktır.' },
    { title: 'Katılım Belgesi', desc: 'Süreci tamamladığınızda katılım belgeniz oluşturulacaktır.' },
  ];
  return (
    <div style={{ width: '100%' }}>
      {roadmap.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span
              style={{
                width: '26px', height: '26px', borderRadius: '50%',
                backgroundColor: item.active ? colors.coral : colors.card,
                color: item.active ? '#fff' : colors.tealDark,
                border: item.active ? 'none' : `1.5px solid ${colors.tealBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            {i < roadmap.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: colors.tealBorder, minHeight: '22px' }} />}
          </div>
          <div style={{ paddingBottom: '18px' }}>
            <p style={{ fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: item.active ? colors.coral : colors.tealDark, margin: '2px 0 4px 0' }}>
              {item.title}
            </p>
            <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, lineHeight: 1.55, margin: 0 }}>
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Adım 4: Gizlilik ve Veri Güvenliği ---------- */
function StepPrivacy({ isAgreed, setIsAgreed }) {
  return (
    <>
      <div style={{ position: 'relative', width: '150px', height: '150px', margin: '4px auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', border: `1px dashed ${colors.tealBorder}` }} />
        <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '18px' }}>👤</span>
        <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '18px' }}>✅</span>
        <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🗄️</span>
        <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>📊</span>
        <span style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '14px', backgroundColor: colors.coral, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔓</span>
        <div style={{ width: '92px', height: '92px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: colors.tealDark, fontFamily: font.body, fontWeight: 700 }}>Katılımcı Kodu</span>
          <span style={{ fontSize: '14px', color: colors.tealDark, letterSpacing: '2px' }}>*****</span>
          <span style={{ fontSize: '16px' }}>🔒</span>
        </div>
      </div>

      <Card>
        <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
          Uygulama kapsamında elde edilen veriler katılımcı kodu kullanılarak kaydedilecektir. Adınız ve soyadınız
          eğitim ve değerlendirme ekranlarında yer almayacaktır.
        </p>
      </Card>
      <Card>
        <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
          Toplanan veriler yalnızca bilimsel araştırma amacıyla kullanılacak, gizli tutulacak ve araştırma sonuçları
          bireysel kimliğiniz belirlenemeyecek şekilde raporlanacaktır.
        </p>
      </Card>
      <Card>
        <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
          Araştırma kapsamında verdiğiniz yanıtlar akademik başarı notunuzu etkilemeyecektir. Araştırmaya katılım
          gönüllülük esasına dayanmaktadır.
        </p>
      </Card>

      <label
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          backgroundColor: colors.card, border: `1.5px solid ${colors.tealBorder}`,
          borderRadius: '14px', padding: '14px 16px', margin: '4px 0 4px 0',
          cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: colors.teal, flexShrink: 0 }}
        />
        <span style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text }}>
          Yukarıdaki bilgilendirmeyi okudum ve anladım.
        </span>
      </label>
    </>
  );
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const titles = [
    'NeoFizik’e Hoş Geldiniz',
    'Uygulamayı Nasıl Kullanacaksınız?',
    'Eğitim Süreci Nasıl İlerleyecek?',
    'Gizlilik ve Veri Güvenliği',
  ];

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      navigate('/info-form');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isLastStep = currentStep === TOTAL_STEPS;
  const nextDisabled = isLastStep && !isAgreed;

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={currentStep > 1 ? handlePrev : false} badge={`${currentStep}/${TOTAL_STEPS}`} />
        <StepDots step={currentStep} total={TOTAL_STEPS} />

        <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '4px 0 18px 0' }}>
          {titles[currentStep - 1]}
        </h1>

        {currentStep === 1 && <StepWelcome />}
        {currentStep === 2 && <StepHowToUse />}
        {currentStep === 3 && <StepRoadmap />}
        {currentStep === 4 && <StepPrivacy isAgreed={isAgreed} setIsAgreed={setIsAgreed} />}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '20px' }}>
          {currentStep > 1 && <SecondaryButton onClick={handlePrev}>Geri</SecondaryButton>}
          <PrimaryButton onClick={handleNext} disabled={nextDisabled}>
            {isLastStep ? 'Kişisel Bilgi Formuna Geç' : 'Devam Et'}
          </PrimaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}
