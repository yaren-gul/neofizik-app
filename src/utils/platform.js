import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

// Uygulama telefona yüklenmiş (Android/iOS) olarak mı çalışıyor?
export const isNativeApp = Capacitor.isNativePlatform();

// Telefon düzeni: yüklü uygulamada her zaman, tarayıcıda dar ekranda.
// Geniş ekranda (bilgisayar) önizleme için telefon çerçevesi gösterilir.
const PHONE_QUERY = '(max-width: 500px)';

export function useIsPhoneLayout() {
  const [isPhone, setIsPhone] = useState(
    () => isNativeApp || window.matchMedia(PHONE_QUERY).matches,
  );

  useEffect(() => {
    if (isNativeApp) return undefined;
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isPhone;
}

// Çentik / durum çubuğu / alt çubuk boşlukları. Capacitor Android'de
// --safe-area-inset-* değişkenlerini kendisi ekler; diğer yerlerde env() kullanılır.
export const safeArea = {
  top: 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))',
  bottom: 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))',
};
