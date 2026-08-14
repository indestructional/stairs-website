/**
 * Генерирует страницу разметки работ для мастера.
 *
 * Зачем: в gallery.json у публикаций есть только id и список файлов -
 * ни типа, ни породы, ни описания. Без этого 797 фотографий бесполезны
 * и для поиска, и для посетителя, который выбирает себе лестницу.
 *
 * Размечать должен мастер, а он в другом городе. Поэтому страница лежит
 * на самом сайте по адресу /razmetka/, закрытому от индексации и не
 * связанному ссылками ни с одной другой страницей.
 *
 * Разметка хранится в localStorage того устройства, где её делают -
 * сервера у сайта нет. Поэтому в конце результат уходит на почту через
 * web3forms; кнопка сохранения файла оставлена запасным вариантом.
 *
 * Картинки берутся из уменьшенных превью: 797 полноразмерных фотографий
 * на телефоне грузились бы вечно и съели бы трафик.
 *
 * Ключ: переменная окружения WEB3FORMS_KEY (в .env проекта).
 * Запуск: node scripts/make-tagger.mjs
 * Результат: public/razmetka/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const gallery = JSON.parse(await readFile(resolve('public/gallery.json'), 'utf8'));
const ACCESS_KEY = process.env.WEB3FORMS_KEY ?? '';

// Сквозная нумерация по всем категориям - на неё мастер ссылается,
// когда отмечает, что две публикации относятся к одному объекту.
const items = [];
for (const [category, list] of Object.entries(gallery)) {
    for (const pub of list) {
        items.push({ n: items.length + 1, id: pub.id, category, images: pub.images });
    }
}

/** Тип объекта - выбор один: публикация всегда про один объект. */
const TYPES = [
    'Лестница на второй этаж',
    'Лестница на бетонном основании',
    'Лестница на металлокаркасе',
    'Поворотная с забежными ступенями',
    'Перила или ограждение отдельно',
    'Беседка',
    'Терраса или настил',
    'Арка или портал',
    'Мебель из массива',
    'Другое',
];

/** Что видно на фотографиях - отметок может быть несколько. */
const SHOWN = [
    'Лестница целиком',
    'Ступени',
    'Подступенки',
    'Балясины',
    'Поручень',
    'Ограждение площадки',
    'Косоур или тетива',
    'Узел крепления, крупный план',
    'Интерьер вокруг лестницы',
    'Беседка, терраса',
    'Мебель',
];

