/**
 * Генерирует страницу выбора фотографий для карточки организации.
 *
 * Зачем: в карточку нужно не меньше десяти снимков, и первый становится
 * обложкой. Мастеру виднее, какие брать: он помнит объекты.
 *
 * Устройство страницы:
 * - работы идут блоками, внутри блока все её снимки в ряд. Первая
 *   фотография работы часто неудачная, поэтому показываем все и не
 *   прячем ничего за галочками;
 * - выбранные собираются в нижнюю панель в порядке нажатия, и там же
 *   порядок можно менять стрелками. Без этого, чтобы поставить обложкой
 *   найденный последним снимок, пришлось бы отжимать весь выбор.
 *
 * Страница лежит на сайте по адресу /foto/, закрытому от индексации,
 * результат уходит письмом.
 *
 * Запуск: node scripts/make-photopicker.mjs
 * Результат: public/foto/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const gallery = JSON.parse(await readFile(resolve('public/gallery.json'), 'utf8'));
const ACCESS_KEY = process.env.WEB3FORMS_KEY ?? '';

const GENITIVE = { 'Дуб': 'дуба', 'Бук': 'бука', 'Ясень': 'ясеня', 'Сосна': 'сосны', 'Лиственница': 'лиственницы' };
const thumbOf = (src) => '/gallery-thumbs' + src.replace(/^\/gallery/, '').replace(/\.(jpg|jpeg|png)$/i, '.webp');

/** Работы блоками: подпись плюс все её снимки. */
const works = [];
let counter = 0;
for (const [category, list] of Object.entries(gallery)) {
    for (const pub of list) {
        const bits = [pub.type || (category === 'other' ? 'Столярная работа' : 'Лестница')];
        if (GENITIVE[pub.material]) bits.push('из ' + GENITIVE[pub.material]);
        if (pub.note) bits.push('- ' + pub.note);
        works.push({
            label: bits.join(' '),
            photos: pub.images.map((src) => ({ n: ++counter, src, thumb: thumbOf(src) })),
        });
    }
}

const STYLE = `
  :root { --ground:#F5F3EE; --ink:#1B211D; --soft:#6B7169; --line:#DFDBD2; --forest:#2E4036; --terra:#B84E2C; --ok:#2F7D4F; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--ground); color:var(--ink); font:16px/1.5 "Segoe UI",-apple-system,Roboto,sans-serif; padding-bottom:190px; }

  header { position:sticky; top:0; z-index:20; background:var(--forest); color:#F5F3EE; padding:12px 16px; display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center; }
  header h1 { font-size:17px; margin:0; font-weight:600; }
  .count { font-size:14px; font-variant-numeric:tabular-nums; }
  .count b { color:#BFE3CB; }
  .status { font-size:13px; color:#BFE3CB; }
  button { font:inherit; cursor:pointer; border:1px solid transparent; border-radius:7px; padding:9px 15px; background:var(--terra); color:#fff; font-weight:600; }
  button.ghost { background:transparent; border-color:rgba(245,243,238,.35); color:#F5F3EE; font-weight:500; }

  .hint { padding:16px; max-width:70ch; color:var(--soft); font-size:15px; }
  .hint b { color:var(--ink); }

  main { padding:0 16px; display:flex; flex-direction:column; gap:22px; }
  .work { border-top:1px solid var(--line); padding-top:14px; }
  .work h2 { font-size:14px; font-weight:600; color:var(--soft); margin:0 0 10px; }
  .work .row { display:flex; flex-wrap:wrap; gap:10px; }
  .shot { position:relative; width:150px; cursor:pointer; }
  .shot img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px; border:3px solid transparent; background:#e8e8e8; display:block; }
  .shot.on img { border-color:var(--ok); }
  .shot .order { position:absolute; top:6px; left:6px; min-width:28px; height:28px; padding:0 6px; border-radius:14px; background:var(--ok); color:#fff; font-weight:700; display:none; align-items:center; justify-content:center; font-size:14px; }
  .shot.on .order { display:flex; }

  footer { position:fixed; left:0; right:0; bottom:0; z-index:30; background:#fff; border-top:1px solid var(--line); box-shadow:0 -6px 24px rgba(27,33,29,.08); padding:10px 12px; }
  footer .head { display:flex; align-items:center; gap:12px; font-size:14px; color:var(--soft); margin-bottom:8px; }
  footer .head b { color:var(--ink); }
  .strip { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; min-height:104px; align-items:flex-start; }
  .strip .empty { color:var(--soft); font-size:14px; padding:28px 4px; }
  .pick { position:relative; flex:0 0 auto; width:96px; }
  .pick img { width:96px; height:72px; object-fit:cover; border-radius:6px; display:block; border:2px solid var(--ok); }
  .pick .num { position:absolute; top:3px; left:3px; min-width:22px; height:22px; padding:0 5px; border-radius:11px; background:var(--ok); color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .pick .cover { position:absolute; top:3px; right:3px; background:var(--terra); color:#fff; font-size:10px; padding:2px 5px; border-radius:9px; }
  .pick .tools { display:flex; gap:3px; margin-top:4px; }
  .pick .tools button { flex:1; padding:4px 0; font-size:13px; background:#EFEDE7; color:var(--ink); font-weight:600; border-radius:5px; }
  .pick .tools button.del { background:#F6E4DE; color:var(--terra); }

  @media (max-width:640px) {
    .shot { width:calc(50% - 5px); }
    body { padding-bottom:200px; }
  }
`;

