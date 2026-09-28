// Ana sayfayı (index.html) üretir. Çalıştırma: node tool/ana-sayfa/uret.js
//
// Kaynaklar:
//   ekranlar.js    — telefon ekranı çizimleri (sabit boyutlu, satır içi stil)
//   fiyatlar.json  — değer hesabının geçici fiyat tablosu (fiyat-tablosu-uret.js)
// Sayfa düzeni bu dosyada, sınıflarla; telefonda ve masaüstünde aynı HTML.
//
// Sitedeki her iddia uygulamanın metinlerine dayanıyor (app_tr.arb: yasal
// metinler ve yardım). Yeni bir cümle eklerken önce orada karşılığına bak;
// "24 saatte inceleme" ve "reklam yok" gibi karşılığı olmayanlar bilerek yok.
const fs = require('fs');
const path = require('path');
const { K, S, ic, pic, RENK, dukkan } = require('./ekranlar');
const VERI = require('./fiyatlar.json');

// ---------- Değer hesabı ----------
// Durum çarpanları API'deki PhoneValueRules ile aynı (ekran, kasa, pil,
// değişen parça, garanti). Tablo "mağazadan alış ORTA, F = 1" veriyor; aralık
// ve satış tarafı buradaki sabit oranlarla türüyor. API'ye geçince bu işlev
// ve tablo gidecek, yanıtın low/median/high'ı doğrudan yazılacak.
function degerHesapla(taban, d) {
  var R = function (x) { return Math.round(x / 500) * 500; };
  var E = { 5: 1, 4: 0.95, 3: 0.88, 2: 0.78, 1: 0.65 }[d.ekran] || 1;
  var Ks = { 5: 1, 4: 0.97, 3: 0.92, 2: 0.85, 1: 0.75 }[d.kasa] || 1;
  var P = { '90': 1, '85': 0.97, '80': 0.93, '0': 0.85 }[d.pil] || 1;
  var F = E * Ks * P * (d.degisen ? 0.85 : 1) * (d.garanti ? 1.05 : 1);
  var q = function (v) { return Math.max(500, R(v * F)); };
  var al = R(taban), sat = R(taban * 0.82);
  return {
    sat: [q(R(sat * 0.92)), q(sat), q(R(sat * 1.06))],
    al: [q(R(al * 0.93)), q(al), q(R(al * 1.07))],
  };
}

// Uygulamadaki sıra (getModelsForBrand): seriler ilk görülme sırasında, her
// serinin içi yeniden eskiye.
function modelSirasi(modeller) {
  const seri = (m) => { const i = m.search(/\d/); return i < 0 ? m : m.slice(0, i); };
  const sayi = (m) => { const e = m.match(/\d+/); return e ? +e[0] : 0; };
  const gruplar = new Map();
  for (const m of modeller) { const s = seri(m); if (!gruplar.has(s)) gruplar.set(s, []); gruplar.get(s).push(m); }
  return [...gruplar.values()].flatMap((g) => g.sort((a, b) => (sayi(b) - sayi(a)) || b.localeCompare(a)));
}

const KATALOG = Object.entries(VERI.fiyatlar).map(([marka, modeller]) => [
  marka, modelSirasi(Object.keys(modeller)).map((m) => [m, Object.entries(modeller[m])]),
]);

const BASLANGIC = { marka: 'Apple', model: 'iPhone 14 Pro', depolama: '256 GB', ekran: 4, kasa: 3, pil: '90', degisen: false, garanti: false };
const tl = (n) => n.toLocaleString('tr-TR');

// Çizelgede iki taraf aynı ölçekte: satış bandı alışın solunda durur.
function olcek(s) {
  const lo = s.sat[0] * 0.9, hi = s.al[2] * 1.05;
  const yuzde = (v) => Math.round(((v - lo) / (hi - lo)) * 1000) / 10;
  return {
    sat: { sol: yuzde(s.sat[0]), gen: Math.round((yuzde(s.sat[2]) - yuzde(s.sat[0])) * 10) / 10, orta: yuzde(s.sat[1]) },
    al: { sol: yuzde(s.al[0]), gen: Math.round((yuzde(s.al[2]) - yuzde(s.al[0])) * 10) / 10, orta: yuzde(s.al[1]) },
  };
}

const ilkSonuc = degerHesapla(VERI.fiyatlar[BASLANGIC.marka][BASLANGIC.model][BASLANGIC.depolama], BASLANGIC);
const ilkOlcek = olcek(ilkSonuc);

// ---------- Küçük parçalar ----------
const tik = (c = K.navy) => ic('check', 18, c, 2.4);
const maddeler = (arr, c) => `<ul class="maddeler">${arr.map((s) => `<li>${tik(c)}<span>${s}</span></li>`).join('')}</ul>`;
const LOGO = '<b>ON</b><i>CEP</i>';

// ---------- Bölümler ----------
function ust() {
  const L = [['#hesap', 'Değer hesapla'], ['#gez', 'Mağazaları gez'], ['#ozellikler', 'Özellikler'], ['#guvenlik', 'Güvenlik'], ['#magaza', 'Mağazalar için'], ['#sss', 'Sorular']];
  const linkler = L.map(([h, s]) => `<a href="${h}">${s}</a>`).join('');
  return `<header class="ust">
  <div class="kap">
    <a class="logo" href="#" aria-label="ONCEP ana sayfa">${LOGO}</a>
    <nav class="ana-nav" aria-label="Bölümler">${linkler}</nav>
    <a class="cta" href="#indir">Çıkınca haber ver</a>
    <details class="menu">
      <summary aria-label="Menü">${ic('menu', 20, K.navy)}</summary>
      <nav aria-label="Bölümler">${linkler}<a href="#indir">Çıkınca haber ver</a></nav>
    </details>
  </div>
</header>`;
}

function acilisTel() {
  const off = (n, s, a, top) => `<div style="background: #FFFFFF; ${top ? `border: 2px solid ${K.org};` : ''} border-radius: 16px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;"><div style="display: flex; flex-direction: column; gap: 2px;"><span style="font-weight: 600; font-size: 15px;">${n}</span><span style="font-size: 12px; color: ${K.mut};">Onaylı · ★ ${s}</span></div><span style="font-weight: 700; font-size: 18px; font-variant-numeric: tabular-nums; ${top ? `color: ${K.org};` : ''}">${a} TL</span></div>`;
  return `<div style="width: 340px; height: 680px; box-sizing: border-box; border-radius: 48px; background: ${K.frame}; padding: 12px; flex-shrink: 0; font-family: 'Onest', system-ui, sans-serif; color: ${K.ink};"><div style="width: 100%; height: 100%; border-radius: 38px; background: ${K.bg}; overflow: hidden; display: flex; flex-direction: column;">
    <div style="background: ${K.navy}; color: #FFFFFF; padding: 40px 22px 22px; display: flex; flex-direction: column; gap: 6px;"><div style="font-size: 13px; opacity: 0.75;">iPhone 14 Pro · 256 GB · Kadıköy</div><div style="font-size: 22px; font-weight: 700;">Gelen teklifler</div></div>
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">${off('Üsküdar GSM', '4,9', '36.800', true)}${off('Şişli Telekom', '4,7', '34.200')}${off('Beşiktaş Mobil', '4,8', '33.900')}${off('Kadıköy Cep', '4,6', '32.500')}<div style="margin-top: 6px; background: ${K.org}; color: #FFFFFF; text-align: center; border-radius: 14px; padding: 14px; font-weight: 600; font-size: 16px;">En iyi teklifi kabul et</div><div style="text-align: center; font-size: 11px; color: #8A91AA;">Örnek ekran</div></div>
  </div></div>`;
}

