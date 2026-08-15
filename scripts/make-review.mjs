/**
 * Генерирует страницу вычитки текстов сайта для мастера.
 *
 * Зачем: тексты писал я по общим знаниям о работе с деревом, и часть
 * утверждений мастер может не разделять. Читать сайт и пересказывать
 * замечания голосом неудобно - половина потеряется.
 *
 * Страница кладётся на сайт по адресу /vychitka/, закрытому от
 * индексации. Каждый кусок текста с указанием, где он стоит: галочка
 * "верно" или поле для правки. Результат уходит письмом.
 *
 * Тексты страниц берутся из модели контента, тексты главной -
 * извлекаются из App.jsx: там они вшиты в разметку.
 *
 * Вычитка пройдена 15 августа 2026: мастер подтвердил все тексты, страница
 * с сайта удалена. Скрипт оставлен - пригодится, когда текстов станет
 * заметно больше и понадобится вторая вычитка.
 *
 * Запуск: node scripts/make-review.mjs
 * Результат: public/vychitka/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ALL_PAGES } from '../src/content/landings.js';

const ACCESS_KEY = process.env.WEB3FORMS_KEY ?? '';

/** Куски текста: { place - где стоит, text - что написано }. */
const chunks = [];
const add = (place, text) => {
    const t = String(text ?? '').trim();
    if (t.length > 12 && !chunks.some((c) => c.text === t)) chunks.push({ place, text: t });
};

// --- Главная страница: строки вшиты в разметку, достаём разбором ---
const app = await readFile(resolve('src/App.jsx'), 'utf8');
const CYR = /[А-Яа-яЁё]/;

// Текст между тегами
for (const m of app.matchAll(/>\s*([^<>{}\n][^<>{}]{14,})\s*</g)) {
    const t = m[1].trim();
    if (CYR.test(t) && !t.includes('className') && !t.startsWith('//')) add('Главная страница', t);
}
// Строки в кавычках: заголовки и описания карточек
for (const m of app.matchAll(/(?:title|desc|label):\s*'([^']{14,})'/g)) {
    if (CYR.test(m[1])) add('Главная страница', m[1]);
}

// --- Страницы: берём из модели контента ---
for (const page of ALL_PAGES) {
    const place = page.h1;
    add(place + ' - заголовок', page.h1);
    add(place + ' - вступление', page.lead);
    add(place + ' - описание для поиска', page.description);
    for (const section of page.sections ?? []) {
        add(place + ' - подзаголовок', section.h2);
        for (const paragraph of section.body ?? []) add(`${place} - ${section.h2}`, paragraph);
    }
    for (const { q, a } of page.faq ?? []) {
        add(place + ' - вопрос', q);
        add(place + ' - ответ на «' + q + '»', a);
    }
}

/**
 * Помечаем куски с проверяемыми фактами: сроки, цены, гарантия, породы,
 * география, обещания клиенту. Именно в них я мог ошибиться, и именно их
 * мастер должен прочитать в первую очередь. Остальное - формулировки,
 * их можно смотреть по желанию.
 */
