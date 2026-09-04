// NeoFizik eğitim modülleri veri modeli.
// "reflexes" modülündeki 10 refleks word dosyasındaki mockuptan birebir alınmıştır.
// "exam" (Baştan Ayağa Fizik Muayene) modülündeki vücut bölgeleri mockup'ta yalnızca
// "Baş Muayenesi" ve "Yüz Muayenesi" olarak görüldü — geri kalanı standart yenidoğan
// fizik muayenesi sırasına göre taslak olarak eklendi, gerçek liste netleşince güncellenebilir.

import { userKey } from '../utils/session';
import { auth, db } from '../firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

export const MODULES = [
  {
    id: 'vital',
    order: 1,
    title: 'Vital Bulguların Değerlendirilmesi',
    shortTitle: 'Vital Bulgular',
    icon: '🩺',
    type: 'list',
    description: 'Yenidoğanın vücut ısısı, apikal kalp hızı, solunumu ve kan basıncının değerlendirilmesini öğrenin.',
    topics: [
      { id: 'vucut-isisi', title: 'Vücut Isısı', icon: '🌡️' },
      { id: 'apikal-kalp-hizi', title: 'Apikal Kalp Hızı', icon: '❤️' },
      { id: 'solunum', title: 'Solunum', icon: '🫁' },
      { id: 'kan-basinci', title: 'Kan Basıncı', icon: '🩺' },
    ],
  },
  {
    id: 'exam',
    order: 2,
    title: 'Baştan Ayağa Fizik Muayene',
    shortTitle: 'Baştan Ayağa Fizik Muayene',
    icon: '👶',
    type: 'body',
    description: 'Yenidoğanın fizik muayenesini vücut bölgelerine göre sistematik biçimde inceleyin.',
    // Bölge listesi tez önerisi 7. Aşama'daki sırayla birebir uyumlu:
    // baş, boyun, göz, kulak, burun, ağız ve oral kavite, göğüs, abdomen,
    // umbilikal kord, genital sistem, ekstremiteler, deri.
    topics: [
      { id: 'bas', title: 'Baş Muayenesi', point: { top: '10%', left: '50%' } },
      { id: 'goz', title: 'Göz Muayenesi', point: { top: '14%', left: '42%' } },
      { id: 'kulak', title: 'Kulak Muayenesi', point: { top: '15%', left: '66%' } },
      { id: 'burun', title: 'Burun Muayenesi', point: { top: '18%', left: '50%' } },
      { id: 'agiz', title: 'Ağız ve Oral Kavite Muayenesi', point: { top: '21%', left: '58%' } },
      { id: 'boyun', title: 'Boyun Muayenesi', point: { top: '27%', left: '38%' } },
      { id: 'gogus', title: 'Göğüs Muayenesi', point: { top: '38%', left: '50%' } },
      { id: 'abdomen', title: 'Abdomen (Karın) Muayenesi', point: { top: '48%', left: '50%' } },
      { id: 'umbilikal-kord', title: 'Umbilikal Kord Muayenesi', point: { top: '52%', left: '58%' } },
      { id: 'genital', title: 'Genital Bölge Muayenesi', point: { top: '62%', left: '50%' } },
      { id: 'ekstremite', title: 'Ekstremite Muayenesi', point: { top: '70%', left: '25%' } },
      { id: 'deri', title: 'Deri Muayenesi', point: { top: '40%', left: '80%' } },
    ],
  },
  {
    id: 'reflexes',
    order: 3,
    title: 'Yenidoğan Refleksleri',
    shortTitle: 'Yenidoğan Refleksleri',
    icon: '🖐️',
    type: 'list',
    description: 'Yenidoğanın temel reflekslerini ve değerlendirme yöntemlerini öğrenin.',
    topics: [
      { id: 'arama', title: 'Arama Refleksi', icon: '🔍' },
      { id: 'emme', title: 'Emme Refleksi', icon: '👄' },
      { id: 'moro', title: 'Moro Refleksi', icon: '🤲' },
      { id: 'yakalama', title: 'Yakalama Refleksi', icon: '✊' },
      { id: 'adimlama', title: 'Adımlama Refleksi', icon: '🚶' },
      { id: 'tonik-boyun', title: 'Tonik Boyun Refleksi', icon: '🔄' },
      { id: 'babinski', title: 'Babinski Refleksi', icon: '🦶' },
      { id: 'glabella', title: 'Glabella Refleksi', icon: '👁️' },
      { id: 'aksirma-oksurme', title: 'Aksırma ve Öksürme Refleksleri', icon: '🤧' },
      { id: 'galant', title: 'Galant Refleksi', icon: '➰' },
    ],
  },
];

