import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Tez önerisi (3. ve 9. Aşama): ön test "Bilgi Testi A", son test "Bilgi Testi B" —
// aynı soru havuzu değil, ayrı iki form. Bunu ayırt etmek için "questions"
// koleksiyonundaki her belgede bir "form" alanı ("A" | "B") olması gerekir.
// O alan henüz eklenmediyse (örn. yer tutucu/test verisi), uygulamanın boş
// kalmaması için tüm koleksiyon geri döndürülür ve konsola uyarı yazılır.
export async function fetchQuestionsByForm(form) {
  const q = query(collection(db, 'questions'), where('form', '==', form));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  console.warn(
    `"questions" koleksiyonunda form="${form}" olan soru bulunamadı, geçici olarak tüm sorular kullanılıyor. ` +
    `Her soruya Firestore'da "form": "A" (ön test) veya "form": "B" (son test) alanı eklenmeli.`
  );
  const allSnap = await getDocs(collection(db, 'questions'));
  return allSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
