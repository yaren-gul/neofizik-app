import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function Certificate() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
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
          <button 
            style={styles.primaryButton} 
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certificate;