const MATERIALS = ['Дуб', 'Бук', 'Ясень', 'Сосна', 'Смешанные породы', 'Другое', 'Не помню'];

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Разметка работ</title>
<meta name="robots" content="noindex, nofollow">
<style>
  :root {
    --ground: #F5F3EE; --card: #FFFFFF; --ink: #1B211D; --soft: #6B7169;
    --line: #DFDBD2; --forest: #2E4036; --terra: #B84E2C; --ok: #2F7D4F;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--ground); color: var(--ink);
    font: 16px/1.55 "Segoe UI", -apple-system, Roboto, sans-serif;
  }
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
  button:disabled { opacity: .55; cursor: default; }
  .status { font-size: 13px; color: #BFE3CB; }
  .hint { padding: 18px; max-width: 70ch; color: var(--soft); font-size: 15px; }
  .hint b { color: var(--ink); }
  .filters { padding: 0 18px 14px; }
  .filters label { font-size: 14px; color: var(--soft); display: flex; gap: 7px; align-items: center; }
  main { padding: 0 18px 90px; display: flex; flex-direction: column; gap: 16px; }
  .card {
    background: var(--card); border: 1px solid var(--line); border-radius: 10px;
    padding: 16px; display: grid; grid-template-columns: 280px 1fr; gap: 18px;
  }
  .card.done { border-color: var(--ok); box-shadow: inset 3px 0 0 var(--ok); }
  .card.dropped { opacity: .45; }
  .num { font-weight: 700; font-size: 15px; color: var(--terra); font-variant-numeric: tabular-nums; margin-bottom: 8px; }
  .thumbs { display: flex; flex-wrap: wrap; gap: 6px; }
  .thumb { position: relative; width: 82px; height: 82px; }
  .thumb img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 6px;
    border: 2px solid transparent; cursor: zoom-in; background: #EEE;
  }
  .thumb.main img { border-color: var(--ok); }
  .thumb.hidden img { opacity: .3; filter: grayscale(1); }
  .thumb .acts { position: absolute; inset: auto 0 0 0; display: flex; gap: 3px; justify-content: center; }
  .thumb .acts button { padding: 2px 7px; font-size: 11px; background: rgba(27,33,29,.85); font-weight: 500; border-radius: 4px; }
  .fields { display: flex; flex-direction: column; gap: 12px; }
  .field > .cap { font-size: 13px; color: var(--soft); display: block; margin-bottom: 5px; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .checks { display: flex; flex-wrap: wrap; gap: 6px; }
  .checks label {
    display: inline-flex; align-items: center; gap: 6px; font-size: 14px;
    border: 1px solid var(--line); border-radius: 999px; padding: 7px 13px; cursor: pointer;
  }
  .checks label.on { border-color: var(--ok); background: #F0F7F2; }
  select, input[type=number], textarea {
    font: inherit; padding: 9px; border: 1px solid var(--line); border-radius: 7px; background: #fff; color: var(--ink);
  }
  select { max-width: 100%; }
  textarea { width: 100%; min-height: 54px; resize: vertical; }
  .danger { color: var(--terra); }
  #viewer {
    position: fixed; inset: 0; background: rgba(20,24,21,.94); display: none;
    align-items: center; justify-content: center; z-index: 50; cursor: zoom-out;
  }
  #viewer img { max-width: 94vw; max-height: 94vh; object-fit: contain; }
  @media (max-width: 720px) {
    .card { grid-template-columns: 1fr; padding: 14px; }
    .thumb { width: 72px; height: 72px; }
    select, input[type=number] { min-height: 44px; width: 100%; }
    main { padding: 0 14px 70px; }
    .hint { padding: 16px 14px; }
    .filters { padding: 0 14px 12px; }
  }
</style>
</head>
<body>

<header>
  <h1>Разметка работ</h1>
  <span class="progress" id="progress"></span>
  <button id="send">Отправить результат</button>
  <button class="ghost" id="save">Сохранить файлом</button>
  <span class="status" id="status"></span>
</header>

<p class="hint">
  Пройдите карточки сверху вниз. У каждой укажите <b>что это</b> и <b>из чего сделано</b>,
  а галочками отметьте, <b>что видно на фотографиях</b> - их можно поставить несколько.
  Не помните породу - так и отметьте, это лучше догадки.
  Если один объект разбит на несколько публикаций, у второй и следующих поставьте
  <b>«тот же объект, что №»</b> и номер первой. Ненужные публикации отметьте
  <b>«убрать с сайта»</b>, лишние фотографии - крестиком, лучшую фотографию сделайте главной.
  Всё сохраняется само: страницу можно закрыть и вернуться позже, отмеченное не пропадёт.
  Размечайте частями, спешить некуда. Когда закончите - нажмите <b>«Отправить результат»</b>.
</p>

<div class="filters">
  <label><input type="checkbox" id="onlyTodo"> показывать только неразмеченные</label>
</div>

<main id="list"></main>
<div id="viewer"><img alt=""></div>

<script>
const ITEMS = ${JSON.stringify(items)};
const TYPES = ${JSON.stringify(TYPES)};
const SHOWN = ${JSON.stringify(SHOWN)};
const MATERIALS = ${JSON.stringify(MATERIALS)};
const ACCESS_KEY = ${JSON.stringify(ACCESS_KEY)};
const KEY = 'razmetka-rabot-v2';

const state = JSON.parse(localStorage.getItem(KEY) || '{}');
const blank = () => ({ type: '', material: '', shown: [], note: '', sameAs: '', drop: false, hidden: [], main: 0 });
const get = (n) => (state[n] ||= blank());
const isDone = (n) => Boolean(state[n]?.type || state[n]?.drop || state[n]?.sameAs);

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  const done = ITEMS.filter((i) => isDone(i.n)).length;
  document.getElementById('progress').textContent = done + ' из ' + ITEMS.length;
}