function acilis() {
  const kisayol = (h, a, b, i) => `<a class="kisayol" href="${h}"><span class="kisayol-ikon">${ic(i, 19, K.org)}</span><span><b>${a}</b><small>${b}</small></span></a>`;
  return `<section class="acilis">
  <div class="kap">
    <div class="acilis-metin">
      <div class="ust-yazi">İKİNCİ EL TELEFON</div>
      <h1>Telefonunu sat, <br class="genis">mağazalar teklif versin.</h1>
      <p class="ozet">İlanını koy. Şehrindeki onaylı telefoncular teklif versin. Teklifleri yan yana gör, en iyisini seç, mağazada elden teslim et.</p>
      <div class="dugmeler"><a class="dugme turuncu" href="#indir">Uygulama çıkınca haber ver</a><a class="dugme acik" href="#magaza">Mağazam var</a></div>
      <div class="sayilar"><div><b>0 TL</b>komisyon</div><div><b>Kargo yok</b>elden teslim</div><div><b>30 gün</b>ilan yayında</div></div>
      <div class="kisayollar">${kisayol('#hesap', 'Telefonun kaç eder?', 'Hemen hesapla', 'calc')}${kisayol('#gez', 'Mağazaları gez', 'Bütün vitrinler tek ekranda', 'store')}</div>
    </div>
    <div class="acilis-tel" aria-hidden="true">${acilisTel()}</div>
  </div>
</section>`;
}

function hesap() {
  const adim = (n, a, b) => `<li><span class="adim-no">${n}</span><span><b>${a}</b>${b}</span></li>`;
  const secenek = (arr, secili) => arr.map(([v, s]) => `<option value="${v}"${v === secili ? ' selected' : ''}>${s}</option>`).join('');
  const markalar = KATALOG.map(([m]) => [m, m]);
  const modeller = KATALOG.find(([m]) => m === BASLANGIC.marka)[1].map(([m]) => [m, m]);
  const depolar = Object.keys(VERI.fiyatlar[BASLANGIC.marka][BASLANGIC.model]).map((d) => [d, d]);
  const seg = (ad, baslik, secili) => `<fieldset class="seg-alan"><legend>${baslik}</legend><div class="seg">${['Kötü', 'Orta', 'İyi', 'Çok iyi', 'Mükemmel'].map((s, i) => `<label><input type="radio" name="${ad}" value="${i + 1}"${i + 1 === secili ? ' checked' : ''}><span>${s}</span></label>`).join('')}</div></fieldset>`;
  const taraf = (sinif, baslik, s, o) => `<div class="taraf ${sinif}" data-taraf="${sinif}">
        <h3>${baslik}</h3>
        <div class="aralik"><b><span data-k="0">${tl(s[0])}</span> – <span data-k="2">${tl(s[2])}</span></b><span>TL</span></div>
        <div class="cizelge"><i class="bant-i" style="left: ${o.sol}%; width: ${o.gen}%;"></i><i class="nokta" style="left: ${o.orta}%;"></i></div>
        <div class="uclar"><span>Düşük <b data-k="0">${tl(s[0])}</b></span><span>Orta <b data-k="1">${tl(s[1])}</b></span><span>Yüksek <b data-k="2">${tl(s[2])}</b></span></div>
      </div>`;
  return `<section id="hesap" class="lacivert-bolum">
  <div class="kap">
    <div class="hesap-metin">
      <div class="ust-yazi acik">TELEFON DEĞERİ HESAPLA</div>
      <h2>Telefonun kaç eder? Satmadan önce öğren.</h2>
      <p>Modelini ve durumunu seç; mağazaya satarsan ne alacağını, mağazadan alırsan ne ödeyeceğini gör.</p>
      <ol class="adim-liste">${adim(1, 'Hangi telefon?', 'Marka, model, depolama.')}${adim(2, 'Ekran ve kasa', 'Beş basamaktan birini seç.')}${adim(3, 'Pil ve ekstralar', 'İstersen pil sağlığı, değişen parça, garanti.')}</ol>
    </div>
    <div class="hesap-kart">
      <form id="deger-form" class="hesap-form" novalidate>
        <fieldset>
          <legend><span>1</span>Hangi telefon?</legend>
          <div class="alanlar telefon-sec">
            <label class="alan a-marka">Marka<select name="marka">${secenek(markalar, BASLANGIC.marka)}</select></label>
            <label class="alan a-model">Model<select name="model">${secenek(modeller, BASLANGIC.model)}</select></label>
            <label class="alan a-depolama">Depolama<select name="depolama">${secenek(depolar, BASLANGIC.depolama)}</select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend><span>2</span>Ekran ve kasa</legend>
          <div class="alanlar iki">${seg('ekran', 'Ekran', BASLANGIC.ekran)}${seg('kasa', 'Kasa', BASLANGIC.kasa)}</div>
          <p class="ipucu">Dürüst seçim daha doğru fiyat verir: çizikleri ve kırıkları hesaba kat.</p>
        </fieldset>
        <details class="ekstra" open>
          <summary><span class="adim-rozet">3</span><span class="ekstra-baslik">Pil ve ekstralar <small>isteğe bağlı</small></span><span class="ekstra-ozet" data-ozet>%90 ve üstü · Değişen yok · Garanti yok</span><span class="ekstra-ok">${ic('down', 16, K.mut)}</span></summary>
          <fieldset>
            <legend class="gizli">Pil ve ekstralar</legend>
            <div class="alanlar">
              <label class="alan">Pil sağlığı<select name="pil">${secenek([['', 'Bilmiyorum'], ['90', '%90 ve üstü'], ['85', '%85–89'], ['80', '%80–84'], ['0', '%80’in altı']], BASLANGIC.pil)}</select></label>
              <label class="alan">Değişen parça<select name="degisen">${secenek([['0', 'Yok'], ['1', 'Var']], '0')}</select></label>
              <label class="alan">Garanti<select name="garanti">${secenek([['0', 'Yok ya da bitti'], ['1', 'Devam ediyor']], '0')}</select></label>
            </div>
          </fieldset>
        </details>
      </form>
      <div class="sonuc" aria-live="polite">
        ${taraf('sat', 'Mağazaya satarsan', ilkSonuc.sat, ilkOlcek.sat)}
        ${taraf('al', 'Mağazadan alırsan', ilkSonuc.al, ilkOlcek.al)}
      </div>
      <div class="pay">${ic('tag', 18, K.navy)}<span>Aradaki fark mağazanın payı: ~<b data-pay>${tl(ilkSonuc.al[1] - ilkSonuc.sat[1])}</b> TL</span></div>
      <div class="hesap-dugmeler">
        <a class="dugme turuncu" href="#indir">Uygulama çıkınca ilan ver</a>
        <a class="dugme cerceve" href="#al">Satıştaki benzerlerine bak</a>
        <a class="dugme cerceve" href="#gez">Mağazaları gez</a>
      </div>
      <p class="dipnot">Şimdilik ikinci el piyasa fiyatlarına dayanan bir tahmin (Eylül 2026); kesin fiyat değildir. Uygulama yayına girince hesap, ONCEP'teki gerçek teklif ve ilanlardan yapılacak. Listede olmayan modeller o zaman eklenecek.</p>
    </div>
  </div>
</section>`;
}

function gez() {
  const shops = [
    ['Üsküdar GSM', '4,9', 42, 'Üsküdar', [RENK.mor, RENK.gece, RENK.gumus]],
    ['Kadıköy Cep', '4,6', 31, 'Kadıköy', [RENK.yesil, RENK.krem, RENK.siyah]],
    ['Beşiktaş Mobil', '4,8', 27, 'Beşiktaş', [RENK.mavi, RENK.mor, RENK.kirmizi]],
    ['Şişli Telekom', '4,7', 28, 'Şişli', [RENK.krem, RENK.gece, RENK.yesil]],
  ].map(([a, b, c, d, e]) => dukkan(a, b, c, d, e, false)).join('');
  return `<section id="gez" class="gez">
  <div class="kap">
    <div class="tur-metin">
      <div class="ust-yazi">MAĞAZALARI GEZ</div>
      <h2>Telefoncu telefoncu gezme. Bütün vitrinler cebinde.</h2>
      <p class="giris-metin">Şehrindeki onaylı telefoncuların satıştaki bütün telefonları tek ekranda. Dükkân dükkân dolaşmadan bak, beğendiğin için mağazaya git.</p>
      ${maddeler(['Fiyatı, pil sağlığını, ekran ve kasa puanını evden karşılaştır', 'Şehrini ve ilçeni seç; o mağazaların bütün ilanları tek listede', 'Beğendiğin telefonu mağazaya yaz, sor, sonra git', 'Her mağazanın puanı ve yorumları ilanın altında'])}
      <div class="dugmeler"><a class="dugme turuncu" href="#al">Vitrine göz at</a><span class="not">${ic('user', 15, K.mut)}Bakmak için hesap gerekmez</span></div>
    </div>
    <div class="gez-gorsel" aria-hidden="true">
      <div class="dukkanlar">${shops}</div>
      <div class="ok"><span class="daire">${ic('arrow', 24, '#FFFFFF', 2.6)}</span><span>4 mağaza<br>tek listede</span></div>
      <div class="gez-tel">${S.vitrin()}</div>
    </div>
  </div>
</section>`;
}

