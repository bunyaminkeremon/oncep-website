# oncep-website
ONCEP pre-launch landing page

## Ana sayfa

`index.html` elle düzenlenmez; üretilir:

```
node tool/ana-sayfa/uret.js
```

- `tool/ana-sayfa/uret.js` — sayfa düzeni, metinler, stil, hesaplayıcı betiği
- `tool/ana-sayfa/ekranlar.js` — telefon ekranı çizimleri (uygulama ekranlarının örnekleri)
- `tool/ana-sayfa/fiyatlar.json` — değer hesabının GEÇİCİ fiyat tablosu; `node tool/ana-sayfa/fiyat-tablosu-uret.js` ile yeniden üretilir (mobil depo `../oncep_mobile` gerekir, model adları oradaki katalogdan doğrulanır)

Değer hesabı şimdilik bu tahmini tabloyla çalışıyor; uygulama yayına girip yeterli teklif birikince `GET api/PhoneValue/estimate` ucuna bağlanacak.

`tool/` klasörü `.vercelignore` ile yayına gitmez.
