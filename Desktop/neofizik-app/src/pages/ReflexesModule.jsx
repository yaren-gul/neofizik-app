import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function ReflexesModule() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Yenidoğan Refleksleri</h2>
          <p style={{ textAlign: 'center', color: '#555', margin: '20px 0' }}>
            Moro, yakalama (grasp), emme ve adım atma gibi ilkel reflekslerin değerlendirilmesi.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate('/scales-module')}>
            Ölçeklere Geç
          </button>
          <button style={styles.textLink} onClick={() => navigate('/examination-module')}>
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReflexesModule;