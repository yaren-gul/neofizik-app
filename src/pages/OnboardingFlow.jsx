import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton, SecondaryButton, StepDots, TopBar, Card } from '../components/ui';
import BabyOrbit from '../components/BabyOrbit';
import { colors, font } from '../theme';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const TOTAL_STEPS = 4;

/* ---------- Adım 1: Hoş Geldiniz ---------- */
function StepWelcome() {
  const items = [
    'NeoFizik, ebelik öğrencilerine erken yenidoğan döneminde fizik muayenenin sistematik biçimde öğrenilmesine yönelik eğitim içeriği sunmak amacıyla geliştirilmiştir.',
    'Uygulamada yenidoğanın muayene bölgelerine ilişkin bilgi kartları, normal ve anormal bulguları gösteren görseller ve eğitim videoları yer almaktadır.',
    'Eğitim öncesinde ve sonrasında gerçekleştirilecek değerlendirmeler aracılığıyla öğrencilerin öğrenme süreci incelenecektir.',
  ];
  return (
    <>
      <BabyOrbit size={70} />
      <div style={{ width: '100%', marginTop: '10px' }}>
        {items.map((text, i) => (
          <Card key={i} style={{ padding: '11px 14px', marginBottom: '8px' }}>
            <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.text, lineHeight: 1.4, margin: 0 }}>{text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- Adım 2: Uygulamayı Nasıl Kullanacaksınız ---------- */
function StepHowToUse() {
  const steps = [
    {
      n: 1,
      active: true,
      title: 'Bilgi Kartlarını İnceleyin',
      desc: 'İlgili muayene bölgesinin değerlendirme basamaklarını, normal ve anormal bulgularını; bölge açıklamaları ve uyarı bilgileriyle birlikte inceleyiniz.',
    },
    {
      n: 2,
      title: 'Uygulama Videosunu İzleyin 🔒',
      desc: 'Bilgi kartlarının tamamlanmasının ardından ilgili muayene bölgesine ait uygulama videosu erişime açılacaktır.',
    },
    {
      n: 3,
      title: 'İlerlemenizi Takip Edin',
      desc: 'Her muayene bölgesindeki tamamlanma durumunuzu yüzde göstergesi üzerinden (bilgi kartları %50, video %100) takip edebilirsiniz.',
    },
  ];
  return (
    <>
      <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.5, margin: '0 0 20px 0' }}>
        Eğitim bölümleri yenidoğan görseli üzerinde gösterilecektir; muayene bölgeleri, önceki bölüm tamamlandıkça sırasıyla açılacaktır.
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span
              style={{
                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: s.active ? colors.teal : 'transparent',
                color: s.active ? '#fff' : colors.textFaint,
                border: s.active ? 'none' : `1.5px solid ${colors.tealBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: 700,
              }}
            >
              {s.n}
            </span>
            <div>
              <p style={{ fontFamily: font.heading, fontSize: '13px', fontWeight: 700, color: colors.tealDark, margin: '0 0 3px 0' }}>{s.title}</p>
              <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.text, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Adım 3: Eğitim Süreci Nasıl İlerleyecek ---------- */
function StepRoadmap() {
  const roadmap = [
    { title: 'Kişisel Bilgi Formu', desc: 'Araştırmaya başlamadan önce sizi tanımamıza yardımcı olacak kısa bir form doldurulacaktır.', active: true },
    { title: 'Ön Test', desc: 'Yenidoğanın fizik muayenesine ilişkin ön bilginizi ölçen bir test uygulanacaktır.' },
    { title: 'Eğitim Modülleri', desc: 'Yenidoğanın muayene bölgelerine ilişkin bilgi kartları, görseller ve videolar üzerinden eğitim içeriklerine erişeceksiniz.' },
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

/* ---------- Adım 4: Aydınlatılmış Onam ---------- */
// İçerik, tez önerisi EK-1 "Bilgilendirilmiş Gönüllü Olur Formu" metninden
// (kısaltılarak) alınmıştır.
function StepPrivacy({ isAgreed, setIsAgreed }) {
  const sections = [
    {
      title: 'Bu araştırma nedir?',
      text: '"Erken Yenidoğan Dönemi Fizik Muayenesine Yönelik Geliştirilen Mobil Uygulamanın Ebelik Öğrencilerinin Bilgi Düzeyi, Klinik Beceri Öz-yeterliliği ve Öğrenme Motivasyonuna Etkisinin Değerlendirilmesi" araştırılacaktır. Araştırmanın yaklaşık 12 ay içinde tamamlanması, siz ve diğer 453 ebelik öğrencisinin katılması planlanmaktadır.',
    },
    {
      title: 'Katılmamın yararları ve olası riskleri nelerdir?',
      text: 'Katılımınızın size doğrudan bir akademik veya mesleki yarar sağlayacağı garanti edilmemektedir. Bununla birlikte mobil uygulamanın, yenidoğanın fizik muayenesine ilişkin bilgi düzeyinizin artmasına, klinik beceri öz-yeterliliğinizin ve öğrenme motivasyonunuzun gelişmesine katkı sağlaması beklenmektedir. Bilinen bir risk bulunmamaktadır.',
    },
    {
      title: 'Bu çalışmada bana ne yapılacak?',
      text: 'Kabul etmeniz durumunda önce Kişisel Bilgi Formu, Klinik Beceriler İçin Öz-Yeterlik Ölçeği ve Bilgi Testi A Formu\'nu (ön test) dolduracaksınız. Ardından mobil uygulamayı belirtilen 14 gün boyunca kullanacak, sonunda Bilgi Testi B Formu (son test) ile diğer ölçekleri dolduracaksınız.',
    },
    {
      title: 'Katılmak zorunda mıyım?',
      text: 'Hayır. Katılım tamamen gönüllülük esasına dayanır. İstediğiniz zaman, herhangi bir gerekçe göstermeden araştırmadan ayrılabilirsiniz — bu durum öğrencilik durumunuzu, derslerinizi veya notlarınızı hiçbir şekilde etkilemez.',
    },
    {
      title: 'Bilgilerim gizli tutulacak mı?',
      text: 'Evet. Kişisel ve araştırma verileriniz katılımcı kodu üzerinden, adınız/soyadınız olmadan kaydedilecek; yalnızca bilimsel amaçla kullanılacak, yetkisiz kişilerle paylaşılmayacak ve sonuçlar kimliğinizi ortaya çıkarmayacak şekilde raporlanacaktır.',
    },
  ];

  return (
    <>
      <div style={{ width: '58px', height: '58px', margin: '0 auto 12px auto', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '24px' }}>🛡️</span>
      </div>

      {sections.map((s, i) => (
        <Card key={i} style={{ padding: '11px 14px', marginBottom: '8px' }}>
          <p style={{ fontFamily: font.heading, fontSize: '12.5px', fontWeight: 700, color: colors.tealDark, margin: '0 0 4px 0' }}>
            {s.title}
          </p>
          <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.text, lineHeight: 1.45, margin: 0 }}>
            {s.text}
          </p>
        </Card>
      ))}

      <label
        style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%',
          backgroundColor: colors.card, border: `1.5px solid ${colors.tealBorder}`,
          borderRadius: '14px', padding: '12px 14px', margin: '4px 0 4px 0',
          cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <input
          type="checkbox"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: colors.teal, flexShrink: 0, marginTop: '2px' }}
        />
        <span style={{ fontFamily: font.body, fontSize: '12px', color: colors.text, lineHeight: 1.5 }}>
          Araştırmanın amacı, yöntemi, bana uygulanacak işlemler, olası yararları ve olası riskleri hakkında yeterli
          bilgi aldım. Katılımın gönüllülük esasına dayandığını ve istediğim zaman ayrılabileceğimi biliyorum.
          Bu araştırmaya kendi özgür irademle katılmayı kabul ediyorum.
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
    'Aydınlatılmış Onam',
  ];

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      if (auth.currentUser) {
        setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { consentGivenAt: new Date().toISOString() },
          { merge: true }
        ).catch((e) => console.error('Onam kaydedilemedi:', e));
      }
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

        <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '0 0 12px 0' }}>
          {titles[currentStep - 1]}
        </h1>

        {currentStep === 1 && <StepWelcome />}
        {currentStep === 2 && <StepHowToUse />}
        {currentStep === 3 && <StepRoadmap />}
        {currentStep === 4 && <StepPrivacy isAgreed={isAgreed} setIsAgreed={setIsAgreed} />}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '20px' }}>
          {currentStep > 1 && (
            <SecondaryButton onClick={handlePrev} style={{ flex: '0 0 96px', width: 'auto' }}>Geri</SecondaryButton>
          )}
          <PrimaryButton onClick={handleNext} disabled={nextDisabled} style={{ flex: 1, width: 'auto' }}>
            Devam Et
          </PrimaryButton>
        </div>
      </Screen>
    </PhoneShell>
  );
}
