import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

function PrivacyPolicy() {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!isAgreed) {
      alert("Lütfen devam etmeden önce bilgilendirmeyi onaylayın.");
      return;
    }
    navigate('/info-form');
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.mainTitle}>Gizlilik ve Veri Güvenliği</h2>
          
          {/* Bilgilendirme Kartları */}
          <div style={styles.infoCard}>
            Uygulama kapsamında elde edilen veriler katılımcı kodu kullanılarak kaydedilecektir. Adınız ve soyadınız eğitim ve değerlendirme ekranlarında yer almayacaktır.
          </div>
          <div style={styles.infoCard}>
            Toplanan veriler yalnızca bilimsel araştırma amacıyla kullanılacak, gizli tutulacak ve araştırma sonuçları bireysel kimliğiniz belirlenemeyecek şekilde raporlanacaktır.
          </div>
          <div style={styles.infoCard}>
            Araştırma kapsamında verdiğiniz yanıtlar akademik başarı notunuzu etkilemeyecektir. Araştırmaya katılım gönüllülük esasına dayanmaktadır.
          </div>

          {/* Onay Kutucuğu */}
          <div style={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              checked={isAgreed} 
              onChange={(e) => setIsAgreed(e.target.checked)} 
            />
            <span style={{ fontSize: '13px' }}>Yukarıdaki bilgilendirmeyi okudum ve anladım.</span>
          </div>

          {/* Devam Et Butonu - Sadece onaylanınca aktif görünüm veya işlev kazanır */}
          <button 
            style={{
              ...styles.primaryButton,
              opacity: isAgreed ? 1 : 0.6,
              cursor: isAgreed ? 'pointer' : 'not-allowed'
            }} 
            onClick={handleNext}
          >
            Devam Et
          </button>

          <button style={styles.textLink} onClick={() => navigate('/register')}>
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;