// Metin + üç telefon ekranı.
function tur(id, { eb, baslik, alt, madde, ekranlar, sinif = 'gri', ek = '', koyu = false }) {
  return `<section id="${id}" class="tur ${sinif}">
  <div class="kap">
    <div class="tur-metin">
      <div class="ust-yazi${koyu ? ' acik' : ''}">${eb}</div>
      <h2>${baslik}</h2>
      <p class="giris-metin">${alt}</p>
      ${maddeler(madde, koyu ? K.org : K.navy)}
      ${ek}
    </div>
    <div class="telefonlar" aria-hidden="true">${ekranlar.join('')}</div>
  </div>
</section>`;
}

function yasam() {
  const d = [['BEKLEMEDE', 'İncelenir'], ['YAYINDA', '30 gün teklif alır'], ['7 · 2 GÜN KALA', 'Hatırlatma gelir'], ['SATILDI / YENİLE', 'Sen seçersin']];
  return `<ol class="yasam">${d.map(([a, b], i) => `<li${i === 1 ? ' class="simdi"' : ''}><span class="no">${i + 1}</span><b>${a}</b><span>${b}</span></li>`).join('')}</ol>`;
}

function karsiKart() {
  const rows = [
    ['EKRAN', 'Yenileme hızı', '60 Hz', '120 Hz', 50, 100, 'R', '%100 daha fazla'],
    ['PERFORMANS', 'RAM', '4 GB', '6 GB', 67, 100, 'R', '%50 daha fazla'],
    ['PİL VE ŞARJ', 'Batarya', '3.227 mAh', '3.200 mAh', 100, 99, 'L', '%1 daha fazla'],
    ['KAMERA', 'Ana kamera', '12 MP', '48 MP', 25, 100, 'R', '%300 daha fazla'],
    ['DİĞER', 'Ağırlık', '173 g', '206 g', 84, 100, 'L', '%16 daha hafif'],
  ];
  const bar = (v, lead, sag) => `<div class="olcu-cubuk${sag ? ' sag' : ''}"><i style="width: ${v}%;"${lead ? ' class="onde"' : ''}></i></div>`;
  const r = ([g, l, a, b, va, vb, lead, not]) => `<div class="olcu">
        <div class="olcu-ad"><small>${g}</small><b>${l}</b></div>
        <div class="olcu-deger">
          <div class="olcu-sayi"><span${lead === 'L' ? ' class="onde-sol"' : ''}>${a}</span><span${lead === 'R' ? ' class="onde-sag"' : ''}>${b}</span></div>
          <div class="olcu-cubuklar">${bar(va, lead === 'L', false)}${bar(vb, lead === 'R', true)}</div>
          <div class="olcu-not ${lead === 'L' ? 'sol' : 'sag'}">${not}</div>
        </div>
      </div>`;
  const taraf = (n, c, sag, s) => `<div class="vs-taraf${sag ? ' sag' : ''}"><div class="vs-foto">${pic(100, c, K.tint)}</div><div><b>${n}</b><small>${s}</small></div></div>`;
  return `<div class="karsi-kart" aria-label="Örnek karşılaştırma: iPhone 13 ve iPhone 14 Pro">
      <div class="vs-bas">${taraf('iPhone 13', RENK.gece, false, '2 kategoride önde')}<span class="vs">VS</span>${taraf('iPhone 14 Pro', RENK.mor, true, '3 kategoride önde')}</div>
      <div>${rows.map(r).join('')}</div>
      <div class="kazanan"><b>iPhone 14 Pro daha iyi</b><span>3 kategoride önde, 2 kategoride geride</span></div>
      <div class="ornek-not">Örnek karşılaştırma</div>
    </div>`;
}

// Altı tanıtım tek bölümde, sekmeli. Sekme kimlikleri eski bölüm çapalarıyla
// aynı (#sat, #al, ...): sayfadaki bağlantılar ilgili sekmeyi açıyor. Betik
// yoksa bütün paneller alt alta görünür.
const PANELLER = () => [
  { id: 'sat', ad: 'Sat', ikon: 'tag', baslik: 'İlanı koy, mağazalar teklif versin.', alt: 'Dört adımda ilan: telefon bilgileri, cihaz durumu, foto ve fiyat, konum. Her ilan yayına girmeden incelenir.', madde: ['Beğenmediğin teklife karşı teklif ver', 'Birini kabul edince diğerleri kendiliğinden kapanır', 'Kargo yok, komisyon yok; mağazada elden teslim'], gorsel: [S.adim2(), S.ilanim(), S.karsi()], ek: yasam() },
  { id: 'al', ad: 'Al', ikon: 'search', baslik: 'Süz, sırala, ayrıntısına bak.', alt: 'Yalnızca onaylı mağazaların ilanları. Batarya yüzdesi, ekran ve kasa puanı her kartta.', madde: ['Marka, model, durum, fiyat, depolama, renk, şehir ve ilçe filtresi', 'Değişensiz ve garantili telefonları ayır', 'Bataryaya, ekran ve kasaya ya da fiyata göre sırala'], gorsel: [S.kesfet(), S.filtre(), S.detay()] },
  { id: 'karsilastir', ad: 'Karşılaştır', ikon: 'compare', baslik: 'İki telefon, beş başlık, tek bakış.', alt: 'Hangisi nerede önde, yüzde kaç fark var, çubuklarda görürsün.', madde: ['Ekran, performans, pil ve şarj, kamera, diğer', 'Her ölçüde farkın yüzdesi', 'İlan sayfasından tek dokunuşla açılır'], kart: karsiKart() },
  { id: 'takip', ad: 'Takip', ikon: 'bell', baslik: 'Fiyat düşünce haberin olsun.', alt: 'Favorine eklediğin ilanın fiyatını eklediğin günle karşılaştırırız. Satılırsa benzerlerini gösteririz.', madde: ['Son baktığın 20 ilan telefonunda saklanır', 'Hangi bildirimi alacağını sen seçersin', 'Bildirimler gün gün gruplanır, kaydırıp silersin'], gorsel: [S.favori(), S.bildirim(), S.bildirimAyar()] },
  { id: 'mesaj', ad: 'Mesaj', ikon: 'msg', baslik: 'Pazarlık uygulamada, numaran cebinde.', alt: 'Mağazayla ilanın üstünden yazışırsın, fotoğraf atarsın. Rahatsız eden olursa şikâyet et ya da engelle.', madde: ['Kullanıcılar birbirine değil, mağazalara yazar', 'Mağaza seni “Ahmet Y.” gibi adınla ve soyadının baş harfiyle görür', 'Okunmamış sohbetler en üstte'], gorsel: [S.mesajlar(), S.sohbet(true), S.sikayet()] },
  { id: 'magazalar', ad: 'Mağazalar', ikon: 'store', baslik: 'Kimden aldığını bil.', alt: "Her mağazanın puanı, yorumları, ilan sayısı ve ne zamandır ONCEP'te olduğu görünür.", madde: ['Puana, ilan sayısına ya da A–Z sırala', "Kendi şehrindekileri ya da tüm Türkiye'yi gör", 'Alışverişten sonra mağazayı 1–5 yıldızla puanla'], gorsel: [S.magazalar(), S.magazaSayfa(), S.yorum()] },
];

