// vercel.json'daki Content-Security-Policy'nin script-src özetlerini yayınlanan
// HTML'deki satır içi betiklerden hesaplar.
//
//   node tool/csp/uret.js            → özetleri vercel.json'a yazar
//   node tool/csp/uret.js --kontrol  → yalnız denetler; uyuşmazlıkta çıkış kodu 1
//
// Satır içi bir <script> değişince yeniden çalıştır: özet tutmazsa tarayıcı
// betiği sessizce engeller (değer hesabı, sekmeler, ilan bağlantısı çalışmaz).
// tool/ana-sayfa/uret.js index.html'i yazdıktan sonra bunu kendisi çağırıyor.
//
// Yalnız script-src'deki 'sha…-' parçalarına dokunur; politikanın geri kalanı
// vercel.json'da elle yönetilir. Veri blokları (application/json, ld+json)
// çalıştırılmadığı için CSP'ye takılmaz, özetlenmez.
//
// Ayrıca CSP'nin engelleyeceği iki şeyi hata sayar: satır içi olay işleyicisi
// (onclick= vb.) ve javascript: bağlantısı. İkisi de addEventListener'a
// taşınmalı. Başka sunucudan gelen <script src> da hata: script-src yalnız 'self'.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KOK = path.join(__dirname, '..', '..');
const VERCEL = path.join(KOK, 'vercel.json');
const CSP = 'content-security-policy';

// Vercel'in yayına hiç almadığı klasörler + .vercelignore. Desenler köke
// bağlı eşleşir; şüphede dosyayı taramak güvenli taraf (fazladan özet zararsız,
// eksik özet betiği kırar).
function yoksayilanlar() {
  const desenler = ['.git', 'node_modules', '.vercel'];
  const dosya = path.join(KOK, '.vercelignore');
  if (fs.existsSync(dosya)) {
    for (const satir of fs.readFileSync(dosya, 'utf8').split(/\r?\n/)) {
      const d = satir.trim();
      if (d && !d.startsWith('#') && !d.startsWith('!')) desenler.push(d.replace(/^\/+|\/+$/g, ''));
    }
  }
  return desenler.map((d) => new RegExp('^' + d.split('*').map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '(/|$)'));
}

function htmlDosyalari() {
  const atla = yoksayilanlar();
  const sonuc = [];
  (function gez(goreli) {
    for (const g of fs.readdirSync(path.join(KOK, goreli), { withFileTypes: true })) {
      const yol = goreli ? goreli + '/' + g.name : g.name;
      if (atla.some((re) => re.test(yol))) continue;
      if (g.isDirectory()) gez(yol);
      else if (/\.html?$/i.test(g.name)) sonuc.push(yol);
    }
  })('');
  return sonuc.sort();
}

function nitelikler(ham) {
  const n = {};
  const re = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(ham))) n[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return n;
}

// HTML standardındaki JavaScript MIME türleri + CSP'ye tabi diğer satır içi türler.
const JS_TURLERI = new Set([
  '', 'module', 'importmap', 'speculationrules',
  'application/ecmascript', 'application/javascript', 'application/x-ecmascript', 'application/x-javascript',
  'text/ecmascript', 'text/javascript', 'text/javascript1.0', 'text/javascript1.1', 'text/javascript1.2',
  'text/javascript1.3', 'text/javascript1.4', 'text/javascript1.5', 'text/jscript', 'text/livescript',
  'text/x-ecmascript', 'text/x-javascript',
]);

// Tarayıcı özeti, ayrıştırıcının satır sonlarını LF'ye çevirdiği metin
// üzerinden hesaplar; Windows'taki CRLF çalışma kopyası aynı özeti vermeli.
const ozet = (metin) => crypto.createHash('sha256').update(metin.replace(/\r\n?/g, '\n'), 'utf8').digest('base64');