export const getModule = (moduleId) => MODULES.find((m) => m.id === moduleId);

export const getTopic = (moduleId, topicId) => {
  const mod = getModule(moduleId);
  return mod?.topics.find((t) => t.id === topicId);
};

/* ---------- İlerleme (localStorage tabanlı) ---------- */

const KEY = 'moduleProgress';

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(userKey(KEY)) || '{}');
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(userKey(KEY), JSON.stringify(progress));
  syncProgressToFirestore(progress);
}

// Yönetici paneli katılımcı ilerlemesini Firestore'dan okuyabilsin diye,
// yerel kayıtla birlikte kullanıcının kendi belgesine de yazılır (arka planda,
// arayüzü bekletmeden).
function syncProgressToFirestore(progress) {
  const user = auth.currentUser;
  if (!user) return;
  const total = MODULES.reduce((sum, m) => {
    const modProgress = progress[m.id] || {};
    const modTotal = m.topics.reduce((s, t) => s + (modProgress[t.id] || 0), 0);
    return sum + Math.round(modTotal / m.topics.length);
  }, 0);
  const overallModulePercent = Math.round(total / MODULES.length);

  setDoc(
    doc(db, 'users', user.uid),
    { moduleProgress: progress, overallModulePercent, moduleProgressUpdatedAt: new Date().toISOString() },
    { merge: true }
  ).catch((e) => console.error("İlerleme Firestore'a yazılamadı:", e));
}

// Bir konunun ilerlemesini al: 0 | 50 | 100
export function getTopicProgress(moduleId, topicId) {
  const p = loadProgress();
  return p[moduleId]?.[topicId] || 0;
}

export function setTopicProgress(moduleId, topicId, value) {
  const p = loadProgress();
  if (!p[moduleId]) p[moduleId] = {};
  const previousValue = p[moduleId][topicId] || 0;
  p[moduleId][topicId] = value;
  saveProgress(p);
  if (value !== previousValue) {
    logTopicCompletion(moduleId, topicId, value);
  }
}

// Bir bölgenin ilerlemesi her değiştiğinde zaman damgalı bir kayıt tutar.
// Tez önerisindeki "bölge başına 1 gün" çıkarılma kriterini araştırmacının
// sonradan (admin panelinden) değerlendirebilmesi için gereklidir.
function logTopicCompletion(moduleId, topicId, value) {
  const user = auth.currentUser;
  if (!user) return;
  setDoc(
    doc(db, 'users', user.uid),
    { topicCompletionLog: arrayUnion({ moduleId, topicId, value, at: new Date().toISOString() }) },
    { merge: true }
  ).catch((e) => console.error('Tamamlanma kaydı yazılamadı:', e));
}

// Modülün genel yüzdesi (tüm konuların ortalaması)
export function getModulePercent(moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return 0;
  const p = loadProgress();
  const modProgress = p[moduleId] || {};
  const total = mod.topics.reduce((sum, t) => sum + (modProgress[t.id] || 0), 0);
  return Math.round(total / mod.topics.length);
}

export function isModuleComplete(moduleId) {
  return getModulePercent(moduleId) === 100;
}

// Bir modül kilitli mi? (kendinden önceki modül %100 değilse kilitli)
export function isModuleLocked(moduleId) {
  const mod = getModule(moduleId);
  if (!mod || mod.order === 1) return false;
  const prevModule = MODULES.find((m) => m.order === mod.order - 1);
  return !isModuleComplete(prevModule.id);
}

// Bir konu kilitli mi? (kendinden önceki konu %100 değilse kilitli)
export function isTopicLocked(moduleId, topicId) {
  const mod = getModule(moduleId);
  if (!mod) return true;
  const idx = mod.topics.findIndex((t) => t.id === topicId);
  if (idx <= 0) return false;
  const prevTopic = mod.topics[idx - 1];
  return getTopicProgress(moduleId, prevTopic.id) !== 100;
}

export function getOverallPercent() {
  const total = MODULES.reduce((sum, m) => sum + getModulePercent(m.id), 0);
  return Math.round(total / MODULES.length);
}

export function completedModuleCount() {
  return MODULES.filter((m) => isModuleComplete(m.id)).length;
}
