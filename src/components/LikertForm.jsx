import React, { useState } from 'react';
import { Card, PrimaryButton, InlineNote } from './ui';
import { colors, font } from '../theme';
import { LIKERT_LABELS } from '../data/scalesData';

// Tek bir ölçeği (madde listesi) 5'li Likert olarak gösterip cevapları toplar.
// `onComplete(answers)` — answers: madde index'ine göre 1-5 dizisi.
export default function LikertForm({ scale, onComplete, submitLabel = 'Ölçeği Tamamla', saving = false }) {
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);

  const allAnswered = scale.items.every((_, i) => answers[i] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) {
      setShowError(true);
      return;
    }
    onComplete(scale.items.map((_, i) => answers[i]));
  };

  return (
    <>
      {scale.intro && (
        <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.textMuted, lineHeight: 1.55, margin: '0 0 12px 0' }}>
          {scale.intro}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
        <span style={{ fontFamily: font.body, fontSize: '10px', color: colors.textFaint, maxWidth: '45%' }}>1 = {LIKERT_LABELS[0]}</span>
        <span style={{ fontFamily: font.body, fontSize: '10px', color: colors.textFaint, maxWidth: '45%', textAlign: 'right' }}>5 = {LIKERT_LABELS[4]}</span>
      </div>

      {scale.items.map((item, i) => (
        <Card key={i} style={{ padding: '12px 14px', marginBottom: '8px' }}>
          <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.5, margin: '0 0 10px 0' }}>
            {i + 1}. {item}
          </p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = answers[i] === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setAnswers({ ...answers, [i]: n }); setShowError(false); }}
                  style={{
                    flex: 1, height: '34px', borderRadius: '8px', fontFamily: font.heading, fontWeight: 700,
                    fontSize: '13px', cursor: 'pointer',
                    border: selected ? 'none' : `1.5px solid ${colors.tealBorder}`,
                    backgroundColor: selected ? colors.teal : colors.card,
                    color: selected ? '#fff' : colors.tealDark,
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </Card>
      ))}

      {showError && <InlineNote tone="error">Lütfen tüm maddeleri yanıtlayınız.</InlineNote>}

      <PrimaryButton onClick={handleSubmit} disabled={saving} icon={false}>
        {saving ? 'Kaydediliyor...' : submitLabel}
      </PrimaryButton>
    </>
  );
}
