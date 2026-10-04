// Sitenin sekme simgelerini (favicon) ve iPhone ana ekran simgesini üretir.
//
//   node tool/simge/uret.js
//
// Uygulama simgesinin aynısı: lacivert zeminde tek satır "ONCEP", Onest
// ExtraBold, ON beyaz, CEP turuncu (uygulamada: oncep_mobile/tool/logo_uret.js).
// 16 ve 32 piksellik sekme simgelerinde yazı biraz daha geniş tutuluyor;
// o boyda her piksel okunurluk demek.
//
// Edge görünmez açılıp <canvas>'a çiziyor; sonuç hata ayıklama
// bağlantısından (DevTools) okunuyor — Windows'ta --dump-dom konsola
// hiçbir şey yazmıyor.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const KOK = path.join(__dirname, '..', '..');
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const boyutlar = [
  { ad: 'favicon-16', g: 16, genislik: 0.92 },
  { ad: 'favicon-32', g: 32, genislik: 0.92 },
  { ad: 'favicon-48x48.png', g: 48, genislik: 0.84 },
  { ad: 'favicon-96x96.png', g: 96, genislik: 0.80 },
  { ad: 'favicon-192x192.png', g: 192, genislik: 0.80 },
  { ad: 'apple-touch-icon.png', g: 180, genislik: 0.80 },
];

const sayfa = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@800&display=block">
</head><body><pre id="sonuc">BEKLIYOR</pre><script>
const boyutlar = ${JSON.stringify(boyutlar)};
function olc(ctx, boy) {
  ctx.font = '800 ' + boy + 'px Onest';
  ctx.letterSpacing = (-0.02 * boy) + 'px';
  const m = ctx.measureText('ONCEP');
  return { sol: m.actualBoundingBoxLeft, sag: m.actualBoundingBoxRight,
           ust: m.actualBoundingBoxAscent, alt: m.actualBoundingBoxDescent };
}
(async () => {
  await document.fonts.load('800 100px Onest');
  if (!document.fonts.check('800 100px Onest')) { document.getElementById('sonuc').textContent = 'YAZI TIPI YOK'; return; }
  const sonuc = {};
  for (const b of boyutlar) {
    const tuval = document.createElement('canvas');
    tuval.width = tuval.height = b.g;
    const ctx = tuval.getContext('2d');
    ctx.fillStyle = '#1A237E'; ctx.fillRect(0, 0, b.g, b.g);
    const m100 = olc(ctx, 100);
    const boy = 100 * (b.g * b.genislik) / (m100.sol + m100.sag);
    const m = olc(ctx, boy);
    const x = (b.g - (m.sol + m.sag)) / 2 + m.sol;
    const y = (b.g - (m.ust + m.alt)) / 2 + m.ust;
    ctx.fillStyle = '#FFFFFF'; ctx.fillText('ON', x, y);
    const ileri = ctx.measureText('ON').width;
    ctx.fillStyle = '#F26A1B'; ctx.fillText('CEP', x + ileri, y);
    sonuc[b.ad] = tuval.toDataURL('image/png');
  }
  document.getElementById('sonuc').textContent = JSON.stringify(sonuc);
})();
</script></body></html>`;

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// PNG kayıtlı .ico: 6 baytlık başlık, her görsel için 16 baytlık kayıt,
// ardından PNG'lerin kendisi. Bütün tarayıcılar PNG'li ico okuyor.
function ico(pngler) {
  const baslik = Buffer.alloc(6 + 16 * pngler.length);
  baslik.writeUInt16LE(0, 0);
  baslik.writeUInt16LE(1, 2);
  baslik.writeUInt16LE(pngler.length, 4);
  let konum = baslik.length;
  pngler.forEach(([g, png], i) => {
    const k = 6 + 16 * i;
    baslik.writeUInt8(g, k);
    baslik.writeUInt8(g, k + 1);
    baslik.writeUInt16LE(1, k + 4);
    baslik.writeUInt16LE(32, k + 6);
    baslik.writeUInt32LE(png.length, k + 8);
    baslik.writeUInt32LE(konum, k + 12);
    konum += png.length;
  });
  return Buffer.concat([baslik, ...pngler.map(([, png]) => png)]);
}

async function main() {
  const gecici = path.join(os.tmpdir(), `oncep-simge-${process.pid}.html`);
  fs.writeFileSync(gecici, sayfa);
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'oncep-edge-'));
  const edge = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profil}`,
    '--remote-debugging-port=0', 'file:///' + gecici.split(path.sep).join('/'),
  ], { stdio: 'ignore' });
  try {
    const portDosyasi = path.join(profil, 'DevToolsActivePort');
    for (let i = 0; i < 60 && !fs.existsSync(portDosyasi); i++) await bekle(250);
    const port = fs.readFileSync(portDosyasi, 'utf8').split('\n')[0].trim();
    let hedef;
    for (let i = 0; i < 40 && !hedef; i++) {
      const liste = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      hedef = liste.find((s) => s.type === 'page' && s.url.startsWith('file:'));
      if (!hedef) await bekle(250);
    }
    const ws = new WebSocket(hedef.webSocketDebuggerUrl);
    await new Promise((r, h) => { ws.onopen = r; ws.onerror = h; });
    const sor = (ifade) => new Promise((r) => {
      ws.onmessage = (m) => r(JSON.parse(m.data).result.result.value);
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: ifade, returnByValue: true } }));
    });
    let ham = 'BEKLIYOR';
    for (let i = 0; i < 120 && ham === 'BEKLIYOR'; i++) {
      ham = await sor("document.getElementById('sonuc').textContent");
      if (ham === 'BEKLIYOR') await bekle(250);
    }
    ws.close();
    if (!ham.startsWith('{')) throw new Error(`Çizim olmadı: ${ham.slice(0, 80)}`);
    const sonuc = Object.fromEntries(Object.entries(JSON.parse(ham))
      .map(([ad, url]) => [ad, Buffer.from(url.split(',')[1], 'base64')]));
    for (const [ad, png] of Object.entries(sonuc)) {
      if (!ad.endsWith('.png')) continue;
      fs.writeFileSync(path.join(KOK, ad), png);
      console.log(ad);
    }
    fs.writeFileSync(path.join(KOK, 'favicon.ico'),
      ico([[16, sonuc['favicon-16']], [32, sonuc['favicon-32']], [48, sonuc['favicon-48x48.png']]]));
    console.log('favicon.ico (16, 32, 48)');
  } finally {
    edge.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
