import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton } from '../components/ui';
import Logo from '../components/Logo';
import BabyOrbit from '../components/BabyOrbit';
import { colors, font } from '../theme';

function Home() {
  const navigate = useNavigate();

  return (
    <PhoneShell scroll={false}>
      <Screen align="center" pad="34px">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Logo size={34} />
          <p style={{
            fontFamily: font.body, fontSize: '13.5px', color: colors.tealDark,
            fontWeight: 600, textAlign: 'center', margin: '10px 0 34px 0', lineHeight: 1.5,
          }}>
            Yenidoğan Fizik Muayenesi<br />Eğitim Uygulaması
          </p>

          <BabyOrbit size={170} />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PrimaryButton onClick={() => navigate('/login')}>Giriş Yap</PrimaryButton>
          <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, textAlign: 'center', marginTop: '14px' }}>
            Eğitimle keşfet, güvenle değerlendir.
          </p>
        </div>
      </Screen>
    </PhoneShell>
  );
}

export default Home;
