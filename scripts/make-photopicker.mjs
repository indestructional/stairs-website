/**
 * Генерирует страницу выбора фотографий для карточки на Яндекс.Картах.
 *
 * Зачем: в карточку нужно загрузить не меньше десяти снимков, и первый
 * станет обложкой в выдаче. Выбирать их, листая папку с сотнями файлов,
 * неудобно, а мастеру видно лучше, чем мне: он помнит объекты.
 *
 * Страница кладётся на сайт по адресу /foto/, закрытому от индексации.
 * Мастер отмечает снимки нажатием, порядок выбора запоминается: первый
 * отмеченный станет обложкой. Результат уходит письмом.
 *
 * Запуск: node scripts/make-photopicker.mjs
 * Результат: public/foto/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const gallery = JSON.parse(await readFile(resolve('public/gallery.json'), 'utf8'));
const ACCESS_KEY = process.env.WEB3FORMS_KEY ?? '';

const GENITIVE = { 'Дуб': 'дуба', 'Бук': 'бука', 'Ясень': 'ясеня', 'Сосна': 'сосны', 'Лиственница': 'лиственницы' };

/** Плоский список снимков с подписью: что за работа и из чего. */
const photos = [];
for (const [category, list] of Object.entries(gallery)) {
    for (const pub of list) {
        const bits = [pub.type || (category === 'other' ? 'Столярная работа' : 'Лестница')];
        if (GENITIVE[pub.material]) bits.push('из ' + GENITIVE[pub.material]);
        if (pub.note) bits.push('- ' + pub.note);
        pub.images.forEach((src, idx) => {
            photos.push({
                src,
                thumb: '/gallery-thumbs' + src.replace(/^\/gallery/, '').replace(/\.(jpg|jpeg|png)$/i, '.webp'),
                label: bits.join(' '),
                first: idx === 0,
            });
        });
    }
}
photos.forEach((p, i) => { p.n = i + 1; });

const STYLE = `
  :root { --ground:#F5F3EE; --card:#fff; --ink:#1B211D; --soft:#6B7169; --line:#DFDBD2; --forest:#2E4036; --terra:#B84E2C; --ok:#2F7D4F; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--ground); color:var(--ink); font:16px/1.55 "Segoe UI",-apple-system,Roboto,sans-serif; }
  header { position:sticky; top:0; z-index:10; background:var(--forest); color:#F5F3EE; padding:12px 16px; display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center; }
  header h1 { font-size:17px; margin:0; font-weight:600; }
  .count { font-variant-numeric:tabular-nums; font-size:14px; }
  .count b { color:#BFE3CB; }
  button { font:inherit; cursor:pointer; border:1px solid transparent; border-radius:7px; padding:9px 15px; background:var(--terra); color:#fff; font-weight:600; }
  button.ghost { background:transparent; border-color:rgba(245,243,238,.35); color:#F5F3EE; font-weight:500; }
  .status { font-size:13px; color:#BFE3CB; }
  .hint { padding:16px; max-width:70ch; color:var(--soft); font-size:15px; }
  .hint b { color:var(--ink); }
  .filters { padding:0 16px 12px; display:flex; gap:14px; flex-wrap:wrap; }
  .filters label { font-size:14px; color:var(--soft); display:flex; gap:7px; align-items:center; }
  main { padding:0 16px 40px; display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }
  figure { margin:0; position:relative; cursor:pointer; }
  figure img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px; border:3px solid transparent; background:#e8e8e8; display:block; }
  figure.on img { border-color:var(--ok); }
  figure .order { position:absolute; top:6px; left:6px; width:28px; height:28px; border-radius:50%; background:var(--ok); color:#fff; font-weight:700; display:none; align-items:center; justify-content:center; font-size:14px; }
  figure.on .order { display:flex; }
  figure figcaption { font-size:11.5px; color:var(--soft); margin-top:4px; line-height:1.35; }
  .chosen { padding:0 16px 60px; }
  .chosen h2 { font-size:15px; margin:0 0 6px; }
  .chosen ol { margin:0; padding-left:22px; font-size:14px; color:var(--soft); }
  @media (max-width:640px) { main { grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); } }
`;

