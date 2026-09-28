// Ana sayfadaki değer hesabının GEÇİCİ fiyat tablosu → fiyatlar.json
//
// Neden var: uygulama yayına girmeden canlıda hesap için yeterli teklif ve
// ilan yok (API en az 3 farklı satıcı istiyor). Kullanıcı kararı (28 Eyl
// 2026): şimdilik elle hazırlanmış bir tablo, sonra API'ye bağlanacak
// (GET api/PhoneValue/estimate; sözleşme TelefonPazar'da PhoneValueController).
//
// Fiyatlar TAHMİNİ: Eylül 2026'da yenilenmiş/ikinci el perakende fiyatlarından
// (akakçe, cimri, getmobil, easycep vb. aramaları) kalibre edildi. Tablodaki
// sayı "mağazadan alırsan" ORTA değeri, en iyi durum için: ekran 5, kasa 5,
// pil %90+, değişen parça yok, garanti yok (API'deki durum çarpanı F = 1).
// Diğer depolamalar her kademe için `adim` oranıyla büyüyor.
//
// Model adları ve depolama seçenekleri uygulamanın kataloğundan okunuyor ki
// ileride API'ye geçişte aynı adlar gitsin. Katalogda olmayan bir model yazılırsa
// betik hata verip duruyor.
//
// Çalıştırma: node tool/ana-sayfa/fiyat-tablosu-uret.js
// Mobil depo varsayılan olarak ../oncep_mobile; başka yerdeyse ONCEP_MOBIL.
const fs = require('fs');
const path = require('path');

const MOBIL = process.env.ONCEP_MOBIL || path.join(__dirname, '..', '..', '..', 'oncep_mobile');
const oku = (p) => fs.readFileSync(path.join(MOBIL, p), 'utf8');

function haritaGovdesi(kaynak, bas) {
  const i = kaynak.indexOf(bas);
  if (i < 0) throw new Error(`Bulunamadı: ${bas}`);
  const j = kaynak.indexOf('\n};', i);
  return kaynak.slice(i, j);
}

function listeHaritasi(govde) {
  const sonuc = {};
  for (const m of govde.matchAll(/'([^']+)':\s*\[([\s\S]*?)\]/g)) {
    sonuc[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }
  return sonuc;
}

const katalogDart = oku('lib/constants/phone_catalog.dart');
const katalog = listeHaritasi(haritaGovdesi(katalogDart, 'const Map<String, List<String>> phoneCatalog = {'));
const eklemeler = listeHaritasi(haritaGovdesi(katalogDart, 'const Map<String, List<String>> _katalogEklemeleri = {'));
const depolamalar = listeHaritasi(haritaGovdesi(oku('lib/constants/phone_storage_data.dart'), 'const Map<String, List<String>> _modelStorages = {'));
const VARSAYILAN = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
const SIRA = ['16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB'];

// [marka, model, en küçük depolamanın fiyatı, kademe oranı, depolama (katalogda yoksa)]
const ORTA = ['128 GB', '256 GB'];
const UST = ['128 GB', '256 GB', '512 GB'];
const TABLO = [
  ['Apple', 'iPhone 11', 9500, 0.10],
  ['Apple', 'iPhone 11 Pro', 11500, 0.09],
  ['Apple', 'iPhone 11 Pro Max', 13500, 0.09],
  ['Apple', 'iPhone SE (2. Nesil)', 6500, 0.10],
  ['Apple', 'iPhone 12 Mini', 11000, 0.09],
  ['Apple', 'iPhone 12', 13500, 0.09],
  ['Apple', 'iPhone 12 Pro', 19000, 0.09],
  ['Apple', 'iPhone 12 Pro Max', 22000, 0.09],
  ['Apple', 'iPhone 13 Mini', 18500, 0.08],
  ['Apple', 'iPhone 13', 24500, 0.08],
  ['Apple', 'iPhone 13 Pro', 31000, 0.08],
  ['Apple', 'iPhone 13 Pro Max', 35000, 0.08],
  ['Apple', 'iPhone SE (3. Nesil)', 11000, 0.09],
  ['Apple', 'iPhone 14', 30000, 0.08],
  ['Apple', 'iPhone 14 Plus', 32500, 0.08],
  ['Apple', 'iPhone 14 Pro', 41000, 0.09],
  ['Apple', 'iPhone 14 Pro Max', 47000, 0.09],
  ['Apple', 'iPhone 15', 42000, 0.08],
  ['Apple', 'iPhone 15 Plus', 46000, 0.08],
  ['Apple', 'iPhone 15 Pro', 56000, 0.08],
  ['Apple', 'iPhone 15 Pro Max', 66000, 0.08],
  ['Apple', 'iPhone 16e', 40000, 0.08],
  ['Apple', 'iPhone 16', 55000, 0.08],
  ['Apple', 'iPhone 16 Plus', 60000, 0.08],
  ['Apple', 'iPhone 16 Pro', 70000, 0.09],
  ['Apple', 'iPhone 16 Pro Max', 84000, 0.08],
  ['Apple', 'iPhone 17', 70000, 0.10],
  ['Apple', 'iPhone Air', 78000, 0.10],
  ['Apple', 'iPhone 17 Pro', 95000, 0.10],
  ['Apple', 'iPhone 17 Pro Max', 108000, 0.10],

  ['Samsung', 'Galaxy S21 FE', 10500, 0.07, ORTA],
  ['Samsung', 'Galaxy S21', 12500, 0.07],
  ['Samsung', 'Galaxy S21+', 14000, 0.07],
  ['Samsung', 'Galaxy S21 Ultra', 17500, 0.07],
  ['Samsung', 'Galaxy S22', 15500, 0.07],
  ['Samsung', 'Galaxy S22+', 18000, 0.07],
  ['Samsung', 'Galaxy S22 Ultra', 23000, 0.07],
  ['Samsung', 'Galaxy S23 FE', 16500, 0.07, ORTA],
  ['Samsung', 'Galaxy S23', 21000, 0.07],
  ['Samsung', 'Galaxy S23+', 24500, 0.07],
  ['Samsung', 'Galaxy S23 Ultra', 30500, 0.07],
  ['Samsung', 'Galaxy S24 FE', 22000, 0.07, ORTA],
  ['Samsung', 'Galaxy S24', 29500, 0.07],
  ['Samsung', 'Galaxy S24+', 34000, 0.07],
  ['Samsung', 'Galaxy S24 Ultra', 43000, 0.07],
  ['Samsung', 'Galaxy S25', 38000, 0.07],
  ['Samsung', 'Galaxy S25+', 43500, 0.07],
  ['Samsung', 'Galaxy S25 Ultra', 56000, 0.07],
  ['Samsung', 'Galaxy S25 Edge', 45000, 0.07],
  ['Samsung', 'Galaxy Z Flip 5', 21000, 0.07],
  ['Samsung', 'Galaxy Z Flip 6', 30000, 0.07],
  ['Samsung', 'Galaxy Z Fold 5', 36000, 0.07],
  ['Samsung', 'Galaxy Z Fold 6', 50000, 0.07],
  ['Samsung', 'Galaxy A14', 4000, 0.08, ['64 GB', '128 GB']],
  ['Samsung', 'Galaxy A15', 4800, 0.08, ORTA],
  ['Samsung', 'Galaxy A24', 5500, 0.08, ORTA],
  ['Samsung', 'Galaxy A25', 7000, 0.08, ORTA],
  ['Samsung', 'Galaxy A34', 7500, 0.08, ORTA],
  ['Samsung', 'Galaxy A35', 9500, 0.08, ORTA],
  ['Samsung', 'Galaxy A36', 11500, 0.08, ORTA],
  ['Samsung', 'Galaxy A54', 9500, 0.08, ORTA],
  ['Samsung', 'Galaxy A55', 12000, 0.08, ORTA],
  ['Samsung', 'Galaxy A56', 15000, 0.08, ORTA],

  ['Xiaomi', 'Redmi Note 11', 4500, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 11 Pro', 6000, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 12', 5500, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 12 Pro', 7500, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 13', 7500, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 13 Pro', 12000, 0.08, UST],
  ['Xiaomi', 'Redmi Note 13 Pro+', 13500, 0.08, ['256 GB', '512 GB']],
  ['Xiaomi', 'Redmi Note 14', 9500, 0.08, ORTA],
  ['Xiaomi', 'Redmi Note 14 Pro', 13000, 0.08, UST],
  ['Xiaomi', 'Redmi Note 14 Pro+', 16500, 0.08, ['256 GB', '512 GB']],
  ['Xiaomi', 'Xiaomi 13T', 15000, 0.08, ['256 GB']],
  ['Xiaomi', 'Xiaomi 13T Pro', 18000, 0.08, ['256 GB', '512 GB', '1 TB']],
  ['Xiaomi', 'Xiaomi 14T', 19500, 0.08, ['256 GB', '512 GB']],
  ['Xiaomi', 'Xiaomi 14T Pro', 23500, 0.08, ['256 GB', '512 GB', '1 TB']],
  ['Xiaomi', 'Xiaomi 14', 25000, 0.08, ['256 GB', '512 GB']],
  ['Xiaomi', 'Xiaomi 14 Ultra', 38000, 0.08, ['512 GB']],
  ['Xiaomi', 'Poco X6 Pro', 11000, 0.08, ['256 GB', '512 GB']],
  ['Xiaomi', 'Poco F6', 13500, 0.08, ['256 GB', '512 GB']],

  ['Google', 'Pixel 7', 11000, 0.08, ORTA],
  ['Google', 'Pixel 7 Pro', 14000, 0.08, UST],
  ['Google', 'Pixel 8', 16500, 0.08, ORTA],
  ['Google', 'Pixel 8 Pro', 21500, 0.08, UST],
  ['Google', 'Pixel 9', 25500, 0.08, ORTA],
  ['Google', 'Pixel 9 Pro', 32000, 0.08, UST],
  ['Google', 'Pixel 9 Pro XL', 35500, 0.08, UST],
];

const yuvarla = (x) => Math.round(x / 500) * 500;
const hatalar = [];
const cikti = {};

for (const [marka, model, taban, adim, elle] of TABLO) {
  const modeller = [...(katalog[marka] || []), ...(eklemeler[marka] || [])];
  if (!modeller.includes(model)) { hatalar.push(`${marka} / ${model} katalogda yok`); continue; }
  const liste = depolamalar[model] || elle || VARSAYILAN;
  if (!depolamalar[model] && !elle) hatalar.push(`${model}: katalogda depolama yok, elle yaz`);
  const ilk = SIRA.indexOf(liste[0]);
  const fiyat = {};
  for (const d of liste) {
    const k = SIRA.indexOf(d) - ilk;
    if (k < 0 || SIRA.indexOf(d) < 0) { hatalar.push(`${model}: depolama sırası bozuk (${d})`); continue; }
    fiyat[d] = yuvarla(taban * Math.pow(1 + adim, k));
  }
  (cikti[marka] ||= {})[model] = fiyat;
}

if (hatalar.length) {
  console.error(hatalar.join('\n'));
  process.exit(1);
}

const dosya = path.join(__dirname, 'fiyatlar.json');
fs.writeFileSync(dosya, JSON.stringify({
  surum: '2026-09',
  not: 'Tahmini ikinci el fiyatları; mağazadan alış ORTA değeri, en iyi durum (F = 1). Kaynak: fiyat-tablosu-uret.js',
  fiyatlar: cikti,
}, null, 1) + '\n');
const adet = Object.values(cikti).reduce((a, m) => a + Object.keys(m).length, 0);
console.log(`${adet} model yazıldı → ${path.relative(process.cwd(), dosya)}`);