function ozellikler() {
  const p = PANELLER();
  const sekme = (x, i) => `<button type="button" class="sekme${i === 0 ? ' acik' : ''}" role="tab" id="sekme-${x.id}" aria-controls="${x.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${ic(x.ikon, 17, 'currentColor')}${x.ad}</button>`;
  const panel = (x, i) => `<div class="panel${i === 0 ? ' acik' : ''}" id="${x.id}" role="tabpanel" aria-labelledby="sekme-${x.id}" tabindex="0">
      <div class="tur-metin">
        <h3>${x.baslik}</h3>
        <p class="giris-metin">${x.alt}</p>
        ${maddeler(x.madde)}
        ${x.ek || ''}
      </div>
      ${x.kart || `<div class="telefonlar" aria-hidden="true">${x.gorsel.join('')}</div>`}
    </div>`;
  return `<section id="ozellikler" class="ozellik">
  <div class="kap">
    <div class="ozellik-bas">
      <div class="ust-yazi">UYGULAMADA NELER VAR</div>
      <h2>Satmaktan mağaza seçmeye, hepsi tek uygulamada.</h2>
    </div>
    <div class="sekmeler" role="tablist" aria-label="Uygulamanın bölümleri">${p.map(sekme).join('')}</div>
    ${p.map(panel).join('\n    ')}
  </div>
</section>`;
}

function guvenlik() {
  const r = [
    ['nocash', 'Kapora gönderme', 'Telefonu görmeden para yok.'],
    ['pin', 'Güvenli bir yerde buluş', 'Mağazada ya da kalabalık bir yerde.'],
    ['lock', 'Hesap kilidini kontrol et', 'Apple ID ve Bul kapalı, Google hesabı silinmiş olsun.'],
    ['pulse', 'Her şeyini dene', 'Ekran, kamera, hoparlör, mikrofon, şarj girişi, Face ID, pil.'],
    ['receipt', 'Fatura ve kutu iste', 'Kutudaki IMEI telefondakiyle aynı mı, bak.'],
    ['msg', "Yazışmayı ONCEP'te tut", 'SMS kodu ve banka bilgisi paylaşma.'],
  ];
  const g = [['shield', 'Her mağaza tek tek onaylanır'], ['eye', 'Her ilan yayından önce incelenir'], ['lock', 'Numaran ve e-postan mağazalara gösterilmez'], ['image', 'Fotoğraflardaki konum bilgisi silinir'], ['flag', 'Şüpheli ilanı ya da mesajı şikâyet edersin'], ['x', 'Verilerin satılmaz, reklam için paylaşılmaz']];
  return `<section id="guvenlik" class="guv">
  <div class="kap">
    <div class="guv-ana">
      <div class="tur-metin">
        <div class="ust-yazi">GÜVENLİ ALIŞVERİŞ</div>
        <h2>Kaporayı unut. Altı kural yeter.</h2>
        <p class="giris-metin">Uygulamadaki Güvenli Alışveriş Rehberi'nin özeti. Hesabın da senin elinde: e-postanı doğrula, diğer cihazlardan çık, engelle, istersen hesabını sil.</p>
      </div>
      <div class="kurallar">${r.map(([i, a, b]) => `<div class="kural"><span class="kural-ikon">${ic(i, 22, K.navy)}</span><div><b>${a}</b><span>${b}</span></div></div>`).join('')}</div>
      <div class="imei"><span class="imei-kod">*#06#</span><span>Bu kodla IMEI'yi öğren, kutu ve faturadakiyle karşılaştır, e-Devlet'ten sorgula. ONCEP IMEI doğrulaması yapmaz.</span></div>
      <div class="guvenceler">${g.map(([i, s]) => `<div>${ic(i, 18, K.org, 2.2)}<span>${s}</span></div>`).join('')}</div>
    </div>
    <div class="guv-tel" aria-hidden="true">${S.ayarlar()}</div>
  </div>
</section>`;
}

function magazaIcin() {
  const ek = `<div class="magaza-ek">
        <div class="magaza-sayilar">${[['Ücretsiz', 'şu an'], ['Günlük', 'teklif hakkı'], ['Onaylı', 'vergi no ile']].map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
        <a class="dugme turuncu" href="#indir">Mağazanı ONCEP'e ekle</a>
        <p>Başvurun incelenir, sonuç e-postayla gelir. Şu an ONCEP'te mağaza hesabı açmak ücretsizdir.</p>
      </div>`;
  return tur('magaza', {
    eb: 'MAĞAZALAR İÇİN', baslik: 'Telefoncuysan: ilanlar sana gelsin.', koyu: true, sinif: 'koyu', ek,
    alt: 'Kullanıcıların sattığı telefonları görürsün, teklifini yazarsın. Kendi ilanlarını da vitrine koyarsın.',
    madde: ['Kullanıcıyı “Ahmet Y.” olarak görürsün; ilçesi ve telefonun durumu yazılı', 'Karşı teklif gelirse kabul et ya da reddet', 'İlgini çeken ilanı kalple takip et, hazır olunca teklif ver'],
    ekranlar: [S.magazaKesfet(), S.teklifVer(), S.magazaProfil()],
  });
}

function sss() {
  const qs = [
    ['Komisyon ya da ücret var mı?', 'Yok. Şu an bireysel kullanıcılar ve mağazalar için ONCEP\'in bütün hizmetleri ücretsiz. ONCEP ödemeye aracılık etmez; para mağazada elden verilir, alışverişten komisyon alınmaz.'],
    ['İlanım ne kadar süre teklif alır?', 'Yayına girdiği andan itibaren 30 gün. Bitimine 7 ve 2 gün kala hatırlatma gelir; istersen ilanı yenilersin.'],
    ['Birden fazla teklifi aynı anda görebilir miyim?', 'Evet. Gelen teklifler yan yana durur; birini kabul edince diğerleri kapanır.'],
    ['Kaç fotoğraf ekleyebilirim?', 'En az 1, en fazla 5. İlk eklediğin kapak olur.'],
    ["IMEI'yi ONCEP kontrol ediyor mu?", "Hayır. Satın almadan önce *#06# ile IMEI'yi gör, kutu ve faturadakiyle aynı olduğuna bak ve e-Devlet'ten sorgula."],
    ['Hesabımı silersem ne olur?', 'Hesabın hemen kapanır ve ilanların yayından kalkar. 30 gün içinde destek@oncep.com.tr adresine yazarak geri açtırabilirsin; sonra adın, e-postan ve telefonun kalıcı olarak silinir.'],
  ];
  return `<section id="sss" class="sss">
  <div class="kap">
    <div class="tur-metin">
      <div class="ust-yazi">YARDIM MERKEZİ</div>
      <h2>Sorular</h2>
      <p class="giris-metin">Uygulamada altı başlıkta yaklaşık yirmi soru var. Bulamazsan <a href="mailto:destek@oncep.com.tr">destek@oncep.com.tr</a> adresine yaz.</p>
    </div>
    <div class="sss-liste">${qs.map(([a, b], i) => `<details${i === 0 ? ' open' : ''}><summary>${a}<span class="arti">${ic('plus', 18, K.navy, 2.4)}</span></summary><p>${b}</p></details>`).join('')}</div>
  </div>
</section>`;
}

function alt() {
  const links = [['/gizlilik', 'Gizlilik'], ['/kullanim-sartlari', 'Kullanım Şartları'], ['/kvkk', 'KVKK Aydınlatma Metni'], ['/hesap-silme', 'Hesap silme'], ['mailto:destek@oncep.com.tr', 'destek@oncep.com.tr']];
  return `<footer id="indir" class="alt">
  <div class="kap">
    <div class="alt-ust">
      <div class="alt-yazi">
        <h2>Satmadan önce kaç ettiğini gör. Almadan önce bütün vitrinleri gez.</h2>
        <p>Uygulama yakında Google Play ve App Store'da. Çıktığı gün Instagram ve TikTok'ta duyuracağız.</p>
      </div>
      <div class="rozetler">
        <span class="rozet"><small>YAKINDA</small><b>Google Play</b></span>
        <span class="rozet"><small>YAKINDA</small><b>App Store</b></span>
        <a class="rozet" href="https://instagram.com/oncep.tr" target="_blank" rel="noopener"><small>TAKİP ET</small><b>Instagram @oncep.tr</b></a>
        <a class="rozet" href="https://tiktok.com/@oncep.tr" target="_blank" rel="noopener"><small>TAKİP ET</small><b>TikTok @oncep.tr</b></a>
      </div>
    </div>
    <div class="alt-alt">
      <a class="logo" href="#" aria-label="ONCEP ana sayfa"><b>ON</b><i>CEP</i></a>
      <nav aria-label="Yasal ve iletişim">${links.map(([h, s]) => `<a href="${h}">${s}</a>`).join('')}</nav>
    </div>
    <p class="telif">© 2026 ONCEP · İkinci el telefon alım satım platformu · Sayfadaki fiyat, mağaza ve kişi adları örnektir.</p>
  </div>
</footer>`;
}

