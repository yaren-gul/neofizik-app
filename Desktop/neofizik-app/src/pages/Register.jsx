import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { styles } from '../styles';

function Register() {
  const [regData, setRegData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) return alert("Hata: Şifreler uyuşmuyor!");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: regData.email,
        name: regData.name || "İsimsiz",
        isTestCompleted: false,
        resultScore: 0
      });
      alert("Kayıt Başarılı!");
      navigate('/privacy-policy');
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Kayıt Ol</h2>
          <input 
            style={styles.inputField} 
            placeholder="Ad Soyad" 
            onChange={(e) => setRegData({...regData, name: e.target.value})} 
          />
          <input 
            style={styles.inputField} 
            placeholder="Email" 
            onChange={(e) => setRegData({...regData, email: e.target.value})} 
          />
          <input 
            style={styles.inputField} 
            type="password" 
            placeholder="Şifre" 
            onChange={(e) => setRegData({...regData, password: e.target.value})} 
          />
          <input 
            style={styles.inputField} 
            type="password" 
            placeholder="Şifre Tekrar" 
            onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})} 
          />
          <button style={styles.secondaryButton} onClick={handleRegister}>Kayıt Ol</button>
          <button style={styles.textLink} onClick={() => navigate('/')}>Geri Dön</button>
        </div>
      </div>
    </div>
  );
}

export default Register;