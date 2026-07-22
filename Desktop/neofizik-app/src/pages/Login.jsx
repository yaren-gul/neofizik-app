import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Kayıt ol ekranındaki stilleri buraya da import ediyoruz
import { styles } from '../styles'; 

export default function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      localStorage.setItem('userLoggedIn', 'true');
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Eğer test daha önce tamamlandıysa doğrudan sonuçlar sayfasına atıyoruz
        if (userData.isTestCompleted === true) {
          navigate('/results', { replace: true });
        } else {
          // Henüz çözmediyse onboarding adımlarından devam etsin
          navigate('/onboarding', { replace: true });
        }
      } else {
        // Belge yoksa ilk kez kayıt olmuş gibi oluşturup onboarding'e atalım
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
    }
  };

  return (
    // Dış konteyner (arka plan)
    <div style={styles.container}>
      {/* Kayıt ol ekranındaki aynı telefon çerçevesi */}
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          
          {/* Başlık alanı */}
          <div style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: '#2c3e50', fontWeight: 'bold' }}>NeoFizik</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Devam etmek için giriş yapın</p>
          </div>

          {/* Form alanı - inputlar ve butonlar */}
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* E-posta Inputu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginLeft: '5px' }}>E-posta</label>
              <input 
                type="email" 
                placeholder="ornek@mail.com" 
                value={loginData.email} 
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} 
                style={styles.inputField} // Kayıt ol'daki input stili
                required
              />
            </div>

            {/* Şifre Inputu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginLeft: '5px' }}>Şifre</label>
              <input 
                type="password" 
                placeholder="********" 
                value={loginData.password} 
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
                style={styles.inputField} // Kayıt ol'daki input stili
                required
              />
            </div>

            {/* Giriş Yap Butonu (kayıt ol'daki secondaryButton rengini kullanıyoruz) */}
            <button type="submit" style={styles.secondaryButton}>Giriş Yap</button>
          </form>

          {/* Alt linkler */}
          <div style={{ width: '100%', textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '25px' }}>
            Hesabın yok mu? <span onClick={() => navigate('/register')} style={{ color: '#e67e22', fontWeight: '600', cursor: 'pointer' }}>Kayıt Ol</span>
          </div>

          {/* Ana sayfaya dönüş (Kayıt ol ekranındaki Geri Dön linki) */}
          <button style={styles.textLink} onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    </div>
  );
}