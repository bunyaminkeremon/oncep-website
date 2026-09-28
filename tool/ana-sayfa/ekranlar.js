// Ana sayfadaki telefon ekranı çizimleri (uygulama ekranlarının örnekleri).
// Hepsi SABİT boyutlu süs: sayfa düzeni uret.js'te sınıflarla, bunlar satır içi
// stille. Tasarım tuvalindeki A · Sade Güven sürümünden taşındı.
const K = { bg: '#F5F7FC', card: '#FFFFFF', ink: '#0F1B3D', sub: '#4A5470', mut: '#6B7390', line: '#E7EAF3', fld: '#D9DEEC', navy: '#1A237E', org: '#F26A1B', tint: '#F1F3FA', green: '#13795B', greenT: '#E3F3EC', red: '#C0392B', redT: '#FBEAE8', deep: '#10164F', frame: '#0F1B3D' };
const F = "'Onest', system-ui, sans-serif";

const ICON = {
  search: '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"></path>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"></path><circle cx="16" cy="6" r="2"></circle><circle cx="10" cy="12" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
  sort: '<path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3"></path>',
  grid: '<rect x="4" y="4" width="7" height="7"></rect><rect x="13" y="4" width="7" height="7"></rect><rect x="4" y="13" width="7" height="7"></rect><rect x="13" y="13" width="7" height="7"></rect>',
  list: '<path d="M4 6h16M4 12h16M4 18h16"></path>',
  msg: '<path d="M4 5h16v11H9l-5 4z"></path>',
  call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"></path>',
  share: '<circle cx="18" cy="5" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="19" r="2.5"></circle><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"></path>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"></path>',
  block: '<circle cx="12" cy="12" r="8"></circle><path d="M6.5 6.5l11 11"></path>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"></path>',
  check: '<path d="M5 12l5 5L20 7"></path>',
  x: '<path d="M6 6l12 12M18 6L6 18"></path>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"></path><path d="M9 12l2 2 4-4"></path>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"></path><path d="M10 20a2 2 0 0 0 4 0"></path>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"></path><circle cx="12" cy="9" r="2.5"></circle>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle>',
  clock: '<circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l3 2"></path>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"></path>',
  chev: '<path d="M9 6l6 6-6 6"></path>',
  down: '<path d="M6 9l6 6 6-6"></path>',
  store: '<path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5"></path>',
  user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"></path><path d="M4 8l8 4 8-4M12 12v8"></path>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="1"></rect><circle cx="12" cy="12" r="2.5"></circle>',
  nocash: '<rect x="3" y="6" width="18" height="12" rx="1"></rect><path d="M4 20L20 4"></path>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"></path><path d="M9 8h6M9 12h6"></path>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M3 7l9 6 9-6"></path>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"></path>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"></path>',
  down2: '<path d="M4 7l6 6 4-4 6 6M20 10v5h-5"></path>',
  pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"></path>',
  compare: '<rect x="3" y="5" width="7" height="14" rx="1.5"></rect><rect x="14" y="5" width="7" height="14" rx="1.5"></rect>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M8 7h8M8 12h1M12 12h1M16 12h0M8 16h1M12 16h1M16 16h0"></path>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"></path><circle cx="7.5" cy="8.5" r="1.5"></circle>',
  battery: '<rect x="3" y="8" width="16" height="9" rx="1.5"></rect><path d="M21 11v3"></path>',
  more: '<circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',
  send: '<path d="M4 12l16-8-6 16-3-6z"></path>',
  home: '<path d="M4 11l8-7 8 7v9H4z"></path><path d="M10 20v-6h4v6"></path>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2"></path><path d="M4 4v4h4M20 20v-4h-4"></path>',
  gear: '<circle cx="12" cy="12" r="3"></circle><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"></path>',
  image: '<rect x="3" y="5" width="18" height="14" rx="1.5"></rect><circle cx="9" cy="10" r="2"></circle><path d="M21 16l-5-5-9 8"></path>',
  help: '<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5M12 17h0"></path>',
};

function ic(name, size = 18, color = 'currentColor', sw = 2, fill = 'none') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0;">${ICON[name]}</svg>`;
}

function stars(n, size, on, off) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += ic('star', size, i <= n ? on : off, 1.5, i <= n ? on : 'none');
  return `<span style="display: inline-flex; gap: 2px; align-items: center;">${s}</span>`;
}

// Telefon fotoğrafı yerine arka yüz çizimi (gerçek görsel yok).
function pic(h, color, bg, ex = '') {
  const pw = Math.round(h * 0.34), ph = Math.round(h * 0.74), r = Math.round(h * 0.06);
  const cam = Math.round(pw * 0.5);
  const pad = Math.max(2, Math.round(cam * 0.1));
  const gap = Math.max(2, Math.round(cam * 0.08));
  const dot = '<div style="border-radius: 50%; background: #111827; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.18);"></div>';
  return `<div style="height: ${h}px; background: ${bg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; ${ex}"><div style="width: ${pw}px; height: ${ph}px; border-radius: ${r}px; background: ${color}; position: relative; box-shadow: inset 0 0 0 2px rgba(17,24,39,0.10), 0 6px 14px rgba(17,24,39,0.16);"><div style="position: absolute; left: ${Math.round(pw * 0.1)}px; top: ${Math.round(pw * 0.1)}px; width: ${cam}px; height: ${cam}px; border-radius: ${Math.round(cam * 0.26)}px; background: rgba(17,24,39,0.22); box-sizing: border-box; padding: ${pad}px; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: ${gap}px;">${dot}${dot}${dot}</div></div></div>`;
}

const RENK = { mor: '#5E4E72', gece: '#232838', krem: '#E6DECF', yesil: '#98B3A0', mavi: '#86A2C6', kirmizi: '#B4453C', gumus: '#C9CDD4', siyah: '#2B2D33' };