function tara(dosya) {
  const html = fs.readFileSync(path.join(KOK, dosya), 'utf8');
  const betikler = [];
  const hatalar = [];
  const satir = (i) => html.slice(0, i).split('\n').length;
  const nitelik = '\\s+[^\\s"\'>\\/=]+(?:\\s*=\\s*(?:"[^"]*"|\'[^\']*\'|[^\\s"\'=<>`]+))?';
  const re = new RegExp(
    '<!--[\\s\\S]*?-->' +
    '|<(script|style|textarea|title)\\b([^>]*)>([\\s\\S]*?)<\\/\\1\\s*>' +
    '|<[a-zA-Z][^\\s\\/>]*((?:' + nitelik + ')*)\\s*\\/?>',
    'gi');
  let m;
  while ((m = re.exec(html))) {
    const n = nitelikler(m[2] ?? m[4] ?? '');
    for (const [ad, deger] of Object.entries(n)) {
      if (/^on/.test(ad)) hatalar.push(`${dosya}:${satir(m.index)}: satır içi olay işleyicisi ${ad}= (CSP engeller; addEventListener kullan)`);
      if (/^\s*javascript:/i.test(deger)) hatalar.push(`${dosya}:${satir(m.index)}: javascript: bağlantısı ${ad}= (CSP engeller)`);
    }
    if (!m[1] || m[1].toLowerCase() !== 'script') continue;
    if ('src' in n) {
      if (/^(https?:)?\/\//i.test(n.src.trim())) hatalar.push(`${dosya}:${satir(m.index)}: başka sunucudan betik ${n.src} (script-src yalnız 'self')`);
      continue;
    }
    const tur = 'type' in n ? n.type.trim().toLowerCase() : '';
    if (!JS_TURLERI.has(tur)) continue;
    betikler.push({ dosya, satir: satir(m.index), ozet: ozet(m[3]) });
  }
  return { betikler, hatalar };
}

function cspBul(json) {
  const bulunan = [];
  for (const kural of json.headers || []) {
    for (const b of kural.headers || []) if (String(b.key).toLowerCase() === CSP) bulunan.push(b);
  }
  if (bulunan.length !== 1) throw new Error(`vercel.json'da tek bir Content-Security-Policy başlığı bekleniyordu, ${bulunan.length} bulundu`);
  return bulunan[0];
}

const OZET_PARCASI = /^'sha(256|384|512)-[A-Za-z0-9+/=_-]+'$/;

function hesapla() {
  const dosyalar = htmlDosyalari();
  const betikler = [];
  const hatalar = [];
  for (const d of dosyalar) {
    const t = tara(d);
    betikler.push(...t.betikler);
    hatalar.push(...t.hatalar);
  }
  const ozetler = [...new Set(betikler.map((b) => b.ozet))];
  return { dosyalar, betikler, hatalar, ozetler };
}

function scriptSrcAyir(deger) {
  const yonergeler = deger.split(';').map((y) => y.trim()).filter(Boolean);
  const i = yonergeler.findIndex((y) => /^script-src(\s|$)/i.test(y));
  if (i < 0) throw new Error('CSP\'de script-src yok');
  const parcalar = yonergeler[i].split(/\s+/).slice(1);
  return { yonergeler, i, parcalar };
}

// vercel.json'ı baştan biçimlendirmemek için yalnız CSP dizesini değiştirir.
function guncelle({ kontrol = false, sessiz = false } = {}) {
  const ayrinti = (s) => { if (!sessiz) console.log(s); };
  const yaz = (s) => console.log(s);
  const ham = fs.readFileSync(VERCEL, 'utf8');
  const json = JSON.parse(ham);
  const baslik = cspBul(json);
  const { yonergeler, i, parcalar } = scriptSrcAyir(baslik.value);
  const { dosyalar, betikler, hatalar, ozetler } = hesapla();

  const mevcut = parcalar.filter((p) => OZET_PARCASI.test(p)).map((p) => p.slice(1, -1).replace(/^sha256-/, ''));
  const eksik = ozetler.filter((o) => !mevcut.includes(o));
  const fazla = mevcut.filter((o) => !ozetler.includes(o));

  ayrinti(`${dosyalar.length} HTML dosyası, ${betikler.length} satır içi betik, ${ozetler.length} farklı özet`);
  for (const b of betikler) ayrinti(`  ${b.dosya}:${b.satir}  sha256-${b.ozet}`);

  if (kontrol) {
    for (const o of eksik) {
      const b = betikler.find((x) => x.ozet === o);
      hatalar.push(`CSP'de eksik özet: ${b.dosya}:${b.satir} sha256-${o} (node tool/csp/uret.js çalıştır)`);
    }
    for (const o of fazla) hatalar.push(`CSP'de artık kullanılmayan özet: ${o} (node tool/csp/uret.js çalıştır)`);
    if (hatalar.length) {
      for (const h of hatalar) console.error('HATA ' + h);
      process.exitCode = 1;
      return false;
    }
    yaz('CSP özetleri sayfalarla eşleşiyor.');
    return true;
  }

  if (hatalar.length) {
    for (const h of hatalar) console.error('HATA ' + h);
    throw new Error('CSP\'nin engelleyeceği yapılar var; önce onları düzelt');
  }

  if (!eksik.length && !fazla.length) {
    yaz('vercel.json CSP özetleri güncel.');
    return true;
  }
  const yeniParcalar = parcalar.filter((p) => !OZET_PARCASI.test(p)).concat(ozetler.map((o) => `'sha256-${o}'`));
  yonergeler[i] = ['script-src', ...yeniParcalar].join(' ');
  const yeniDeger = yonergeler.join('; ');
  const eskiDize = JSON.stringify(baslik.value);
  let yeni;
  if (ham.split(eskiDize).length === 2) {
    yeni = ham.replace(eskiDize, () => JSON.stringify(yeniDeger));
  } else {
    baslik.value = yeniDeger;
    const crlf = ham.includes('\r\n');
    yeni = JSON.stringify(json, null, 2) + '\n';
    if (crlf) yeni = yeni.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(VERCEL, yeni, 'utf8');
  yaz(`vercel.json CSP güncellendi: ${eksik.length} özet eklendi, ${fazla.length} özet çıkarıldı.`);
  return true;
}

module.exports = { guncelle };

if (require.main === module) {
  try {
    guncelle({ kontrol: process.argv.includes('--kontrol') });
  } catch (e) {
    console.error('HATA ' + e.message);
    process.exitCode = 1;
  }
}
