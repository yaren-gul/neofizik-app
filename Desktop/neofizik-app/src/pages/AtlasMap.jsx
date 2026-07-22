import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { styles } from '../styles';
import Header from './Header';

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
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={{ ...styles.content, position: 'relative' }}>
          <Header />
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

         
      
        </div>
      </div>
    </div>
  );
}

export default AtlasMap;