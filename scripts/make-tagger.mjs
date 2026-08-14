/**
 * Генерирует локальную страницу для разметки работ.
 *
 * Зачем: в gallery.json у публикаций есть только id и список файлов -
 * ни типа, ни породы, ни описания. Без этого 797 фотографий бесполезны
 * и для поиска, и для посетителя, который выбирает себе лестницу.
 *
 * Разметить может только мастер, а он в другом городе. Поэтому страница
 * кладётся на сам сайт по адресу /razmetka/, закрытому от индексации и
 * не связанному ссылками ни с одной другой страницей. Ссылку передают
 * лично; после разметки страницу можно удалить.
 *
 * Картинки берутся из уменьшенных превью: 797 полноразмерных фотографий
 * на телефоне грузились бы вечно и съели бы трафик.
 *
 * Запуск: node scripts/make-tagger.mjs (входит в npm run build)
 * Результат: public/razmetka/index.html
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const gallery = JSON.parse(await readFile(resolve('public/gallery.json'), 'utf8'));

// Сквозная нумерация по всем категориям - на неё мастер ссылается,
// когда отмечает, что две публикации относятся к одному объекту.
const items = [];
for (const [category, list] of Object.entries(gallery)) {
    for (const pub of list) {
        items.push({ n: items.length + 1, id: pub.id, category, images: pub.images });
    }
}

const TYPES = [
    'Лестница на второй этаж',
    'Лестница на бетонном основании',
    'Лестница на металлокаркасе',
    'Лестница на косоурах',
    'Лестница на тетиве',
    'Поворотная с забежными ступенями',
    'Перила и ограждения',
    'Беседка',
    'Терраса или настил',
    'Арка или портал',
    'Мебель из массива',
    'Другое',
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
    padding: 14px 20px; display: flex; flex-wrap: wrap; gap: 12px 22px; align-items: center;
  }
  header h1 { font-size: 18px; margin: 0; font-weight: 600; }
  .progress { font-variant-numeric: tabular-nums; opacity: .85; font-size: 14px; }
  button {
    font: inherit; cursor: pointer; border-radius: 6px; border: 1px solid transparent;
    padding: 8px 14px; background: var(--terra); color: #fff; font-weight: 600;
  }
  button.ghost { background: transparent; border-color: rgba(245,243,238,.4); color: #F5F3EE; font-weight: 500; }
  .hint { padding: 18px 20px; max-width: 70ch; color: var(--soft); font-size: 15px; }
  .hint b { color: var(--ink); }
  .filters { padding: 0 20px 14px; display: flex; gap: 10px; flex-wrap: wrap; }
  .filters label { font-size: 14px; color: var(--soft); display: flex; gap: 6px; align-items: center; }
  main { padding: 0 20px 80px; display: flex; flex-direction: column; gap: 16px; }
  .card {
    background: var(--card); border: 1px solid var(--line); border-radius: 10px;
    padding: 16px; display: grid; grid-template-columns: 280px 1fr; gap: 18px;
  }
  .card.done { border-color: var(--ok); box-shadow: inset 3px 0 0 var(--ok); }
  .card.dropped { opacity: .45; }
  .num {
    font-weight: 700; font-size: 15px; color: var(--terra);
    font-variant-numeric: tabular-nums; margin-bottom: 8px;
  }
  .thumbs { display: flex; flex-wrap: wrap; gap: 6px; }
  .thumb { position: relative; width: 82px; height: 82px; }
  .thumb img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 6px;
    border: 2px solid transparent; cursor: zoom-in; background: #EEE;
  }
  .thumb.main img { border-color: var(--ok); }
  .thumb.hidden img { opacity: .3; filter: grayscale(1); }
  .thumb .acts { position: absolute; inset: auto 0 0 0; display: flex; gap: 2px; justify-content: center; }
  .thumb .acts button {
    padding: 1px 5px; font-size: 11px; background: rgba(27,33,29,.82); font-weight: 500; border-radius: 4px;
  }
  .fields { display: flex; flex-direction: column; gap: 10px; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .row > label { font-size: 14px; color: var(--soft); display: flex; gap: 6px; align-items: center; }
  select, input[type=number], textarea {
    font: inherit; padding: 7px 9px; border: 1px solid var(--line); border-radius: 6px;
    background: #fff; color: var(--ink);
  }
  textarea { width: 100%; min-height: 54px; resize: vertical; }
  .danger { color: var(--terra); }
  #viewer {
    position: fixed; inset: 0; background: rgba(20,24,21,.94); display: none;
    align-items: center; justify-content: center; z-index: 50; cursor: zoom-out;
  }
  #viewer img { max-width: 94vw; max-height: 94vh; object-fit: contain; }
  .saved { color: #BFE3CB; font-size: 13px; }
  @media (max-width: 720px) {
    .card { grid-template-columns: 1fr; padding: 14px; }
    .thumb { width: 72px; height: 72px; }
    select, input[type=number] { min-height: 42px; }
    .row > label { width: 100%; }
    header { padding: 12px 14px; }
    main { padding: 0 14px 60px; }
  }
</style>
</head>
<body>

<header>
  <h1>Разметка работ</h1>
  <span class="progress" id="progress"></span>
  <button id="save">Сохранить файл</button>
  <span class="saved" id="saved"></span>
</header>

<p class="hint">
  Пройдите по карточкам сверху вниз. У каждой укажите <b>что это</b> и <b>из чего сделано</b>.
  Если не помните породу - так и отметьте, это лучше догадки.
  Если один объект разбит на несколько публикаций, у второй и следующих поставьте
  <b>«тот же объект, что №»</b> и номер первой. Ненужные публикации отметьте
  <b>«убрать с сайта»</b>, лишние фотографии - крестиком, лучшую фотографию сделайте главной.
  Всё сохраняется само, страницу можно закрыть и вернуться позже - отмеченное не пропадёт.
  Когда закончите, нажмите <b>«Сохранить файл»</b> вверху и пришлите получившийся файл сыну.
</p>

<div class="filters">
  <label><input type="checkbox" id="onlyTodo"> показывать только неразмеченные</label>
</div>

<main id="list"></main>
<div id="viewer"><img alt=""></div>

<script>
const ITEMS = ${JSON.stringify(items)};
const TYPES = ${JSON.stringify(TYPES)};
const MATERIALS = ${JSON.stringify(MATERIALS)};
const KEY = 'razmetka-rabot-v1';

const state = JSON.parse(localStorage.getItem(KEY) || '{}');
const get = (n) => (state[n] ||= { type: '', material: '', note: '', sameAs: '', drop: false, hidden: [], main: 0 });
const isDone = (n) => Boolean(state[n]?.type) || Boolean(state[n]?.drop) || Boolean(state[n]?.sameAs);

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  document.getElementById('saved').textContent = 'сохранено ' + new Date().toLocaleTimeString('ru-RU');
  const done = ITEMS.filter((i) => isDone(i.n)).length;
  document.getElementById('progress').textContent = done + ' из ' + ITEMS.length;
}

function option(value, label, current) {
  const o = document.createElement('option');
  o.value = value; o.textContent = label;
  if (value === current) o.selected = true;
  return o;
}

function renderCard(item) {
  const s = get(item.n);
  const card = document.createElement('section');
  card.className = 'card' + (isDone(item.n) ? ' done' : '') + (s.drop ? ' dropped' : '');
  card.dataset.n = item.n;

  const left = document.createElement('div');
  const num = document.createElement('div');
  num.className = 'num';
  num.textContent = 'Работа № ' + item.n + ' \\u2022 фото: ' + item.images.length;
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
    hideBtn.title = s.hidden.includes(idx) ? 'вернуть' : 'убрать фото';
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

  const row1 = document.createElement('div');
  row1.className = 'row';

  const typeSel = document.createElement('select');
  typeSel.appendChild(option('', 'Что это? выберите...', s.type));
  TYPES.forEach((t) => typeSel.appendChild(option(t, t, s.type)));
  typeSel.onchange = () => { s.type = typeSel.value; persist(); rerender(); };

  const matSel = document.createElement('select');
  matSel.appendChild(option('', 'Из чего? выберите...', s.material));
  MATERIALS.forEach((m) => matSel.appendChild(option(m, m, s.material)));
  matSel.onchange = () => { s.material = matSel.value; persist(); };

  row1.append(typeSel, matSel);

  const row2 = document.createElement('div');
  row2.className = 'row';

  const sameLabel = document.createElement('label');
  sameLabel.textContent = 'тот же объект, что № ';
  const same = document.createElement('input');
  same.type = 'number'; same.min = '1'; same.max = String(ITEMS.length);
  same.style.width = '90px'; same.value = s.sameAs;
  same.oninput = () => { s.sameAs = same.value; persist(); rerender(); };
  sameLabel.appendChild(same);

  const dropLabel = document.createElement('label');
  dropLabel.className = 'danger';
  const drop = document.createElement('input');
  drop.type = 'checkbox'; drop.checked = s.drop;
  drop.onchange = () => { s.drop = drop.checked; persist(); rerender(); };
  dropLabel.append(drop, document.createTextNode(' убрать с сайта'));

  row2.append(sameLabel, dropLabel);

  const note = document.createElement('textarea');
  note.placeholder = 'Заметка: что здесь особенного, где стоит, что стоит упомянуть. Можно пропустить.';
  note.value = s.note;
  note.oninput = () => { s.note = note.value; persist(); };

  fields.append(row1, row2, note);
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

function payload() {
  return JSON.stringify({
    version: 1,
    savedAt: new Date().toISOString(),
    items: ITEMS.map((i) => ({ n: i.n, id: i.id, category: i.category, images: i.images, ...get(i.n) })),
  }, null, 2);
}

document.getElementById('save').onclick = () => {
  const blob = new Blob([payload()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'razmetka-rabot.json';
  a.click();
  URL.revokeObjectURL(a.href);
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
console.log(`  /razmetka/ - ${items.length} публикаций, ${items.reduce((s, i) => s + i.images.length, 0)} фотографий`);
