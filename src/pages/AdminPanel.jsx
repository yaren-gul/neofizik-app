import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, authForAdminCreation, dbForAdminCreation } from '../firebase';
import { PhoneShell, Screen } from '../components/PhoneShell';
import { TopBar, PrimaryButton, SecondaryButton, Card, Badge, Modal } from '../components/ui';
import { colors, font } from '../theme';
import { generateParticipantCode, generateTempPassword, codeToEmail } from '../utils/participantCode';

function StatusDot({ ok }) {
  return (
    <span
      style={{
        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
        backgroundColor: ok ? colors.success : colors.border,
      }}
    />
  );
}

function ParticipantCard({ p }) {
  const modulePercent = p.overallModulePercent || 0;
  return (
    <Card style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontFamily: font.heading, fontSize: '14px', fontWeight: 700, color: colors.tealDark }}>
          {p.participantCode || '(kod yok)'}
        </span>
        <span style={{ fontFamily: font.body, fontSize: '10.5px', color: colors.textFaint }}>
          {p.lastLoginAt ? new Date(p.lastLoginAt).toLocaleDateString('tr-TR') : 'Hiç giriş yapmadı'}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusDot ok={!!p.preEfficacyScaleCompleted} />
          <span style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Ön Ölçek</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusDot ok={!!p.isTestCompleted} />
          <span style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Ön Test</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusDot ok={!!p.isFinalTestCompleted} />
          <span style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Son Test</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusDot ok={!!p.scalesCompleted} />
          <span style={{ fontFamily: font.body, fontSize: '11px', color: colors.textMuted }}>Ölçekler</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1, height: '6px', backgroundColor: colors.tealSoft, borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${modulePercent}%`, backgroundColor: colors.teal, borderRadius: '999px' }} />
        </div>
        <span style={{ fontFamily: font.body, fontSize: '11px', color: colors.tealDark, fontWeight: 600 }}>{modulePercent}%</span>
      </div>
    </Card>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newParticipant, setNewParticipant] = useState(null); // { code, password }

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs
        .map((d) => ({ uid: d.id, ...d.data() }))
        .filter((u) => u.role !== 'admin')
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setParticipants(list);
    } catch (e) {
      console.error('Katılımcılar yüklenemedi:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleCreateParticipant = async () => {
    setCreating(true);
    try {
      const code = generateParticipantCode();
      const password = generateTempPassword();
      const email = codeToEmail(code);

      const cred = await createUserWithEmailAndPassword(authForAdminCreation, email, password);
      await setDoc(doc(dbForAdminCreation, 'users', cred.user.uid), {
        participantCode: code,
        role: 'participant',
        isTestCompleted: false,
        createdAt: new Date().toISOString(),
      });
      await signOut(authForAdminCreation);

      setNewParticipant({ code, password });
      loadParticipants();
    } catch (e) {
      console.error('Katılımcı oluşturulamadı:', e);
      alert('Katılımcı oluşturulamadı: ' + e.message);
    } finally {
      setCreating(false);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewParticipant(null);
  };

  const doneCount = participants.filter((p) => p.isFinalTestCompleted).length;

  return (
    <PhoneShell>
      <Screen align="center">
        <TopBar back={false} onLogout={() => { localStorage.clear(); navigate('/login'); }} />

        <h1 style={{ fontFamily: font.heading, fontSize: '19px', fontWeight: 700, color: colors.tealDark, textAlign: 'center', margin: '4px 0 4px 0' }}>
          Yönetici Paneli
        </h1>
        <div style={{ marginBottom: '14px' }}>
          <Badge>{participants.length} Katılımcı · {doneCount} Tamamladı</Badge>
        </div>

        <div style={{ width: '100%', marginBottom: '12px' }}>
          <PrimaryButton onClick={() => setShowAddModal(true)} icon={false}>+ Yeni Katılımcı Ekle</PrimaryButton>
        </div>

        <div style={{ width: '100%' }}>
          {isLoading ? (
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center' }}>Yükleniyor...</p>
          ) : participants.length === 0 ? (
            <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, textAlign: 'center' }}>
              Henüz katılımcı eklenmedi.
            </p>
          ) : (
            participants.map((p) => <ParticipantCard key={p.uid} p={p} />)
          )}
        </div>

        {showAddModal && (
          <Modal>
            {!newParticipant ? (
              <>
                <h3 style={{ fontFamily: font.heading, color: colors.tealDark, margin: '0 0 8px 0' }}>Yeni Katılımcı</h3>
                <p style={{ fontFamily: font.body, fontSize: '13px', color: colors.textMuted, lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  Rastgele bir katılımcı kodu ve şifre oluşturulacak. Bu bilgileri katılımcıya sen ileteceksin.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <PrimaryButton onClick={handleCreateParticipant} disabled={creating} icon={false}>
                    {creating ? 'Oluşturuluyor...' : 'Katılımcı Oluştur'}
                  </PrimaryButton>
                  <SecondaryButton onClick={closeAddModal}>Vazgeç</SecondaryButton>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: colors.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px auto', color: colors.teal }}>
                  ✓
                </div>
                <h3 style={{ fontFamily: font.heading, color: colors.tealDark, margin: '0 0 12px 0' }}>Katılımcı Oluşturuldu</h3>
                <div style={{ backgroundColor: colors.tealSoft, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', textAlign: 'left' }}>
                  <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.tealDark, margin: '0 0 2px 0' }}>Katılımcı Kodu</p>
                  <p style={{ fontFamily: font.heading, fontSize: '16px', fontWeight: 700, color: colors.tealDark, margin: '0 0 10px 0', letterSpacing: '1px' }}>{newParticipant.code}</p>
                  <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.tealDark, margin: '0 0 2px 0' }}>Şifre</p>
                  <p style={{ fontFamily: font.heading, fontSize: '16px', fontWeight: 700, color: colors.tealDark, margin: 0, letterSpacing: '1px' }}>{newParticipant.password}</p>
                </div>
                <p style={{ fontFamily: font.body, fontSize: '11px', color: colors.error, lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Bu şifre bir daha gösterilmeyecek — kapatmadan önce not al.
                </p>
                <PrimaryButton onClick={closeAddModal} icon={false}>Tamam</PrimaryButton>
              </>
            )}
          </Modal>
        )}
      </Screen>
    </PhoneShell>
  );
}
