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
    item.note = (mark.note ?? '').trim();
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