function option(value, label, current) {
  const o = document.createElement('option');
  o.value = value; o.textContent = label;
  if (value === current) o.selected = true;
  return o;
}

function field(caption, control) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const cap = document.createElement('span');
  cap.className = 'cap';
  cap.textContent = caption;
  wrap.append(cap, control);
  return wrap;
}

function renderCard(item) {
  const s = get(item.n);
  const card = document.createElement('section');
  card.className = 'card' + (isDone(item.n) ? ' done' : '') + (s.drop ? ' dropped' : '');

  const left = document.createElement('div');
  const num = document.createElement('div');
  num.className = 'num';
  num.textContent = 'Работа № ' + item.n + ', фотографий: ' + item.images.length;
  left.appendChild(num);

  const thumbs = document.createElement('div');
  thumbs.className = 'thumbs';
  item.images.forEach((src, idx) => {
    const box = document.createElement('div');
    box.className = 'thumb' + (s.main === idx ? ' main' : '') + (s.hidden.includes(idx) ? ' hidden' : '');
    const img = document.createElement('img');
    img.src = '/gallery-thumbs' + src.replace(/^\\/gallery/, '').replace(/\\.(jpg|jpeg|png)\$/i, '.webp');
    img.alt = 'Работа ' + item.n + ', фото ' + (idx + 1);
    img.loading = 'lazy';
    img.onclick = () => {
      const v = document.getElementById('viewer');
      v.querySelector('img').src = src;
      v.style.display = 'flex';
    };

    const acts = document.createElement('div');
    acts.className = 'acts';
    const mainBtn = document.createElement('button');
    mainBtn.textContent = 'гл';
    mainBtn.title = 'сделать главной';
    mainBtn.onclick = () => { s.main = idx; persist(); rerender(); };
    const hideBtn = document.createElement('button');
    hideBtn.textContent = s.hidden.includes(idx) ? '+' : '\\u00d7';
    hideBtn.title = s.hidden.includes(idx) ? 'вернуть фото' : 'убрать фото';
    hideBtn.onclick = () => {
      s.hidden = s.hidden.includes(idx) ? s.hidden.filter((x) => x !== idx) : [...s.hidden, idx];
      persist(); rerender();
    };
    acts.append(mainBtn, hideBtn);
    box.append(img, acts);
    thumbs.appendChild(box);
  });
  left.appendChild(thumbs);

  const fields = document.createElement('div');
  fields.className = 'fields';

  const typeSel = document.createElement('select');
  typeSel.appendChild(option('', 'выберите...', s.type));
  TYPES.forEach((t) => typeSel.appendChild(option(t, t, s.type)));
  typeSel.onchange = () => { s.type = typeSel.value; persist(); rerender(); };

  const matSel = document.createElement('select');
  matSel.appendChild(option('', 'выберите...', s.material));
  MATERIALS.forEach((m) => matSel.appendChild(option(m, m, s.material)));
  matSel.onchange = () => { s.material = matSel.value; persist(); };

  const checks = document.createElement('div');
  checks.className = 'checks';
  SHOWN.forEach((label) => {
    const l = document.createElement('label');
    if (s.shown.includes(label)) l.className = 'on';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = s.shown.includes(label);
    cb.onchange = () => {
      s.shown = cb.checked ? [...s.shown, label] : s.shown.filter((x) => x !== label);
      l.className = cb.checked ? 'on' : '';
      persist();
    };
    l.append(cb, document.createTextNode(label));
    checks.appendChild(l);
  });

  const row = document.createElement('div');
  row.className = 'row';
  const sameLabel = document.createElement('label');
  sameLabel.style.fontSize = '14px';
  sameLabel.style.color = 'var(--soft)';
  sameLabel.textContent = 'тот же объект, что № ';
  const same = document.createElement('input');
  same.type = 'number'; same.min = '1'; same.max = String(ITEMS.length);
  same.style.width = '95px'; same.value = s.sameAs;
  same.oninput = () => { s.sameAs = same.value; persist(); };
  sameLabel.appendChild(same);

  const dropLabel = document.createElement('label');
  dropLabel.className = 'danger';
  dropLabel.style.fontSize = '14px';
  const drop = document.createElement('input');
  drop.type = 'checkbox'; drop.checked = s.drop;
  drop.onchange = () => { s.drop = drop.checked; persist(); rerender(); };
  dropLabel.append(drop, document.createTextNode(' убрать с сайта'));
  row.append(sameLabel, dropLabel);

  const note = document.createElement('textarea');
  note.placeholder = 'Заметка: что здесь особенного, где стоит. Можно пропустить.';
  note.value = s.note;
  note.oninput = () => { s.note = note.value; persist(); };

  fields.append(
    field('Что это?', typeSel),
    field('Из чего сделано?', matSel),
    field('Что видно на фотографиях?', checks),
    row,
    field('Заметка', note),
  );

  card.append(left, fields);
  return card;
}

function rerender() {
  const list = document.getElementById('list');
  const onlyTodo = document.getElementById('onlyTodo').checked;
  list.textContent = '';
  ITEMS.filter((i) => !onlyTodo || !isDone(i.n)).forEach((i) => list.appendChild(renderCard(i)));
  persist();
}

/** В отчёт идут только заполненные карточки - так он остаётся компактным. */
function payload() {
  const filled = ITEMS
    .filter((i) => state[i.n] && JSON.stringify(state[i.n]) !== JSON.stringify(blank()))
    .map((i) => ({ n: i.n, id: i.id, ...state[i.n] }));
  return JSON.stringify({ version: 2, savedAt: new Date().toISOString(), filled: filled.length, items: filled });
}

const status = document.getElementById('status');

document.getElementById('send').onclick = async () => {
  const btn = document.getElementById('send');
  if (!ACCESS_KEY) {
    status.textContent = 'отправка не настроена, сохраните файлом';
    return;
  }
  btn.disabled = true;
  status.textContent = 'отправляю...';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: 'Разметка работ с сайта',
        from_name: 'Разметка работ',
        razmetka: payload(),
      }),
    });
    const data = await res.json();
    status.textContent = data.success ? 'отправлено, спасибо' : 'не отправилось, сохраните файлом';
  } catch {
    status.textContent = 'не отправилось, сохраните файлом';
  }
  btn.disabled = false;
};

document.getElementById('save').onclick = () => {
  const blob = new Blob([payload()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'razmetka-rabot.json';
  a.click();
  URL.revokeObjectURL(a.href);
  status.textContent = 'файл сохранён';
};

document.getElementById('onlyTodo').onchange = rerender;
document.getElementById('viewer').onclick = (e) => { e.currentTarget.style.display = 'none'; };

rerender();
</script>
</body>
</html>
`;

await mkdir(resolve('public/razmetka'), { recursive: true });
await writeFile(resolve('public/razmetka/index.html'), html, 'utf8');
console.log(`  /razmetka/ - ${items.length} публикаций, ${items.reduce((s, i) => s + i.images.length, 0)} фотографий, отправка на почту: ${ACCESS_KEY ? 'настроена' : 'НЕ НАСТРОЕНА'}`);