// ---------- Stil ----------
const CSS = `
:root {
  color-scheme: light;
  --zemin: #FFFFFF; --zemin-2: #F5F7FC; --yumusak: #F1F3FA; --cizgi: #E7EAF3; --alan: #D9DEEC;
  --murekkep: #0F1B3D; --metin: #4A5470; --soluk: #6B7390;
  --lacivert: #1A237E; --lacivert-koyu: #10164F; --lacivert-metin: #C7CCEE;
  --turuncu: #F26A1B; --turuncu-acik: #FFB27A; --yesil: #13795B;
  --yazi: 'Onest', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --kenar: clamp(20px, 6.6vw, 96px);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--zemin); color: var(--murekkep); font-family: var(--yazi); font-size: 16px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
a { color: var(--lacivert); }
a:hover { color: var(--turuncu); }
:focus-visible { outline: 2px solid var(--turuncu); outline-offset: 3px; border-radius: 4px; }
h1, h2, h3 { margin: 0; font-weight: 700; text-wrap: balance; }
h2 { font-size: clamp(30px, 3.4vw, 44px); line-height: 1.06; letter-spacing: -1.3px; }
h2.buyuk { font-size: clamp(34px, 4.2vw, 58px); letter-spacing: -2px; line-height: 1.04; }
.kap { max-width: 1440px; margin: 0 auto; padding-left: var(--kenar); padding-right: var(--kenar); }
section[id], footer[id] { scroll-margin-top: 76px; }
.ust-yazi { font-size: 13px; font-weight: 600; letter-spacing: 1.2px; color: var(--turuncu); }
.ust-yazi.acik { color: var(--turuncu-acik); }
.giris-metin { margin: 0; font-size: 17px; line-height: 1.55; color: var(--metin); }
.maddeler { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.maddeler li { display: flex; gap: 10px; align-items: flex-start; font-size: 16px; line-height: 1.45; color: var(--metin); }
.maddeler svg { margin-top: 2px; }
.dugmeler { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.dugme { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 15px 22px; border-radius: 12px; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; }
.dugme.turuncu { background: var(--turuncu); color: #FFFFFF; }
.dugme.turuncu:hover { background: #DD5A0E; color: #FFFFFF; }
.dugme.acik { background: var(--yumusak); color: var(--lacivert); }
.dugme.cerceve { background: #FFFFFF; color: var(--lacivert); box-shadow: inset 0 0 0 1.5px var(--lacivert); }
.not { display: inline-flex; gap: 6px; align-items: center; font-size: 14px; color: var(--soluk); }
.logo { font-weight: 800; font-size: 26px; letter-spacing: -0.5px; text-decoration: none; }
.logo b { color: var(--lacivert); font-weight: 800; }
.logo i { color: var(--turuncu); font-style: normal; }

/* Üst çubuk */
.ust { position: sticky; top: 0; z-index: 30; background: rgba(255, 255, 255, 0.95); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-bottom: 1px solid var(--cizgi); }
.ust .kap { display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 72px; }
.ana-nav { display: flex; gap: 26px; font-size: 15px; font-weight: 500; }
.ana-nav a, .menu nav a { text-decoration: none; color: #3B4563; }
.ana-nav a:hover { color: var(--turuncu); }
.ust .cta { text-decoration: none; background: var(--lacivert); color: #FFFFFF; padding: 11px 18px; border-radius: 10px; font-size: 15px; font-weight: 600; white-space: nowrap; }
.menu { display: none; position: relative; }
.menu summary { list-style: none; width: 44px; height: 44px; border-radius: 10px; background: var(--yumusak); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.menu summary::-webkit-details-marker { display: none; }
.menu nav { position: absolute; right: 0; top: 52px; background: #FFFFFF; border: 1px solid var(--cizgi); border-radius: 14px; box-shadow: 0 18px 40px rgba(15, 27, 61, 0.14); display: flex; flex-direction: column; padding: 8px; min-width: 230px; }
.menu nav a { padding: 12px 14px; border-radius: 8px; font-weight: 600; color: var(--murekkep); }
.menu nav a:hover { background: var(--yumusak); }

/* Açılış */
.acilis .kap { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; align-items: center; padding-top: 72px; padding-bottom: 88px; }
.acilis-metin { display: flex; flex-direction: column; gap: 26px; }
.acilis h1 { font-size: clamp(38px, 4.6vw, 64px); line-height: 1.04; letter-spacing: -2px; }
.ozet { margin: 0; font-size: clamp(17px, 1.5vw, 20px); line-height: 1.55; color: var(--metin); max-width: 520px; }
.sayilar { display: flex; gap: 32px; font-size: 15px; color: var(--metin); }
.sayilar b { display: block; font-size: 24px; font-weight: 700; color: var(--murekkep); }
.kisayollar { display: flex; gap: 10px; max-width: 600px; }
.kisayol { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--yumusak); color: var(--murekkep); text-decoration: none; }
.kisayol:hover { color: var(--murekkep); box-shadow: inset 0 0 0 1.5px var(--alan); }
.kisayol-ikon { width: 38px; height: 38px; border-radius: 10px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kisayol b { display: block; font-size: 15px; }
.kisayol small { display: block; font-size: 13px; color: var(--metin); }
.acilis-tel { display: flex; justify-content: center; }

/* Değer hesabı */
.lacivert-bolum { background: var(--lacivert); color: #FFFFFF; }
.lacivert-bolum .kap { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 40px; align-items: start; padding-top: 96px; padding-bottom: 96px; }
.hesap-metin { display: flex; flex-direction: column; gap: 22px; padding-top: 12px; }
.hesap-metin h2 { color: #FFFFFF; font-size: clamp(34px, 4.2vw, 58px); letter-spacing: -2px; line-height: 1.04; }
.hesap-metin p { margin: 0; font-size: 18px; line-height: 1.55; color: var(--lacivert-metin); }
.adim-liste { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.adim-liste li { display: flex; gap: 14px; align-items: flex-start; color: var(--lacivert-metin); font-size: 15px; line-height: 1.45; }
.adim-liste b { display: block; color: #FFFFFF; font-size: 17px; font-weight: 600; }
.adim-no { width: 34px; height: 34px; border-radius: 17px; background: rgba(255, 255, 255, 0.12); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.hesap-kart { background: #FFFFFF; color: var(--murekkep); border-radius: 20px; padding: clamp(18px, 2.6vw, 34px); display: flex; flex-direction: column; gap: 22px; box-shadow: 0 24px 48px rgba(8, 12, 48, 0.28); min-width: 0; }
.hesap-form { display: flex; flex-direction: column; gap: 22px; }
.hesap-form fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
.hesap-form > fieldset > legend { padding: 0; margin-bottom: 12px; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.hesap-form > fieldset > legend span { width: 24px; height: 24px; border-radius: 12px; background: var(--lacivert); color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
.hesap-form legend small { font-size: 13px; font-weight: 500; color: var(--soluk); }
.alanlar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.alanlar.iki { grid-template-columns: 1fr; gap: 14px; }
.alan { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--soluk); min-width: 0; }
.alan select { -webkit-appearance: none; appearance: none; width: 100%; height: 50px; border: 1.5px solid var(--alan); border-radius: 10px; padding: 0 38px 0 14px; font: inherit; font-size: 16px; font-weight: 500; color: var(--murekkep); background: #FFFFFF url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7390' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center; cursor: pointer; }
.alan select:hover { border-color: #B9C0D6; }
.seg-alan legend { padding: 0; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--soluk); }
.seg { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); background: var(--yumusak); border-radius: 10px; padding: 4px; gap: 2px; }
.seg label { position: relative; display: block; }
.seg input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.seg span { display: block; text-align: center; padding: 10px 2px; border-radius: 7px; font-size: 13px; font-weight: 700; color: var(--soluk); white-space: nowrap; }
.seg input:checked + span { background: #FFFFFF; color: var(--lacivert); box-shadow: 0 1px 3px rgba(20, 27, 52, 0.14); }
.seg input:focus-visible + span { outline: 2px solid var(--turuncu); outline-offset: 1px; }
.ipucu { margin: 10px 0 0; font-size: 13px; color: var(--soluk); }
.ekstra summary { list-style: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; cursor: pointer; font-size: 15px; font-weight: 700; }
.ekstra summary::-webkit-details-marker { display: none; }
.adim-rozet { width: 24px; height: 24px; border-radius: 12px; background: var(--lacivert); color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
.ekstra-baslik small { font-size: 13px; font-weight: 500; color: var(--soluk); }
.ekstra-ozet { display: none; flex-basis: 100%; padding-left: 32px; font-size: 13px; font-weight: 500; color: var(--metin); }
.ekstra:not([open]) .ekstra-ozet { display: block; }
.ekstra-ok { margin-left: auto; display: flex; transition: transform 0.2s; order: 2; }
.ekstra-ozet { order: 3; }
.ekstra[open] .ekstra-ok { transform: rotate(180deg); }
.ekstra fieldset { border: 0; margin: 12px 0 0; padding: 0; min-width: 0; }
.gizli { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.sonuc { border-top: 1px solid var(--cizgi); padding-top: 24px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px; }
.taraf { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.taraf h3 { font-size: 14px; font-weight: 700; color: var(--soluk); }
.aralik { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-variant-numeric: tabular-nums; }
.aralik b { font-size: clamp(26px, 2.3vw, 34px); font-weight: 800; letter-spacing: -1px; white-space: nowrap; }
.aralik > span { font-size: 15px; font-weight: 700; color: var(--soluk); }
.cizelge { position: relative; height: 10px; border-radius: 5px; background: var(--yumusak); }
.cizelge i { position: absolute; display: block; }
.bant-i { top: 0; bottom: 0; border-radius: 5px; transition: left 0.25s, width 0.25s; }
.nokta { top: -5px; width: 20px; height: 20px; margin-left: -10px; border-radius: 10px; background: #FFFFFF; border: 4px solid; transition: left 0.25s; }
.sat .bant-i { background: var(--lacivert); }
.sat .nokta { border-color: var(--lacivert); }
.al .bant-i { background: var(--turuncu); }
.al .nokta { border-color: var(--turuncu); }
.uclar { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--soluk); font-variant-numeric: tabular-nums; }
.uclar b { font-weight: 600; color: var(--metin); }
.pay { display: flex; align-items: center; gap: 10px; background: var(--yumusak); border-radius: 12px; padding: 12px 14px; font-size: 15px; font-weight: 700; color: var(--lacivert); }
.hesap-dugmeler { display: flex; gap: 10px; flex-wrap: wrap; }
.hesap-dugmeler .dugme { padding: 14px 18px; font-size: 15px; }
.dipnot { margin: 0; font-size: 12px; line-height: 1.5; color: var(--soluk); }

/* Mağazaları gez */
.gez .kap { display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 48px; align-items: center; padding-top: 96px; padding-bottom: 96px; }
.gez-gorsel { display: flex; align-items: center; gap: 24px; justify-content: flex-end; }
.dukkanlar { display: grid; grid-template-columns: repeat(2, 210px); gap: 14px; }
.ok { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; font-size: 13px; font-weight: 700; color: var(--metin); text-align: center; }
.ok .daire { width: 52px; height: 52px; border-radius: 26px; background: var(--turuncu); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(242, 106, 27, 0.3); }
.gez-tel { display: flex; justify-content: center; }

/* Metin + telefonlar */
.tur .kap { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 56px; align-items: center; padding-top: 96px; padding-bottom: 96px; }
.tur.gri { background: var(--zemin-2); }
.tur.beyaz { background: #FFFFFF; }
.tur.koyu { background: var(--lacivert-koyu); color: #FFFFFF; }
.tur.koyu h2 { color: #FFFFFF; }
.tur.koyu .giris-metin, .tur.koyu .maddeler li { color: var(--lacivert-metin); }
.tur-metin { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.telefonlar { display: flex; gap: 20px; overflow-x: auto; padding: 6px 4px 28px; scroll-padding-left: 4px; scroll-snap-type: x proximity; scrollbar-width: thin; }
.telefonlar > * { scroll-snap-align: start; }
.telefonlar > :first-child { margin-left: auto; }
.yasam { list-style: none; margin: 0; padding: 6px 0 0; display: flex; flex-direction: column; gap: 10px; }
.yasam li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--metin); }
.yasam .no { width: 26px; height: 26px; border-radius: 13px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; background: #FFFFFF; color: var(--lacivert); box-shadow: inset 0 0 0 1.5px var(--alan); }
.yasam .simdi .no { background: var(--turuncu); color: #FFFFFF; box-shadow: none; }
.yasam b { font-size: 12px; font-weight: 800; letter-spacing: 0.6px; width: 124px; color: var(--murekkep); }
.magaza-ek { display: flex; flex-direction: column; gap: 14px; padding-top: 4px; }
.magaza-sayilar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.magaza-sayilar div { border-top: 2px solid var(--turuncu); padding-top: 10px; display: flex; flex-direction: column; gap: 2px; }
.magaza-sayilar b { font-size: 18px; }
.magaza-sayilar span, .magaza-ek p { font-size: 13px; color: var(--lacivert-metin); }
.magaza-ek p { margin: 0; line-height: 1.5; }

/* Karşılaştır */
.karsi-kart { background: #FFFFFF; border-radius: 20px; box-shadow: 0 1px 0 var(--cizgi), 0 24px 48px rgba(15, 27, 61, 0.08); border: 1px solid var(--cizgi); padding: clamp(18px, 2.6vw, 36px); display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.vs-bas { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 20px; }
.vs-taraf { display: flex; align-items: center; gap: 14px; min-width: 0; }
.vs-taraf.sag { flex-direction: row-reverse; text-align: right; }
.vs-foto { width: 84px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
.vs-taraf b { display: block; font-size: 20px; }
.vs-taraf small { display: block; font-size: 13px; color: var(--soluk); }
.vs { width: 56px; height: 56px; border-radius: 50%; background: var(--murekkep); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
.olcu { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 24px; align-items: center; padding: 18px 0; border-top: 1px solid var(--cizgi); }
.olcu-ad small { display: block; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; color: var(--soluk); }
.olcu-ad b { font-size: 15px; }
.olcu-deger { display: flex; flex-direction: column; gap: 6px; }
.olcu-sayi { display: flex; justify-content: space-between; font-size: 15px; color: var(--metin); font-variant-numeric: tabular-nums; }
.onde-sol { font-weight: 800; color: var(--lacivert); }
.onde-sag { font-weight: 800; color: var(--turuncu); }
.olcu-cubuklar { display: flex; gap: 6px; }
.olcu-cubuk { flex: 1; height: 10px; border-radius: 5px; background: var(--yumusak); display: flex; justify-content: flex-end; overflow: hidden; }
.olcu-cubuk.sag { justify-content: flex-start; }
.olcu-cubuk i { display: block; border-radius: 5px; background: var(--alan); }
.olcu-cubuk i.onde { background: var(--lacivert); }
.olcu-cubuk.sag i.onde { background: var(--turuncu); }
.olcu-not { font-size: 12px; font-weight: 700; color: var(--yesil); }
.olcu-not.sag { text-align: right; }
.kazanan { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; background: var(--murekkep); color: #FFFFFF; border-radius: 14px; padding: 18px 24px; }
.kazanan b { font-size: 24px; }
.kazanan span { font-size: 15px; color: var(--lacivert-metin); }
.ornek-not { font-size: 12px; color: var(--soluk); text-align: right; }

/* Sekmeli tanıtım */
.ozellik { background: var(--zemin-2); }
.ozellik .kap { padding-top: 96px; padding-bottom: 96px; display: flex; flex-direction: column; gap: 28px; }
.ozellik-bas { display: flex; flex-direction: column; gap: 14px; max-width: 760px; }
.sekmeler { display: flex; gap: 8px; flex-wrap: wrap; }
.sekme { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 999px; border: 0; background: #FFFFFF; color: var(--murekkep); font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: inset 0 0 0 1.5px var(--alan); }
.sekme:hover { box-shadow: inset 0 0 0 1.5px var(--lacivert); }
.sekme.acik { background: var(--lacivert); color: #FFFFFF; box-shadow: none; }
.panel { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 56px; align-items: center; padding-top: 12px; }
.panel h3 { font-size: clamp(26px, 2.6vw, 36px); line-height: 1.08; letter-spacing: -1px; }
.panel:focus-visible { outline-offset: 10px; }
.js .panel:not(.acik) { display: none; }

/* Güvenlik */
.guv { background: var(--zemin-2); }
.guv .kap { display: grid; grid-template-columns: minmax(0, 1fr) 264px; gap: 56px; align-items: start; padding-top: 96px; padding-bottom: 96px; }
.guv-ana { display: flex; flex-direction: column; gap: 28px; min-width: 0; }
.kurallar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.kural { background: #FFFFFF; border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 1px 0 var(--cizgi); }
.kural-ikon { width: 44px; height: 44px; border-radius: 12px; background: var(--yumusak); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kural b { display: block; font-size: 17px; }
.kural div > span { display: block; font-size: 14px; line-height: 1.45; color: var(--metin); }
.imei { background: #FFFFFF; border-radius: 16px; padding: 22px; display: flex; align-items: center; gap: 18px; box-shadow: 0 1px 0 var(--cizgi); font-size: 14px; line-height: 1.45; color: var(--metin); }
.imei-kod { font-size: 36px; font-weight: 800; letter-spacing: 3px; color: var(--lacivert); white-space: nowrap; }
.guvenceler { background: var(--lacivert); color: #FFFFFF; border-radius: 16px; padding: 24px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
.guvenceler div { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; }
.guv-tel { padding-top: 8px; }

/* Sorular */
.sss { background: #FFFFFF; }
.sss .kap { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 56px; align-items: start; padding-top: 96px; padding-bottom: 96px; }
.sss-liste { display: flex; flex-direction: column; gap: 10px; }
.sss details { background: var(--zemin-2); border-radius: 14px; }
.sss summary { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 20px 24px; font-size: 18px; font-weight: 700; cursor: pointer; list-style: none; }
.sss summary::-webkit-details-marker { display: none; }
.sss .arti { transition: transform 0.2s; flex-shrink: 0; }
.sss details[open] .arti { transform: rotate(45deg); }
.sss details p { margin: 0; padding: 0 24px 20px; color: var(--metin); line-height: 1.55; }

/* Alt */
.alt { background: var(--lacivert); color: var(--lacivert-metin); }
.alt .kap { padding-top: 64px; padding-bottom: 40px; display: flex; flex-direction: column; gap: 36px; }
.alt-ust { display: flex; justify-content: space-between; align-items: center; gap: 40px; }
.alt-yazi { display: flex; flex-direction: column; gap: 12px; max-width: 700px; }
.alt h2 { color: #FFFFFF; font-size: clamp(28px, 3.2vw, 44px); letter-spacing: -1px; }
.alt-yazi p { margin: 0; font-size: 16px; }
.rozetler { display: grid; grid-template-columns: repeat(2, minmax(0, auto)); gap: 10px; }
.rozet { display: inline-flex; flex-direction: column; gap: 2px; padding: 10px 18px; border-radius: 12px; background: #FFFFFF; color: var(--murekkep); text-decoration: none; }
.rozet small { font-size: 10px; font-weight: 800; letter-spacing: 0.8px; color: var(--turuncu); }
.rozet b { font-size: 15px; }
a.rozet:hover { color: var(--lacivert); box-shadow: inset 0 0 0 2px var(--turuncu-acik); }
.alt-alt { border-top: 1px solid #3A4290; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; gap: 18px; flex-wrap: wrap; }
.alt .logo b { color: #FFFFFF; }
.alt nav { display: flex; flex-wrap: wrap; gap: 10px 22px; font-size: 14px; }
.alt nav a { color: var(--lacivert-metin); text-decoration: none; }
.alt nav a:hover { color: #FFFFFF; }
.telif { margin: 0; font-size: 12px; line-height: 1.6; color: #8F96CF; }

/* Ara genişlikler */
@media (max-width: 1280px) {
  .ana-nav { gap: 18px; font-size: 14px; }
  .gez .kap { grid-template-columns: 1fr; }
  .gez-gorsel { justify-content: center; }
}
@media (max-width: 1180px) {
  .ana-nav, .ust .cta { display: none; }
  .menu { display: block; }
  .tur .kap, .sss .kap { grid-template-columns: 1fr; gap: 32px; }
  .panel { grid-template-columns: 1fr; gap: 28px; }
  .telefonlar { margin: 0 calc(-1 * var(--kenar)); padding-left: var(--kenar); padding-right: var(--kenar); scroll-padding-left: var(--kenar); }
  .telefonlar > :first-child { margin-left: 0; }
  .lacivert-bolum .kap { grid-template-columns: 1fr; }
  .guv .kap { grid-template-columns: 1fr; }
  .guv-tel { display: flex; justify-content: center; }
}
@media (max-width: 900px) {
  .guv-tel { display: none; }
}
@media (max-width: 900px) {
  .acilis .kap { grid-template-columns: 1fr; gap: 40px; padding-top: 36px; padding-bottom: 56px; }
  .kurallar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .alt-ust { flex-direction: column; align-items: flex-start; }
  .gez-gorsel { flex-direction: column; align-items: stretch; }
  .dukkanlar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ok { flex-direction: row; justify-content: center; }
  .ok .daire svg { transform: rotate(90deg); }
}
@media (max-width: 700px) {
  .alanlar, .alanlar.iki { grid-template-columns: 1fr; }
  .alanlar.telefon-sec { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: "marka depolama" "model model"; }
  .a-marka { grid-area: marka; } .a-model { grid-area: model; } .a-depolama { grid-area: depolama; }
  .adim-liste { display: none; }
  .ekstra-ozet { padding-left: 32px; }
  .seg span { font-size: 11px; padding: 10px 0; letter-spacing: -0.2px; }
  .sonuc { grid-template-columns: 1fr; gap: 22px; }
  .hesap-dugmeler .dugme { flex: 1 1 100%; }
  .olcu { grid-template-columns: 1fr; gap: 8px; }
  .vs-bas { align-items: start; }
  .vs { align-self: center; }
  .vs-taraf, .vs-taraf.sag { flex-direction: column; text-align: center; }
  .kazanan b { font-size: 20px; }
  .imei { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px) {
  .lacivert-bolum .kap, .gez .kap, .tur .kap, .ozellik .kap, .guv .kap, .sss .kap { padding-top: 52px; padding-bottom: 48px; }
  .tur .kap { padding-bottom: 24px; }
  .dugmeler { flex-direction: column; align-items: stretch; }
  .sayilar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 13px; }
  .sayilar b { font-size: 18px; }
  .kisayollar { flex-direction: column; }
  .acilis-tel > div { transform: scale(0.8); transform-origin: top center; margin-bottom: -136px; }
  .kurallar { grid-template-columns: 1fr; }
  .kurallar { gap: 0; background: #FFFFFF; border-radius: 16px; box-shadow: 0 1px 0 var(--cizgi); }
  .kural { flex-direction: row; align-items: flex-start; gap: 14px; padding: 14px 16px; border-radius: 0; box-shadow: none; border-top: 1px solid var(--cizgi); background: transparent; }
  .kural:first-child { border-top: 0; }
  .kural-ikon { width: 36px; height: 36px; border-radius: 10px; }
  .imei { padding: 16px; }
  .sekmeler { flex-wrap: nowrap; overflow-x: auto; margin: 0 calc(-1 * var(--kenar)); padding: 2px var(--kenar); scrollbar-width: none; }
  .sekmeler::-webkit-scrollbar { display: none; }
  .sekme { padding: 10px 14px; font-size: 14px; }
  .guvenceler { grid-template-columns: 1fr; }
  .sss summary { font-size: 16px; padding: 16px 18px; }
  .sss details p { padding: 0 18px 16px; }
  .rozetler { grid-template-columns: 1fr 1fr; width: 100%; }
  .genis { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; }
}
`;

