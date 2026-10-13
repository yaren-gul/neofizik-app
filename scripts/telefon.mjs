// USB ile bağlı Android telefonu canlı yenilemeye bağlar:
// telefondaki localhost:5173 -> bu bilgisayardaki geliştirme sunucusu (npm run dev).
// Telefonu her takışınızda bir kez çalıştırın: npm run telefon

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const sdk = process.env.ANDROID_HOME || join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
const adb = join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
if (!existsSync(adb)) {
  console.error(`adb bulunamadı: ${adb}`);
  process.exit(1);
}

const devices = spawnSync(adb, ['devices'], { encoding: 'utf8' }).stdout
  .split('\n').slice(1).map((l) => l.trim()).filter(Boolean);

if (devices.length === 0) {
  console.error('Telefon bulunamadı. Kabloyu ve telefonda "USB hata ayıklama"nın açık olduğunu kontrol edin.');
  process.exit(1);
}
if (devices.some((l) => l.endsWith('unauthorized'))) {
  console.error('Telefon izin bekliyor: telefondaki "USB hata ayıklamaya izin verilsin mi?" sorusuna "İzin ver" deyin, sonra tekrar çalıştırın.');
  process.exit(1);
}

const r = spawnSync(adb, ['reverse', 'tcp:5173', 'tcp:5173'], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log('Telefon bağlandı. "npm run dev" açıkken NeonaFizik uygulamasını telefonda açabilirsiniz.');
