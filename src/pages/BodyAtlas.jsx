import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import Baby3D from '../components/Baby3D';
import { getModule, getModulePercent, getTopicProgress, isTopicLocked } from '../data/modulesData';
import { colors, font } from '../theme';

export default function BodyAtlas() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const mod = getModule(moduleId);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [zoomed, setZoomed] = useState(false);

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
          <div style={{ position: 'relative', width: '100%' }}>
            <Baby3D
              maxWidth={300}
              height={300}
              focusHead={zoomed}
              points={mod.topics.map((t) => ({ id: t.id, anchor: t.anchor, normal: t.normal }))}
              renderPoint={(id) => {
                const topic = mod.topics.find((t) => t.id === id);
                const locked = isTopicLocked(mod.id, topic.id);
                const complete = getTopicProgress(mod.id, topic.id) === 100;
                const isActive = topic.id === activeTopic.id;
                return (
                  <button
                    onClick={() => !locked && setActiveTopicId(topic.id)}
                    aria-label={topic.title}
                    title={topic.title}
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #fff', padding: 0,
                      backgroundColor: complete ? colors.teal : isActive ? colors.coral : colors.card,
                      color: complete || isActive ? '#fff' : colors.textFaint,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                      cursor: locked ? 'default' : 'pointer',
                      boxShadow: isActive ? '0 0 0 4px rgba(254,90,60,0.25)' : '0 2px 6px rgba(14,69,80,0.2)',
                    }}
                  >
                    {complete ? '✓' : locked ? '🔒' : ''}
                  </button>
                );
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint }}>↔ Döndürmek için sürükleyin</span>
              <button
                onClick={() => setZoomed((z) => !z)}
                style={{
                  border: `1px solid ${colors.tealBorder}`, borderRadius: '999px', backgroundColor: colors.card, color: colors.teal,
                  fontFamily: font.body, fontSize: '11px', fontWeight: 600, padding: '5px 10px', cursor: 'pointer',
                }}
              >
                {zoomed ? '⤢ Tüm vücut' : '🔍 Yüze yakınlaş'}
              </button>
            </div>
            {/* CC-BY 4.0 lisansı gereği model sahibinin adı belirtilmelidir (public/models/baby-LICENSE.txt) */}
            <p style={{ fontFamily: font.body, fontSize: '9px', color: colors.textFaint, textAlign: 'center', margin: '6px 0 0 0' }}>
              3D model: <a href="https://sketchfab.com/3d-models/sleeping-baby-f64d9f687a2e458883d72489adfa5fba" target="_blank" rel="noreferrer" style={{ color: colors.textFaint }}>"Sleeping Baby"</a> – Syral86, <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" style={{ color: colors.textFaint }}>CC BY 4.0</a>
            </p>
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