const row = (inner, gap = 8, ex = '') => `<div style="display: flex; align-items: center; gap: ${gap}px; ${ex}">${inner}</div>`;
const col = (inner, gap = 8, ex = '') => `<div style="display: flex; flex-direction: column; gap: ${gap}px; ${ex}">${inner}</div>`;
const wrap = (inner, gap = 5, ex = '') => `<div style="display: flex; flex-wrap: wrap; gap: ${gap}px; ${ex}">${inner}</div>`;
const grid = (n, inner, gap = 8, ex = '') => `<div style="display: grid; grid-template-columns: repeat(${n}, minmax(0, 1fr)); gap: ${gap}px; ${ex}">${inner}</div>`;
const t = (s, sz = 12, w = 500, c = K.ink, ex = '') => `<span style="font-size: ${sz}px; font-weight: ${w}; color: ${c}; ${ex}">${s}</span>`;
const lab = (s, c = K.mut) => `<span style="font-size: 10px; font-weight: 700; letter-spacing: 0.6px; color: ${c};">${s}</span>`;
const pill = (s, on = false, ex = '') => `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 5px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; white-space: nowrap; ${on ? `background: ${K.navy}; color: #FFFFFF;` : `background: #FFFFFF; color: ${K.ink}; box-shadow: inset 0 0 0 1px ${K.fld};`} ${ex}">${s}</span>`;
const cbtn = (s, kind = 'org', ex = '') => {
  const k = { org: `background: ${K.org}; color: #FFFFFF;`, navy: `background: ${K.navy}; color: #FFFFFF;`, out: `background: #FFFFFF; color: ${K.navy}; box-shadow: inset 0 0 0 1.5px ${K.navy};`, soft: `background: ${K.tint}; color: ${K.navy};`, red: `background: ${K.redT}; color: ${K.red};` }[kind];
  return `<span style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 10px; border-radius: 10px; font-size: 12px; font-weight: 700; white-space: nowrap; ${k} ${ex}">${s}</span>`;
};
const inp = (l, v, sel = true) => col(`${lab(l)}<div style="height: 32px; border-radius: 8px; box-shadow: inset 0 0 0 1.5px ${K.fld}; background: #FFFFFF; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; font-size: 12px; font-weight: 600;"><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v}</span>${sel ? ic('down', 12, K.mut) : ''}</div>`, 4, 'min-width: 0;');
const bar5 = (n, l, w) => {
  let b = '';
  for (let i = 1; i <= 5; i++) b += `<div style="flex: 1; height: 7px; border-radius: 4px; background: ${i <= n ? K.navy : K.tint};"></div>`;
  return col(`<div style="display: flex; justify-content: space-between; font-size: 11px;"><span style="font-weight: 600;">${l}</span><span style="color: ${K.sub};">${w}</span></div><div style="display: flex; gap: 3px;">${b}</div>`, 5);
};
const toggle = (on) => `<span style="width: 34px; height: 20px; border-radius: 10px; background: ${on ? K.navy : K.fld}; position: relative; flex-shrink: 0;"><span style="position: absolute; top: 2px; ${on ? 'right: 2px' : 'left: 2px'}; width: 16px; height: 16px; border-radius: 8px; background: #FFFFFF;"></span></span>`;
const cbox = (on, s) => `<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;"><span style="width: 16px; height: 16px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; ${on ? `background: ${K.navy};` : `box-shadow: inset 0 0 0 1.5px ${K.fld};`}">${on ? ic('check', 11, '#FFFFFF', 3) : ''}</span>${s}</span>`;
const av = (s, sz = 30, bg = K.navy, c = '#FFFFFF') => `<span style="width: ${sz}px; height: ${sz}px; border-radius: ${sz / 2}px; flex-shrink: 0; background: ${bg}; color: ${c}; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${Math.round(sz * 0.38)}px;">${s}</span>`;
const ph = (h, c, bg = K.tint, r = 10) => `<div style="border-radius: ${r}px; overflow: hidden;">${pic(h, c, bg)}</div>`;
const scard = (ex, inner) => `<div style="background: #FFFFFF; border-radius: 12px; padding: 10px; box-shadow: 0 1px 0 ${K.line}; ${ex}">${inner}</div>`;
const tag = (s, bg, c) => `<span style="font-size: 9px; font-weight: 800; letter-spacing: 0.5px; padding: 3px 6px; border-radius: 5px; background: ${bg}; color: ${c}; white-space: nowrap;">${s}</span>`;

// ---------- Telefon çerçevesi ----------
function phone(inner, { w = 264, h = 540, title = '', back = false, act = '', nav = '', bg = K.bg, pad = 12, gap = 10, over = '' } = {}) {
  const sb = `<div style="height: 30px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-size: 11px; font-weight: 700; color: ${K.ink}; background: #FFFFFF;"><span>9:41</span><span style="width: 64px; height: 18px; border-radius: 9px; background: ${K.frame};"></span><span style="display: flex; gap: 3px; align-items: flex-end;"><span style="width: 3px; height: 5px; background: ${K.ink};"></span><span style="width: 3px; height: 7px; background: ${K.ink};"></span><span style="width: 3px; height: 9px; background: ${K.ink};"></span><span style="width: 16px; height: 8px; border-radius: 2px; box-shadow: inset 0 0 0 1.5px ${K.ink}; margin-left: 3px; position: relative;"><span style="position: absolute; left: 2px; top: 2px; bottom: 2px; width: 9px; background: ${K.ink};"></span></span></span></div>`;
  const ab = title ? `<div style="flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 6px 14px 10px; background: #FFFFFF; border-bottom: 1px solid ${K.line};">${back ? ic('back', 18, K.ink) : ''}<span style="flex: 1; font-size: 15px; font-weight: 800; letter-spacing: -0.2px; white-space: nowrap; overflow: hidden;">${title}</span>${act}</div>` : '';
  return `<div style="width: ${w}px; height: ${h}px; flex-shrink: 0; box-sizing: border-box; border-radius: 40px; background: ${K.frame}; padding: 8px; box-shadow: 0 30px 60px rgba(20,27,52,0.22);">
    <div style="width: 100%; height: 100%; border-radius: 32px; overflow: hidden; background: ${bg}; display: flex; flex-direction: column; position: relative; font-family: ${F}; color: ${K.ink};">
      ${sb}${ab}<div style="flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: ${gap}px; padding: ${pad}px;">${inner}</div>${nav}${over}
    </div></div>`;
}

const navItem = (i, s, on) => `<span style="display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 9px; font-weight: 700; color: ${on ? K.navy : K.mut};">${ic(i, 18, on ? K.navy : K.mut)}${s}</span>`;
const fab = `<span style="display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 9px; font-weight: 700; color: ${K.org};"><span style="width: 38px; height: 38px; border-radius: 19px; background: ${K.org}; display: flex; align-items: center; justify-content: center; margin-top: -16px; box-shadow: 0 6px 12px rgba(232,104,12,0.35);">${ic('plus', 20, '#FFFFFF', 2.6)}</span>İlan ver</span>`;
const navU = (a) => `<div style="flex-shrink: 0; display: grid; grid-template-columns: repeat(5, 1fr); align-items: end; padding: 6px 4px 12px; background: #FFFFFF; border-top: 1px solid ${K.line};">${navItem('search', 'Keşfet', a === 0)}${navItem('tag', 'İlanlarım', a === 1)}${fab}${navItem('msg', 'Mesaj', a === 3)}${navItem('user', 'Profil', a === 4)}</div>`;
const navS = (a) => `<div style="flex-shrink: 0; display: grid; grid-template-columns: repeat(5, 1fr); align-items: end; padding: 6px 4px 12px; background: #FFFFFF; border-top: 1px solid ${K.line};">${navItem('search', 'Keşfet', a === 0)}${navItem('msg', 'Mesaj', a === 1)}${fab}${navItem('store', 'Mağazam', a === 3)}${navItem('gear', 'Ayarlar', a === 4)}</div>`;
const sheet = (inner, top = 150) => `<div style="position: absolute; inset: 0; background: rgba(14,19,48,0.45);"></div><div style="position: absolute; left: 0; right: 0; bottom: 0; top: ${top}px; background: #FFFFFF; border-radius: 22px 22px 0 0; padding: 10px 16px 18px; display: flex; flex-direction: column; gap: 12px; font-family: ${F}; color: ${K.ink};"><span style="align-self: center; width: 40px; height: 4px; border-radius: 2px; background: ${K.fld};"></span>${inner}</div>`;

const minicard = (tt, p, c, extra = '', cond = '2. El') => `<div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 0 ${K.line}; position: relative; min-width: 0;">${pic(84, c, K.tint)}<span style="position: absolute; left: 6px; top: 6px;">${tag(cond, cond === 'Sıfır' ? K.navy : '#FFFFFF', cond === 'Sıfır' ? '#FFFFFF' : K.ink)}</span><span style="position: absolute; right: 6px; top: 6px; width: 22px; height: 22px; border-radius: 11px; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">${ic('heart', 12, K.ink)}</span><div style="padding: 7px 8px 8px; display: flex; flex-direction: column; gap: 2px;">${t(tt, 11, 700, K.ink, 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;')}${extra}${t(p, 13, 800, K.navy)}</div></div>`;

// ---------- Ekranlar ----------
const S = {};

S.adim2 = () => phone(`
  ${row(`${lab('ADIM 2 / 4')}<span style="flex: 1;"></span>`, 6)}
  <div style="display: flex; gap: 4px;">${[1, 2, 3, 4].map(i => `<div style="flex: 1; height: 4px; border-radius: 2px; background: ${i <= 2 ? K.org : K.fld};"></div>`).join('')}</div>
  ${t('Cihaz Durumu', 17, 800)}
  <div style="display: grid; grid-template-columns: 1fr 1fr; background: ${K.tint}; border-radius: 10px; padding: 3px;"><span style="text-align: center; padding: 7px; font-size: 12px; font-weight: 700; color: ${K.mut};">Sıfır</span><span style="text-align: center; padding: 7px; font-size: 12px; font-weight: 700; background: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 3px rgba(20,27,52,0.12);">2. El</span></div>
  ${bar5(4, 'Ekran', 'Çok iyi')}${bar5(3, 'Kasa', 'İyi')}
  ${col(`<div style="display: flex; justify-content: space-between; font-size: 11px;"><span style="font-weight: 600;">Pil sağlığı</span><span style="font-weight: 800; color: ${K.green};">%91</span></div><div style="position: relative; height: 6px; border-radius: 3px; background: ${K.tint};"><div style="position: absolute; left: 0; top: 0; bottom: 0; width: 91%; border-radius: 3px; background: ${K.green};"></div><span style="position: absolute; left: 91%; top: -5px; margin-left: -8px; width: 16px; height: 16px; border-radius: 8px; background: #FFFFFF; box-shadow: 0 1px 4px rgba(20,27,52,0.3);"></span></div>`, 6)}
  ${lab('DEĞİŞEN PARÇALAR')}
  ${wrap(['Ekran', 'Batarya', 'Kamera', 'Anakart', 'Şarj soketi', 'Hoparlör', 'Arka kapak', 'Face ID'].map(p => pill(p, p === 'Batarya')).join(''), 5)}
  <div style="margin-top: auto; display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">${cbtn('Geri', 'soft')}${cbtn('Devam', 'org')}</div>
`, { title: 'İlan Ver', back: true });

S.ilanim = () => {
  const off = (n, s, a, l, top = false) => `<div style="background: #FFFFFF; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 8px; ${top ? `box-shadow: inset 0 0 0 1.5px ${K.org};` : `box-shadow: 0 1px 0 ${K.line};`}">${row(`${av(n.split(' ').map(x => x[0]).join(''), 28)}${col(`${t(n, 12, 700)}${t(s, 10, 500, K.mut)}`, 1, 'flex: 1; min-width: 0;')}${col(`${t(a, 14, 800, K.navy)}${t(l, 9, 600, K.mut)}`, 1, 'align-items: flex-end;')}`)}${top ? `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">${cbtn('Kabul Et', 'org', 'padding: 7px 4px; font-size: 11px;')}${cbtn('Reddet', 'soft', 'padding: 7px 4px; font-size: 11px;')}${cbtn('Karşı teklif', 'out', 'padding: 7px 4px; font-size: 11px;')}</div>` : ''}</div>`;
  return phone(`
    ${scard('', row(`<div style="width: 50px;">${ph(50, RENK.mor)}</div>${col(`${t('iPhone 14 Pro 256 GB', 12, 700)}${row(tag('YAYINDA', K.greenT, K.green) + t('Min. 35.000 TL', 10, 600, K.mut), 5)}`, 4, 'min-width: 0;')}`, 10))}
    ${grid(2, scard('', col(`${lab('EN YÜKSEK')}${t('36.800 TL', 15, 800, K.navy)}`, 2)) + scard('', col(`${lab('TEKLİF SÜRESİ')}${t('18 gün kaldı', 15, 800)}`, 2)), 8)}
    ${lab('GELEN TEKLİFLER · 4', K.ink)}
    ${off('Üsküdar GSM', '★ 4,9 · Üsküdar', '36.800', '18 gün kaldı', true)}
    ${off('Şişli Telekom', '★ 4,7 · Şişli', '34.200', '17 gün kaldı')}
    ${off('Beşiktaş Mobil', '★ 4,8 · Beşiktaş', '33.900', '15 gün kaldı')}
  `, { title: 'İlanım', back: true, act: ic('more', 18, K.ink) });
};

S.karsi = () => phone(`
  ${lab('GELEN TEKLİFLER · 4', K.ink)}
  ${[['Üsküdar GSM', '36.800'], ['Şişli Telekom', '34.200'], ['Beşiktaş Mobil', '33.900'], ['Kadıköy Cep', '32.500']].map(([n, a]) => scard('', row(`${av(n.split(' ').map(x => x[0]).join(''), 26)}${t(n, 12, 700, K.ink, 'flex: 1;')}${t(a, 13, 800, K.navy)}`))).join('')}
`, {
  title: 'İlanım', back: true, over: sheet(`
    ${t('Karşı teklif', 17, 800)}
    ${scard(`background: ${K.tint}; box-shadow: none;`, row(`${av('ŞT', 28)}${col(`${t('Şişli Telekom', 12, 700)}${t('34.200 TL teklif verdi', 11, 500, K.sub)}`, 1)}`))}
    ${col(`${lab('TUTAR')}<div style="height: 46px; border-radius: 10px; box-shadow: inset 0 0 0 2px ${K.navy}; display: flex; align-items: center; justify-content: space-between; padding: 0 12px;"><span style="font-size: 22px; font-weight: 800;">36.000</span>${t('TL', 12, 700, K.mut)}</div>`, 4)}
    ${col(`${lab('MESAJ')}<div style="border-radius: 10px; box-shadow: inset 0 0 0 1.5px ${K.fld}; padding: 9px 10px; font-size: 12px;">Kutusu ve faturası var.</div>`, 4)}
    ${cbtn('Karşı teklifi gönder', 'org', 'padding: 12px; font-size: 13px; margin-top: auto;')}
  `, 190)
});

S.kesfet = () => phone(`
  <div style="display: flex; align-items: center; gap: 8px; height: 36px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 1px ${K.fld}; padding: 0 10px;">${ic('search', 14, K.mut)}${t('Marka, model veya mağaza ara', 11, 500, K.mut)}</div>
  <div style="display: flex; gap: 6px;">${cbtn(`${ic('sliders', 13, '#FFFFFF')}Filtrele · 4`, 'navy', 'flex: 1; padding: 7px;')}${cbtn(`${ic('sort', 13, K.navy)}Sırala`, 'out', 'flex: 1; padding: 7px;')}<span style="width: 32px; border-radius: 10px; background: ${K.tint}; display: flex; align-items: center; justify-content: center;">${ic('grid', 14, K.navy)}</span></div>
  ${wrap(['Apple ×', '2. El ×', 'Değişensiz ×', '25–50 bin ×'].map(s => pill(s, true, 'padding: 4px 8px; font-size: 10px;')).join(''), 4)}
  ${grid(2, minicard('iPhone 14 Pro', '36.500 TL', RENK.mor, t('%91 Batarya', 9, 700, K.green)) + minicard('iPhone 13', '24.500 TL', RENK.gece, t('%86 Batarya', 9, 700, K.green)) + minicard('iPhone 15', '38.900 TL', RENK.yesil, t('%97 Batarya', 9, 700, K.green)) + minicard('iPhone 14', '29.750 TL', RENK.mavi, t('%89 Batarya', 9, 700, K.green)), 8)}
`, { title: `<span style="color: ${K.navy};">ON</span><span style="color: ${K.org};">CEP</span>`, act: ic('bell', 18, K.ink), nav: navU(0) });

S.filtre = () => phone(`
  ${col(`${lab('MARKA')}${wrap(['Apple', 'Samsung', 'Xiaomi', 'Huawei'].map((s, i) => pill(s, i === 0)).join(''), 4)}`, 6)}
  ${col(`${lab('DURUM')}<div style="display: grid; grid-template-columns: repeat(3, 1fr); background: ${K.tint}; border-radius: 9px; padding: 3px;">${['Tümü', 'Sıfır', '2. El'].map((s, i) => `<span style="text-align: center; padding: 5px; font-size: 11px; font-weight: 700; ${i === 2 ? 'background: #FFFFFF; border-radius: 7px; box-shadow: 0 1px 3px rgba(20,27,52,0.12);' : `color: ${K.mut};`}">${s}</span>`).join('')}</div>`, 6)}
  ${row(cbox(true, 'Değişensiz') + cbox(false, 'Garantili'), 16)}
  ${col(`${lab('FİYAT ARALIĞI')}${wrap(['10 bin altı', '10–25 bin', '25–50 bin', '50 bin üstü'].map((s, i) => pill(s, i === 2)).join(''), 4)}`, 6)}
  ${col(`${lab('DEPOLAMA')}${wrap(['128 GB', '256 GB', '512 GB', '1 TB'].map((s, i) => pill(s, i === 1)).join(''), 4)}`, 6)}
  ${row(`${lab('RENK')}<span style="flex: 1;"></span>${row([RENK.mor, RENK.gece, RENK.krem, RENK.mavi, RENK.yesil, RENK.kirmizi].map((c, i) => `<span style="width: 20px; height: 20px; border-radius: 10px; background: ${c}; ${i === 0 ? `box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px ${K.navy};` : `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);`}"></span>`).join(''), 8)}`, 6)}
  ${grid(2, inp('ŞEHİR', 'İstanbul') + inp('İLÇE', 'Tüm İlçeler'), 6)}
`, { title: 'Filtreler', back: true, act: t('Temizle', 12, 700, K.navy), gap: 7, nav: `<div style="flex-shrink: 0; padding: 8px 12px 14px; background: #FFFFFF; border-top: 1px solid ${K.line}; display: flex;">${cbtn('128 ilanı göster', 'org', 'flex: 1; padding: 11px; font-size: 13px;')}</div>` });

S.detay = () => phone(`
  <div style="margin: -12px -12px 0; position: relative;">${pic(140, RENK.mor, K.tint)}<span style="position: absolute; left: 12px; top: 10px; width: 28px; height: 28px; border-radius: 14px; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">${ic('back', 15, K.ink)}</span><span style="position: absolute; right: 12px; top: 10px; display: flex; gap: 6px;"><span style="width: 28px; height: 28px; border-radius: 14px; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">${ic('share', 14, K.ink)}</span><span style="width: 28px; height: 28px; border-radius: 14px; background: #FFFFFF; display: flex; align-items: center; justify-content: center;">${ic('heart', 14, K.org, 2, K.org)}</span></span><span style="position: absolute; right: 12px; bottom: 10px; font-size: 10px; font-weight: 700; color: #FFFFFF; background: rgba(14,19,48,0.7); padding: 2px 7px; border-radius: 8px;">1 / 5</span></div>
  ${col(`${t('36.500 TL', 22, 800, K.navy)}${t('iPhone 14 Pro 256 GB', 14, 700)}${t('182 görüntülenme · 2 gün önce', 10, 500, K.mut)}`, 3)}
  ${scard('', col(`${lab('TELEFON DURUMU', K.ink)}${bar5(4, 'Ekran durumu', 'Çok iyi')}${bar5(3, 'Kasa durumu', 'İyi')}<div style="display: flex; justify-content: space-between; font-size: 11px;"><span style="font-weight: 600;">Batarya sağlığı</span><span style="font-weight: 800; color: ${K.green};">%91</span></div>`, 8))}
  ${scard('', row(`${av('ÜG', 30)}${col(`${t('Üsküdar GSM', 12, 700)}${row(stars(5, 10, K.org, K.fld) + t('4,9 · 37 değerlendirme', 10, 500, K.mut), 4)}`, 2, 'flex: 1;')}${ic('chev', 14, K.mut)}`))}
`, { pad: 12, gap: 8, nav: `<div style="flex-shrink: 0; display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px; padding: 10px 12px 14px; background: #FFFFFF; border-top: 1px solid ${K.line};">${cbtn(`${ic('msg', 14, K.navy)}Mesaj`, 'out', 'padding: 11px;')}${cbtn(`${ic('call', 14, '#FFFFFF')}İletişime Geç`, 'org', 'padding: 11px;')}</div>` });

S.favori = () => {
  const it = (n, p, d, dc, c, sold = false) => row(`<div style="width: 40px; ${sold ? 'opacity: 0.45;' : ''}">${ph(40, c, K.tint, 8)}</div>${col(`${t(n, 11, 700, sold ? K.mut : K.ink)}${t(p, 12, 800, sold ? K.mut : K.navy, sold ? 'text-decoration: line-through;' : '')}`, 1, 'flex: 1; min-width: 0;')}${sold ? tag('SATILDI', K.redT, K.red) : `<span style="font-size: 10px; font-weight: 700; color: ${dc}; text-align: right;">${d}</span>`}`, 8, 'padding: 4px 0;');
  const g = (n) => row(`${t(n, 11, 800, K.ink, 'flex: 1;')}${cbtn(`${ic('msg', 11, K.navy)}Yaz`, 'soft', 'padding: 4px 8px; font-size: 10px;')}`, 6, 'padding-top: 2px;');
  return phone(`
    <div style="display: flex; gap: 8px; align-items: center; background: ${K.greenT}; color: ${K.green}; padding: 9px 10px; border-radius: 10px; font-size: 12px; font-weight: 700;">${ic('down2', 15, K.green)}2 ilanın fiyatı düştü</div>
    ${scard('', g('Üsküdar GSM') + it('iPhone 13 128 GB', '24.500 TL', '1.500 TL düştü', K.green, RENK.gece) + it('Galaxy S23 128 GB', '27.900 TL', 'Eklediğinden beri aynı', K.mut, RENK.krem))}
    ${scard('', g('Kadıköy Cep') + it('iPhone 15 128 GB', '38.150 TL', '750 TL düştü', K.green, RENK.yesil))}
    ${lab('ARTIK SATIŞTA DEĞİL')}
    ${scard('', it('Pixel 8 128 GB', '21.000 TL', '', '', RENK.gumus, true) + row(t('Benzerlerini gör', 11, 700, K.navy) + ic('arrow', 12, K.navy), 4, 'padding-top: 2px;'))}
  `, { title: 'Favorilerim', back: true, gap: 6 });
};

S.bildirim = () => {
  const n = (i, a, b, tm, un) => row(`<span style="width: 30px; height: 30px; border-radius: 15px; background: ${un ? '#FDEBDD' : K.tint}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${ic(i, 14, un ? K.org : K.navy)}</span>${col(`${t(a, 11, 800)}${t(b, 10, 500, K.sub, 'line-height: 1.35;')}`, 1, 'flex: 1; min-width: 0;')}${col(`${t(tm, 9, 600, K.mut)}${un ? `<span style="width: 7px; height: 7px; border-radius: 4px; background: ${K.org}; align-self: flex-end;"></span>` : ''}`, 4)}`, 8, 'align-items: flex-start; padding: 7px 0;');
  return phone(`
    ${row(pill('Tümü', true) + pill('Okunmamış · 2'), 5)}
    ${lab('BUGÜN')}
    ${scard('padding: 4px 10px;', n('tag', 'Yeni teklif', 'Üsküdar GSM ilanına 36.800 TL teklif verdi.', '10:24', true) + n('down2', 'Fiyat düştü', 'Favorindeki iPhone 13 1.500 TL ucuzladı.', '09:02', true))}
    ${lab('DÜN')}
    ${scard('padding: 4px 10px;', n('check', 'İlan onayı', 'iPhone 14 Pro ilanın yayında.', '18:40', false))}
    ${lab('BU HAFTA')}
    <div style="position: relative; border-radius: 12px; overflow: hidden; background: ${K.red};"><div style="position: absolute; right: 0; top: 0; bottom: 0; width: 56px; display: flex; align-items: center; justify-content: center;">${ic('trash', 16, '#FFFFFF')}</div><div style="transform: translateX(-56px); background: #FFFFFF; padding: 4px 10px;">${n('clock', 'Süre dolma uyarısı', 'Teklif süresi 7 gün sonra doluyor.', 'Pzt', false)}</div></div>
  `, { title: 'Bildirimler', back: true, act: t('Tümünü oku', 11, 700, K.navy) });
};

S.bildirimAyar = () => {
  const r = (a, on, s = '') => row(`${col(`${t(a, 12, 700)}${s ? t(s, 10, 500, K.sub, 'line-height: 1.35;') : ''}`, 2, 'flex: 1; min-width: 0;')}${toggle(on)}`, 10, `padding: 9px 0; border-bottom: 1px solid ${K.line}; align-items: ${s ? 'flex-start' : 'center'};`);
  return phone(`
    ${scard(`background: ${K.navy};`, row(`${t('Anlık bildirimler', 13, 800, '#FFFFFF', 'flex: 1;')}<span style="width: 34px; height: 20px; border-radius: 10px; background: ${K.org}; position: relative;"><span style="position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 8px; background: #FFFFFF;"></span></span>`))}
    ${scard('padding: 2px 12px;', r('Yeni mesaj', true) + r('Yeni teklif', true) + r('Teklif durumu', true) + r('İlan onayı', true) + r('Süre dolma uyarısı', true) + r('Favoriler', false, 'İlanın favorilendiğinde ya da takip ettiğin ilanın fiyatı düştüğünde'))}
    ${t('Hesapla ilgili bildirimler her zaman gelir.', 10, 500, K.mut)}
  `, { title: 'Bildirim ayarları', back: true });
};

S.sohbet = (withMenu = false) => {
  const b = (me, inner) => `<div style="align-self: ${me ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${me ? K.navy : '#FFFFFF'}; color: ${me ? '#FFFFFF' : K.ink}; padding: 8px 11px; border-radius: ${me ? '14px 14px 4px 14px' : '14px 14px 14px 4px'}; font-size: 12px; line-height: 1.4; ${me ? '' : `box-shadow: 0 1px 0 ${K.line};`}">${inner}</div>`;
  const menu = withMenu ? `<div style="position: absolute; right: 16px; top: 72px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 14px 30px rgba(14,19,48,0.25); padding: 4px 0; font-family: ${F}; min-width: 140px;"><div style="display: flex; gap: 8px; align-items: center; padding: 9px 14px; font-size: 12px; font-weight: 700; color: ${K.ink};">${ic('flag', 14, K.ink)}Şikayet et</div><div style="display: flex; gap: 8px; align-items: center; padding: 9px 14px; font-size: 12px; font-weight: 700; color: ${K.red}; border-top: 1px solid ${K.line};">${ic('block', 14, K.red)}Engelle</div></div>` : '';
  return phone(`
    ${scard('padding: 7px;', row(`<div style="width: 36px;">${ph(36, RENK.mor, K.tint, 6)}</div>${col(`${t('iPhone 14 Pro 256 GB', 11, 700)}${t('35.000 TL', 10, 700, K.navy)}`, 1, 'flex: 1;')}${t('İlanı gör ›', 10, 700, K.navy)}`, 8))}
    <div style="align-self: center;">${t('Bugün', 10, 700, K.mut)}</div>
    ${b(false, "Merhaba, telefonu yarın 15:00'te görebilir miyiz? Teklifimiz 36.800 TL.")}
    ${b(true, `Olur. Pil sağlığı ekranı:<div style="margin-top: 6px; width: 120px; height: 72px; border-radius: 8px; background: #2A3142; display: flex; align-items: center; justify-content: center; gap: 6px;">${ic('battery', 18, '#8FE3A8')}<span style="font-size: 20px; font-weight: 800;">%91</span></div>`)}
    ${b(false, 'Tamamdır, bekliyoruz.')}
  `, {
    title: row(`${av('ÜG', 26)}${col(`${t('Üsküdar GSM', 13, 800)}${t('★ 4,9 · Üsküdar', 9, 600, K.mut)}`, 0)}`, 8), back: true, act: ic('more', 18, K.ink),
    nav: `<div style="flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 8px 12px 14px; background: #FFFFFF; border-top: 1px solid ${K.line};">${ic('camera', 18, K.mut)}${ic('image', 18, K.mut)}<span style="flex: 1; height: 32px; border-radius: 16px; background: ${K.tint}; display: flex; align-items: center; padding: 0 12px; font-size: 11px; color: ${K.mut};">Mesaj yaz...</span><span style="width: 32px; height: 32px; border-radius: 16px; background: ${K.org}; display: flex; align-items: center; justify-content: center;">${ic('send', 14, '#FFFFFF')}</span></div>`,
    over: menu,
  });
};

S.mesajlar = () => {
  const c = (n, m, tm, un, i) => row(`${av(i, 34, un ? K.navy : K.tint, un ? '#FFFFFF' : K.navy)}${col(`${row(t(n, 12, 800, K.ink, 'flex: 1;') + t(tm, 9, 600, K.mut), 4)}${row(t(m, 11, un ? 700 : 500, un ? K.ink : K.mut, 'flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;') + (un ? `<span style="min-width: 16px; height: 16px; border-radius: 8px; background: ${K.org}; color: #FFFFFF; font-size: 9px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center;">${un}</span>` : ''), 6)}`, 2, 'flex: 1; min-width: 0;')}`, 10, `padding: 9px 0; border-bottom: 1px solid ${K.line};`);
  return phone(`
    ${row(pill('Tümü') + pill('Okunmamış · 2', true), 5)}
    ${scard('padding: 0 12px;', c('Üsküdar GSM', 'Tamamdır, bekliyoruz.', '10:31', 2, 'ÜG') + c('Şişli Telekom', 'Karşı teklifinizi aldık.', '09:12', 1, 'ŞT') + c('Kızılay İletişim', 'Kutusu da var mı?', 'Dün', 0, 'Kİ') + c('Alsancak Cep', 'Fotoğraf', 'Pzt', 0, 'AC'))}
    ${row(ic('lock', 13, K.mut) + t('Mağaza seni “Ahmet Y.” olarak görür; numaran gizli.', 10, 600, K.mut, 'line-height: 1.35;'), 6, 'align-items: flex-start; padding: 0 2px;')}
  `, { title: 'Mesajlarım', nav: navU(3) });
};

S.sikayet = () => phone('', {
  title: 'Şikayet et', back: true, bg: K.bg,
  over: sheet(`
    ${t('Şikayet nedeni', 16, 800)}
    ${['Sahte/Yanıltıcı İlan', 'Uygunsuz İçerik', 'Spam', 'Fiyat Manipülasyonu', 'Çalıntı Telefon Şüphesi'].map((r, i) => row(`<span style="width: 16px; height: 16px; border-radius: 8px; box-shadow: inset 0 0 0 ${i === 4 ? 5 : 1.5}px ${i === 4 ? K.org : K.fld};"></span>${t(r, 12, i === 4 ? 800 : 600)}`, 10, `padding: 6px 0;`)).join('')}
    <div style="border-radius: 10px; box-shadow: inset 0 0 0 1.5px ${K.fld}; padding: 9px 10px; font-size: 11px; color: ${K.mut}; height: 48px; box-sizing: border-box;">Açıklama (isteğe bağlı)</div>
    ${cbtn('Gönder', 'org', 'padding: 11px; font-size: 13px;')}
  `, 110)
});

S.magazalar = () => {
  const mc = (n, i, p, c, loc, adet, sure) => `<div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 0 ${K.line};"><div style="height: 54px; background: linear-gradient(135deg, ${K.navy}, #3949AB); position: relative;"><span style="position: absolute; left: 8px; top: 8px;">${tag(sure, 'rgba(255,255,255,0.92)', K.navy)}</span></div><div style="padding: 0 10px 10px; display: flex; gap: 8px; align-items: flex-end; margin-top: -16px;">${av(i, 36, '#FFFFFF', K.navy)}${col(`${t(n, 12, 800)}${row(p ? `${stars(Math.round(p), 9, K.org, K.fld)}${t(`${String(p).replace('.', ',')} · ${c} değerlendirme`, 9, 600, K.mut)}` : t('Henüz puan yok', 9, 600, K.mut), 3)}`, 1, 'flex: 1; min-width: 0;')}</div><div style="display: flex; justify-content: space-between; padding: 0 10px 10px; font-size: 10px; color: ${K.sub}; font-weight: 600;"><span style="display: inline-flex; gap: 3px; align-items: center;">${ic('pin', 11, K.sub)}${loc}</span><span>${adet} ilan</span></div></div>`;
  return phone(`
    <div style="display: flex; align-items: center; gap: 8px; height: 34px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 1px ${K.fld}; padding: 0 10px;">${ic('search', 14, K.mut)}${t('Mağaza veya şehir ara', 11, 500, K.mut)}</div>
    ${row(pill('En yüksek puan', true) + pill('En çok ilan') + pill('A–Z'), 4)}
    ${row(pill(`${ic('pin', 10, K.ink)}Şehrim: İstanbul`) + pill('Tüm şehirler', true), 4)}
    ${mc('Üsküdar GSM', 'ÜG', 4.9, 37, 'İstanbul · Üsküdar', 42, "3 aydır ONCEP'te")}
    ${mc('Kızılay İletişim', 'Kİ', 4.7, 21, 'Ankara · Çankaya', 28, "5 aydır ONCEP'te")}
    ${mc('Nilüfer Mobil', 'NM', 0, 0, 'Bursa · Nilüfer', 6, "ONCEP'e yeni katıldı")}
  `, { title: 'Mağazalar', back: true, gap: 9 });
};

S.magazaSayfa = () => {
  const bars = [[5, 31], [4, 5], [3, 1], [2, 0], [1, 0]].map(([s, n]) => row(`${t(`${s}`, 9, 700, K.mut, 'width: 8px;')}<div style="flex: 1; height: 5px; border-radius: 3px; background: ${K.tint};"><div style="width: ${Math.round(n / 37 * 100)}%; height: 100%; border-radius: 3px; background: ${K.org};"></div></div>`, 5)).join('');
  const rv = (n, s, x, d) => col(`${row(t(n, 11, 800, K.ink, 'flex: 1;') + t(d, 9, 600, K.mut), 4)}${stars(s, 10, K.org, K.fld)}${t(x, 11, 500, K.sub, 'line-height: 1.4;')}`, 3, `padding: 8px 0; border-top: 1px solid ${K.line};`);
  return phone(`
    <div style="margin: -12px -12px 0; height: 70px; background: linear-gradient(135deg, ${K.navy}, #3949AB);"></div>
    <div style="display: flex; gap: 10px; align-items: flex-end; margin-top: -34px;">${av('ÜG', 50, '#FFFFFF', K.navy)}${col(`${t('Üsküdar GSM', 15, 800)}${t('12 Mart 2026 tarihinden beri üye', 9, 600, K.mut)}`, 1)}</div>
    ${grid(2, cbtn(`${ic('msg', 13, '#FFFFFF')}Mesaj gönder`, 'navy', 'padding: 8px;') + cbtn(`${ic('call', 13, K.navy)}Ara`, 'out', 'padding: 8px;'), 6)}
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid ${K.line};">${['İlanlar', 'Yorumlar', 'Hakkında'].map((s, i) => `<span style="text-align: center; padding: 7px; font-size: 11px; font-weight: 800; ${i === 1 ? `color: ${K.navy}; box-shadow: inset 0 -2px 0 ${K.org};` : `color: ${K.mut};`}">${s}</span>`).join('')}</div>
    ${row(col(`${t('4,9', 28, 800)}${stars(5, 9, K.org, K.fld)}${t('37 değerlendirme', 9, 600, K.mut)}`, 2) + col(bars, 4, 'flex: 1;'), 12)}
    ${rv('Mehmet K.', 5, 'Telefon ilandaki gibiydi, pil sağlığını yanımda gösterdiler.', '2 gün önce')}
    ${rv('Zeynep A.', 4, 'Hızlı döndüler, teslimde biraz bekledim.', '1 hafta önce')}
  `, { title: '', gap: 9 });
};

S.yorum = () => phone(`
  ${col(`${t('Bu mağazayı nasıl buldun?', 17, 800, K.ink, 'text-align: center;')}${t('Üsküdar GSM', 12, 600, K.mut, 'text-align: center;')}`, 4, 'padding-top: 10px;')}
  <div style="display: flex; justify-content: center; gap: 4px;">${stars(5, 32, K.org, K.fld)}</div>
  ${t('Mükemmel', 13, 800, K.org, 'text-align: center;')}
  <div style="border-radius: 12px; box-shadow: inset 0 0 0 1.5px ${K.fld}; background: #FFFFFF; padding: 10px; font-size: 12px; line-height: 1.45; height: 110px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;"><span>Teklifleri hızlıydı, telefonu dükkanda baştan sona test ettik.</span><span style="align-self: flex-end; font-size: 9px; color: ${K.mut}; font-weight: 700;">62 / 500</span></div>
  ${t('Her mağazaya bir yorum yazabilirsin; yenisi eskisinin yerine geçer.', 10, 500, K.mut, 'line-height: 1.4;')}
  ${cbtn('Yorumu Gönder', 'org', 'padding: 12px; font-size: 13px; margin-top: auto;')}
`, { title: 'Değerlendir', back: true });

S.ayarlar = () => {
  const r = (i, a, right = '', c = K.ink) => row(`<span style="width: 28px; height: 28px; border-radius: 8px; background: ${c === K.red ? K.redT : K.tint}; display: flex; align-items: center; justify-content: center;">${ic(i, 14, c === K.red ? K.red : K.navy)}</span>${t(a, 12, 700, c, 'flex: 1;')}${right || ic('chev', 13, K.mut)}`, 10, `padding: 8px 0; border-bottom: 1px solid ${K.line};`);
  return phone(`
    <div style="display: flex; gap: 8px; align-items: center; background: #FFF3E6; border-radius: 10px; padding: 9px 10px;">${ic('mail', 15, K.org)}${t('E-posta adresini doğrulamadın.', 11, 700, K.ink, 'flex: 1;')}${t('Doğrula', 11, 800, K.org)}</div>
    ${lab('HESAP')}
    ${scard('padding: 2px 12px;', r('mail', 'E-posta adresi', tag('Doğrulanmadı', '#FFF3E6', K.org)) + r('lock', 'Şifre değiştir') + r('logout', 'Diğer cihazlardan çıkış yap') + r('block', 'Engellenenler'))}
    ${lab('BİLDİRİM VE YASAL')}
    ${scard('padding: 2px 12px;', r('bell', 'Detaylı bildirim ayarları') + r('shield', 'KVKK · Gizlilik · Şartlar'))}
    ${scard('padding: 2px 12px;', r('trash', 'Hesabımı Sil', '', K.red))}
  `, { title: 'Ayarlar', back: true, gap: 5 });
};

S.magazaKesfet = () => {
  const u = (n, who, p, c) => scard('padding: 8px;', row(`<div style="width: 58px;">${ph(58, c, K.tint, 8)}</div>${col(`${t(n, 12, 800)}${t(who, 10, 600, K.mut)}${row(t('Min. teklif', 9, 700, K.mut) + t(`${p} TL`, 12, 800, K.org), 4)}`, 2, 'flex: 1; min-width: 0;')}${ic('heart', 15, K.navy)}`, 9));
  return phone(`
    <div style="display: flex; align-items: center; gap: 8px; height: 34px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 1px ${K.fld}; padding: 0 10px;">${ic('search', 14, K.mut)}${t('Marka, model veya kullanıcı ara', 11, 500, K.mut)}</div>
    <div style="display: flex; gap: 6px;">${cbtn(`${ic('sliders', 13, '#FFFFFF')}Filtrele`, 'navy', 'flex: 1; padding: 7px;')}${cbtn(`${ic('sort', 13, K.navy)}Sırala`, 'out', 'flex: 1; padding: 7px;')}</div>
    ${u('iPhone 14 Pro 256 GB', 'Ahmet Y. · Üsküdar', '35.000', RENK.mor)}
    ${u('Galaxy S23 128 GB', 'Elif D. · Kadıköy', '22.000', RENK.krem)}
    ${u('iPhone 12 64 GB', 'Can T. · Ataşehir', '11.500', RENK.kirmizi)}
    ${u('Redmi Note 12 128 GB', 'Deniz K. · Maltepe', '6.500', RENK.mavi)}
  `, { title: 'Mağaza · Keşfet', act: ic('bell', 18, K.ink), nav: navS(0), gap: 9 });
};

