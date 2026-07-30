import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, SectionTitle, PrimaryButton, Badge } from '../components/ui';
import { colors, radius, font } from '../theme';
import { userKey } from '../utils/session';

export default function WrongAnswers() {
  const navigate = useNavigate();
  const answerLog = JSON.parse(localStorage.getItem(userKey('finalTestAnswerLog')) || '[]');
  const wrongOnes = answerLog.filter((a) => !a.isCorrect);

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <SectionTitle style={{ marginBottom: '6px' }}>Yanlışlarımı İncele</SectionTitle>
        <div style={{ marginBottom: '16px' }}>
          <Badge tone="coral">{wrongOnes.length} Yanlış Soru</Badge>
        </div>

        <div style={{ width: '100%' }}>
          {wrongOnes.length === 0 ? (
            <p style={{ fontFamily: font.body, fontSize: '13.5px', color: colors.textMuted, textAlign: 'center' }}>
              Harika! Bu testte hiç yanlışınız yok.
            </p>
          ) : (
            wrongOnes.map((a, i) => (
              <div
                key={i}
                style={{
                  width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.border}`,
                  borderRadius: radius.md, padding: '16px', marginBottom: '12px', boxSizing: 'border-box', textAlign: 'left',
                }}
              >
                <p style={{ fontFamily: font.body, fontSize: '13.5px', fontWeight: 600, color: colors.tealDark, margin: '0 0 10px 0', lineHeight: 1.5 }}>
                  {i + 1}. {a.question}
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>❌</span>
                  <span style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.error }}>
                    Cevabınız: {a.selected}) {a.selectedText}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>✅</span>
                  <span style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.success }}>
                    Doğru cevap: {a.correct}) {a.correctText}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton onClick={() => navigate(-1)} icon={false}>Geri Dön</PrimaryButton>
      </Screen>
    </PhoneShell>
  );
}
