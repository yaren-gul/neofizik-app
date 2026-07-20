import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { styles } from '../styles';

function Results() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error("Kullanıcı verisi çekme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.phoneFrame}>
          <div style={{ textAlign: 'center', marginTop: '40%' }}>
            <h2>Sonuçlar Yükleniyor...</h2>
          </div>
        </div>
      </div>
    );
  }

  const score = userData?.resultScore || 0;

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <h2 style={styles.mainTitle}>SINAV TAMAMLANDI</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>
            Tebrikler! Değerlendirme başarıyla sonuçlandı.
          </p>
          
          <div style={{ 
            ...styles.circularProgress, 
            background: `conic-gradient(#E78641 ${score}%, #e0e0e0 0)` 
          }}>
            <div style={styles.innerCircle}>
              <p style={{ margin: 0, fontSize: '10px', color: '#708896' }}>BAŞARI ORANI</p>
              <h1 style={{ margin: 0 }}>%{score}</h1>
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '20px' }}>
            <h3 style={{ textAlign: 'left', fontSize: '16px', color: '#1A4D6B', marginBottom: '10px' }}>
              EKSİKLİK BULUNAN KONULAR
            </h3>
            <div style={styles.missingTopicItem}>Genel Görünüm ve Vital Bulgular</div>
            <div style={styles.missingTopicItem}>Burun ve Yüz Muayenesi</div>
          </div>

          <button 
            style={{ marginTop: '25px', ...styles.secondaryButton }} 
            onClick={() => navigate('/atlas-map')}
          >
            SONUÇLARI GÖSTER VE DEVAM ET
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;