const FACTS = /(\d|лет|год|гарант|рубл|цен|стои|срок|дн[еяё]|недел|дуб|бук|ясен|сосн|лиственниц|замер|выезд|км|бесплат|договор|не делаем|не бер[её]мся|только|всегда|никогда|обязательно)/i;
chunks.forEach((c, i) => {
    c.n = i + 1;
    c.key = FACTS.test(c.text);
});
console.log(`  из них с фактами: ${chunks.filter((c) => c.key).length}`);

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Вычитка текстов сайта</title>
<meta name="robots" content="noindex, nofollow">
<style>
  :root {
    --ground: #F5F3EE; --card: #FFFFFF; --ink: #1B211D; --soft: #6B7169;
    --line: #DFDBD2; --forest: #2E4036; --terra: #B84E2C; --ok: #2F7D4F;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--ground); color: var(--ink); font: 16px/1.6 "Segoe UI", -apple-system, Roboto, sans-serif; }
  header {
    position: sticky; top: 0; z-index: 10; background: var(--forest); color: #F5F3EE;
    padding: 12px 18px; display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center;
  }
  header h1 { font-size: 17px; margin: 0; font-weight: 600; }
  .progress { font-variant-numeric: tabular-nums; opacity: .85; font-size: 14px; }
  button {
    font: inherit; cursor: pointer; border-radius: 7px; border: 1px solid transparent;
    padding: 9px 15px; background: var(--terra); color: #fff; font-weight: 600;
  }
  button.ghost { background: transparent; border-color: rgba(245,243,238,.35); color: #F5F3EE; font-weight: 500; }
  .status { font-size: 13px; color: #BFE3CB; }
  .hint { padding: 18px; max-width: 68ch; color: var(--soft); font-size: 15px; }
  .hint b { color: var(--ink); }
  .filters { padding: 0 18px 14px; }
  .filters label { font-size: 14px; color: var(--soft); display: flex; gap: 7px; align-items: center; }
  main { padding: 0 18px 90px; display: flex; flex-direction: column; gap: 14px; max-width: 900px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 16px; }
  .card.ok { border-color: var(--ok); box-shadow: inset 3px 0 0 var(--ok); }
  .card.fix { border-color: var(--terra); box-shadow: inset 3px 0 0 var(--terra); }
  .place { font-size: 12.5px; color: var(--soft); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 8px; }
  .place b { color: var(--terra); font-variant-numeric: tabular-nums; }
  .text { font-size: 16.5px; margin-bottom: 12px; }
  .choice { display: flex; flex-wrap: wrap; gap: 8px; }
  .choice label {
    display: inline-flex; align-items: center; gap: 7px; font-size: 15px;
    border: 1px solid var(--line); border-radius: 999px; padding: 9px 16px; cursor: pointer;
  }
  .choice label.on { border-color: var(--ok); background: #F0F7F2; }
  .choice label.on.warn { border-color: var(--terra); background: #FBF0EC; }
  textarea {
    font: inherit; width: 100%; min-height: 76px; margin-top: 10px; padding: 10px;
    border: 1px solid var(--line); border-radius: 7px; resize: vertical;
  }
  @media (max-width: 720px) {
    main { padding: 0 14px 70px; }
    .hint { padding: 16px 14px; }
    .filters { padding: 0 14px 12px; }
    .choice label { flex: 1; justify-content: center; }
  }
</style>
</head>
<body>

<header>
  <h1>Вычитка текстов</h1>
  <span class="progress" id="progress"></span>
  <button id="send">Отправить результат</button>
  <button class="ghost" id="save">Сохранить файлом</button>
  <span class="status" id="status"></span>
</header>

<p class="hint">
  Здесь весь текст с сайта, кусок за куском, с указанием, где он стоит.
  По каждому нужно сказать: <b>верно</b> или <b>надо поправить</b>.
  Если поправить - напишите своими словами, как правильно. Красиво излагать не нужно,
  достаточно сути: я приведу в порядок.
  Сначала показаны только места с фактами - сроки, цены, гарантия, породы дерева,
  обещания клиенту: там я мог ошибиться. Остальные формулировки можно посмотреть,
  сняв верхнюю галочку, но это не обязательно.
  Всё сохраняется само, можно закрыть и вернуться. В конце нажмите
  <b>«Отправить результат»</b>.
</p>

<div class="filters">
  <label><input type="checkbox" id="onlyKey" checked> сначала только места с фактами: сроки, цены, гарантия, породы, обещания</label>
  <label><input type="checkbox" id="onlyTodo"> показывать только непроверенные</label>
</div>

<main id="list"></main>

<script>
const CHUNKS = ${JSON.stringify(chunks)};
const ACCESS_KEY = ${JSON.stringify(ACCESS_KEY)};
const KEY = 'vychitka-v1';

const state = JSON.parse(localStorage.getItem(KEY) || '{}');
const get = (n) => (state[n] ||= { verdict: '', fix: '' });
const isDone = (n) => Boolean(state[n]?.verdict);

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  const onlyKey = document.getElementById('onlyKey').checked;
  const pool = onlyKey ? CHUNKS.filter((c) => c.key) : CHUNKS;
  const done = pool.filter((c) => isDone(c.n)).length;
  document.getElementById('progress').textContent = done + ' из ' + pool.length;
}

function renderCard(chunk) {
  const s = get(chunk.n);
  const card = document.createElement('section');
  card.className = 'card' + (s.verdict === 'ok' ? ' ok' : s.verdict === 'fix' ? ' fix' : '');

  const place = document.createElement('div');
  place.className = 'place';
  place.innerHTML = '<b>' + chunk.n + '</b> &nbsp; ' + chunk.place.replace(/</g, '&lt;');
  card.appendChild(place);

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = chunk.text;
  card.appendChild(text);

  const choice = document.createElement('div');
  choice.className = 'choice';
  const fixBox = document.createElement('textarea');
  fixBox.placeholder = 'Как правильно? Напишите своими словами.';
  fixBox.value = s.fix;
  fixBox.style.display = s.verdict === 'fix' ? 'block' : 'none';
  fixBox.oninput = () => { s.fix = fixBox.value; persist(); };

  for (const [value, label] of [['ok', 'Верно'], ['fix', 'Надо поправить']]) {
    const l = document.createElement('label');
    if (s.verdict === value) l.className = 'on' + (value === 'fix' ? ' warn' : '');
    const r = document.createElement('input');
    r.type = 'radio';
    r.name = 'v' + chunk.n;
    r.checked = s.verdict === value;
    r.onchange = () => { s.verdict = value; persist(); rerender(); };
    l.append(r, document.createTextNode(label));
    choice.appendChild(l);
  }

  card.append(choice, fixBox);
  return card;
}

function rerender() {
  const list = document.getElementById('list');
  const onlyTodo = document.getElementById('onlyTodo').checked;
  const onlyKey = document.getElementById('onlyKey').checked;
  list.textContent = '';
  CHUNKS
    .filter((c) => (!onlyKey || c.key) && (!onlyTodo || !isDone(c.n)))
    .forEach((c) => list.appendChild(renderCard(c)));
  persist();
}

/** В отчёт идёт только то, что мастер отметил как требующее правки. */
function payload() {
  const fixes = CHUNKS
    .filter((c) => state[c.n]?.verdict === 'fix')
    .map((c) => ({ n: c.n, place: c.place, was: c.text, fix: state[c.n].fix }));
  const checked = CHUNKS.filter((c) => isDone(c.n)).length;
  return JSON.stringify({ version: 1, savedAt: new Date().toISOString(), checked, total: CHUNKS.length, fixes }, null, 1);
}

const status = document.getElementById('status');

document.getElementById('send').onclick = () => {
  if (!ACCESS_KEY) { status.textContent = 'отправка не настроена, сохраните файлом'; return; }
  status.textContent = 'отправляю...';

  let frame = document.getElementById('sink');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'sink'; frame.name = 'sink'; frame.style.display = 'none';
    document.body.appendChild(frame);
  }
  const form = document.createElement('form');
  form.action = 'https://api.web3forms.com/submit';
  form.method = 'POST';
  form.target = 'sink';
  form.style.display = 'none';
  const add = (name, value) => {
    const i = document.createElement('input');
    i.type = 'hidden'; i.name = name; i.value = value;
    form.appendChild(i);
  };
  add('access_key', ACCESS_KEY);
  add('subject', 'Вычитка текстов сайта');
  add('from_name', 'Вычитка текстов');
  add('vychitka', payload());
  add('redirect', location.origin + '/vychitka/ok.html');
  document.body.appendChild(form);
  form.submit();

  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    let href = null;
    try { href = frame.contentWindow.location.href; } catch { /* ещё у сервиса */ }
    if (href && href.includes('ok.html')) {
      clearInterval(timer); form.remove();
      status.textContent = 'отправлено, спасибо';
    } else if (tries > 30) {
      clearInterval(timer); form.remove();
      status.textContent = 'отправить не вышло - нажмите «Сохранить файлом»';
    }
  }, 500);
};

document.getElementById('save').onclick = () => {
  const blob = new Blob([payload()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vychitka-tekstov.json';
  a.click();
  URL.revokeObjectURL(a.href);
  status.textContent = 'файл сохранён';
};

document.getElementById('onlyTodo').onchange = rerender;
document.getElementById('onlyKey').onchange = rerender;
rerender();
</script>
</body>
</html>
`;

await mkdir(resolve('public/vychitka'), { recursive: true });
await writeFile(resolve('public/vychitka/index.html'), html, 'utf8');
await writeFile(
    resolve('public/vychitka/ok.html'),
    '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Принято</title></head><body>Принято</body></html>',
    'utf8',
);
console.log(`  /vychitka/ - ${chunks.length} кусков текста, отправка: ${ACCESS_KEY ? 'настроена' : 'НЕ НАСТРОЕНА'}`);
