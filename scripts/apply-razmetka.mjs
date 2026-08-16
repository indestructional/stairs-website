/**
 * Применяет разметку мастера к галерее.
 *
 * На входе: public/gallery.json (id + список файлов, больше ничего) и
 * ../workspace/razmetka-rabot.json - результат разметки, где по каждой
 * работе указан тип, порода, что видно на фотографиях, заметка, а также
 * пометки «убрать с сайта», «тот же объект, что №» и скрытые кадры.
 *
 * На выходе: public/gallery.json с осмысленными полями и отчёт в консоль.
 * Исходный файл сохраняется рядом как gallery.raw.json - разметку можно
 * будет применить заново, если мастер что-то уточнит.
 *
 * Запуск: node scripts/apply-razmetka.mjs
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const RAW = resolve('public/gallery.raw.json');
const OUT = resolve('public/gallery.json');
const MARKUP = resolve('../workspace/razmetka-rabot.json');

// Работаем всегда от исходника: так скрипт можно гонять повторно.
const hasRaw = await access(RAW).then(() => true).catch(() => false);
if (!hasRaw) await writeFile(RAW, await readFile(OUT, 'utf8'), 'utf8');
const gallery = JSON.parse(await readFile(RAW, 'utf8'));
const markup = JSON.parse(await readFile(MARKUP, 'utf8'));

// Нумерация в разметке сквозная: сначала stairs, потом other - ровно так,
// как их обходил генератор страницы разметки.
const items = [];
for (const [category, list] of Object.entries(gallery)) {
    for (const pub of list) items.push({ n: items.length + 1, category, ...pub });
}
const byNum = new Map(items.map((item) => [item.n, item]));
const marks = new Map(markup.items.map((m) => [m.n, m]));


/**
 * Заметки мастера правятся при переносе на сайт: он писал их быстро, с
 * телефона, и там есть опечатки («решоток», «родвал», «монтожа»). Смысл
 * сохраняем дословно, меняем только написание и убираем первое лицо.
 * Ключ - идентификатор публикации, чтобы правки переживали повторный
 * прогон разметки.
 */
const NOTE_FIXES = {
    '1717484871': 'Лестница на монокосоуре',
    '1713968332': 'Лестница с металлическим ограждением и подсветкой ступеней',
    '1707800699': 'Покраска с патиной',
    '1706036549': 'Покрыта маслом, ступени с подсветкой',
    '1700509732': 'Ограждение «паутинка»',
    '1664122023': 'Изготовление и монтаж поручней',
    '1663183723': 'Лестница укрыта ковролином: делали поручни и плинтусы',
    '1663142895': 'Ограждение из бука: изготовление и монтаж',
    '1661356278': 'Винтовые поручни из бука на готовое металлическое ограждение',
    '1659204118': 'Лестница с подсветкой ступеней',
    '1658767011': 'Две ступени в гараж',
    '1658766471': 'Лестница в подвал',
    '1651658315': 'Ступени на металлокаркас, подъём на мансарду',
    '1651589390': 'Лестница в подвал на косоурах, ступени «гусиный шаг»',
    '1643283141': 'Лестница на металлокаркасе, зашитом МДФ',
    '1642938013': 'Фотографии четырёх разных лестниц',
    '1639159281': 'Бетонное основание зашито МДФ',
    '1638292985': 'В процессе монтажа',
    '1625152958': 'Ограждение лестницы, ступени из керамогранита',
    '1621351430': 'Покраска с патиной',
    '1596880681': 'Покраска с патиной',
    '1595407125': 'Процесс монтажа',
    '1594283403': 'Покраска с патиной',
    '1592220182': 'Винтовые поручни, ступени из керамогранита; балясины и столбы заказчика',
    '1592218864': 'Фотографии трёх разных лестниц',
    '1592218240': 'Покраска, золотая патина',
    '1629023163': 'Изготовление решёток для беседки',
    '1603303788': 'Ограждение беседки декоративной решёткой',
};

const report = { dropped: [], merged: [], hiddenPhotos: 0, described: 0, untouched: [] };

/** Мастер иногда писал «эту убрать» в заметке вместо галочки. */
const wantsDrop = (mark) => mark.drop || /убрать|удалить/i.test(mark.note ?? '');

for (const item of items) {
    const mark = marks.get(item.n);
    if (!mark) { report.untouched.push(item.n); continue; }

    if (wantsDrop(mark)) {
        item.remove = true;
        report.dropped.push({ n: item.n, note: mark.note.trim() });
        continue;
    }

    // Скрытые кадры выбрасываем, выбранный главный ставим первым.
    let images = item.images.filter((_, idx) => !mark.hidden.includes(idx));
    report.hiddenPhotos += item.images.length - images.length;
    const mainSrc = item.images[mark.main ?? 0];
    if (mainSrc && images.includes(mainSrc)) {
        images = [mainSrc, ...images.filter((src) => src !== mainSrc)];
    }
    item.images = images;

    item.type = mark.type || '';
    item.material = mark.material || '';
    item.shown = mark.shown ?? [];
    item.note = NOTE_FIXES[item.id] ?? (mark.note ?? '').trim();
    if (item.type) report.described += 1;
}

// Склейка разбитых публикаций: дочерние вливаются в указанную родительскую.
for (const item of items) {
    const mark = marks.get(item.n);
    const parentNum = Number(mark?.sameAs);
    if (!parentNum || item.remove) continue;
    const parent = byNum.get(parentNum);
    if (!parent || parent === item) continue;

    parent.images = [...parent.images, ...item.images.filter((src) => !parent.images.includes(src))];
    // Родитель мог остаться неразмеченным - тогда берём данные ребёнка.
    parent.type ||= item.type ?? '';
    parent.material ||= item.material ?? '';
    parent.shown = [...new Set([...(parent.shown ?? []), ...(item.shown ?? [])])];
    if (item.note && !parent.note?.includes(item.note)) {
        parent.note = [parent.note, item.note].filter(Boolean).join(' ');
    }
    item.remove = true;
    report.merged.push({ from: item.n, to: parentNum });
}

const result = {};
for (const [category, list] of Object.entries(gallery)) {
    result[category] = items
        .filter((item) => item.category === category && !item.remove && item.images.length)
        .map(({ id, images, type, material, shown, note }) => ({
            id, images,
            ...(type ? { type } : {}),
            ...(material ? { material } : {}),
            ...(shown?.length ? { shown } : {}),
            ...(note ? { note } : {}),
        }));
    void list;
}

await writeFile(OUT, JSON.stringify(result, null, 1), 'utf8');

const total = Object.values(result).reduce((sum, list) => sum + list.length, 0);
const photos = Object.values(result).reduce((sum, list) => sum + list.reduce((n, p) => n + p.images.length, 0), 0);
console.log(`  было: ${items.length} публикаций`);
console.log(`  снято с сайта: ${report.dropped.length}`);
console.log(`  склеено в другие: ${report.merged.length}`);
console.log(`  убрано отдельных фотографий: ${report.hiddenPhotos}`);
console.log(`  осталось: ${total} публикаций, ${photos} фотографий`);
console.log(`  с описанием типа: ${report.described}`);
console.log(`  мастер не размечал: ${report.untouched.length} (${report.untouched.join(', ')})`);
console.log('  снятые по заметке:', report.dropped.filter((d) => d.note).map((d) => `№${d.n} «${d.note}»`).join('; ') || 'нет');
