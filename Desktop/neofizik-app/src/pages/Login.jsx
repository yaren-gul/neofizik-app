import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { styles } from '../styles';

function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isTestCompleted) {
          navigate('/results');
        } else {
          navigate('/info-form');
        }
      } else {
        navigate('/info-form');
      }
    } catch (error) {
      alert("Giriş başarısız: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Giriş Yap</h2>
          <input 
            style={styles.inputField} 
            placeholder="Email" 
            onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
          />
          <input 
            style={styles.inputField} 
            type="password" 
            placeholder="Şifre" 
            onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
          />
          <button style={styles.primaryButton} onClick={handleLogin}>Giriş Yap</button>
          <button style={styles.textLink} onClick={() => navigate('/')}>Geri Dön</button>
        </div>
      </div>
    </div>
  );
}

export default Login;