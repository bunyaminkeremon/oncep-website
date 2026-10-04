// ONCEP tanıtım dergisi (A4, PDF).
//
//   node tool/dergi/uret.js          → tool/dergi/dergi.html
//   node tool/dergi/uret.js --pdf    → ayrıca tool/dergi/ONCEP-Tanitim-Dosyasi.pdf
//
// Ekran görüntüleri tool/dergi/ekranlar/ altında (uygulamanın demo
// sürümünden, oncep_mobile/tool/tanitim/cek.js ile çekildi; mağaza, kişi ve
// fiyatlar örnek). Pazar rakamlarının HER BİRİNİN kaynağı sayfada yazılı;
// kaynaksız rakam girmez.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const KOK = __dirname;
const ekranDosyalari = fs.existsSync(path.join(KOK, 'ekranlar'))
  ? fs.readdirSync(path.join(KOK, 'ekranlar')).filter((f) => f.endsWith('.png'))
  : [];
/** 'ana_sayfa' → 'ekranlar/01-ana_sayfa.png' */
function ekran(ad) {
  const f = ekranDosyalari.find((d) => d.replace(/^\d+-/, '').replace('.png', '') === ad);
  if (!f) throw new Error(`Ekran yok: ${ad}`);
  return `ekranlar/${f}`;
}

// ---------------------------------------------------------------------------
// PARÇALAR
// ---------------------------------------------------------------------------

const cihaz = (ad, genislik = 62, sinif = '') =>
  `<figure class="cihaz ${sinif}" style="--g:${genislik}mm"><img src="${ekran(ad)}" alt=""></figure>`;

let sayfaNo = 0;
const sayfalar = [];
const sayfaAdlari = {};
function sayfa(sinif, icerik, { folyo = true, bolum = '', ad = '' } = {}) {
  sayfaNo++;
  if (ad) sayfaAdlari[ad] = sayfaNo;
  sayfalar.push(`
<section class="sayfa ${sinif}">
${icerik}
${folyo ? `<footer class="folyo"><span>ONCEP · Tanıtım Dosyası${bolum ? ` · ${bolum}` : ''}</span><span>${String(sayfaNo).padStart(2, '0')}</span></footer>` : ''}
</section>`);
  return sayfaNo;
}

/** Sayfanın altındaki adım şeridi: [ekran adı, başlık, açıklama]. */
const adimSerit = (adimlar) => `<div class="adim-serit">${adimlar
  .map(([ad, baslik, aciklama]) => `<figure>${cihaz(ad, 38, 'mini')}<figcaption><b>${baslik}</b>${aciklama}</figcaption></figure>`)
  .join('')}</div>`;

const kaynak = (metin) => `<p class="kaynak">${metin}</p>`;
const ornekNotu = `<p class="ornek-notu">Ekranlar uygulamanın kendisinden alındı. Mağaza ve kişi adları, fiyatlar örnektir; telefon görselleri temsilîdir.</p>`;

// ---------------------------------------------------------------------------
// SAYFALAR
// ---------------------------------------------------------------------------

// 1 — KAPAK
sayfa('kapak', `
  <header class="kapak-ust">
    <img class="logo" src="gorseller/logo-acik.png" alt="ONCEP">
    <p class="kunye">TANITIM DOSYASI<br>EKİM 2026</p>
  </header>
  <div class="kapak-govde">
    <h1>İkinci el<br>telefonun<br><em>yeni<br>pazar yeri.</em></h1>
    <p class="kapak-giris">ONCEP, telefonunu satmak isteyeni şehrindeki onaylı telefoncularla buluşturur. Mağazalar teklif verir; teklifler yan yana, teslim mağazada, elden.</p>
  </div>
  <div class="kapak-cihazlar">
    ${cihaz('ilanim_teklifler', 74, 'on')}
  </div>
  <ul class="kapak-serit">
    <li><b>0 TL</b> komisyon</li>
    <li><b>Kargo yok</b> elden teslim</li>
    <li><b>Onaylı</b> telefoncular</li>
  </ul>
`, { folyo: false, ad: 'kapak' });