const SCRIPT = `
const PHOTOS = ${JSON.stringify(photos)};
const ACCESS_KEY = ${JSON.stringify(ACCESS_KEY)};
const KEY = 'foto-vybor-v1';

let chosen = JSON.parse(localStorage.getItem(KEY) || '[]');

function save() {
  localStorage.setItem(KEY, JSON.stringify(chosen));
  document.getElementById('n').textContent = chosen.length;
  const list = document.getElementById('list');
  list.textContent = '';
  chosen.forEach(function (n) {
    const p = PHOTOS.find(function (x) { return x.n === n; });
    const li = document.createElement('li');
    li.textContent = p ? p.label : '';
    list.appendChild(li);
  });
}

function render() {
  const grid = document.getElementById('grid');
  const onlyFirst = document.getElementById('onlyFirst').checked;
  const onlyChosen = document.getElementById('onlyChosen').checked;
  grid.textContent = '';
  PHOTOS.filter(function (p) {
    return (!onlyFirst || p.first || chosen.indexOf(p.n) > -1) && (!onlyChosen || chosen.indexOf(p.n) > -1);
  }).forEach(function (p) {
    const fig = document.createElement('figure');
    const pos = chosen.indexOf(p.n);
    if (pos > -1) fig.className = 'on';
    const img = document.createElement('img');
    img.src = p.thumb;
    img.loading = 'lazy';
    img.alt = p.label;
    const badge = document.createElement('div');
    badge.className = 'order';
    badge.textContent = pos + 1;
    const cap = document.createElement('figcaption');
    cap.textContent = p.label;
    fig.appendChild(img); fig.appendChild(badge); fig.appendChild(cap);
    fig.onclick = function () {
      chosen = chosen.indexOf(p.n) > -1
        ? chosen.filter(function (x) { return x !== p.n; })
        : chosen.concat([p.n]);
      save(); render();
    };
    grid.appendChild(fig);
  });
  save();
}

function payload() {
  return JSON.stringify({
    version: 1,
    savedAt: new Date().toISOString(),
    count: chosen.length,
    photos: chosen.map(function (n, i) {
      const p = PHOTOS.find(function (x) { return x.n === n; });
      return { position: i + 1, label: p ? p.label : '', url: 'https://lestniza-krr.ru' + (p ? p.src : '') };
    }),
  }, null, 1);
}

const status = document.getElementById('status');

document.getElementById('send').onclick = function () {
  if (chosen.length < 10) { status.textContent = 'нужно хотя бы десять'; return; }
  if (!ACCESS_KEY) { status.textContent = 'отправка не настроена'; return; }
  status.textContent = 'отправляю...';
  let frame = document.getElementById('sink');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'sink'; frame.name = 'sink'; frame.style.display = 'none';
    document.body.appendChild(frame);
  }
  const form = document.createElement('form');
  form.action = 'https://api.web3forms.com/submit';
  form.method = 'POST'; form.target = 'sink'; form.style.display = 'none';
  function add(k, v) { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; form.appendChild(i); }
  add('access_key', ACCESS_KEY);
  add('subject', 'Выбор фотографий для карточки');
  add('from_name', 'Выбор фотографий');
  add('vybor', payload());
  add('redirect', location.origin + '/foto/ok.html');
  document.body.appendChild(form);
  form.submit();
  let tries = 0;
  const timer = setInterval(function () {
    tries++;
    let href = null;
    try { href = frame.contentWindow.location.href; } catch (e) { /* ещё у сервиса */ }
    if (href && href.indexOf('ok.html') > -1) { clearInterval(timer); form.remove(); status.textContent = 'отправлено, спасибо'; }
    else if (tries > 30) { clearInterval(timer); form.remove(); status.textContent = 'не отправилось, напишите сыну'; }
  }, 500);
};

document.getElementById('reset').onclick = function () { chosen = []; save(); render(); };
document.getElementById('onlyFirst').onchange = render;
document.getElementById('onlyChosen').onchange = render;
render();
`;

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Выбор фотографий для карточки</title>
<meta name="robots" content="noindex, nofollow">
<style>${STYLE}</style>
</head>
<body>

<header>
  <h1>Фотографии для карточки</h1>
  <span class="count">выбрано <b id="n">0</b> из 10</span>
  <button id="send">Отправить выбор</button>
  <button class="ghost" id="reset">Сбросить</button>
  <span class="status" id="status"></span>
</header>

<p class="hint">
  Нужно выбрать <b>не меньше десяти</b> фотографий для карточки организации в Яндексе.
  Нажимайте на снимки - на выбранных появится номер.
  <b>Первый выбранный станет обложкой</b>: его увидят раньше всего, поэтому начните с самой удачной готовой лестницы.
  Хорошо, если снимки будут разными: тёмная и светлая, прямая и поворотная, с балясинами и без.
  Не берите тёмные, смазанные и недоделанные.
  Всё сохраняется само, можно закрыть и вернуться. Когда закончите - нажмите <b>«Отправить выбор»</b>.
</p>

<div class="filters">
  <label><input type="checkbox" id="onlyFirst" checked> по одному снимку от каждой работы</label>
  <label><input type="checkbox" id="onlyChosen"> только выбранные</label>
</div>

<main id="grid"></main>

<div class="chosen">
  <h2>Выбрано, по порядку:</h2>
  <ol id="list"></ol>
</div>

<script>${SCRIPT}</script>
</body>
</html>
`;

await mkdir(resolve('public/foto'), { recursive: true });
await writeFile(resolve('public/foto/index.html'), html, 'utf8');
await writeFile(
    resolve('public/foto/ok.html'),
    '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Принято</title></head><body>Принято</body></html>',
    'utf8',
);
console.log(`  /foto/ - ${photos.length} снимков, из них главных в работах: ${photos.filter((p) => p.first).length}`);
