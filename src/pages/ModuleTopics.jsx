import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, Badge, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import { getModule, getModulePercent, getTopicProgress, isTopicLocked } from '../data/modulesData';
import { colors, radius, font } from '../theme';

export default function ModuleTopics() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const mod = getModule(moduleId);

  if (!mod) {
    return (
      <PhoneShell>
        <Screen align="center">
          <p style={{ fontFamily: font.body, color: colors.textMuted, margin: 'auto' }}>Modül bulunamadı.</p>
        </Screen>
      </PhoneShell>
    );
  }

  const percent = getModulePercent(mod.id);
  const doneCount = mod.topics.filter((t) => getTopicProgress(mod.id, t.id) === 100).length;

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={() => navigate('/education-modules')} />

        <h1 style={{ fontFamily: font.heading, fontSize: '20px', fontWeight: 700, color: colors.tealDark, margin: '0 0 14px 0', textAlign: 'center' }}>
          {mod.title}
        </h1>

        <Card>
          <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
            {mod.description}
          </p>
        </Card>

        <div style={{ margin: '10px 0 22px 0' }}>
          <ProgressRing percent={percent} size={110} label="MODÜL İLERLEMESİ" sublabel={`${doneCount}/${mod.topics.length} Konu Tamamlandı`} />
        </div>

        <div style={{ width: '100%' }}>
          {mod.topics.map((topic, i) => {
            const locked = isTopicLocked(mod.id, topic.id);
            const topicPercent = getTopicProgress(mod.id, topic.id);
            const complete = topicPercent === 100;
            return (
              <div key={topic.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      backgroundColor: complete ? colors.teal : (!locked ? colors.coral : colors.card),
                      color: (complete || !locked) ? '#fff' : colors.textFaint,
                      border: locked && !complete ? `1.5px solid ${colors.tealBorder}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                    }}
                  >
                    {complete ? '✓' : i + 1}
                  </span>
                  {i < mod.topics.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: colors.tealBorder, minHeight: '18px' }} />}
                </div>

                <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '14px 16px', marginBottom: '14px', opacity: locked ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: locked ? '4px' : '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '17px' }}>{topic.icon}</span>
                      <span style={{ fontFamily: font.heading, fontSize: '13.5px', fontWeight: 700, color: colors.tealDark }}>{topic.title}</span>
                    </div>
                    {!locked && !complete && <Badge tone="coral">Aktif</Badge>}
                    {locked && <span style={{ fontSize: '14px' }}>🔒</span>}
                    {complete && <Badge>✓</Badge>}
                  </div>

                  {locked ? (
                    <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, margin: 0 }}>
                      {mod.topics[i - 1]?.title} tamamlandığında açılacaktır.
                    </p>
                  ) : (
                    <PrimaryButton onClick={() => navigate(`/module/${mod.id}/${topic.id}`)} icon={false}>
                      {complete ? 'Konuyu Tekrar İncele' : topicPercent > 0 ? 'Konuya Devam Et' : 'Konuya Başla'}
                    </PrimaryButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ backgroundColor: colors.tealSoft, borderRadius: radius.sm, padding: '12px 14px', display: 'flex', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '13px' }}>ℹ️</span>
          <p style={{ fontFamily: font.body, fontSize: '11.5px', color: colors.tealDark, lineHeight: 1.6, margin: 0 }}>
            Konular belirlenen sırayla açılacaktır. Bir konu %100 tamamlandığında sonraki konuya geçebilirsiniz.
          </p>
        </div>
      </Screen>
    </PhoneShell>
  );
}
