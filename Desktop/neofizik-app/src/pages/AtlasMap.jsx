import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { styles } from '../styles';

function AtlasMap() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  const fetchAtlasDetails = async (regionId) => {
    try {
      const docRef = doc(db, "atlas_info", regionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedRegion(docSnap.data());
      } else {
        alert("Detay henüz eklenmedi.");
      }
    } catch (e) {
      console.error("Detay hatası:", e);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={{ ...styles.content, position: 'relative' }}>
          <h2 style={styles.sectionTitle}>Muayene Atlası</h2>
          
          <div style={styles.mapImageWrapper}>
            <div style={styles.babyImage}>ÖN</div>
            <div style={styles.babyImage}>ARKA</div>
            <button style={styles.regionNode(40, 15)} onClick={() => fetchAtlasDetails("1")}>1</button>
            <button style={styles.regionNode(40, 65)} onClick={() => fetchAtlasDetails("3")}>3</button>
          </div>

          {selectedRegion && (
            <div style={styles.infoPanel}>
              <button style={styles.closeBtn} onClick={() => setSelectedRegion(null)}>X</button>
              <h3>{selectedRegion.title}</h3>
              <p>{selectedRegion.description}</p>
              <button style={styles.primaryButton} onClick={() => setSelectedRegion(null)}>Anladım</button>
            </div>
          )}

          <button 
            style={{ marginTop: '20px', ...styles.primaryButton }} 
            onClick={() => navigate('/vital-module')}
          >
            Eğitim Modüllerine Başla
          </button>

          <button 
            style={{ marginTop: '15px', ...styles.textLink, textAlign: 'center', width: '100%' }} 
            onClick={() => navigate('/results')}
          >
            Geri Dön
          </button>

          <button 
            style={{
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#FF6B6B', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              width: '100%',
              cursor: 'pointer'
            }} 
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}

export default AtlasMap;