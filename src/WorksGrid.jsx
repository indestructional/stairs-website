import React, { useEffect, useState } from 'react';

/**
 * Сетка работ с каруселью в карточке и полноэкранным просмотром.
 *
 * Раньше это жило внутри блока работ на главной и было завязано на его
 * состояние, поэтому на внутренних страницах пришлось ставить простые
 * картинки-ссылки. Теперь блок общий: и главная, и статьи показывают
 * работы одинаково - карточку можно листать и открывать целиком.
 */

/** Падежи пород: автоматическое склонение врёт на ясене и сосне. */
const GENITIVE = {
    'Дуб': 'дуба',
    'Бук': 'бука',
    'Ясень': 'ясеня',
    'Сосна': 'сосны',
    'Лиственница': 'лиственницы',
};

/** Осмысленная подпись вместо «Работа 3 фото 2» - её читают и люди, и поиск. */
export function describe(pub) {
    const parts = [pub.type || 'Деревянная лестница'];
    const material = GENITIVE[pub.material];
    if (material) parts.push(`из ${material}`);
    parts.push('на заказ в Краснодаре');
    return parts.join(' ');
}

const src = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function WorkCarousel({ pub, onOpen }) {
    const [idx, setIdx] = useState(0);
    const step = (delta) => (event) => {
        event.stopPropagation();
        setIdx((prev) => (prev + delta + pub.images.length) % pub.images.length);
    };

    return (
        <div
            onClick={onOpen}
            className="group cursor-pointer relative aspect-[3/4] bg-primary/5 rounded-2xl md:rounded-3xl overflow-hidden border border-primary/5 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <img
                src={src(pub.images[idx])}
                alt={describe(pub)}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

            {pub.images.length > 1 && (
                <>
                    <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none z-10">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </div>

                    <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 z-10 pointer-events-none">
                        {pub.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-white scale-125' : 'bg-white/40 shadow-sm'}`} />
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-label="Предыдущее фото"
                        onClick={step(-1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/20"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Следующее фото"
                        onClick={step(1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/20"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </>
            )}
        </div>
    );
}

function Lightbox({ pub, onClose }) {
    const [idx, setIdx] = useState(0);
    const move = (delta) => setIdx((prev) => (prev + delta + pub.images.length) % pub.images.length);

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowRight') move(1);
            if (event.key === 'ArrowLeft') move(-1);
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    });

    return (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
            <button
                type="button"
                aria-label="Закрыть"
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                onClick={onClose}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
                <img
                    src={src(pub.images[idx])}
                    alt={describe(pub)}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg select-none"
                />

                <div className="text-center text-white/80 text-sm px-4">
                    <span>{describe(pub)}</span>
                    {pub.note && <span className="block text-white/60 mt-1">{pub.note}</span>}
                    {pub.images.length > 1 && <span className="block text-white/40 mt-1">{idx + 1} из {pub.images.length}</span>}
                </div>

                {pub.images.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Предыдущее фото"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={() => move(-1)}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <button
                            type="button"
                            aria-label="Следующее фото"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            onClick={() => move(1)}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function WorksGrid({ items, title, subtitle, initial = 12, step = 12, id, moreHref }) {
    const [visible, setVisible] = useState(initial);
    const [openIdx, setOpenIdx] = useState(null);

    if (!items?.length) return null;

    return (
        <section id={id} className="w-full py-16 md:py-24 px-6 md:px-16 bg-background scroll-mt-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {(title || subtitle) && (
                    <div className="flex flex-col gap-3">
                        {title && <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">{title}</h2>}
                        {subtitle && <p className="text-textMain/60 max-w-2xl">{subtitle}</p>}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {items.slice(0, visible).map((pub, idx) => (
                        <WorkCarousel key={pub.id} pub={pub} onOpen={() => setOpenIdx(idx)} />
                    ))}
                </div>

                {visible < items.length && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setVisible((prev) => prev + step)}
                            className="btn-magnetic px-10 py-4 bg-primary text-background rounded-full font-medium text-lg hover:shadow-xl hover:shadow-primary/20"
                        >
                            Показать ещё
                        </button>
                    </div>
                )}

                {moreHref && visible >= items.length && (
                    <a href={moreHref} className="text-accent font-medium link-hover self-start">
                        Смотреть все работы
                    </a>
                )}
            </div>

            {openIdx !== null && <Lightbox pub={items[openIdx]} onClose={() => setOpenIdx(null)} />}
        </section>
    );
}
