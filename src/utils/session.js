// Egitim ilerlemesi tarayicida (localStorage) tutuluyor. Farkli hesaplar ayni cihazi
// kullandiginda birbirinin ilerlemesini gormesin diye her anahtar aktif kullanicinin
// uid'ine gore ayri tutulur (ornek: "moduleProgress::<uid>").
const PROGRESS_KEYS = [
  'moduleProgress',
  'isTestCompleted',
  'correctCount',
  'preTestAnswerLog',
  'isFinalTestCompleted',
  'finalTestCorrectCount',
  'finalTestAnswerLog',
  'scalesCompleted',
];

export function userKey(baseKey) {
  const uid = localStorage.getItem('activeUserUid') || 'anon';
  return `${baseKey}::${uid}`;
}

export function setActiveUser(uid) {
  const alreadyTracking = localStorage.getItem('activeUserUid');
  if (!alreadyTracking) {
    // Bu fonksiyon eklenmeden once kaydedilmis, hesaba gore ayrilmamis eski veriler
    // varsa (ilk calistigi hesaba ait oldugu icin) o hesabin kendi alanina tasi.
    PROGRESS_KEYS.forEach((key) => {
      const oldValue = localStorage.getItem(key);
      if (oldValue !== null) {
        localStorage.setItem(`${key}::${uid}`, oldValue);
        localStorage.removeItem(key);
      }
    });
  }
  localStorage.setItem('activeUserUid', uid);
}