// 2 — BİR BAKIŞTA + İÇİNDEKİLER
// Numaralar elle yazılmıyor: her sayfa `ad` ile kaydoluyor, yer tutucu
// (@@NO:ad@@) bütün sayfalar üretildikten sonra dolduruluyor.
const icindekiler = [
  ['Kapak', 'İkinci el telefonun yeni pazar yeri', 'kapak'],
  ['Bir bakışta', 'Mahallendeki telefoncular, cebinde', 'bakis'],
  ['Sorun', 'Telefon satmak neden yorucu?', 'sorun'],
  ['Çözüm', 'Üç taraf, tek uygulama', 'cozum'],
  ['Keşfet', 'Bütün vitrinler tek ekranda', 'kesfet'],
  ['Değer hesapla', 'Gerçek değerini öğren', 'deger'],
  ['İlan ver', 'Dört adım, bir dakika', 'ilanver'],
  ['Teklifler', 'Karar kullanıcıda', 'teklifler'],
  ['Mesajlaşma', 'Mağaza bir mesaj uzağında', 'mesaj'],
  ['Karşılaştır', 'İki telefon yan yana', 'karsilastir'],
  ['Mağazalar', 'Kimden aldığını bil', 'magazalar'],
  ['Telefoncular', 'İlanlar kendisi gelir', 'telefoncular'],
  ['Güven', 'Onay, inceleme, gizlilik', 'guven'],
  ['Pazar', 'Rakamlarla ikinci el telefon', 'pazar'],
  ['Rekabet', 'Kim ne yapıyor, farkımız ne', 'rekabet'],
  ['İş modeli', 'Mağaza aboneliği', 'model'],
  ['Teknoloji', 'Altyapı ve güvenlik', 'teknoloji'],
  ['Yol haritası', 'Bugün neredeyiz', 'yol'],
  ['Arka kapak', 'İletişim', 'arka'],
];
sayfa('bakis', `
  <div class="bakis-sol">
    <p class="ust-etiket">BİR BAKIŞTA</p>
    <h2>Mahallendeki<br>telefoncular,<br><em>cebinde.</em></h2>
    <dl class="bakis-liste">
      <div><dt>Ne</dt><dd>Kullanıcı telefonunu ilana koyar, aynı şehirdeki onaylı telefoncular teklif verir. Kullanıcı teklifleri karşılaştırır, telefonu mağazada elden teslim eder.</dd></div>
      <div><dt>Kimin için</dt><dd>Telefonunu satmak ya da ikinci el almak isteyenler; kullanıcıya ulaşmak isteyen telefoncular.</dd></div>
      <div><dt>Nasıl kazanır</dt><dd>Telefoncular aylık ya da yıllık abonelik öder. Kullanıcı için ücretsiz, satıştan komisyon yok.</dd></div>
      <div><dt>Bugün</dt><dd>Android uygulaması hazır, sunucu ve web sitesi (oncep.com.tr) canlı. Mağazalarda yayın için şirket geliştirici hesabı bekleniyor.</dd></div>
    </dl>
  </div>
  <nav class="icindekiler">
    <p class="ust-etiket">İÇİNDEKİLER</p>
    <ol>
      ${icindekiler.map(([b, a, ad]) => `<li><span class="ic-no">@@NO:${ad}@@</span><span class="ic-bas">${b}</span><span class="ic-alt">${a}</span></li>`).join('')}
    </ol>
  </nav>
`, { ad: 'bakis' });

// 3 — SORUN
sayfa('sorun', `
  <p class="ust-etiket">SORUN</p>
  <h2 class="buyuk">Telefon satmak<br>neden bu kadar yorucu?</h2>
  <div class="sorunlar">
    <article>
      <h3>Dükkân dükkân gezmek</h3>
      <p>Telefonunun gerçek değerini öğrenmenin tek yolu telefoncuları tek tek dolaşmak. Her dükkân başka bir fiyat söylüyor, karşılaştırmak için yeniden yola çıkmak gerekiyor.</p>
    </article>
    <article>
      <h3>İlk teklif, son teklif</h3>
      <p>Satıcı piyasayı göremeyince pazarlık gücü telefoncuda kalıyor. Kimse elindeki teklifi başka bir mağazanınkiyle yan yana koyamıyor.</p>
    </article>
    <article>
      <h3>İnternette güven sorunu</h3>
      <p>İlan sitelerinde satıcıyı sahte dekont ve kapora tuzakları bekliyor. İstanbul'da bir çete, çevrim içi ilan veren ikinci el iPhone satıcılarını hedef aldı; dosyada 12 olay var.</p>
      ${kaynak('Sabah, 5 Ekim 2025.')}
    </article>
  </div>
  <div class="sorun-veri">
    <div class="rakam-blok">
      <p class="rakam">594<small> milyon TL</small></p>
      <p>2025'te çevrim içi bireyden bireye satışta (yenilenmiş hariç) en çok satılan ürün: <b>cep telefonu</b>. Elden yapılan satışlar bu rakama dahil değil.</p>
      ${kaynak('Ticaret Bakanlığı, Türkiye\'de E-Ticaretin Görünümü (12 Mayıs 2026); ürün kırılımı Bigpara, Mayıs 2026.')}
    </div>
    <div class="rakam-blok">
      <p class="rakam">2026</p>
      <p>BTK çift ve klon IMEI'li telefonları kapatmaya başladı. Ne aldığını bilmek artık alıcı için daha da önemli.</p>
      ${kaynak('Gazete Oksijen, 13 Nisan 2026.')}
    </div>
  </div>
`, { ad: 'sorun', bolum: 'Sorun' });

// 4 — ÇÖZÜM
sayfa('cozum', `
  <p class="ust-etiket">ÇÖZÜM</p>
  <h2 class="buyuk">Üç taraf,<br><em>tek uygulama.</em></h2>
  <div class="akislar">
    <section class="akis">
      <h3>Satmak isteyen</h3>
      <ol>
        <li><b>Gerçek değerini öğrenir.</b> Model ve durumu seçer, uygulamadaki gerçek teklif ve ilanlara göre fiyat aralığını görür.</li>
        <li><b>Dört adımda ilan verir.</b> Telefon, cihaz durumu, fotoğraf ve fiyat, konum. İlan yayına girmeden incelenir.</li>
        <li><b>Teklifleri toplar.</b> Aynı şehirdeki onaylı telefoncular 30 gün boyunca teklif verir.</li>
        <li><b>Seçer.</b> Teklifleri yan yana görür; kabul eder, reddeder ya da karşı teklif verir.</li>
        <li><b>Mağazada teslim eder.</b> Kargo yok. Telefon ve ödeme yüz yüze el değiştirir.</li>
      </ol>
    </section>
    <section class="akis">
      <h3>Almak isteyen</h3>
      <ol>
        <li><b>Vitrinleri gezer.</b> Şehrindeki onaylı mağazaların satıştaki telefonları tek ekranda.</li>
        <li><b>Süzer ve karşılaştırır.</b> Pil sağlığı, ekran ve kasa puanı her kartta; iki telefon yan yana.</li>
        <li><b>Yazışır.</b> Mağazaya ilanın üstünden yazar, favorisinin fiyatı düşünce haber alır.</li>
        <li><b>Mağazaya gider.</b> Telefonu görür, dener, orada alır.</li>
      </ol>
    </section>
    <section class="akis akis-magaza">
      <h3>Telefoncu</h3>
      <p>Kullanıcıların sattığı telefonları görür, teklifini yazar. Kendi ilanlarını vitrine koyar. Müşteri, teklifi kabul ettiğinde telefonla birlikte kapısına gelir.</p>
      <p class="akis-not">ONCEP telefon almaz, satmaz, ödemeye aracılık etmez: stok ve ödeme riski taşımayan bir buluşma noktasıdır.</p>
    </section>
  </div>
`, { ad: 'cozum', bolum: 'Çözüm' });

