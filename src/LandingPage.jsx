import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { Navbar, MobileNav, Footer, MessengerWidget } from './App.jsx';
import WorksGrid from './WorksGrid.jsx';
import LeadForm from './LeadForm.jsx';
import { LEADS_ACCESS_KEY } from './content/forms.js';
import { LANDINGS, bySlug, PHONE, PHONE_HREF, CITY } from './content/landings.js';

const ORIGIN = 'https://lestniza-krr.ru';

/**
 * Проставляет метатеги и микроразметку. Работает через DOM, а не через
 * серверный рендер: пререндер снимает страницу уже после выполнения
 * скриптов, поэтому в статический HTML всё попадает.
 */
function useSeo(page) {
    useEffect(() => {
        if (!page) return;
        const url = `${ORIGIN}/${page.slug}/`;
        document.title = page.title;

        const setMeta = (selector, attrs) => {
            let el = document.head.querySelector(selector);
            if (!el) {
                el = document.createElement(attrs.rel ? 'link' : 'meta');
                document.head.appendChild(el);
            }
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        };

        setMeta('meta[name="description"]', { name: 'description', content: page.description });
        setMeta('link[rel="canonical"]', { rel: 'canonical', href: url });
        setMeta('meta[property="og:title"]', { property: 'og:title', content: page.title });
        setMeta('meta[property="og:description"]', { property: 'og:description', content: page.description });
        setMeta('meta[property="og:url"]', { property: 'og:url', content: url });

        const ld = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${ORIGIN}/` },
                        { '@type': 'ListItem', position: 2, name: page.h1, item: url },
                    ],
                },
                {
                    '@type': 'Service',
                    name: page.h1,
                    description: page.description,
                    areaServed: { '@type': 'City', name: CITY },
                    provider: { '@type': 'HomeAndConstructionBusiness', name: 'Лестницы в Краснодаре', telephone: PHONE_HREF },
                },
                ...(page.faq?.length ? [{
                    '@type': 'FAQPage',
                    mainEntity: page.faq.map(({ q, a }) => ({
                        '@type': 'Question',
                        name: q,
                        acceptedAnswer: { '@type': 'Answer', text: a },
                    })),
                }] : []),
            ],
        };

        let script = document.head.querySelector('script[data-landing-ld]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-landing-ld', '');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(ld);
    }, [page]);
}


/**
 * Подборка работ под тему страницы. После разметки у публикаций есть тип,
 * порода и перечень того, что видно на снимках - значит на странице про
 * дуб показываем дубовые работы, а на странице про перила те, где видны
 * балясины. Если подходящих мало, добираем остальными: пустая подборка
 * хуже не совсем точной.
 */
function useWorks(category, works) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}gallery.json`)
            .then((r) => r.json())
            .then((data) => {
                const all = data[category] ?? [];
                const fits = (pub) => {
                    if (!works) return false;
                    if (works.type) return pub.type === works.type;
                    if (works.material) return pub.material === works.material;
                    if (works.shown) return pub.shown?.includes(works.shown);
                    return false;
                };
                const matched = all.filter(fits);
                const rest = all.filter((pub) => !matched.includes(pub));
                setItems([...matched, ...rest]);
            })
            .catch(() => setItems([]));
    }, [category, works]);

    return items;
}

/** Заголовок подборки: «наши работы из дуба» понятнее, чем «примеры работ». */
const WORKS_TITLE = {
    'Дуб': 'Наши работы из дуба',
    'Бук': 'Наши работы из бука',
    'Ясень': 'Наши работы из ясеня',
    'Сосна': 'Наши работы из сосны',
    'Лиственница': 'Наши работы из лиственницы',
};

function worksHeading(works) {
    if (works?.material) return WORKS_TITLE[works.material] ?? 'Примеры наших работ';
    if (works?.type) return `Наши работы: ${works.type.toLowerCase()}`;
    if (works?.shown === 'Балясины') return 'Наши ограждения и перила';
    return 'Примеры наших работ';
}

/**
 * Короткая справка вместо развёрнутых блоков про замер и цену.
 * Раньше они целиком повторялись на каждой странице и занимали больше
 * места, чем собственный текст страницы - для поиска это близкие дубли.
 * Развёрнутые версии живут по ссылкам, здесь только суть.
 */
function QuickFacts({ currentSlug, priceLabel }) {
    return (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-textMain/70 border-y border-primary/10 py-4">
            {priceLabel && <span className="font-semibold text-primary">{priceLabel}</span>}
            {priceLabel && <span className="text-primary/20">|</span>}
            <span>Замер бесплатный по {CITY}у</span>
            <span className="text-primary/20">|</span>
            <span>Гарантия год по договору</span>
            <span className="text-primary/20">|</span>
            <span>Более 25 лет опыта</span>
            {currentSlug !== 'ceny' && (
                <a href="/ceny/" className="text-accent font-medium link-hover">От чего зависит цена</a>
            )}
            {currentSlug !== 'etap-zamer' && (
                <a href="/etap-zamer/" className="text-accent font-medium link-hover">Как проходит замер</a>
            )}
        </div>
    );
}

