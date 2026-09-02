// Katılımcılar Firebase'e ad/e-posta yerine "katılımcı kodu" ile giriş yapar
// (tez önerisi, 1. Aşama). Firebase Authentication e-posta/şifre istediği için
// kod, görünmeyen sentetik bir e-postaya çevrilip öyle kullanılır.

const CODE_DOMAIN = 'katilimci.neofizik.app';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // karışabilecek 0/O, 1/I çıkarıldı

export function normalizeCode(rawCode) {
  return rawCode.trim().toUpperCase().replace(/\s+/g, '');
}

export function codeToEmail(rawCode) {
  return `${normalizeCode(rawCode)}@${CODE_DOMAIN}`.toLowerCase();
}

export function isParticipantCodeEmail(email) {
  return email.toLowerCase().endsWith(`@${CODE_DOMAIN}`);
}

// Örnek: NF-4K7Q
export function generateParticipantCode() {
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `NF-${suffix}`;
}

export function generateTempPassword() {
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return pass;
}
