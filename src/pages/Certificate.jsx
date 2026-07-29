import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, SecondaryButton } from '../components/ui';
import Logo from '../components/Logo';
import { colors, radius, font } from '../theme';

function Certificate() {
  const navigate = useNavigate();
  const [name, setName] = useState('Katılımcı');

  useEffect(() => {
    const fetchName = async () => {
      try {
        if (auth.currentUser) {
          const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (snap.exists() && snap.data().name) setName(snap.data().name);
        }
      } catch (e) {
        console.error('Kullanıcı adı alınamadı:', e);
      }
    };
    fetchName();
  }, []);

  const today = new Date().toLocaleDateString('tr-TR');

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={() => navigate('/thank-you')} />

        <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, margin: '0 0 16px 0', textAlign: 'center' }}>
          Katılım Belgesi
        </h1>

        <div
          style={{
            width: '100%', border: `2px solid ${colors.teal}`, borderRadius: radius.lg,
            padding: '22px 18px', textAlign: 'center', backgroundColor: colors.card, position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute', inset: '6px', border: `1px solid ${colors.tealBorder}`,
              borderRadius: `calc(${radius.lg} - 4px)`, pointerEvents: 'none',
            }}
          />
          <div style={{ fontSize: '46px', marginBottom: '4px' }}>👶🩺</div>

          <div style={{ marginBottom: '10px' }}><Logo size={20} /></div>

          <h2 style={{ fontFamily: font.heading, fontSize: '17px', fontWeight: 800, color: colors.tealDark, letterSpacing: '0.02em', margin: '0 0 16px 0' }}>
            NEOFİZİK<br />KATILIM BELGESİ
          </h2>

          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted, margin: '0 0 2px 0' }}>Katılımcı Adı Soyadı</p>
          <p style={{ fontFamily: font.heading, fontSize: '15px', fontWeight: 700, color: colors.coral, margin: '0 0 14px 0' }}>{name}</p>

          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.text, lineHeight: 1.6, margin: '0 0 18px 0' }}>
            Yenidoğan Fizik Muayenesi Eğitim Uygulaması kapsamındaki eğitim ve değerlendirme süreçlerini tamamlamıştır.
          </p>

          <div
            style={{
              width: '64px', height: '64px', borderRadius: '50%', backgroundColor: colors.teal, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto',
              fontSize: '26px', border: `3px solid ${colors.tealSoft}`,
            }}
          >
            ✓
          </div>

          <p style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textMuted, lineHeight: 1.7, margin: '0 0 14px 0' }}>
            Mersin Üniversitesi<br />
            Sağlık Bilimleri Enstitüsü<br />
            Ebelik Anabilim Dalı<br />
            Yüksek Lisans Tez Araştırması
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px dashed ${colors.tealBorder}`, paddingTop: '10px', fontFamily: font.body, fontSize: '10px', color: colors.textFaint }}>
            <span>Tarih: {today}</span>
            <span>Araştırmacı</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={() => window.print()} icon={false}>⬇ Belgeyi İndir</PrimaryButton>
        <div style={{ height: '10px' }} />
        <SecondaryButton onClick={() => navigate('/')}>Ana Sayfaya Dön</SecondaryButton>

        <p style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint, textAlign: 'center', marginTop: '10px' }}>
          Belge katılımcı adına düzenlenmiştir.
        </p>
      </Screen>
    </PhoneShell>
  );
}

export default Certificate;
