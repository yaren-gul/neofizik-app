import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';
import Header from './Header';

function Certificate() {
  const navigate = useNavigate();

  // 1. Oturumu bozmadan bir önceki sayfaya / ana sayfaya dön
  const handleGoBack = () => {
    navigate(-1); // veya navigate('/');
  };

  // 2. Oturumu tamamen kapat ve çıkış yap
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <Header />
          
          <h2 style={styles.mainTitle}>Tebrikler!</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '15px' }}>
            Eğitim sürecini başarıyla tamamladınız.
          </p>
          <div style={{ ...styles.infoCard, textAlign: 'center', margin: '15px 0' }}>
            <h3 style={{ color: '#1A4D6B', marginBottom: '8px' }}>Katılım Belgesi</h3>
            <p style={{ fontSize: '13px', color: '#555' }}>
              Bu belge NeoFizik eğitimini başarıyla tamamlayan katılımcı adına düzenlenmiştir.
            </p>
          </div>

          {/* Butonların yer aldığı alan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {/* Geri Dön Tuşu (Oturum kapanmaz) */}
            <button 
              style={styles.primaryButton} 
              onClick={handleGoBack}
            >
              Geri Dön
            </button>

            {/* Çıkış Yap Tuşu (Oturum kapanır, login'e atar) */}
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;