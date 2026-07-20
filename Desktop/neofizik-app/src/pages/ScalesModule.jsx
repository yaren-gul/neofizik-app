import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function ScalesModule() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Değerlendirme Ölçekleri</h2>
          <p style={{ textAlign: 'center', color: '#555', margin: '20px 0' }}>
            Klinik beceri, motivasyon ve kullanılabilirlik anketleri.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate('/certificate')}>
            Sertifikayı Görüntüle
          </button>
          <button style={styles.textLink} onClick={() => navigate('/reflexes-module')}>
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScalesModule;