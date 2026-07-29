import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, SecondaryButton, Badge } from '../components/ui';
import { MODULES, isModuleComplete } from '../data/modulesData';
import { colors, radius, font } from '../theme';

function Medal({ score }) {
  return (
    <div style={{ position: 'relative', width: '150px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="150" height="160" viewBox="0 0 150 160">
        <polygon points="45,70 30,150 75,125 120,150 105,70" fill={colors.teal} opacity="0.9" />
        <polygon points="45,70 30,150 75,125 105,70" fill={colors.tealDark} opacity="0.25" />
        <circle cx="75" cy="65" r="58" fill={colors.card} stroke={colors.coral} strokeWidth="4" />
        <circle cx="75" cy="65" r="48" fill="none" stroke={colors.tealSoft} strokeWidth="2" strokeDasharray="3 4" />
      </svg>
      <div style={{ position: 'absolute', top: '18px', left: 0, width: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: colors.coral, fontSize: '16px', lineHeight: 1 }}>★</span>
        <span style={{ fontFamily: font.heading, fontSize: '30px', fontWeight: 800, color: colors.tealDark, lineHeight: 1.1 }}>%{score}</span>
      </div>
      <div
        style={{
          position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: colors.coral, color: '#fff', fontFamily: font.body, fontSize: '9.5px', fontWeight: 700,
          padding: '4px 10px', borderRadius: radius.pill, whiteSpace: 'nowrap',
        }}
      >
        Başarı Yüzdesi
      </div>
    </div>
  );
}

export default function FinalReport() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (snap.exists()) setUserData(snap.data());
        }
      } catch (e) {
        console.error('Kullanıcı verisi çekme hatası:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <PhoneShell>
        <Screen align="center">
          <div style={{ margin: 'auto', fontFamily: font.body, color: colors.tealDark }}>Rapor hazırlanıyor...</div>
        </Screen>
      </PhoneShell>
    );
  }

  const answerLog = JSON.parse(localStorage.getItem('finalTestAnswerLog') || '[]');
  const total = userData?.finalTestTotalQuestions ?? answerLog.length;
  const correct = userData?.finalTestCorrectCount ?? Number(localStorage.getItem('finalTestCorrectCount') || 0);
  const wrong = Math.max(total - correct, 0);
  const score = userData?.finalTestScore ?? (total > 0 ? Math.round((correct / total) * 100) : 0);
  const hasWrongAnswers = answerLog.some((a) => !a.isCorrect);

  // Konu bazlı dağılım: sorularda 'topic' alanı varsa onu kullan, yoksa 3 moduladına göre böl.
  const hasTopicField = answerLog.some((a) => a.topic);
  let breakdown = [];
  if (hasTopicField) {
    const map = {};
    answerLog.forEach((a) => {
      const t = a.topic || 'Diğer';
      if (!map[t]) map[t] = { correct: 0, total: 0 };
      map[t].total += 1;
      if (a.isCorrect) map[t].correct += 1;
    });
    breakdown = Object.entries(map).map(([title, v]) => ({ title, ...v }));
  } else if (answerLog.length > 0) {
    const chunkSize = Math.ceil(answerLog.length / MODULES.length);
    breakdown = MODULES.map((m, i) => {
      const chunk = answerLog.slice(i * chunkSize, (i + 1) * chunkSize);
      return { title: m.shortTitle, total: chunk.length, correct: chunk.filter((a) => a.isCorrect).length };
    }).filter((b) => b.total > 0);
  }

  const allModulesComplete = MODULES.every((m) => isModuleComplete(m.id));
  const scalesCompleted = localStorage.getItem('scalesCompleted') === 'true';

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={false} />

        <h1 style={{ fontFamily: font.heading, fontSize: '19px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '4px 0 6px 0' }}>
          Sonuç Raporunuz
        </h1>

        <Medal score={score} />

        <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.tealDark, fontWeight: 600, textAlign: 'center', margin: '8px 0 18px 0' }}>
          NeoFizik Eğitimini Tamamladınız
        </p>

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '8px' }}>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#E9F7F1', color: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>✓</span>
            <div>
              <div style={{ fontFamily: font.heading, fontSize: '18px', fontWeight: 700, color: colors.tealDark, lineHeight: 1 }}>{correct}</div>
              <div style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted }}>Doğru</div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#FCEAE7', color: colors.error, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>✕</span>
            <div>
              <div style={{ fontFamily: font.heading, fontSize: '18px', fontWeight: 700, color: colors.tealDark, lineHeight: 1 }}>{wrong}</div>
              <div style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.textMuted }}>Yanlış</div>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, textAlign: 'center', margin: '0 0 16px 0' }}>
          {total}/{total} Soru Yanıtlandı
        </p>

        {breakdown.length > 0 && (
          <div style={{ width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '10px' }}>
            {breakdown.map((b, i) => (
              <div key={i} style={{ marginBottom: i < breakdown.length - 1 ? '12px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontFamily: font.body, fontSize: '12px', color: colors.text }}>{b.title}</span>
                  <span style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, fontWeight: 600 }}>{b.correct}/{b.total}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: colors.tealSoft, borderRadius: radius.pill, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(b.correct / b.total) * 100}%`, backgroundColor: colors.teal, borderRadius: radius.pill }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '18px' }}>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '15px' }}>{allModulesComplete ? '🏅' : '⏳'}</span>
            <span style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.tealDark, fontWeight: 600, textAlign: 'center' }}>
              {allModulesComplete ? 'Tüm Modüller Tamamlandı' : 'Modüller Devam Ediyor'}
            </span>
          </div>
          <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '15px' }}>{scalesCompleted ? '🛡️' : '⏳'}</span>
            <span style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.tealDark, fontWeight: 600, textAlign: 'center' }}>
              {scalesCompleted ? 'Değerlendirmeler Tamamlandı' : 'Değerlendirmeler Devam Ediyor'}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SecondaryButton
            onClick={() => navigate('/wrong-answers')}
            disabled={!hasWrongAnswers}
            style={!hasWrongAnswers ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          >
            Yanlışlarımı İncele
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate('/thank-you')}>Raporu Tamamla</PrimaryButton>
        </div>
        <p style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint, textAlign: 'center', marginTop: '8px' }}>
          Sonuçlar katılımcının yanıtlarına göre otomatik oluşturulur.
        </p>
      </Screen>
    </PhoneShell>
  );
}
