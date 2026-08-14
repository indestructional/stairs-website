/**
 * Пререндер статических страниц.
 *
 * Зачем: сайт — SPA на React, и поисковому роботу отдавалась пустая
 * разметка с <div id="root"></div>. Яндекс JavaScript почти не исполняет,
 * поэтому весь контент для него не существовал.
 *
 * Что делает: поднимает локальный сервер на собранном dist, открывает
 * каждый маршрут в настоящем браузере, дожидается отрисовки галереи и
 * сохраняет получившийся HTML обратно в dist. Для посетителя ничего не
 * меняется — React перехватывает управление при загрузке.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const DIST = resolve('dist');
const ROUTES = ['/'];

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml',
};

function startServer() {
    const server = createServer(async (req, res) => {
        const url = decodeURIComponent(req.url.split('?')[0]);
        let filePath = join(DIST, url);
        if (!existsSync(filePath) || url.endsWith('/')) filePath = join(DIST, 'index.html');
        try {
            const body = await readFile(filePath);
            res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
            res.end(body);
        } catch {
            res.writeHead(404).end('not found');
        }
    });
    return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const server = await startServer();
const { port } = server.address();
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

try {
    for (const route of ROUTES) {
        const page = await browser.newPage();
        // Крупный вьюпорт: галерея отдаёт больше карточек, роботу достаётся
        // больше контента и больше ссылок на изображения.
        await page.setViewport({ width: 1600, height: 1200 });
        await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle0', timeout: 60_000 });

        // Ждём, пока подтянется gallery.json и отрисуются карточки работ.
        await page.waitForFunction(
            () => document.querySelectorAll('#works img').length > 0,
            { timeout: 30_000 },
        ).catch(() => console.warn(`  предупреждение: галерея не отрисовалась на ${route}`));

        // Прокручиваем страницу до конца и обратно: иначе GSAP оставляет
        // блокам ниже первого экрана opacity:0, и это запекается в статику.
        // Робот считает такой текст скрытым, а без JS его не увидит и человек.
        await page.evaluate(async () => {
            const step = window.innerHeight / 2;
            for (let y = 0; y < document.body.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 60));
            }
            window.scrollTo(0, 0);
            await new Promise((r) => setTimeout(r, 400));
        });

        // Страховка: снимаем остаточную прозрачность и сдвиг с элементов,
        // до которых прокрутка не добралась.
        await page.evaluate(() => {
            for (const el of document.querySelectorAll('[style*="opacity: 0"]')) {
                el.style.opacity = '1';
                if (el.style.transform) el.style.transform = 'none';
            }
        });

        const html = await page.content();
        const outDir = route === '/' ? DIST : join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(join(outDir, 'index.html'), html, 'utf8');

        const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(`  ${route} — ${text.length} символов текста в HTML`);
        await page.close();
    }
} finally {
    await browser.close();
    server.close();
}