// 5 — ÜRÜN: KEŞFET
sayfa('urun urun-iki', `
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · KEŞFET</p>
    <h2>Bütün vitrinler<br>tek ekranda.</h2>
    <p class="giris">Şehrindeki onaylı telefoncuların satıştaki telefonları tek listede. Dükkân dükkân dolaşmadan bakılır, beğenilen için mağazaya gidilir.</p>
    <ul class="ozellik">
      <li><b>Durum her kartta.</b> Batarya yüzdesi, 2. el ya da sıfır bilgisi, mağaza ve ilçe.</li>
      <li><b>Süz ve sırala.</b> Marka, model, fiyat, şehir ve ilçe, menşei, garanti, değişen parça. Fiyata, pile, duruma, tarihe göre.</li>
      <li><b>İlan detayında şeffaflık.</b> Ekran, kasa ve batarya puanı çubuklarla; kutu, fatura, garanti bilgisi; mağazanın puanı.</li>
    </ul>
    ${ornekNotu}
  </div>
  <div class="urun-cihazlar">
    ${cihaz('ana_sayfa', 66)}
    ${cihaz('ilan_detay', 66, 'asagi')}
  </div>
`, { ad: 'kesfet', bolum: 'Ürün' });

// 6 — ÜRÜN: DEĞER
sayfa('urun urun-tek serili', `
  <div class="urun-cihazlar">${cihaz('deger', 60)}</div>
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · DEĞER HESAPLA</p>
    <h2>Satmadan önce gerçek değerini öğren.</h2>
    <p class="giris">Üç adımda telefon, ekran ve kasa durumu, pil ve ekstralar seçilir. Sonuç iki ayrı rakamdır: mağazaya satarsan eline geçecek aralık ve mağazadan alırsan ödeyeceğin aralık.</p>
    <ul class="ozellik">
      <li><b>Kaynağı uygulamanın kendisi.</b> Hesap, ONCEP'teki gerçek teklif ve ilanlardan yapılır; son 90 günün verisi, cihazın durumuna göre düzeltilir.</li>
      <li><b>Yeterli veri yoksa söyler.</b> Bir modelde yeterli fiyat birikmediyse uydurma rakam göstermez.</li>
      <li><b>Tek dokunuşla ilana döner.</b> "Bu bilgilerle ilan ver" formu, seçilen değerlerle açar.</li>
    </ul>
    <p class="ornek-notu">Ekrandaki aralık örnek veriyle; yayından sonra gerçek tekliflerle hesaplanacak.</p>
  </div>
  ${adimSerit([
    ['deger_adim1', '1. Telefon', 'Marka, model, depolama.'],
    ['deger_adim2', '2. Ekran ve kasa', 'Beş basamaklı dürüst puan.'],
    ['deger_adim3', '3. Pil ve ekstralar', 'İsteğe bağlı; sonra hesap.'],
  ])}
`, { ad: 'deger', bolum: 'Ürün' });

// 7 — ÜRÜN: İLAN VER
sayfa('urun urun-tek serili ters', `
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · İLAN VER</p>
    <h2>Dört adım,<br>bir dakika.</h2>
    <p class="giris">Telefon bilgileri, cihaz durumu, fotoğraf ve fiyat, konum. Durum puanları kaydırıcıyla, değişen parçalar tek tek işaretlenir.</p>
    <ul class="ozellik">
      <li><b>Her ilan incelenir.</b> Yayına girmeden önce ONCEP yönetimi bakar. Çalıntı, sahte ya da çalışmayan cihaz ilanı yayınlanmaz.</li>
      <li><b>Fotoğraftaki konum silinir.</b> GPS ve kişisel meta veri, fotoğraf yüklenmeden önce telefonda temizlenir.</li>
      <li><b>30 gün teklif.</b> Süre dolmadan 7 ve 2 gün kala hatırlatma gelir; ilan yenilenebilir.</li>
    </ul>
    ${ornekNotu}
  </div>
  <div class="urun-cihazlar">${cihaz('ilan_ver', 60)}</div>
  ${adimSerit([
    ['ilan_ver_1', '1. Telefon bilgileri', 'Marka, model, renk, depolama.'],
    ['ilan_ver_3', '3. Foto ve fiyat', 'En fazla 5 fotoğraf, satış fiyatı.'],
    ['ilan_ver_4', '4. Konum', 'Şehir ve ilçe; teklifler buradan gelir.'],
  ])}
`, { ad: 'ilanver', bolum: 'Ürün' });

