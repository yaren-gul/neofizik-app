import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, SecondaryButton, Badge, Card } from '../components/ui';
import ProgressRing from '../components/ProgressRing';
import { MODULES, getModulePercent, isModuleLocked, isModuleComplete, getOverallPercent, completedModuleCount } from '../data/modulesData';
import { colors, radius, font } from '../theme';

export default function EducationModules() {
  const navigate = useNavigate();
  const overallPercent = getOverallPercent();
  const doneCount = completedModuleCount();
  const allComplete = doneCount === MODULES.length;

  const goToModule = (mod, locked) => {
    if (locked) return;
    navigate(mod.type === 'body' ? `/module/${mod.id}` : `/module/${mod.id}`);
  };

  if (allComplete) {
    return (
      <PhoneShell>
        <Screen align="center">
          <TopBar back={false} />
          <div style={{ flex: 1 }} />
          <ProgressRing percent={100} size={140} label="GENEL İLERLEME" />
          <h1 style={{ fontFamily: font.heading, fontSize: '21px', fontWeight: 700, color: colors.tealDark, margin: '18px 0 8px 0', textAlign: 'center' }}>
            Eğitimi Tamamladınız
          </h1>
          <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            Yenidoğan fizik muayenesine ilişkin tüm eğitim modüllerini başarıyla tamamladınız. Artık istediğiniz
            muayene bölgesine yeniden erişerek bilgi kartlarını, görselleri ve uygulama videolarını tekrar inceleyebilirsiniz.
          </p>
          <div style={{ width: '100%', marginBottom: '18px' }}>
            {MODULES.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.sm, padding: '12px 16px', marginBottom: '8px' }}>
                <span style={{ color: colors.teal }}>✓</span>
                <span style={{ fontFamily: font.body, fontSize: '13px', color: colors.tealDark, fontWeight: 600 }}>{m.shortTitle}: Tamamlandı</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '16px' }}><Badge>Tüm Muayene Bölgeleri Açık</Badge></div>
          <div style={{ flex: 1 }} />
          <SecondaryButton onClick={() => navigate(`/module/${MODULES[0].id}`)}>Eğitimleri Tekrar İncele</SecondaryButton>
          <div style={{ height: '10px' }} />
          <PrimaryButton onClick={() => navigate('/final-test')}>Son Değerlendirmeye Geç</PrimaryButton>
        </Screen>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={false} />

        <h1 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 700, color: colors.tealDark, margin: '0 0 14px 0', textAlign: 'center' }}>
          Eğitim Modülleri
        </h1>

        <Card>
          <p style={{ fontFamily: font.body, fontSize: '12.5px', color: colors.text, lineHeight: 1.6, margin: 0 }}>
            NeoFizik eğitimi üç modülden oluşmaktadır. Modüller belirlenen sırayla açılacaktır. Bir modülü %100
            tamamladığınızda bir sonraki modüle geçebilirsiniz.
          </p>
        </Card>

        <div style={{ margin: '14px 0 22px 0' }}>
          <ProgressRing percent={overallPercent} size={120} label="GENEL İLERLEME" sublabel={`${doneCount}/${MODULES.length} Modül Tamamlandı`} />
        </div>

        <div style={{ width: '100%' }}>
          {MODULES.map((mod, i) => {
            const locked = isModuleLocked(mod.id);
            const complete = isModuleComplete(mod.id);
            const percent = getModulePercent(mod.id);
            return (
              <div key={mod.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span
                    style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      backgroundColor: complete ? colors.teal : (!locked ? colors.coral : colors.card),
                      color: (complete || !locked) ? '#fff' : colors.textFaint,
                      border: locked && !complete ? `1.5px solid ${colors.tealBorder}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                    }}
                  >
                    {complete ? '✓' : i + 1}
                  </span>
                  {i < MODULES.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: colors.tealBorder, minHeight: '20px' }} />}
                </div>

                <div style={{ flex: 1, backgroundColor: colors.card, border: `1px solid ${colors.tealBorder}`, borderRadius: radius.md, padding: '16px', marginBottom: '16px', opacity: locked ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{mod.icon}</span>
                    {!locked && !complete && <Badge tone="coral">Aktif</Badge>}
                    {locked && <span style={{ fontSize: '16px' }}>🔒</span>}
                    {complete && <Badge>Tamamlandı</Badge>}
                  </div>
                  <h3 style={{ fontFamily: font.heading, fontSize: '15px', fontWeight: 700, color: colors.tealDark, margin: '0 0 6px 0' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontFamily: font.body, fontSize: '12px', color: colors.textMuted, lineHeight: 1.55, margin: '0 0 12px 0' }}>
                    {mod.description}
                  </p>

                  {locked ? (
                    <>
                      <div style={{ display: 'inline-block', border: `1px solid ${colors.border}`, borderRadius: radius.pill, padding: '4px 12px', fontSize: '11px', color: colors.textMuted, fontFamily: font.body, marginBottom: '6px' }}>
                        Kilitli
                      </div>
                      <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.textFaint, margin: 0 }}>
                        {MODULES[i - 1]?.shortTitle} modülü tamamlandığında açılacaktır.
                      </p>
                    </>
                  ) : (
                    <PrimaryButton onClick={() => goToModule(mod, locked)} icon={false}>
                      {complete ? 'Modülü İncele' : percent > 0 ? 'Modüle Devam Et' : 'Modüle Başla'}
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
            Eğitim modülleri belirlenen sırayla tamamlanacaktır. Tüm eğitim tamamlandığında modüllere yeniden erişebilirsiniz.
          </p>
        </div>
      </Screen>
    </PhoneShell>
  );
}
