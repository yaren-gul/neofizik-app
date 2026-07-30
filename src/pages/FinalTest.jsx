import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, ProgressBar, Badge, OptionButton, PrimaryButton, SecondaryButton, Card, InlineNote } from '../components/ui';
import { colors, font } from '../theme';
import { userKey } from '../utils/session';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function FinalTest() {
  const [questions, setQuestions] = useState([]);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'test'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isCompleted = localStorage.getItem(userKey('isFinalTestCompleted')) === 'true';
    if (isCompleted) navigate('/scales-module');
  }, [navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        // Son test, ön testle aynı soru havuzunu (aynı arayüz ve ilerleme yapısında) kullanır.
        const querySnapshot = await getDocs(collection(db, "questions"));
        setQuestions(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Soru çekme hatası:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const buildLog = () => {
    return questions.map((q, i) => {
      const selectedIdx = answers[i];
      const selectedHarf = LETTERS[selectedIdx];
      const dogruCevap = String(q.correct_option).trim();
      const optionValues = Object.values(q.options);
      return {
        question: q.question_text,
        topic: q.topic || null,
        options: optionValues,
        selected: selectedHarf,
        selectedText: optionValues[selectedIdx],
        correct: dogruCevap,
        correctText: optionValues[LETTERS.indexOf(dogruCevap)],
        isCorrect: selectedHarf === dogruCevap,
      };
    });
  };

  const finishTest = async () => {
    const finalLog = buildLog();
    const finalScoreCount = finalLog.filter((a) => a.isCorrect).length;
    const total = questions.length;
    const calculatedScore = Math.round((finalScoreCount / total) * 100);

    localStorage.setItem(userKey('isFinalTestCompleted'), 'true');
    localStorage.setItem(userKey('finalTestCorrectCount'), finalScoreCount);
    localStorage.setItem(userKey('finalTestAnswerLog'), JSON.stringify(finalLog));

    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          isFinalTestCompleted: true,
          finalTestScore: calculatedScore,
          finalTestCorrectCount: finalScoreCount,
          finalTestTotalQuestions: total,
          finalTestAnswerLog: finalLog,
        });
      }
      navigate('/scales-module');
    } catch (error) {
      console.error("Firebase kayıt hatası:", error);
      alert("Bir hata oluştu, lütfen tekrar dene.");
    }
  };

  const handleSelect = (idx) => {
    setAnswers({ ...answers, [currentQuestionIndex]: idx });
    setShowError(false);
  };

  const handleNext = async () => {
    if (answers[currentQuestionIndex] === undefined) {
      setShowError(true);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
      setShowError(false);
    } else {
      await finishTest();
    }
  };

  const handlePrev = () => {
    setShowError(false);
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1);
  };

  if (isLoading) {
    return (
      <PhoneShell>
        <Screen align="center">
          <div style={{ margin: 'auto', textAlign: 'center', fontFamily: font.body, color: colors.tealDark }}>
            Sorular yükleniyor...
          </div>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- Giriş / bilgilendirme ekranı ---------- */
  if (phase === 'intro') {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => navigate('/education-modules')} />

          <h1 style={{ fontFamily: font.heading, fontSize: '24px', fontWeight: 700, color: colors.tealDark, margin: '4px 0 18px 0' }}>
            Son Test
          </h1>

          <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '18px' }}>
            📋
          </div>

          <Card>
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.text, lineHeight: 1.65, margin: 0 }}>
              Bu bölümde yenidoğanın fizik muayenesine ilişkin bilgi soruları yeniden yer almaktadır.<br /><br />
              Her soruyu dikkatlice okuyarak size en uygun olduğunu düşündüğünüz seçeneği işaretleyiniz. Lütfen hiçbir soruyu cevapsız bırakmayınız.
            </p>
          </Card>

          <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' }}>
            <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark }}>{questions.length}</div>
              <div style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted }}>Soru</div>
            </div>
            <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: font.heading, fontSize: '13px', fontWeight: 700, color: colors.tealDark, marginTop: '3px' }}>Çoktan</div>
              <div style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted }}>Seçmeli</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '14px' }}>
            <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: font.heading, fontSize: '16px', fontWeight: 700, color: colors.tealDark }}>15–20 dk</div>
              <div style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted }}>Tahmini Süre</div>
            </div>
            <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: font.heading, fontSize: '11.5px', fontWeight: 700, color: colors.tealDark, marginTop: '1px', lineHeight: 1.3 }}>Doğru–Yanlış</div>
              <div style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textMuted }}>Test Sırasında Gösterilmez</div>
            </div>
          </div>

          <InlineNote tone="error">
            Son test soruları, ön test ile aynı arayüz ve ilerleme yapısında gösterilecektir.
          </InlineNote>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={() => setPhase('test')}>Son Teste Başla</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- Soru ekranı ---------- */
  const q = questions[currentQuestionIndex];
  const selectedIdx = answers[currentQuestionIndex];

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar badge="Son Test" back={false} />

        {questions && questions.length > 0 ? (
          <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Badge tone="coral">Soru {currentQuestionIndex + 1}/{questions.length}</Badge>
            </div>
            <ProgressBar value={currentQuestionIndex + 1} total={questions.length} />

            <div
              style={{
                width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`,
                borderRadius: '16px', padding: '18px', marginBottom: '16px', boxSizing: 'border-box',
              }}
            >
              <p style={{ fontFamily: font.body, fontSize: '14.5px', fontWeight: 600, color: colors.tealDark, lineHeight: 1.55, margin: 0, textAlign: 'left' }}>
                {currentQuestionIndex + 1}. {q.question_text}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {Object.values(q.options).map((option, idx) => (
                <OptionButton key={idx} selected={selectedIdx === idx} onClick={() => handleSelect(idx)}>
                  {LETTERS[idx]}) {option}
                </OptionButton>
              ))}
            </div>

            {showError && <InlineNote tone="error">Lütfen bu soruyu yanıtlayınız.</InlineNote>}

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '18px' }}>
              <SecondaryButton onClick={handlePrev} style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }} disabled={currentQuestionIndex === 0}>
                Önceki Soru
              </SecondaryButton>
              <PrimaryButton onClick={handleNext} icon={false}>
                {currentQuestionIndex === questions.length - 1 ? 'Son Testi Tamamla' : 'Sonraki Soru'}
              </PrimaryButton>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', fontFamily: font.body, color: colors.textMuted }}>Soru bulunamadı.</p>
        )}
      </Screen>
    </PhoneShell>
  );
}
