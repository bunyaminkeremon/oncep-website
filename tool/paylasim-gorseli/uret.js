// kaynak.html'den /paylasim.png (1200×630) üretir. Windows'ta Edge ile:
//   node tool/paylasim-gorseli/uret.js
// Edge başka yerdeyse EDGE ortam değişkeniyle ver. Chrome da olur (aynı bayraklar).
// Not: Edge komut döndükten SONRA dosyayı yazabiliyor; betik dosyayı bekliyor.
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const kaynak = path.join(__dirname, 'kaynak.html');
const hedef = path.join(__dirname, '..', '..', 'paylasim.png');
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'oncep-gorsel-'));
const once = fs.existsSync(hedef) ? fs.statSync(hedef).mtimeMs : 0;

spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
  `--user-data-dir=${profil}`, '--window-size=1200,630', '--virtual-time-budget=8000',
  `--screenshot=${hedef}`, 'file:///' + kaynak.replace(/\\/g, '/'),
], { stdio: 'ignore' });

const bas = Date.now();
(function bekle() {
  if (fs.existsSync(hedef) && fs.statSync(hedef).mtimeMs > once) {
    console.log(`paylasim.png yazıldı (${Math.round(fs.statSync(hedef).size / 1024)} KB)`);
    return;
  }
  if (Date.now() - bas > 60000) { console.error('Edge 60 sn içinde görseli yazmadı'); process.exit(1); }
  setTimeout(bekle, 1000);
})();