// 8 — ÜRÜN: TEKLİFLER
sayfa('urun urun-tek serili vurgu', `
  <div class="urun-cihazlar">${cihaz('ilanim_teklifler', 60)}</div>
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · TEKLİFLER</p>
    <h2>Teklifler<br>üst&nbsp;üste,<br>karar<br>kullanıcıda.</h2>
    <p class="giris">Aynı telefona dört mağaza dört farklı fiyat verir. Satıcı en yükseğini görür, mağazaların puanına bakar, kabul eder ya da kendi fiyatını yazar.</p>
    <ul class="ozellik">
      <li><b>Karşı teklif.</b> Satıcı teklife kendi fiyatıyla cevap verebilir.</li>
      <li><b>Günlük teklif hakkı.</b> Mağazalar günde sınırlı sayıda teklif verebilir; ilanlar teklif yağmuruna dönmez.</li>
      <li><b>Süre dolunca temizlik.</b> İlan 30 günü doldurunca yanıt bekleyen teklifler kendiliğinden kapanır.</li>
    </ul>
    ${ornekNotu}
  </div>
  ${adimSerit([
    ['teklifler_liste', 'Bütün teklifler', 'Bekleyen, geçmiş, hepsi.'],
    ['teklif_detay', 'Teklifin ayrıntısı', 'En düşük fiyatına göre farkı ve mağazanın notu.'],
    ['karsi_teklif', 'Karşı teklif', 'Kendi fiyatını ve notunu yaz.'],
  ])}
`, { ad: 'teklifler', bolum: 'Ürün' });

// 9 — ÜRÜN: MESAJ
sayfa('urun urun-tek serili ters', `
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · MESAJLAŞMA</p>
    <h2>Mağaza<br>bir&nbsp;mesaj<br>uzağında.</h2>
    <p class="giris">Kullanıcı mağazayla ilanın üstünden yazışır, fotoğraf gönderir. Buluşma saati, kutu, fatura; hepsi tek konuşmada.</p>
    <ul class="ozellik">
      <li><b>Numara ve e-posta gizli.</b> Mağazalar kullanıcının iletişim bilgilerini görmez.</li>
      <li><b>Şikâyet ve engelleme.</b> Rahatsız eden mağaza ya da kullanıcı tek dokunuşla şikâyet edilir veya engellenir.</li>
      <li><b>Anlık bildirim.</b> Yeni teklif, mesaj ve fiyat düşüşü telefona bildirim olarak gelir.</li>
    </ul>
    ${ornekNotu}
  </div>
  <div class="urun-cihazlar">${cihaz('sohbet', 60)}</div>
  ${adimSerit([
    ['mesajlar', 'Bütün sohbetler', 'Her konuşma ilanıyla birlikte.'],
    ['bildirimler', 'Bildirimler', 'Teklif, mesaj, fiyat düşüşü, ilan onayı.'],
    ['sohbet_menu', 'Şikâyet et, engelle', 'Rahatsız edene tek dokunuş.'],
  ])}
`, { ad: 'mesaj', bolum: 'Ürün' });

// 10 — ÜRÜN: KARŞILAŞTIR
sayfa('urun urun-tek', `
  <div class="urun-cihazlar">${cihaz('karsilastir', 74)}</div>
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · KARŞILAŞTIR</p>
    <h2>Hangisi<br>daha&nbsp;iyi?<br>Yan&nbsp;yana&nbsp;gör.</h2>
    <p class="giris">İki telefon arasında kararsız kalan alıcı, modelleri teknik özellikleriyle yan yana koyar. Ekrandaki örnekte iPhone 15 Pro ile Galaxy S24: ekran boyutu, ekran tipi, yenileme hızı, çözünürlük, işlemci.</p>
    <ul class="ozellik">
      <li><b>Fark çubukta ve yüzdede.</b> Öndeki telefonun değeri koyu, sayısal özelliklerde çubuğu dolu ve farkı yüzdeyle yazılı. Fark küçükse "Aradaki fark önemsiz", değerler eşitse "İki telefonda da aynı" der.</li>
      <li><b>Beş başlık.</b> Ekran, performans, pil ve şarj, kamera, diğer. Sonda "Nerede önde" özeti.</li>
      <li><b>İlandan tek dokunuş.</b> İlan detayındaki "Bu telefonu karşılaştır" ilandaki telefonu sola koyar; alıcı yalnızca karşısına koyacağını seçer.</li>
      <li><b>27 marka, 814 model.</b> Teknik verisi olan bütün telefonlar seçilebilir.</li>
    </ul>
  </div>
`, { ad: 'karsilastir', bolum: 'Ürün' });

// 11 — ÜRÜN: MAĞAZALAR
sayfa('urun urun-iki', `
  <div class="urun-metin">
    <p class="ust-etiket">ÜRÜN · MAĞAZALAR</p>
    <h2>Kimden aldığını bil.</h2>
    <p class="giris">Her mağazanın kendi sayfası var: puanı, yorumları, ilan sayısı ve ne zamandır ONCEP'te olduğu. Mağazalar puana, ilan sayısına ya da ada göre sıralanır, şehre göre süzülür.</p>
    <ul class="ozellik">
      <li><b>Kişi başı tek puan.</b> Her kullanıcı bir mağazayı bir kez puanlar; ikinci puanı eskisinin yerine geçer. Uygunsuz yorum şikâyet edilebilir.</li>
      <li><b>Mağaza vitrini.</b> Mağazanın bütün ilanları tek sayfada.</li>
    </ul>
    ${ornekNotu}
  </div>
  <div class="urun-cihazlar">
    ${cihaz('magazalar', 66)}
    ${cihaz('magaza_sayfasi', 66, 'asagi')}
  </div>
`, { ad: 'magazalar', bolum: 'Ürün' });

