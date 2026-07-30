import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setActiveUser } from '../utils/session';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { PrimaryButton, FieldInput, TextLink, SectionTitle } from '../components/ui';
import Logo from '../components/Logo';
import { colors, font } from '../theme';

function Register() {
  const [regData, setRegData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) return alert("Hata: Şifreler uyuşmuyor!");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: regData.email,
        name: regData.name || "İsimsiz",
        isTestCompleted: false,
        resultScore: 0
      });
      setActiveUser(userCredential.user.uid);
      localStorage.setItem('userLoggedIn', 'true');
      navigate('/login');
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneShell>
      <Screen align="center">
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <Logo size={24} />
        </div>
        <SectionTitle>Kayıt Ol</SectionTitle>
        <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', margin: '-8px 0 20px 0' }}>
          Eğitime katılmak için bilgilerinizi girin.
        </p>

        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <FieldInput icon="🧑" placeholder="Ad Soyad" onChange={(e) => setRegData({ ...regData, name: e.target.value })} />
          <FieldInput icon="✉️" type="email" placeholder="E-posta" onChange={(e) => setRegData({ ...regData, email: e.target.value })} required />
          <FieldInput icon="🔒" type="password" placeholder="Şifre" onChange={(e) => setRegData({ ...regData, password: e.target.value })} required />
          <FieldInput icon="🔒" type="password" placeholder="Şifre Tekrar" onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })} required />
          <PrimaryButton type="submit" disabled={loading} icon={false}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </PrimaryButton>
        </form>

        <TextLink onClick={() => navigate('/')}>Geri Dön</TextLink>
      </Screen>
    </PhoneShell>
  );
}

export default Register;
