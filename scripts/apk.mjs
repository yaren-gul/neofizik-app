// Android APK derleme yardımcısı.
//
//   npm run apk        -> Normal APK (uygulama telefonun içinde, bilgisayar gerekmez)
//                         Çıktı: NeonaFizik-test.apk
//   npm run apk:live   -> Canlı yenileme APK'sı (geliştirme için). Uygulamayı USB kablo üzerinden
//                         bilgisayardaki geliştirme sunucusundan (npm run dev) okur;
//                         koddaki değişiklikler telefonda anında görünür.
//                         Çıktı: NeonaFizik-canli.apk
//
// Canlı APK yalnızca telefon USB ile bağlıyken, "npm run telefon" çalıştırıldıktan sonra
// ve "npm run dev" açıkken çalışır. Sunucu sadece bu bilgisayarda (localhost) açılır,
// Wi-Fi'deki başka kimse erişemez. Öğrencilere her zaman normal APK verilmeli.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const live = process.argv.includes('live');
const root = process.cwd();
const androidDir = join(root, 'android');
const PORT = 5173;

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// Android derlemesi Java 17-21 ister; Android Studio'nun kendi Java'sı tercih edilir.
const env = { ...process.env };
const studioJbr = 'C:\\Program Files\\Android\\Android Studio\\jbr';
if (existsSync(studioJbr)) env.JAVA_HOME = studioJbr;

if (!live) run('npm', ['run', 'build']);
run('npx', ['cap', 'sync', 'android']);

if (live) {
  // Telefondaki localhost:5173, "npm run telefon" (adb reverse) ile USB üzerinden
  // bu bilgisayara yönlendirilir. cap sync'in Android'e kopyaladığı ayara eklenir;
  // kök dizindeki capacitor.config.json değişmez, normal APK etkilenmez.
  const url = `http://localhost:${PORT}`;
  const cfgPath = join(androidDir, 'app', 'src', 'main', 'assets', 'capacitor.config.json');
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  cfg.server = { url, cleartext: true };
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  console.log(`\nCanlı yenileme adresi: ${url}`);
}

run(`"${join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')}"`, ['assembleDebug', '--no-daemon', '--max-workers=4'], { cwd: androidDir, env });

const out = join(root, live ? 'NeonaFizik-canli.apk' : 'NeonaFizik-test.apk');
copyFileSync(join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'), out);
console.log(`\nHazır: ${out}`);
