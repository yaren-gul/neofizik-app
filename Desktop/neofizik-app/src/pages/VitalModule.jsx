import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';
import Header from './Header';
function VitalModule() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <Header />
          <h2 style={styles.sectionTitle}>Vital Bulguların Değerlendirilmesi</h2>
          <p style={{ textAlign: 'center', color: '#555', margin: '20px 0' }}>
            Yenidoğan vital bulguları (kalp hızı, solunum, ateş vb.) bu modülde incelenir.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate('/examination-module')}>
            Sonraki Modül: Baştan Ayağa Muayene
          </button>
          <button style={styles.textLink} onClick={() => navigate('/atlas-map')}>
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default VitalModule;