// 12 — TELEFONCULAR
sayfa('magaza-tarafi', `
  <p class="ust-etiket acik">TELEFONCULAR İÇİN</p>
  <h2 class="buyuk acik">İlanlar telefoncuya<br><em>kendisi gelir.</em></h2>
  <p class="giris acik">Mağaza hesabıyla giren telefoncu, şehrindeki kullanıcıların sattığı telefonları görür ve teklifini yazar. Kabul edilen teklif, müşterinin telefonuyla birlikte dükkâna gelmesi demektir.</p>
  <div class="uclu">
    <figure>${cihaz('magaza_ana', 54)}<figcaption><b>Kullanıcı ilanları</b> Minimum teklif, pil ve ilçe kartta.</figcaption></figure>
    <figure>${cihaz('magaza_ilan_detay', 54)}<figcaption><b>Teklif ver</b> Tutar ve kısa bir not; kullanıcının en düşük fiyatı üstte.</figcaption></figure>
    <figure>${cihaz('magaza_teklifler', 54)}<figcaption><b>Verdiğim teklifler</b> Bekleyen, kabul edilen, karşı teklif.</figcaption></figure>
  </div>
  <p class="ornek-notu acik">Ekranlar uygulamanın kendisinden alındı. Mağaza ve kişi adları, fiyatlar örnektir; telefon görselleri temsilîdir.</p>
`, { ad: 'telefoncular', bolum: 'Telefoncular' });

// 13 — GÜVEN
sayfa('guven', `
  <div class="guven-sol">
    <p class="ust-etiket">GÜVEN</p>
    <h2 class="buyuk">Güvenle al,<br><em>güvenle sat.</em></h2>
    <p class="giris">Uygulamadaki Güvenli Alışveriş Rehberi, ikinci el alım satımda en sık karşılaşılan tuzakları altı kuralda topluyor. Platformun kendi önlemleri de aynı hedefe çalışıyor.</p>
    <ul class="guven-liste">
      <li>Her mağaza tek tek onaylanır.</li>
      <li>Her ilan yayından önce incelenir.</li>
      <li>Numara ve e-posta mağazalara gösterilmez.</li>
      <li>Fotoğraflardaki konum bilgisi silinir.</li>
      <li>Şüpheli ilan, mesaj ve yorum şikâyet edilir.</li>
      <li>Veriler satılmaz, reklam için paylaşılmaz.</li>
      <li>Hesap uygulamanın içinden silinebilir; KVKK aydınlatma metni ve gizlilik politikası yayında.</li>
    </ul>
    <p class="durust">ONCEP IMEI doğrulaması yapmaz. Rehber, teslim almadan önce *#06# ile IMEI'nin kutu ve faturayla karşılaştırılmasını ve e-Devlet'ten sorgulanmasını öğütler.</p>
  </div>
  <div class="guven-sag">${cihaz('guvenli', 72)}</div>
`, { ad: 'guven', bolum: 'Güven' });

// 14 — PAZAR
sayfa('pazar', `
  <p class="ust-etiket acik">PAZAR</p>
  <h2 class="buyuk acik">Neden <em>şimdi?</em></h2>
  <p class="giris acik">Yeni telefon pahalanıyor, yurt dışından telefon getirmek zorlaştı, ikinci el büyüyor. Kaynağıyla rakamlar:</p>
  <div class="rakamlar">
    <div class="rakam-kart">
      <p class="rakam">11,68<small> milyon</small></p>
      <p>2025'te Türkiye'de IMEI kaydı yapılan akıllı telefon (2024: 11,30 milyon). Satış değil, pazara giren cihaz sayısı.</p>
      ${kaynak('BTK Mobil Cihaz Kayıt Sistemi verisi; Patronlar Dünyası, 11 Nisan 2026.')}
    </div>
    <div class="rakam-kart">
      <p class="rakam">+%27,6</p>
      <p>2026'da küresel ortalama akıllı telefon fiyatında beklenen artış (581 USD). Aynı yıl küresel sevkiyatın %16,7 düşmesi bekleniyor.</p>
      ${kaynak('IDC, 26 Ağustos 2026.')}
    </div>
    <div class="rakam-kart">
      <p class="rakam">+%15</p>
      <p>2026'da küresel organize ikinci el akıllı telefon pazarında beklenen büyüme.</p>
      ${kaynak('FDM CCS Insight, 17 Haziran 2026.')}
    </div>
    <div class="rakam-kart">
      <p class="rakam">54.258<small> TL</small></p>
      <p>2026'da yurt dışından getirilen telefonun IMEI kayıt harcı. Bu yolla kaydedilen cihaz 2023'te 892.501 iken 2025'te 71.203'e indi.</p>
      ${kaynak('Harç: Bigpara, 1 Ocak 2026. Kayıt sayıları: Dünya, 2 Temmuz 2025; Patronlar Dünyası, 11 Nisan 2026.')}
    </div>
    <div class="rakam-kart">
      <p class="rakam">660<small> bin</small></p>
      <p>Türkiye'de satılan yenilenmiş telefon: 2025'te 660 bin, 2026 beklentisi 1 milyonun üstü. Yenilenmiş, ikinci el pazarın küçük ve kayıtlı dilimi.</p>
      ${kaynak('MOBİSAD Başkanı, 30 Haziran 2026 (haberler.com).')}
    </div>
    <div class="rakam-kart">
      <p class="rakam">15–32<small> bin</small></p>
      <p>Türkiye'deki telefoncu noktası. Kaynaklar farklı tanımlar kullandığı için aralık olarak: MOBİSAD ~15 bin, Forbes Türkiye ~25 bin, Getmobil 32 bin+.</p>
      ${kaynak('mobisad.org; Forbes Türkiye, 3 Temmuz 2025; Webrazzi, 23 Aralık 2025.')}
    </div>
  </div>
  <p class="durust acik">Türkiye'de toplam ikinci el telefon pazarı için doğrulanmış tek bir rakam yok; sektör tahminleri yılda 5 ile 20 milyon adet arasında değişiyor. Bu yüzden burada yalnızca kaynağı belli rakamlar var.</p>
`, { ad: 'pazar', bolum: 'Pazar' });