S.teklifVer = () => phone(`
  ${scard('', row(`<div style="width: 50px;">${ph(50, RENK.mor)}</div>${col(`${t('iPhone 14 Pro 256 GB', 12, 800)}${t('Ahmet Y. · Üsküdar', 10, 600, K.mut)}${row(t('Min. teklif', 9, 700, K.mut) + t('35.000 TL', 12, 800, K.org), 4)}`, 2)}`, 10))}
  ${scard('', col(`${lab('SATICI VE KONUM', K.ink)}${t('Ahmet Y. · İstanbul / Üsküdar', 11, 600, K.sub)}`, 4))}
`, {
  title: 'Kullanıcı İlanı', back: true,
  over: sheet(`
    ${t('Teklif Ver', 17, 800)}
    ${col(`${lab('TUTAR')}<div style="height: 46px; border-radius: 10px; box-shadow: inset 0 0 0 2px ${K.navy}; display: flex; align-items: center; justify-content: space-between; padding: 0 12px;"><span style="font-size: 22px; font-weight: 800;">36.800</span>${t('TL', 12, 700, K.mut)}</div>`, 4)}
    ${col(`${lab('MESAJ (İSTEĞE BAĞLI)')}<div style="border-radius: 10px; box-shadow: inset 0 0 0 1.5px ${K.fld}; padding: 9px 10px; font-size: 12px; line-height: 1.4;">Yarın 15:00 gelebilirsin, nakit ödüyoruz.</div>`, 4)}
    <div style="display: flex; gap: 6px; align-items: center; background: ${K.tint}; border-radius: 10px; padding: 8px 10px;">${ic('clock', 14, K.navy)}${t('Bugün 27 teklif hakkın kaldı', 11, 700, K.navy)}</div>
    ${cbtn('Teklifi Gönder', 'org', 'padding: 12px; font-size: 13px; margin-top: auto;')}
  `, 170)
});

S.magazaProfil = () => {
  const st = (a, b) => scard('padding: 8px; text-align: center;', col(`${t(b, 16, 800, K.navy)}${t(a, 9, 700, K.mut)}`, 1, 'align-items: center;'));
  const m = (i, a, n = '') => row(`${ic(i, 15, K.navy)}${t(a, 12, 700, K.ink, 'flex: 1;')}${n ? tag(n, K.tint, K.navy) : ''}${ic('chev', 13, K.mut)}`, 10, `padding: 9px 0; border-bottom: 1px solid ${K.line};`);
  return phone(`
    ${row(`${av('ÜG', 44)}${col(`${t('Üsküdar GSM', 15, 800)}${row(stars(5, 10, K.org, K.fld) + t('4,9 · 37', 10, 600, K.mut), 4)}`, 2)}`, 10)}
    ${grid(3, st('Aktif İlan', '18') + st('Satılan', '64') + st('Görüntülenme', '3.240'), 6)}
    ${lab('MAĞAZA İLANLARIM')}
    ${grid(4, ['Aktif', 'Beklemede', 'Pasif', 'Satılan'].map((s, i) => `<span style="text-align: center; padding: 6px 2px; border-radius: 8px; font-size: 9px; font-weight: 800; ${i === 0 ? `background: ${K.navy}; color: #FFFFFF;` : `background: #FFFFFF; color: ${K.sub}; box-shadow: inset 0 0 0 1px ${K.fld};`}">${s}</span>`).join(''), 4)}
    ${scard('padding: 2px 12px;', m('tag', 'Verdiğim Teklifler', '6 açık') + m('heart', 'Takip Ettiklerim', '11') + m('star', 'Yorumlar') + m('eye', 'Mağaza sayfam'))}
    ${cbtn(`${ic('plus', 14, '#FFFFFF')}Yeni ilan`, 'org', 'padding: 10px;')}
  `, { title: 'Mağaza Profilim', nav: navS(3), gap: 9 });
};


const dukkan = (n, p, adet, ilce, renkler, m) => `<div style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 0 ${K.line}, 0 14px 28px rgba(15,27,61,0.09); display: flex; flex-direction: column; min-width: 0;">
  <div style="height: ${m ? 18 : 22}px; background: repeating-linear-gradient(90deg, ${K.org} 0 16px, #FFE3D1 16px 32px);"></div>
  <div style="height: 8px; background: radial-gradient(circle at 8px 0, ${K.org} 7px, transparent 8px) 0 0 / 32px 8px repeat-x, radial-gradient(circle at 24px 0, #FFE3D1 7px, transparent 8px) 0 0 / 32px 8px repeat-x;"></div>
  <div style="padding: 6px 12px 8px; display: flex; flex-direction: column; gap: 3px;">${t(n, m ? 13 : 15, 800)}${row(stars(5, 10, K.org, K.fld) + t(p, 10, 700, K.mut), 4)}</div>
  <div style="margin: 0 ${m ? 8 : 12}px; background: ${K.tint}; border-radius: 10px; padding: ${m ? 6 : 8}px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: ${m ? 4 : 6}px;">${renkler.map(c => `<div style="border-radius: 6px; overflow: hidden;">${pic(m ? 40 : 54, c, '#FFFFFF')}</div>`).join('')}</div>
  <div style="padding: 8px 12px 12px; display: flex; justify-content: space-between; gap: 6px; font-size: 11px; font-weight: 600; color: ${K.sub};"><span style="white-space: nowrap;">${ilce}</span><span style="white-space: nowrap;">${adet} ilan</span></div>
</div>`;

S.vitrin = () => {
  const sl = (s) => t(s, 9, 700, K.mut, 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;');
  return phone(`
    <div style="display: flex; align-items: center; gap: 8px; height: 36px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 1px ${K.fld}; padding: 0 10px;">${ic('search', 14, K.mut)}${t('Marka, model veya mağaza ara', 11, 500, K.mut)}</div>
    <div style="display: flex; gap: 6px;">${cbtn(`${ic('sliders', 13, '#FFFFFF')}Filtrele · 2`, 'navy', 'flex: 1; padding: 7px;')}${cbtn(`${ic('sort', 13, K.navy)}Sırala`, 'out', 'flex: 1; padding: 7px;')}</div>
    ${wrap(pill('İstanbul ×', true, 'padding: 4px 8px; font-size: 10px;') + pill('Değişensiz ×', true, 'padding: 4px 8px; font-size: 10px;'), 4)}
    ${grid(2, minicard('iPhone 14 Pro', '36.500 TL', RENK.mor, sl('Üsküdar GSM · Üsküdar')) + minicard('iPhone 13', '24.500 TL', RENK.gece, sl('Kadıköy Cep · Kadıköy')) + minicard('Galaxy S23', '27.900 TL', RENK.krem, sl('Şişli Telekom · Şişli')) + minicard('iPhone 15', '38.900 TL', RENK.yesil, sl('Beşiktaş Mobil · Beşiktaş')), 8)}
  `, { title: `<span style="color: ${K.navy};">ON</span><span style="color: ${K.org};">CEP</span>`, act: ic('bell', 18, K.ink), nav: navU(0) });
};

// Reklam 2: mağazaları gezmeden bütün ilanları gör.

module.exports = { K, F, S, ic, stars, pic, RENK, dukkan, minicard, phone };
