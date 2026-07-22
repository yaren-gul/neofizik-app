import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';
import Header from './Header';
function InfoForm() {
  const navigate = useNavigate();

  // Sayfa yüklenir yüklenmez test verilerini sıfırlayalım (güvenli başlangıç)
  useEffect(() => {
    localStorage.removeItem('correctCount');
    localStorage.removeItem('questionIndex');
    localStorage.removeItem('isTestCompleted');
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <Header />
          <h2 style={styles.sectionTitle}>Tanıtıcı Bilgi Formu</h2>
          
          <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', margin: '20px 0' }}>
            Ön teste başlamadan önce lütfen bu alanı tamamlayın.
          </p>

          {/* Buraya ileride form inputları eklenebilir */}

          <button 
            style={styles.primaryButton} 
            onClick={() => navigate('/pre-test')}
          >
            ÖN TESTE BAŞLA
          </button>

          <button 
            style={styles.textLink} 
            onClick={() => navigate('/onboarding')}
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoForm;