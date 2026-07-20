import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
            <span style={{ fontSize: '80px' }}>👶</span>
            <h1 style={styles.mainTitle}>NEO FİZİK</h1>
          </div>
          <div style={styles.btnGroup}>
            <button style={styles.primaryButton} onClick={() => navigate('/login')}>GİRİŞ YAP</button>
            <button style={styles.secondaryButton} onClick={() => navigate('/register')}>KAYIT OL</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;