// ---------- Hesaplayıcı betiği ----------
const BETIK = `
(function () {
  var veri = JSON.parse(document.getElementById('fiyat-verisi').textContent);
  var form = document.getElementById('deger-form');
  if (!form) return;
  var el = form.elements;
  var degerHesapla = ${degerHesapla.toString()};
  var bicim = function (n) { return n.toLocaleString('tr-TR'); };
  function modelleri(marka) {
    for (var i = 0; i < veri.length; i++) if (veri[i][0] === marka) return veri[i][1];
    return [];
  }
  function doldur(sec, liste, onceki) {
    sec.innerHTML = '';
    liste.forEach(function (x) { sec.add(new Option(x, x, false, x === onceki)); });
    if (liste.indexOf(onceki) < 0) sec.selectedIndex = 0;
  }
  function depolamalar() {
    var m = modelleri(el.marka.value);
    for (var i = 0; i < m.length; i++) if (m[i][0] === el.model.value) return m[i][1];
    return [];
  }
  function secili(ad) { var s = form.querySelector('input[name="' + ad + '"]:checked'); return s ? +s.value : 5; }
  function guncelle() {
    var dep = depolamalar();
    var taban = 0;
    for (var i = 0; i < dep.length; i++) if (dep[i][0] === el.depolama.value) taban = dep[i][1];
    if (!taban) return;
    var s = degerHesapla(taban, { ekran: secili('ekran'), kasa: secili('kasa'), pil: el.pil.value, degisen: el.degisen.value === '1', garanti: el.garanti.value === '1' });
    var lo = s.sat[0] * 0.9, hi = s.al[2] * 1.05;
    var yuzde = function (v) { return Math.round(((v - lo) / (hi - lo)) * 1000) / 10; };
    ['sat', 'al'].forEach(function (k) {
      var kutu = document.querySelector('[data-taraf="' + k + '"]');
      kutu.querySelectorAll('[data-k]').forEach(function (n) { n.textContent = bicim(s[k][+n.getAttribute('data-k')]); });
      var bant = kutu.querySelector('.bant-i'), nokta = kutu.querySelector('.nokta');
      bant.style.left = yuzde(s[k][0]) + '%';
      bant.style.width = (yuzde(s[k][2]) - yuzde(s[k][0])) + '%';
      nokta.style.left = yuzde(s[k][1]) + '%';
    });
    document.querySelector('[data-pay]').textContent = bicim(s.al[1] - s.sat[1]);
  }
  el.marka.addEventListener('change', function () {
    doldur(el.model, modelleri(el.marka.value).map(function (m) { return m[0]; }), el.model.value);
    doldur(el.depolama, depolamalar().map(function (d) { return d[0]; }), el.depolama.value);
    guncelle();
  });
  el.model.addEventListener('change', function () {
    doldur(el.depolama, depolamalar().map(function (d) { return d[0]; }), el.depolama.value);
    guncelle();
  });
  form.addEventListener('change', function (e) {
    if (e.target !== el.marka && e.target !== el.model) guncelle();
  });
  // 3. adım kapalıyken seçilenlerin özeti; telefonda kapalı başlar.
  var ekstra = document.querySelector('.ekstra'), ozet = document.querySelector('[data-ozet]');
  function ozetle() {
    ozet.textContent = el.pil.options[el.pil.selectedIndex].text + ' · Değişen ' + (el.degisen.value === '1' ? 'var' : 'yok') + ' · Garanti ' + (el.garanti.value === '1' ? 'var' : 'yok');
  }
  form.addEventListener('change', ozetle);
  if (ekstra && window.matchMedia('(max-width: 700px)').matches) ekstra.open = false;

  // Sekmeler: tıklama, ok tuşları ve #sat gibi çapalar.
  var sekmeler = [].slice.call(document.querySelectorAll('.sekme'));
  function sec(id, odak) {
    sekmeler.forEach(function (s) {
      var on = s.getAttribute('aria-controls') === id;
      s.setAttribute('aria-selected', on ? 'true' : 'false');
      s.tabIndex = on ? 0 : -1;
      s.classList.toggle('acik', on);
      if (on && odak) s.focus();
    });
    [].forEach.call(document.querySelectorAll('.panel'), function (p) { p.classList.toggle('acik', p.id === id); });
  }
  sekmeler.forEach(function (s, i) {
    s.addEventListener('click', function () { sec(s.getAttribute('aria-controls')); });
    s.addEventListener('keydown', function (e) {
      var yon = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!yon) return;
      e.preventDefault();
      sec(sekmeler[(i + yon + sekmeler.length) % sekmeler.length].getAttribute('aria-controls'), true);
    });
  });
  function bolumeGit() { document.getElementById('ozellikler').scrollIntoView(); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!document.getElementById('sekme-' + id)) return;
    e.preventDefault();
    sec(id);
    bolumeGit();
    history.replaceState(null, '', '#' + id);
  });
  function capadanAc() {
    var id = location.hash.slice(1);
    if (id && document.getElementById('sekme-' + id)) { sec(id); bolumeGit(); }
  }
  window.addEventListener('hashchange', capadanAc);
  capadanAc();

  // Mobil menü: bağlantıya dokununca kapansın.
  var menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.removeAttribute('open'); });
})();
`;

