import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, SecondaryButton, Badge, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import { getModule, getTopic, getTopicProgress, setTopicProgress } from '../data/modulesData';
import { colors, radius, font } from '../theme';

// Gerçek bilgi kartı içerikleri (bölge açıklaması, normal/anormal bulgular vb.) henüz netleşmedi.
// Aşağıdaki kartlar akışı doğru şekilde göstermek için taslak/placeholder içeriktir.
const CARD_TEMPLATE = [
  { title: 'Bölge Açıklaması', icon: '📍', text: 'Bu bölümde ilgili muayene bölgesinin anatomik sınırları ve önemi açıklanacaktır.' },
  { title: 'Muayene Basamakları', icon: '📋', text: 'Muayenenin hangi sırayla ve nasıl yapılması gerektiği adım adım anlatılacaktır.' },
  { title: 'Normal Bulgular', icon: '💚', text: 'İlgili muayene bölgesinde beklenen normal bulgular açıklanacaktır.' },
  { title: 'Anormal Bulgular', icon: '⚠️', text: 'Dikkat edilmesi gereken anormal bulgular ve uyarı işaretleri açıklanacaktır.' },
];

export default function TopicDetail() {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const mod = getModule(moduleId);
  const topic = getTopic(moduleId, topicId);

  const [phase, setPhase] = useState('entry');
  const [cardIndex, setCardIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // React Router, sadece URL parametresi (topicId) değiştiğinde bileşeni yeniden mount ETMEZ.
  // Bu yüzden "Sonraki Bölüme Geç" ile başka bir konuya geçildiğinde state'i burada elle sıfırlıyoruz,
  // aksi halde bir önceki konudan kalan "Bölüm Tamamlandı" ekranı yeni konuda da görünmeye devam eder.
  useEffect(() => {
    const p = getTopicProgress(moduleId, topicId);
    setProgress(p);
    setPhase(p >= 100 ? 'done' : 'entry');
    setCardIndex(0);
  }, [moduleId, topicId]);

  if (!mod || !topic) return null;

  const goNextModuleStep = () => {
    const nextIdx = mod.topics.findIndex((t) => t.id === topicId) + 1;
    if (nextIdx < mod.topics.length) {
      navigate(`/module/${moduleId}/${mod.topics[nextIdx].id}`);
    } else {
      navigate('/education-modules');
    }
  };

  const finishCards = () => {
    setTopicProgress(moduleId, topicId, 50);
    setProgress(50);
    setPhase('entry');
  };

  const finishVideo = () => {
    setTopicProgress(moduleId, topicId, 100);
    setProgress(100);
    setPhase('done');
  };

  /* ---------- Bilgi kartları alt-akışı ---------- */
  if (phase === 'cards') {
    const card = CARD_TEMPLATE[cardIndex];
    const isLast = cardIndex === CARD_TEMPLATE.length - 1;
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => setPhase('entry')} />
          <div style={{ marginBottom: '14px' }}><Badge>Bilgi Kartı {cardIndex + 1}/{CARD_TEMPLATE.length}</Badge></div>
          <h1 style={{ fontFamily: font.heading, fontSize: '19px', fontWeight: 700, color: colors.tealDark, margin: '0 0 18px 0', textAlign: 'center' }}>
            {topic.title}
          </h1>

          <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '18px' }}>
            {card.icon}
          </div>

          <Card>
            <h3 style={{ fontFamily: font.heading, fontSize: '14.5px', fontWeight: 700, color: colors.tealDark, margin: '0 0 8px 0' }}>{card.title}</h3>
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.text, lineHeight: 1.65, margin: 0 }}>{card.text}</p>
          </Card>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <SecondaryButton onClick={() => setCardIndex((i) => Math.max(0, i - 1))} style={{ opacity: cardIndex === 0 ? 0.5 : 1 }} disabled={cardIndex === 0}>
              Önceki
            </SecondaryButton>
            <PrimaryButton onClick={() => (isLast ? finishCards() : setCardIndex((i) => i + 1))} icon={false}>
              {isLast ? 'Kartları Tamamla' : 'Sonraki'}
            </PrimaryButton>
          </div>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- Uygulama videosu alt-akışı ---------- */
  if (phase === 'video') {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => setPhase('entry')} />
          <h1 style={{ fontFamily: font.heading, fontSize: '18px', fontWeight: 700, color: colors.tealDark, margin: '0 0 4px 0', textAlign: 'center' }}>
            {topic.title}
          </h1>
          <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.textMuted, margin: '0 0 18px 0' }}>Uygulama Videosu</p>

          <div style={{ width: '100%', aspectRatio: '16/10', backgroundColor: '#0E4550', borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '40px', color: '#fff' }}>▶</span>
          </div>

          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.text, textAlign: 'center', lineHeight: 1.6, margin: '0 0 6px 0' }}>
            {topic.title.replace(' Muayenesi', '')} muayenesinin uygulanışını dikkatlice izleyiniz.
          </p>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={finishVideo} icon={false}>Bölümü Tamamla</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- Bölüm tamamlandı ---------- */
  if (phase === 'done') {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={() => navigate(`/module/${moduleId}`)} />
          <div style={{ flex: 1 }} />
          <ProgressRing percent={100} size={130} />
          <h1 style={{ fontFamily: font.heading, fontSize: '19px', fontWeight: 700, color: colors.tealDark, margin: '18px 0 8px 0', textAlign: 'center' }}>
            Bölüm Tamamlandı
          </h1>
          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 18px 0' }}>
            {topic.title} bölümündeki bilgi kartlarını, görselleri ve uygulama videosunu tamamladınız.
          </p>
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '12px 16px', marginBottom: '8px' }}>
              <span style={{ color: colors.teal }}>✓</span>
              <span style={{ fontFamily: font.body, fontSize: '13px', color: colors.tealDark, fontWeight: 600 }}>Bilgi Kartları: Tamamlandı</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '12px 16px' }}>
              <span style={{ color: colors.teal }}>✓</span>
              <span style={{ fontFamily: font.body, fontSize: '13px', color: colors.tealDark, fontWeight: 600 }}>Uygulama Videosu: Tamamlandı</span>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <PrimaryButton onClick={goNextModuleStep}>Sonraki Bölüme Geç</PrimaryButton>
          <SecondaryButton onClick={() => { setCardIndex(0); setPhase('cards'); }} style={{ marginTop: '10px' }}>
            Bilgi Kartlarını Tekrar İncele
          </SecondaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  /* ---------- Konu giriş ekranı (varsayılan) ---------- */
  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={() => navigate(`/module/${moduleId}`)} />

        <h1 style={{ fontFamily: font.heading, fontSize: '19px', fontWeight: 700, color: colors.tealDark, margin: '0 0 16px 0', textAlign: 'center' }}>
          {topic.title}
        </h1>

        <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', marginBottom: '18px' }}>
          {topic.icon || '👶'}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <ProgressRing percent={progress} size={100} label={topic.title.toUpperCase()} />
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1.5px solid ${colors.coral}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '10px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: colors.coral, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>1</span>
            <span style={{ flex: 1, fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark }}>Bilgi Kartları</span>
            <button onClick={() => { setCardIndex(0); setPhase('cards'); }} style={{ background: 'none', border: 'none', color: colors.coral, fontSize: '16px', cursor: 'pointer' }}>›</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '14px', opacity: progress >= 50 ? 1 : 0.6 }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: progress >= 50 ? colors.teal : colors.card, border: progress >= 50 ? 'none' : `1.5px solid ${colors.tealBorder}`, color: progress >= 50 ? '#fff' : colors.textFaint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>2</span>
            <span style={{ flex: 1, fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark }}>Uygulama Videosu</span>
            {progress >= 50 ? (
              <button onClick={() => setPhase('video')} style={{ background: 'none', border: 'none', color: colors.coral, fontSize: '16px', cursor: 'pointer' }}>›</button>
            ) : (
              <span style={{ fontSize: '14px' }}>🔒</span>
            )}
          </div>

          {progress < 50 && (
            <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, margin: '-4px 0 14px 0' }}>
              ℹ️ Bilgi kartlarını tamamladığınızda açılacaktır.
            </p>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton
          onClick={() => {
            if (progress >= 50) setPhase('video');
            else { setCardIndex(0); setPhase('cards'); }
          }}
          icon={false}
        >
          {progress === 0 ? 'Bilgi Kartlarına Başla' : progress >= 50 ? 'Uygulama Videosuna Geç' : 'Devam Et'}
        </PrimaryButton>
      </Screen>
    </PhoneShell>
  );
}
