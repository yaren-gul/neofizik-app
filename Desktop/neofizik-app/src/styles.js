export const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#95B8D1', 
    fontFamily: 'sans-serif' 
  },
  
  phoneFrame: { 
    width: '375px', 
    height: '750px', 
    backgroundColor: '#FAFAF8', 
    borderRadius: '50px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
    position: 'relative', 
    overflow: 'hidden', 
    border: '8px solid #1a1a1a',
    display: 'flex',
    flexDirection: 'column' 
  },
  
  content: { 
    padding: '40px', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    textAlign: 'center',
    overflowY: 'auto' 
  },
  
  mainTitle: { fontSize: '32px', color: '#1A4D6B', fontWeight: '800', margin: '10px 0' },
  mainSubtitle: { fontSize: '14px', color: '#708896', marginBottom: '20px' },
  logoArea: { textAlign: 'center', marginBottom: '40px' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' },
  
  primaryButton: { 
    backgroundColor: '#2D81B7', 
    color: 'white', 
    border: 'none', 
    padding: '18px', 
    borderRadius: '15px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    width: '100%',
    boxSizing: 'border-box' 
  },
  
  secondaryButton: { 
    backgroundColor: '#E78641', 
    color: 'white', 
    border: 'none', 
    padding: '18px', 
    borderRadius: '15px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    width: '100%',
    boxSizing: 'border-box' 
  },
  
  sectionTitle: { fontSize: '24px', color: '#1A4D6B', marginBottom: '20px' },
  
  inputField: { 
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid #ccc', 
    width: '100%', 
    marginBottom: '10px', 
    boxSizing: 'border-box' 
  },
  
  inputGroup: { width: '100%', marginBottom: '20px' },
  textLink: { background: 'none', border: 'none', color: '#708896', marginTop: '10px', cursor: 'pointer' },
  badge: { backgroundColor: '#E1EDF6', color: '#2D81B7', padding: '5px 15px', borderRadius: '20px', marginBottom: '10px', fontWeight: '700' },
  questionText: { fontSize: '18px', color: '#333', marginBottom: '20px' },
  
  optionsGroup: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
  
  optionButton: { 
    padding: '15px', 
    backgroundColor: '#fff', 
    border: '2px solid #ddd', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: '600', 
    textAlign: 'left',
    boxSizing: 'border-box'
  },
  
  babyMapContainer: { position: 'relative', width: '100%', height: '300px', backgroundColor: '#E8EDF1', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' },
  
  regionNode: (top, left) => ({ 
    position: 'absolute', 
    top: `${top}%`, 
    left: `${left}%`, 
    backgroundColor: '#FF5252', 
    color: 'white', 
    border: 'none', 
    padding: '8px', 
    borderRadius: '10px', 
    fontSize: '10px', 
    fontWeight: '700', 
    cursor: 'pointer' 
  }),

  mapImageWrapper: { 
    display: 'flex', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginBottom: '20px',
    position: 'relative' 
  },
  
 babyImage: { 
  width: '45%', 
  height: '150px', // Yükseklik verelim ki kutular görünür olsun
  backgroundColor: '#D1E0EA', // Arka plan rengi
  borderRadius: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  color: '#555'
},

  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    padding: '20px',
    boxShadow: '0 -10px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10
  },

  videoPlaceholder: {
    width: '100%',
    height: '150px',
    backgroundColor: '#EEE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    margin: '15px 0'
  },

  closeBtn: { 
    alignSelf: 'flex-end', 
    border: 'none', 
    background: 'none', 
    fontSize: '20px', 
    cursor: 'pointer', 
    marginBottom: '10px' 
  },
progressBarContainer: {
  width: '100%',
  height: '10px',
  backgroundColor: '#e0e0e0',
  borderRadius: '5px',
  marginBottom: '20px',
  overflow: 'hidden'
},
progressBarFill: {
  height: '100%',
  backgroundColor: '#4CAF50', // Yeşil renk
  transition: 'width 0.3s ease-in-out'
},
// styles.js içine eklenecekler
resultsContainer: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  textAlign: 'center'
},
circularProgress: {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '20px 0',
  // İşte sihirli kısım: (başarı oranı * 3.6 derece)
},
// İçine bir tane de beyaz daire koyalım ki halka gibi görünsün:
innerCircle: {
  width: '120px', // Dıştan biraz küçük
  height: '120px',
  borderRadius: '50%',
  backgroundColor: '#FAFAF8', // Arka plan renginle aynı
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
},
missingTopicItem: {
  backgroundColor: '#fff',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '10px',
  width: '100%',
  textAlign: 'left',
  border: '1px solid #ddd'
}


};