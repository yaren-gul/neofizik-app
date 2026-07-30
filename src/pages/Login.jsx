import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { setActiveUser } from '../utils/session';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton, FieldInput } from '../components/ui';
import Logo from '../components/Logo';
import BabyOrbit from '../components/BabyOrbit';
import { colors, font } from '../theme';

export default function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      setActiveUser(user.uid);
      localStorage.setItem('userLoggedIn', 'true');

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isTestCompleted === true) {
          navigate('/results', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      } else {
        await setDoc(userDocRef, {
          email: user.email,
          isTestCompleted: false,
          createdAt: new Date().toISOString()
        });
        navigate('/onboarding', { replace: true });
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş başarısız: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell>
      <Screen align="center">
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <Logo size={26} />
          <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.tealDark, fontWeight: 600, margin: '8px 0 0 0' }}>
            Yenidoğan Fizik Muayenesi Eğitim Uygulaması
          </p>
        </div>

        <BabyOrbit size={100} />

        <h1 style={{ fontFamily: font.heading, fontSize: '24px', fontWeight: 700, color: colors.tealDark, margin: '14px 0 6px 0' }}>
          Hoş Geldiniz
        </h1>
        <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', margin: '0 0 22px 0', lineHeight: 1.5 }}>
          Eğitime başlamak veya kaldığınız yerden devam etmek için giriş bilgilerinizi giriniz.
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <FieldInput
            icon="👤"
            type="email"
            placeholder="E-posta"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <FieldInput
            icon="🔒"
            type="password"
            placeholder="Şifre"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <div style={{ width: '100%', textAlign: 'right', marginBottom: '18px' }}>
            <span style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, cursor: 'pointer' }}>
              Giriş bilgilerimi unuttum
            </span>
          </div>
          <PrimaryButton type="submit" disabled={loading} icon={false}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </PrimaryButton>
        </form>

        <div style={{ width: '100%', textAlign: 'center', fontFamily: font.body, fontSize: '13px', color: colors.textMuted, marginTop: '20px' }}>
          Hesabın yok mu?{' '}
          <span onClick={() => navigate('/register')} style={{ color: colors.coral, fontWeight: 700, cursor: 'pointer' }}>
            Kayıt Ol
          </span>
        </div>

        <div style={{ width: '100%', textAlign: 'center', marginTop: '18px' }}>
          <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, margin: '0 0 4px 0' }}>
            Giriş yapmakta sorun mu yaşıyorsunuz?
          </p>
          <span style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.teal, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            💬 Araştırmacıyla İletişime Geçin
          </span>
        </div>

        <div style={{ width: '100%', textAlign: 'center', marginTop: '22px', lineHeight: 1.6 }}>
          <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, margin: 0 }}>
            Mersin Üniversitesi<br />
            Sağlık Bilimleri Enstitüsü<br />
            Ebelik Anabilim Dalı<br />
            Yüksek Lisans Tez Araştırması
          </p>
        </div>
      </Screen>
    </PhoneShell>
  );
}
