// Tez önerisi ekleri (EK-5, EK-6, EK-7) — 5'li Likert tipi ölçeklerin gerçek maddeleri.
// "1: Kesinlikle Katılmıyorum ... 5: Kesinlikle Katılıyorum" ortak puanlama kullanılır.

export const LIKERT_LABELS = ['Kesinlikle Katılmıyorum', 'Katılmıyorum', 'Kararsızım', 'Katılıyorum', 'Kesinlikle Katılıyorum'];

export const EFFICACY_SCALE = {
  key: 'efficacy',
  title: 'Klinik Beceriler İçin Öz-Yeterlik Ölçeği',
  intro: 'Ölçekteki "bu ders" ifadesi "Yenidoğanın Fizik Muayenesi Eğitimi"ni, "klinik beceri" ifadesi ise bu eğitim kapsamındaki uygulama basamaklarını ifade etmektedir.',
  items: [
    'Klinik beceriyi nasıl yapacağımı hatırlayabilirim.',
    'Klinik becerinin basamaklarını anlarım ve başkalarına beceriyi yaparak gösterebilirim.',
    'Klinik beceriyi uygulama basamaklarını unuttuğum zaman, akıl yürütme yoluyla bulabilirim.',
    'Klinik beceriyi ustalıkla uygulayabilirim.',
    'Klinik becerinin uygulama amacını ve ilkelerini sözel olarak açıklayabilirim.',
    'Beceride yer alan basamakların sırasını ve diğer basamaklarla olan ilişkisini sözlü olarak açıklayabilirim.',
    'Bu derse diğer derslerden daha fazla zaman harcadığımı düşünüyorum.',
    'Bu derste diğer derslere kıyasla performansımda daha fazla ilerleme kaydettiğimi düşünüyorum.',
    'Bu dersle ilgili bilgiye daha fazla önem verme eğilimindeyim.',
    'Bu dersle ilgili bilgiyi araştırıp bulma eğilimindeyim.',
    'Klinik becerinin uygulama basamaklarını kolaylıkla baştan sona yapabilirim.',
    'Klinik becerimi ilerletmek için gelişimimi izlemeye ve değerlendirmeye çalışırım.',
    'Farklı yaklaşımlarla klinik beceriyi uygulamaya çalışırım.',
    'Klinik uygulamalarımı değerlendirmeye çalışırım ve gerektiği zaman uygun düzeltmeler yaparım.',
  ],
};

export const MOTIVATION_SCALE = {
  key: 'motivation',
  title: 'Mobil Öğrenme Motivasyon Ölçeği',
  intro: 'Kullandığınız mobil eğitim uygulamasına ve mobil öğrenme sürecine ilişkin deneyiminizi en iyi yansıtan seçeneği işaretleyiniz.',
  items: [
    'Mobil uygulamayı kullanmaktan zevk aldım.',
    'Mobil uygulama üzerinde çalıştıkça içeriği öğreneceğime dair inancım arttı.',
    'Mobil uygulamada merak uyandıran şeyler vardı.',
    'Mobil uygulamada yer alan etkinlikleri tamamladığımda kendimi başarılı hissettim.',
    'Etkinliklere verilen geri dönütler çalışmalarımın karşılığını aldığım hissini arttırdı.',
    'Mobil uygulamadaki etkinlik çeşitliliği öğrenmeye olan ilgimin devamlılığını sağladı.',
    'Mobil uygulamanın zaman ve mekân sınırlaması olmaması çalışma isteğimi artırdı.',
    'Mobil uygulamadaki etkinlikleri başarılı bir şekilde tamamlamak öğrenme hevesimi arttırdı.',
    'Mobil uygulama ile istediğim hızda çalışabildiğimden mobil uygulama ile öğrenmeye devam etmek istedim.',
    'İçeriğin organizasyonu uygulamada aktarılanları öğreneceğime dair olan inancımı arttırdı.',
    'Mobil uygulamanın dikkat çekici bir materyal olduğunu düşündüm.',
    'Mobil uygulamada aktarılanlar öğrenme ihtiyacımı karşıladı.',
    'Mobil uygulama ile yeni bilgiler öğrendim.',
    'Mobil uygulama içerisindeki etkinlikleri yapmak eğlenceliydi.',
    'Mobil uygulamanın içeriğinin niteliği dikkatimin devamlılığını sağladı.',
    'Mobil uygulama ile iyi öğrendim.',
    'Mobil uygulamanın içinde yer alan alıştırmaları başarılı bir şekilde tamamlamak benim için önemliydi.',
  ],
};

export const USABILITY_SCALE = {
  key: 'usability',
  title: 'Sistem Kullanılabilirlik Ölçeği',
  intro: 'Mobil uygulamayı kullanım deneyiminize göre aşağıdaki ifadelere katılma düzeyinizi belirtiniz.',
  items: [
    'Bu sistemi sıklıkla kullanmak isteyeceğimi düşünüyorum.',
    'Bu sistemi gereksiz bir şekilde karmaşık buldum.',
    'Bu sistemin kullanımının kolay olduğunu düşündüm.',
    'Bu sistemi kullanabilmek için daha teknik bir kişinin desteğine ihtiyaç duyacağımı düşünüyorum.',
    'Bu sistemdeki çeşitli fonksiyonları iyi entegre edilmiş buldum.',
    'Bu sistemde çok fazla tutarsızlık olduğunu düşündüm.',
    'Birçok insanın bu sistemi kullanmayı çok çabuk öğreneceğini sanıyorum.',
    'Bu sistemin kullanımını çok elverişsiz buldum.',
    'Bu sistemi kullanırken kendimden çok emin hissettim.',
    'Bu sistemde bir şeyler yapabilmek için öncelikle bir çok şey öğrenmem gerekti.',
  ],
};

export const POST_SCALES = [EFFICACY_SCALE, MOTIVATION_SCALE, USABILITY_SCALE];
