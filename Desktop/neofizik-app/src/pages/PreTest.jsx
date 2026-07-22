import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { styles } from '../styles';
import Header from './Header';
function PreTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Test daha önceden tamamlandı mı kontrolü
  useEffect(() => {
    const isCompleted = localStorage.getItem('isTestCompleted') === 'true';
    if (isCompleted) {
      navigate('/results');
    }
  }, [navigate]);

  // Firestore'dan soruları çekme
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(data);
      } catch (e) {
        console.error("Soru çekme hatası:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const finishTest = async (finalScoreCount, totalQuestions) => {
    const calculatedScore = Math.round((finalScoreCount / totalQuestions) * 100);
    localStorage.setItem('isTestCompleted', 'true');
    localStorage.setItem('correctCount', finalScoreCount);

    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          isTestCompleted: true,
          resultScore: calculatedScore
        });
      }
      navigate('/results');
    } catch (error) {
      console.error("Firebase kayıt hatası:", error);
      alert("Bir hata oluştu, lütfen tekrar dene.");
    }
  };

  const handleOptionClick = async (idx) => {
    const harfler = ['A', 'B', 'C', 'D'];
    const secilenHarf = harfler[idx];
    const dogruCevap = String(questions[currentQuestionIndex].correct_option).trim();

    let updatedScore = correctCount;
    if (secilenHarf === dogruCevap) {
      updatedScore += 1;
      setCorrectCount(updatedScore);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await finishTest(updatedScore, questions.length);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.phoneFrame}>
          <div style={{ textAlign: 'center', marginTop: '40%' }}>
            <h2>Sorular Yükleniyor...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <Header />
          <h2 style={styles.sectionTitle}>Ön Test</h2>
          
          {questions && questions.length > 0 ? (
            <>
              <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBarFill, width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
              </div>
              <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '20px', color: '#555' }}>
                {currentQuestionIndex + 1} / {questions.length} Soru
              </p>
              
              <p style={styles.questionText}>
                {questions[currentQuestionIndex].question_text}
              </p>
              
              <div style={styles.optionsGroup}>
                {Object.values(questions[currentQuestionIndex].options).map((option, idx) => (
                  <button 
                    key={idx} 
                    style={styles.optionButton} 
                    onClick={() => handleOptionClick(idx)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center' }}>Soru bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreTest;