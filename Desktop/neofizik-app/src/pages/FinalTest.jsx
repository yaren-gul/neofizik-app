import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { styles } from '../styles';

export default function FinalTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Yenidoğan refleksleri ile ilgili örnek sorular
  const questions = [
    {
      id: 1,
      question: "Bebek ani bir ses veya hareketle irkildiğinde kollarını yana açıp tekrar kendine doğru kapaması hangi refleksin göstergesidir?",
      options: [
        "A) Arama Refleksi",
        "B) Moro Refleksi",
        "C) Babinski Refleksi",
        "D) Yakalama Refleksi"
      ],
      correct: 1 // B şıkkı (0 tabanlı index)
    },
    {
      id: 2,
      question: "Bebeğin ayağının tabanına topuktan uca doğru sertce bir cisim süründüğünde parmaklarını yelpaze gibi açması hangi refleks olarak adlandırılır?",
      options: [
        "A) Moro Refleksi",
        "B) Emme Refleksi",
        "C) Babinski Refleksi",
        "D) Tonik Boyun Refleksi"
      ],
      correct: 2 // C şıkkı
    },
    {
      id: 3,
      question: "Bebeğin yanağına veya dudak kenarına dokunulduğunda başını o yöne çevirip emme hareketi yapması hangi refleksin adıdır?",
      options: [
        "A) Arama Refleksi",
        "B) Yakalama Refleksi",
        "C) Adımlama Refleksi",
        "D) Moro Refleksi"
      ],
      correct: 0 // A şıkkı
    }
  ];

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test bitti, puanı hesapla
      let correctCount = 0;
      questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.correct) {
          correctCount++;
        }
      });
      const calculatedScore = (correctCount / questions.length) * 100;
      setScore(calculatedScore);
      setIsCompleted(true);

      // İsteğe bağlı olarak Firestore'a ara test sonucunu kaydedebiliriz
      try {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, {
            finalTestScore: calculatedScore,
            isFinalTestCompleted: true
          });
        }
      } catch (error) {
        console.error("Test sonucu kaydedilemedi:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px', width: '100%' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#2c3e50', fontWeight: 'bold' }}>Yenidoğan Refleksleri Değerlendirmesi</h1>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Modül Sonu Ara Testi ({currentQuestion + 1}/{questions.length})</p>
          </div>

          {!isCompleted ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#333', lineHeight: '1.5' }}>
                {questions[currentQuestion].question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #e67e22' : '1px solid #ddd',
                        backgroundColor: isSelected ? '#fdf3e7' : '#fff',
                        color: '#333',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: isSelected ? '600' : '400',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                style={{
                  ...styles.secondaryButton,
                  opacity: selectedAnswers[currentQuestion] === undefined ? 0.6 : 1,
                  marginTop: '10px',
                  cursor: selectedAnswers[currentQuestion] === undefined ? 'not-allowed' : 'pointer'
                }}
              >
                {currentQuestion === questions.length - 1 ? 'Testi Tamamla' : 'Sonraki Soru'}
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>Testi Başarıyla Tamamladın! 🎉</div>
              <div style={{ fontSize: '15px', color: '#555' }}>
                Başarı Puanın: <span style={{ fontWeight: 'bold', color: '#e67e22' }}>{Math.round(score)}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#666' }}>Şimdi Değerlendirme Ölçekleri modülüne geçebilirsin.</p>
              
              <button 
                onClick={() => navigate('/scales-module')} 
                style={styles.secondaryButton}
              >
                Değerlendirme Ölçeklerine Geç
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}