import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import BabyOrbit from '../components/BabyOrbit';
import { getModule, getModulePercent, getTopicProgress, isTopicLocked } from '../data/modulesData';
import { colors, font } from '../theme';

export default function BodyAtlas() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const mod = getModule(moduleId);
  const [activeTopicId, setActiveTopicId] = useState(null);

  if (!mod) return null;

  const percent = getModulePercent(mod.id);
  const firstUnlocked = mod.topics.find((t) => !isTopicLocked(mod.id, t.id) && getTopicProgress(mod.id, t.id) < 100);
  const activeTopic = mod.topics.find((t) => t.id === activeTopicId) || firstUnlocked || mod.topics[0];

  return (
    <PhoneShell>
      <Screen align="center" pad="0">
        <div style={{ padding: '26px 26px 0 26px', width: '100%', boxSizing: 'border-box' }}>
          <TopBar back={() => navigate('/education-modules')} />
          <h1 style={{ fontFamily: font.heading, fontSize: '21px', fontWeight: 700, color: colors.tealDark, margin: '0 0 8px 0' }}>
            Eğitim
          </h1>
          <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.textMuted, margin: '0 0 14px 0' }}>
            Muayene bölgesini yenidoğan görseli üzerinden takip ediniz.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <ProgressRing percent={percent} size={90} label="GENEL İLERLEME" />
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 26px', boxSizing: 'border-box' }}>
          <div style={{ position: 'relative' }}>
            <BabyOrbit size={190} />
            {mod.topics.map((topic) => {
              const locked = isTopicLocked(mod.id, topic.id);
              const complete = getTopicProgress(mod.id, topic.id) === 100;
              const isActive = topic.id === activeTopic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => !locked && setActiveTopicId(topic.id)}
                  style={{
                    position: 'absolute', top: topic.point.top, left: topic.point.left, transform: 'translate(-50%,-50%)',
                    width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #fff',
                    backgroundColor: complete ? colors.teal : isActive ? colors.coral : colors.card,
                    color: complete || isActive ? '#fff' : colors.textFaint,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                    cursor: locked ? 'default' : 'pointer',
                    boxShadow: isActive ? '0 0 0 4px rgba(254,90,60,0.25)' : '0 2px 6px rgba(14,69,80,0.15)',
                  }}
                >
                  {complete ? '✓' : locked ? '🔒' : ''}
                </button>
              );
            })}
          </div>

          {activeTopic && (
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: colors.card,
                border: `1.5px solid ${colors.coral}`, borderRadius: '999px', padding: '6px 14px', marginTop: '10px',
                fontFamily: font.body, fontSize: '12px', fontWeight: 700, color: colors.coral,
              }}
            >
              {activeTopic.title}
            </div>
          )}
        </div>

        <div style={{ padding: '18px 26px 26px 26px', width: '100%', boxSizing: 'border-box' }}>
          {activeTopic && (
            <PrimaryButton onClick={() => navigate(`/module/${mod.id}/${activeTopic.id}`)}>
              {getTopicProgress(mod.id, activeTopic.id) > 0 ? `${activeTopic.title.replace('Muayenesi', '')} Muayenesine Devam Et` : `${activeTopic.title.replace(' Muayenesi', '')} Muayenesine Başla`}
            </PrimaryButton>
          )}
          <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, textAlign: 'center', marginTop: '10px' }}>
            ℹ️ Bölümler belirlenen sırayla açılır.
          </p>
        </div>
      </Screen>
    </PhoneShell>
  );
}