const SCRIPT = `
const WORKS = ${JSON.stringify(works)};
const ACCESS_KEY = ${JSON.stringify(ACCESS_KEY)};
const KEY = 'foto-vybor-v2';

const ALL = {};
WORKS.forEach(function (w) { w.photos.forEach(function (p) { ALL[p.n] = p; }); });

let chosen = JSON.parse(localStorage.getItem(KEY) || '[]');

function persist() { localStorage.setItem(KEY, JSON.stringify(chosen)); }

function paintOrders() {
  document.querySelectorAll('.shot').forEach(function (el) {
    const n = Number(el.dataset.n);
    const pos = chosen.indexOf(n);
    el.classList.toggle('on', pos > -1);
    el.querySelector('.order').textContent = pos > -1 ? String(pos + 1) : '';
  });
  document.getElementById('n').textContent = chosen.length;
  document.getElementById('n2').textContent = chosen.length;
}

function paintStrip() {
  const strip = document.getElementById('strip');
  strip.textContent = '';
  if (!chosen.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Пока ничего не выбрано. Нажимайте на снимки выше.';
    strip.appendChild(empty);
    return;
  }
  chosen.forEach(function (n, i) {
    const p = ALL[n];
    const box = document.createElement('div');
    box.className = 'pick';

    const img = document.createElement('img');
    img.src = p.thumb;
    img.alt = '';
    img.title = 'Показать в списке';
    img.onclick = function () {
      const target = document.querySelector('.shot[data-n="' + n + '"]');
      if (target) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = i + 1;
    box.appendChild(img);
    box.appendChild(num);

    if (i === 0) {
      const cover = document.createElement('div');
      cover.className = 'cover';
      cover.textContent = 'обложка';
      box.appendChild(cover);
    }

    const tools = document.createElement('div');
    tools.className = 'tools';

    const left = document.createElement('button');
    left.textContent = '\\u2190';
    left.title = 'Раньше';
    left.disabled = i === 0;
    left.onclick = function () { move(i, i - 1); };

    const right = document.createElement('button');
    right.textContent = '\\u2192';
    right.title = 'Позже';
    right.disabled = i === chosen.length - 1;
    right.onclick = function () { move(i, i + 1); };

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '\\u00d7';
    del.title = 'Убрать';
    del.onclick = function () { chosen = chosen.filter(function (x) { return x !== n; }); refresh(); };

    tools.appendChild(left); tools.appendChild(right); tools.appendChild(del);
    box.appendChild(tools);
    strip.appendChild(box);
  });
}

function move(from, to) {
  if (to < 0 || to >= chosen.length) return;
  const item = chosen[from];
  chosen.splice(from, 1);
  chosen.splice(to, 0, item);
  refresh();
}

function refresh() { persist(); paintOrders(); paintStrip(); }

function build() {
  const main = document.getElementById('main');
  WORKS.forEach(function (w) {
    const block = document.createElement('section');
    block.className = 'work';
    const title = document.createElement('h2');
    title.textContent = w.label;
    const row = document.createElement('div');
    row.className = 'row';
    w.photos.forEach(function (p) {
      const shot = document.createElement('div');
      shot.className = 'shot';
      shot.dataset.n = p.n;
      const img = document.createElement('img');
      img.src = p.thumb;
      img.loading = 'lazy';
      img.alt = w.label;
      const badge = document.createElement('div');
      badge.className = 'order';
      shot.appendChild(img);
      shot.appendChild(badge);
      shot.onclick = function () {
        chosen = chosen.indexOf(p.n) > -1
          ? chosen.filter(function (x) { return x !== p.n; })
          : chosen.concat([p.n]);
        refresh();
      };
      row.appendChild(shot);
    });
    block.appendChild(title);
    block.appendChild(row);
    main.appendChild(block);
  });
}

function payload() {
  return JSON.stringify({
    version: 2,
    savedAt: new Date().toISOString(),
    count: chosen.length,
    photos: chosen.map(function (n, i) {
      return { position: i + 1, url: 'https://lestniza-krr.ru' + ALL[n].src };
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

document.getElementById('reset').onclick = function () {
  if (!chosen.length) return;
  chosen = [];
  refresh();
};

build();
refresh();
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
  Нужно выбрать <b>не меньше десяти</b> фотографий. Работы идут блоками, в каждом все её снимки.
  Нажимайте на нужные - они появятся в панели внизу, в порядке нажатия.
  <b>Первый в панели станет обложкой</b>, её увидят раньше всего.
  Порядок можно менять стрелками под снимком в панели, лишнее убрать крестиком.
  Нажатие на снимок в панели прокрутит страницу к нему.
  Хорошо, если снимки будут разными: тёмная и светлая, прямая и поворотная, с балясинами и без.
  Всё сохраняется само, можно закрыть и вернуться.
</p>

<main id="main"></main>

<footer>
  <div class="head">Выбрано: <b id="n2">0</b> &nbsp;·&nbsp; первый снимок - обложка, порядок меняется стрелками</div>
  <div class="strip" id="strip"></div>
</footer>

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
console.log(`  /foto/ - работ: ${works.length}, снимков: ${counter}`);