// ---------- Sayfa ----------
const ACIKLAMA = "Telefonun kaç eder, hemen gör. İlanını koy, şehrindeki onaylı telefoncular teklif versin; mağazaların vitrinini gezmeden gez. Yakında Google Play ve App Store'da.";
const BASLIK = 'ONCEP — Telefonunu sat, mağazalar teklif versin';

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${BASLIK}</title>
<meta name="description" content="${ACIKLAMA}">
<link rel="canonical" href="https://oncep.com.tr/">
<meta property="og:title" content="${BASLIK}">
<meta property="og:description" content="${ACIKLAMA}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://oncep.com.tr/">
<meta property="og:site_name" content="ONCEP">
<meta property="og:locale" content="tr_TR">
<meta property="og:image" content="https://oncep.com.tr/paylasim.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ONCEP: Telefonunu sat, mağazalar teklif versin.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://oncep.com.tr/paylasim.png">
<meta name="twitter:title" content="${BASLIK}">
<meta name="twitter:description" content="${ACIKLAMA}">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="icon" href="/favicon-192x192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<!-- Bu dosya üretilir: node tool/ana-sayfa/uret.js — elle düzenleme bir sonraki üretimde kaybolur. -->
<script>document.documentElement.className += ' js';</script>
<style>${CSS}</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"ONCEP","alternateName":"ONCEP İkinci El Telefon","url":"https://oncep.com.tr/"}
</script>
</head>
<body>
${ust()}
<main>
${acilis()}
${hesap()}
${gez()}
${ozellikler()}
${guvenlik()}
${magazaIcin()}
${sss()}
</main>
${alt()}
<script type="application/json" id="fiyat-verisi">${JSON.stringify(KATALOG)}</script>
<script>${BETIK}</script>
</body>
</html>
`;

if (html.includes('24 saat')) throw new Error('Karşılığı olmayan "24 saat" iddiası sayfada');
const hedef = path.join(__dirname, '..', '..', 'index.html');
fs.writeFileSync(hedef, html);
console.log(`index.html yazıldı (${Math.round(html.length / 1024)} KB)`);