// 15 — REKABET
// İşaretler araştırmadaki kaynaklı bilgilere göre (scratchpad arastirma.md,
// Eylül 2026). v = var, k = kısmen, y = yok.
//   - Teklif yarışı / yan yana: incelenen oyuncuların hiçbirinde yok.
//   - Elden teslim: sahibinden/letgo'da elden mümkün ama telefoncuya özgü
//     değil; Getmobil ve EasyCep'te mağazaya teslim seçeneklerden biri;
//     operatörlerde Değiş Tokuş mağazada; yenilenmiş pazaryerleri kargo.
//   - Stok tutmaz: pazaryerleri telefonu kendisi almıyor; Getmobil ve
//     EasyCep kendisi alıyor; operatör takasında iş ortakları alıyor.
const olcutler = [
  'Mağazalar teklif yarışına girer',
  'Teklifler yan yana',
  'Yerel telefoncuya elden teslim',
  'Platform stok tutmaz',
];
const oyuncular = [
  ['sahibinden.com', 'İlan platformu', 'yykv'],
  ['letgo', 'Bireyden bireye ilan', 'yykv'],
  ['Getmobil', 'Anında teklifle alım, yenilenmiş satış', 'yyky'],
  ['EasyCep', 'Yenileme merkezi', 'yyky'],
  ['Hepsiburada, Trendyol', 'Yenilenmiş kategori', 'yyyv'],
  ['Operatör takası', 'Yeni cihaza indirimle takas', 'yyky'],
  ['ONCEP', 'Onaylı telefoncuların teklif pazarı', 'vvvv'],
];
const isaret = {
  v: '<svg class="isaret var" viewBox="0 0 20 20" aria-label="var"><circle cx="10" cy="10" r="9"/><path d="M5.8 10.4l2.7 2.7 5.7-6"/></svg>',
  k: '<svg class="isaret kismen" viewBox="0 0 20 20" aria-label="kısmen"><circle cx="10" cy="10" r="8.2"/><path d="M10 1.8a8.2 8.2 0 0 1 0 16.4z"/></svg>',
  y: '<svg class="isaret yok" viewBox="0 0 20 20" aria-label="yok"><path d="M6 10h8"/></svg>',
};
sayfa('rekabet', `
  <p class="ust-etiket">REKABET</p>
  <h2 class="buyuk">ONCEP'i <em>farklı</em><br>kılan ne?</h2>
  <div class="matris-kap">
    <table class="matris">
      <thead>
        <tr><th></th>${olcutler.map((o) => `<th>${o}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${oyuncular.map(([ad, alt, isaretler]) => `<tr${ad === 'ONCEP' ? ' class="biz"' : ''}>
          <th><b>${ad}</b><span>${alt}</span></th>
          ${[...isaretler].map((i) => `<td>${isaret[i]}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
    <p class="matris-anahtar">${isaret.v} var <span></span>${isaret.k} kısmen <span></span>${isaret.y} yok</p>
  </div>
  <p class="fark-cumle">Telefoncuların teklif yarışına girdiği, tekliflerin yan yana durduğu ve teslimin şehrindeki telefoncuda elden yapıldığı başka bir model bulamadık.</p>
  <section class="yatirim-serit">
    <p class="kutu-etiket">ALANA YATIRIM GELİYOR</p>
    <div class="yatirim-ikili">
      <div><p class="rakam">45<small> milyon $</small></p><p><b>EasyCep</b> · Kasım 2025</p></div>
      <div><p class="rakam">22<small> milyon $</small></p><p><b>Getmobil</b> · Seri A, IFC katılımıyla · Aralık 2025</p></div>
    </div>
    ${kaynak('Yatırımlar: Bloomberg HT; Webrazzi, 23 Aralık 2025. Tablo: şirket sayfaları ve haberler, Eylül 2026; tarama kapsamlı değil.')}
  </section>
`, { ad: 'rekabet', bolum: 'Rekabet' });

// 16 — İŞ MODELİ
sayfa('model', `
  <p class="ust-etiket">İŞ MODELİ</p>
  <h2 class="buyuk">Kullanıcıya ücretsiz.<br><em>Telefoncuya abonelik.</em></h2>
  <p class="giris genis">ONCEP satıştan komisyon almaz, ödemeye aracılık etmez. Gelir, platformdan müşteri kazanan telefonculardan gelir: aylık ya da yıllık abonelik.</p>
  <div class="planlar">
    <article class="plan">
      <p class="plan-ad">Aylık plan</p>
      <p class="plan-alt">Esnek başlangıç; her ay yenilenir.</p>
    </article>
    <article class="plan">
      <p class="plan-ad">Yıllık plan</p>
      <p class="plan-alt">Tek ödemeyle bir yıl.</p>
    </article>
  </div>
  <div class="plan-icerik">
    <h3>İki planda da</h3>
    <ul>
      <li>Şehirdeki kullanıcı ilanlarını görme ve teklif verme</li>
      <li>Mağaza vitrini: ilan verme ve yenileme</li>
      <li>Mağaza sayfası, puan ve yorumlar</li>
      <li>Kullanıcılarla uygulama içi yazışma</li>
      <li>Teklif ve mesaj bildirimleri</li>
    </ul>
  </div>
  <div class="model-neden">
    <h3>Telefoncu neden öder?</h3>
    <p>Kabul edilen her teklif, telefonuyla dükkâna gelen bir müşteri demek: telefoncu stok için ilan sitelerinde satıcı aramak yerine, satıcıyı ayağına getiren bir kanal için öder. Vitrini de şehrindeki alıcılara aynı uygulamada görünür.</p>
  </div>
  <p class="durust">Bugün ONCEP'in bütün hizmetleri ücretsiz. Ücretli hizmetler başlamadan önce kapsamı ve fiyatı duyurulur (Kullanım Şartları, madde 7).</p>
`, { ad: 'model', bolum: 'İş modeli' });

// 17 — TEKNOLOJİ
sayfa('teknoloji', `
  <p class="ust-etiket acik">TEKNOLOJİ</p>
  <h2 class="buyuk acik">Hazır, test edilmiş,<br><em>güvenli.</em></h2>
  <div class="teknoloji-izgara">
    <div class="tek-kart rakamli">
      <p class="rakam">5.744</p>
      <p>otomatik test: 3.471 mobil uygulama, 2.273 sunucu. Her değişiklik birleştirilmeden önce hepsi çalıştırılıyor.</p>
    </div>
    <div class="tek-kart">
      <h3>Tek kod, iki platform</h3>
      <p>Flutter ile yazıldı: aynı kod Android ve iOS'ta çalışır. Arayüz Türkçe; İngilizce çevirisi kodda hazır.</p>
    </div>
    <div class="tek-kart">
      <h3>Sunucu</h3>
      <p>.NET 10 API, PostgreSQL veritabanı. Kendi alan adımızda: api.oncep.com.tr.</p>
    </div>
    <div class="tek-kart">
      <h3>Hizmetler</h3>
      <p>Fotoğraflar Cloudinary'de, bildirim ve çökme raporları Firebase'de, e-posta Resend ve Zoho ile. Sunucu beş dakikada bir izleniyor.</p>
    </div>
    <div class="tek-kart genis">
      <h3>Güvenlik önlemleri</h3>
      <ul class="iki-sutun">
        <li>Kısa ömürlü oturum anahtarı, yenileme ve diğer cihazlardan çıkış</li>
        <li>Parolalar geri döndürülemez biçimde (BCrypt) saklanır</li>
        <li>İstek sınırlama: kaba kuvvet ve spam denemelerine karşı</li>
        <li>Fotoğraflar sunucudan imzalı yüklenir; içerik ve boyut denetlenir</li>
        <li>Fotoğraftaki konum ve kişisel meta veri yüklemeden önce silinir</li>
        <li>Veritabanına dışarıdan doğrudan erişim kapalı</li>
        <li>E-posta doğrulama, şifre sıfırlama, hesap silme</li>
        <li>Hassas veriler şifreli; anahtarlar kod dışında</li>
      </ul>
    </div>
  </div>
  <p class="yigin">Flutter · .NET 10 · PostgreSQL · Cloudinary · Firebase · Render · Vercel</p>
`, { ad: 'teknoloji', bolum: 'Teknoloji' });

// 18 — YOL HARİTASI
sayfa('yol', `
  <p class="ust-etiket">YOL HARİTASI</p>
  <h2 class="buyuk">Bugün neredeyiz?</h2>
  <div class="zaman">
    <section class="evre bitti">
      <p class="evre-ad">Tamamlandı</p>
      <ul>
        <li>Android uygulaması (sürüm 1.0.0) yayına hazır</li>
        <li>Sunucu, web sitesi ve alan adı canlı</li>
        <li>Kullanıcı ve mağaza akışlarının tamamı; yönetim paneli</li>
        <li>Güvenlik denetimi ve açıkların kapatılması</li>
        <li>Gizlilik, KVKK ve kullanım şartları metinleri</li>
      </ul>
    </section>
    <section class="evre simdi">
      <p class="evre-ad">Yayın öncesi</p>
      <ul>
        <li>Şirket adına Google Play ve App Store geliştirici hesapları</li>
        <li>Yasal metinlerin hukuk danışmanı onayı</li>
        <li>İlk şehirde telefoncu ağının kurulması</li>
        <li>Mağaza sayfaları, ekran görüntüleri, tanıtım</li>
      </ul>
    </section>
    <section class="evre sonra">
      <p class="evre-ad">Yayından sonra</p>
      <ul>
        <li>iOS sürümü</li>
        <li>Değer hesabının gerçek teklif verisiyle beslenmesi</li>
        <li>Mağaza aboneliğinin başlaması</li>
        <li>Yeni şehirler</li>
      </ul>
    </section>
  </div>
  <p class="yol-alinti">Uygulama hazır. Sıradaki adım, ilk şehirde telefoncuları ONCEP'e getirmek.</p>
`, { ad: 'yol', bolum: 'Yol haritası' });

// 19 — ARKA KAPAK
sayfa('arka', `
  <div class="arka-govde">
    <img class="logo" src="gorseller/logo-acik.png" alt="ONCEP">
    <p class="arka-slogan">Telefoncu telefoncu gezme.<br><em>Bütün teklifler cebinde.</em></p>
    <div class="arka-iletisim">
      <div id="qr" class="qr" aria-label="oncep.com.tr adresine giden QR kod"></div>
      <dl>
        <dt>Web</dt><dd>oncep.com.tr</dd>
        <dt>E-posta</dt><dd>destek@oncep.com.tr</dd>
      </dl>
    </div>
  </div>
  <p class="arka-not">Bu dosyadaki ekran görüntüleri ONCEP uygulamasının kendisinden, örnek verilerle alındı; mağaza ve kişi adları ile fiyatlar örnektir, telefon görselleri temsilîdir. Pazar rakamlarının kaynakları ilgili sayfalarda yazılıdır.</p>
`, { folyo: false, ad: 'arka' });

// ---------------------------------------------------------------------------
// STİL
// ---------------------------------------------------------------------------

const css = fs.readFileSync(path.join(KOK, 'dergi.css'), 'utf8');

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ONCEP Tanıtım Dosyası</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=block">
<style>
${css}
</style>
</head>
<body>
<main class="kitap">
${sayfalar.join('\n')}
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script>
(function () {
  try {
    var qr = qrcode(0, 'M');
    qr.addData('https://oncep.com.tr');
    qr.make();
    document.getElementById('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  } catch (e) {}
  // Kontrol için: ?s=3 yalnız 3. sayfayı, ?izgara bütün sayfaları küçük
  // gösterir. Baskıyı etkilemez.
  var q = new URLSearchParams(location.search);
  var tekSayfa = q.get('s');
  if (tekSayfa) {
    document.querySelectorAll('.sayfa').forEach(function (s, i) {
      if (String(i + 1) !== tekSayfa) s.style.display = 'none';
    });
    document.querySelector('.kitap').style.padding = '0';
    document.body.style.background = '#fff';
    return;
  }
  if (q.has('izgara')) {
    var k0 = document.querySelector('.kitap');
    k0.style.display = 'grid';
    k0.style.gridTemplateColumns = 'repeat(5, 210mm)';
    k0.style.gap = '8mm';
    k0.style.padding = '8mm';
    k0.style.zoom = '0.3';
    return;
  }
  // Ekranda sayfaları pencereye sığdır (baskıda ölçek yok).
  function sigdir() {
    var k = document.querySelector('.kitap');
    var genislik = document.documentElement.clientWidth;
    var sayfaPx = 210 * 96 / 25.4 + 32;
    k.style.zoom = genislik < sayfaPx ? (genislik / sayfaPx).toFixed(3) : '';
  }
  sigdir();
  window.addEventListener('resize', sigdir);
})();
</script>
</body>
</html>
`;

const doluHtml = html.replace(/@@NO:(\w+)@@/g, (_, ad) => {
  if (!sayfaAdlari[ad]) throw new Error(`İçindekiler: "${ad}" adlı sayfa yok`);
  return String(sayfaAdlari[ad]).padStart(2, '0');
});
fs.writeFileSync(path.join(KOK, 'dergi.html'), doluHtml);
console.log(`dergi.html: ${sayfalar.length} sayfa`);

/** PDF'e gömülü yazı tipi adları (sıkıştırılmış akışlar açılarak). */
function gomuluYaziTipleri(dosya) {
  const zlib = require('zlib');
  const b = fs.readFileSync(dosya);
  const s = b.toString('latin1');
  const adlar = new Set();
  const topla = (metin) => {
    for (const x of metin.match(/\/(BaseFont|FontName)\s*\/[^\s/\]>]+/g) || []) {
      adlar.add(x.split('/').pop().split('+').pop());
    }
  };
  topla(s);
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(s))) {
    const bas = m.index + m[0].length;
    const son = s.indexOf('endstream', bas);
    if (son < 0) break;
    try { topla(zlib.inflateSync(b.subarray(bas, son)).toString('latin1')); } catch (e) { /* sıkıştırılmamış */ }
    re.lastIndex = son;
  }
  return [...adlar];
}

