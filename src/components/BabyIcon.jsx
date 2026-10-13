// Uyuyan bebek ikonu ("Baştan Ayağa Fizik Muayene" modülü). Şeffaf arka planlı SVG.
export default function BabyIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* Kulaklar */}
      <circle cx="15" cy="54" r="9" fill="#E9A47D" />
      <circle cx="85" cy="54" r="9" fill="#E9A47D" />
      {/* Baş */}
      <circle cx="50" cy="54" r="37" fill="#EEAB84" />
      <circle cx="50" cy="54" r="34" fill="#F6BD97" />
      {/* Saç kıvrımı */}
      <path d="M57 16.5c-4.5-3-12-1.5-12.5 5.5-.4 6 5.5 9 10 6.5 3.4-2 2.6-6.5-.6-6.6"
        stroke="#8A573A" strokeWidth="4.2" strokeLinecap="round" fill="none" />
      {/* Kapalı gözler */}
      <path d="M32 53q5.5 7 11 0M57 53q5.5 7 11 0" stroke="#6A3D2C" strokeWidth="3.2" strokeLinecap="round" />
      {/* Yanaklar */}
      <ellipse cx="33.5" cy="63" rx="6.5" ry="3.8" fill="#F39883" opacity="0.85" />
      <ellipse cx="66.5" cy="63" rx="6.5" ry="3.8" fill="#F39883" opacity="0.85" />
      {/* Burun ve ağız */}
      <path d="M47.5 60.5q2.5 2.6 5 0" stroke="#E39C7B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44.5 68.5q5.5 6 11 0" stroke="#6A3D2C" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

// Modül/konu ikonlarını gösterir; bebek emojisi yerine BabyIcon çizilir.
export function ModuleIcon({ icon, size }) {
  if (icon === '👶') return <BabyIcon size={size} />;
  return <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>{icon}</span>;
}
