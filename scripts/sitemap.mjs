/**
 * Генерация sitemap.xml и robots.txt.
 *
 * Раньше sitemap.xml отсутствовал (404), а robots.txt указывал на карту
 * сайта на чужом домене — остаток от прежнего хостинга на Vercel.
 */
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ALL_PAGES } from '../src/content/landings.js';

const ORIGIN = 'https://lestniza-krr.ru';
const DIST = resolve('dist');

// Маршруты сайта. Пополняется по мере появления посадочных страниц.
const ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    ...ALL_PAGES.map((l) => ({ path: `/${l.slug}/`, priority: '0.8', changefreq: 'monthly' })),
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(({ path, priority, changefreq }) => `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /razmetka/

Sitemap: ${ORIGIN}/sitemap.xml
`;

await writeFile(resolve(DIST, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(resolve(DIST, 'robots.txt'), robots, 'utf8');
console.log(`  sitemap.xml — ${ROUTES.length} адрес(ов), robots.txt обновлён`);