if (process.argv.includes('--pdf')) {
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const pdf = path.join(KOK, 'ONCEP-Tanitim-Dosyasi.pdf');
  const bekle = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  // Yazı tipleri Google Fonts'tan geliyor. Ağ o an yavaşsa Edge beklemeden
  // basıyor ve PDF'e Georgia/Segoe UI giriyor (30 Eyl'de bir kez oldu, fark
  // yalnız dosya boyutundan anlaşıldı). Bu yüzden gömülü yazı tipleri
  // denetleniyor; eksikse yeniden basılıyor.
  const gerekli = ['Fraunces', 'Onest', 'JetBrains-Mono'];
  let eksik = gerekli;
  for (let deneme = 1; deneme <= 3 && eksik.length; deneme++) {
    const kullanici = path.join(require('os').tmpdir(), `dergi-edge-${Date.now()}`);
    // Eski dosya dururken beklemek hemen biterdi (Edge dosyayı sonradan yazıyor).
    if (fs.existsSync(pdf)) fs.unlinkSync(pdf);
    execFileSync(edge, [
      '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
      `--user-data-dir=${kullanici}`, '--virtual-time-budget=30000',
      `--print-to-pdf=${pdf}`, 'file:///' + path.join(KOK, 'dergi.html').replace(/\\/g, '/'),
    ], { stdio: 'ignore' });
    for (let i = 0; i < 40 && !(fs.existsSync(pdf) && fs.statSync(pdf).size > 0); i++) bekle(500);
    bekle(1500);
    const gomulu = gomuluYaziTipleri(pdf);
    eksik = gerekli.filter((g) => !gomulu.some((a) => a.startsWith(g)));
    if (eksik.length) console.log(`Deneme ${deneme}: yazı tipi eksik (${eksik.join(', ')}); yeniden basılıyor.`);
  }
  if (eksik.length) throw new Error(`PDF'e yazı tipleri gömülemedi: ${eksik.join(', ')}. İnternet bağlantısını kontrol et.`);
  console.log(`PDF: ${pdf} (${(fs.statSync(pdf).size / 1024) | 0} KB), yazı tipleri tamam`);
}