function CallToAction() {
    return (
        <section className="w-full py-16 px-6 md:px-16">
            <div className="max-w-5xl mx-auto bg-primary text-background rounded-2xl px-8 py-12 flex flex-col gap-5">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-background">
                    Приедем, замерим, посчитаем
                </h2>
                <p className="opacity-80 max-w-2xl">
                    Сам замер бесплатный в черте {CITY}а, за городом оплачивается выезд - от 1000 рублей.
                    Работаем по {CITY}у и краю.
                </p>
                <a
                    href={`tel:${PHONE_HREF}`}
                    className="btn-magnetic inline-flex items-center gap-3 bg-accent text-white px-7 py-4 rounded-full text-lg font-bold self-start"
                >
                    <Phone size={20} />
                    <span>{PHONE}</span>
                </a>
            </div>
        </section>
    );
}


/** Перелинковка: с внутренней страницы должно быть куда уйти, кроме как назад. */
function OtherServices({ currentSlug }) {
    const others = LANDINGS.filter((p) => p.slug !== currentSlug);
    return (
        <section className="w-full px-6 md:px-16 py-12 border-t border-primary/10">
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <h2 className="font-heading font-bold text-xl md:text-2xl text-primary">Другие услуги</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {others.map((p) => (
                        <a
                            key={p.slug}
                            href={`/${p.slug}/`}
                            className="px-5 py-4 rounded-xl border border-primary/10 hover:border-accent/40 hover:text-accent transition-colors font-medium text-primary"
                        >
                            {p.h1}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function LandingPage({ slug }) {
    const page = bySlug[slug];
    const works = useWorks(page?.category, page?.works);
    useSeo(page);

    if (!page) return null;

    return (
        <div className="w-full min-h-screen bg-background">
            <Navbar />
            <MobileNav />

            <main>
                <header className="w-full px-6 md:px-16 pt-10 md:pt-16 pb-8">
                    <div className="max-w-5xl mx-auto flex flex-col gap-5">
                        <nav aria-label="Хлебные крошки" className="text-sm text-textMain/60">
                            <a href="/" className="link-hover">Главная</a>
                            <span className="mx-2">/</span>
                            <span>{page.h1}</span>
                        </nav>
                        <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-primary leading-tight">
                            {page.h1}
                        </h1>
                        <p className="text-lg md:text-xl text-textMain/80 max-w-3xl">{page.lead}</p>
                        <QuickFacts currentSlug={page.slug} priceLabel={page.priceLabel} />
                        <a
                            href={`tel:${PHONE_HREF}`}
                            className="btn-magnetic inline-flex items-center gap-3 bg-accent text-white px-7 py-3.5 rounded-full font-bold self-start"
                        >
                            <Phone size={19} />
                            <span>{PHONE}</span>
                        </a>
                    </div>
                </header>

                <div className="w-full px-6 md:px-16 pb-8">
                    <div className="max-w-5xl mx-auto flex flex-col gap-12">
                        {page.sections.map((section) => (
                            <section key={section.h2} className="flex flex-col gap-4">
                                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">{section.h2}</h2>
                                {section.body.map((paragraph) => (
                                    <p key={paragraph} className="text-textMain/85 max-w-3xl leading-relaxed">{paragraph}</p>
                                ))}
                            </section>
                        ))}
                    </div>
                </div>

                <WorksGrid
                    items={works}
                    title={worksHeading(page.works)}
                    subtitle="Все фотографии сделаны на реальных объектах. Нажмите, чтобы посмотреть работу целиком."
                    initial={8}
                    step={8}
                    moreHref="/#works"
                />

                {page.faq?.length > 0 && (
                    <section className="w-full px-6 md:px-16 py-8">
                        <div className="max-w-5xl mx-auto flex flex-col gap-6">
                            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">Частые вопросы</h2>
                            <dl className="flex flex-col gap-6 max-w-3xl">
                                {page.faq.map(({ q, a }) => (
                                    <div key={q} className="flex flex-col gap-2">
                                        <dt className="font-heading font-bold text-lg text-primary">{q}</dt>
                                        <dd className="text-textMain/85 leading-relaxed">{a}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>
                )}

                <LeadForm accessKey={LEADS_ACCESS_KEY} source={page.h1} />
                <CallToAction />
                <OtherServices currentSlug={page.slug} />
            </main>

            <Footer />
            <MessengerWidget />
        </div>
    );
}
