import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function ExaminationModule() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Baştan Ayağa Fizik Muayene</h2>
          <p style={{ textAlign: 'center', color: '#555', margin: '20px 0' }}>
            Fontanel değerlendirmesi, cilt bulguları ve sistem muayeneleri bu aşamada yer alır.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate('/reflexes-module')}>
            Sonraki Modül: Yenidoğan Refleksleri
          </button>
          <button style={styles.textLink} onClick={() => navigate('/vital-module')}>
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExaminationModule;