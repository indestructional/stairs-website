import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Bookmark, Check } from 'lucide-react';
import dimensions from 'virtual:gallery-dimensions';
import {
    CRAFT_HOTSPOTS,
    FEATURED_WORK_IDS,
    classifyWork,
} from '../content/homepage.js';

const BASE_FILTERS = [
    {
        id: 'all',
        label: 'Все варианты',
        priceTitle: 'Стартовые цены под ключ: от 180 000 ₽ (сосна) до 280 000 ₽ (дуб)',
        priceSub: 'Выберите вашу основу выше, чтобы увидеть подходящие примеры работ.',
    },
    {
        id: 'zero',
        label: 'Лестница с нуля',
        priceTitle: 'Лестница на второй этаж под ключ - от 180 000 ₽',
        priceSub: 'Сосна от 180 000 ₽ · Лиственница и бук от 200 000 ₽ · Ясень от 230 000 ₽ · Дуб от 280 000 ₽.',
    },
    {
        id: 'metal',
        label: 'Готовый металлокаркас',
        priceTitle: 'Ступени и ограждение на готовый металлокаркас - от 150 000 ₽',
        priceSub: 'Работаем по уже сваренному металлу или подскажем размеры на замере до сварки.',
    },
    {
        id: 'concrete',
        label: 'Залит бетон',
        priceTitle: 'Отделка бетонной лестницы деревом - расчёт по замеру',
        priceSub: 'Выравниваем основание, подгоняем каждую ступень по месту, крепёж скрытый.',
    },
    {
        id: 'railing',
        label: 'Только ограждение',
        priceTitle: 'Деревянное ограждение отдельно - от 3 200 ₽ за погонный метр',
        priceSub: 'Поручни и балясины для готовой лестницы, площадки второго этажа или балкона.',
    },
];

const DETAIL_TAGS = [
    { id: 'led', label: 'С подсветкой' },
    { id: 'glass', label: 'Со стеклом' },
    { id: 'metal', label: 'С металлом' },
];

const imgSrc = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

function WorkLightbox({ work, onClose, isSaved, onToggleSave }) {
    const [idx, setIdx] = useState(0);
    const images = work.images || [];
    const photo = images[idx];

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && images.length > 1) setIdx((p) => (p + 1) % images.length);
            if (e.key === 'ArrowLeft' && images.length > 1) setIdx((p) => (p - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [images.length, onClose]);

    return (
        <div
            className="fixed inset-0 z-[120] bg-[#110D0A]/95 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={work.displayTitle}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl max-h-[92vh] flex flex-col gap-3 text-[#F5EFE5]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="font-semibold text-base sm:text-lg leading-snug">{work.displayTitle}</div>
                        <div className="text-xs sm:text-sm text-[#C2B6A8]">{work.displayCaption}</div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть просмотр"
                        className="min-w-[44px] min-h-[44px] border border-white/25 hover:border-white flex items-center justify-center shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative bg-black flex items-center justify-center max-h-[68vh] overflow-hidden">
                    {photo && (
                        <img
                            src={imgSrc(photo)}
                            {...(dimensions[photo] || {})}
                            alt={work.displayTitle}
                            className="max-h-[68vh] w-auto object-contain select-none"
                        />
                    )}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Предыдущее фото"
                                onClick={() => setIdx((p) => (p - 1 + images.length) % images.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                aria-label="Следующее фото"
                                onClick={() => setIdx((p) => (p + 1) % images.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {images.length > 1 ? (
                        <div className="flex gap-1.5 overflow-x-auto py-1">
                            {images.slice(0, 10).map((src, i) => (
                                <button
                                    key={src}
                                    type="button"
                                    onClick={() => setIdx(i)}
                                    className={`w-12 h-12 overflow-hidden border-2 shrink-0 ${
                                        i === idx ? 'border-amber opacity-100' : 'border-transparent opacity-55 hover:opacity-90'
                                    }`}
                                >
                                    <img src={imgSrc(src)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span />
                    )}

                    <button
                        type="button"
                        onClick={() => onToggleSave(work)}
                        className={`min-h-[42px] px-4 text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
                            isSaved
                                ? 'bg-amber text-[#16110D]'
                                : 'border border-amber/60 text-amber hover:bg-amber hover:text-[#16110D]'
                        }`}
                    >
                        {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                        {isSaved ? 'В папке замера' : 'Сохранить как ориентир'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WorksMatcher({
    works,
    savedIds,
    onToggleSave,
    onAskSituation,
}) {
    const [activePin, setActivePin] = useState(CRAFT_HOTSPOTS.points[0].id);
    const [baseFilter, setBaseFilter] = useState('all');
    const [activeTags, setActiveTags] = useState([]);
    const [meters, setMeters] = useState(6);
    const [visibleCount, setVisibleCount] = useState(6);
    const [openedWork, setOpenedWork] = useState(null);

    const classified = useMemo(() => {
        const mapped = (works || []).map(classifyWork);
        const order = new Map(FEATURED_WORK_IDS.map((id, idx) => [id, idx]));
        return mapped.sort((a, b) => {
            const ia = order.has(a.id) ? order.get(a.id) : 999;
            const ib = order.has(b.id) ? order.get(b.id) : 999;
            return ia - ib;
        });
    }, [works]);

    const { list, isFallback } = useMemo(() => {
        const exact = classified.filter((w) => {
            const okBase = baseFilter === 'all' || w.base === baseFilter;
            const okTags = activeTags.every((t) => w.tags.includes(t));
            return okBase && okTags;
        });
        if (exact.length > 0) return { list: exact, isFallback: false };
        const near = classified.filter((w) => baseFilter === 'all' || w.base === baseFilter);
        return { list: near.length ? near : classified.slice(0, 6), isFallback: true };
    }, [classified, baseFilter, activeTags]);

    const currentBaseMeta = BASE_FILTERS.find((b) => b.id === baseFilter) || BASE_FILTERS[0];
    const toggleTag = (id) => {
        setVisibleCount(6);
        setActiveTags((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleSituationAsk = () => {
        const tagLabels = DETAIL_TAGS.filter((t) => activeTags.includes(t.id)).map((t) => t.label).join(', ');
        const text = `Ситуация: ${currentBaseMeta.label}${baseFilter === 'railing' ? ` (примерно ${meters} пог. м)` : ''}${tagLabels ? `. Детали: ${tagLabels}` : ''}.`;
        onAskSituation(text, baseFilter);
    };

    const base = import.meta.env.BASE_URL;

    return (
        <section id="works" className="w-full py-20 md:py-28 px-5 md:px-12 bg-background border-t border-primary/10 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3">
                            02 · Примеры работ и разбор узлов
                        </div>
                        <h2 className="font-heading font-semibold text-4xl md:text-5xl text-primary leading-[1.08]">
                            Примеры работ
                        </h2>
                    </div>
                    <p className="text-textMain/75 max-w-xl text-base leading-relaxed">
                        Сняты на объектах после монтажа. Нажмите на фотографию, чтобы рассмотреть остальные ракурсы,
                        или сохраните понравившиеся варианты в папку замера.
                    </p>
                </div>

                {/* Фишка #4: Разбор реальных узлов на фото */}
                <div className="grid lg:grid-cols-12 gap-8 items-center bg-surface border border-primary/15 p-5 sm:p-8 mb-12 shadow-sm">
                    <div className="lg:col-span-6 relative aspect-[4/5] max-h-[540px] w-full mx-auto overflow-hidden bg-[#1D1815]">
                        <img
                            src={`${base}${CRAFT_HOTSPOTS.img}`}
                            alt={CRAFT_HOTSPOTS.title}
                            width="640"
                            height="920"
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                        {CRAFT_HOTSPOTS.points.map((pt, idx) => {
                            const active = pt.id === activePin;
                            return (
                                <button
                                    key={pt.id}
                                    type="button"
                                    aria-label={pt.label}
                                    aria-pressed={active}
                                    onClick={() => setActivePin(pt.id)}
                                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full font-mono text-xs font-semibold border-2 shadow-lg transition-transform ${
                                        active
                                            ? 'bg-accent text-white border-white scale-110'
                                            : 'bg-surface/95 text-primary border-accent hover:scale-105'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-6 flex flex-col gap-3">
                        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                            Детали столярной работы
                        </div>
                        <h3 className="font-heading font-semibold text-3xl text-primary leading-tight">
                            {CRAFT_HOTSPOTS.title}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-textMain/70 mb-2">
                            {CRAFT_HOTSPOTS.subtitle}
                        </p>

                        <div className="flex flex-col gap-2.5">
                            {CRAFT_HOTSPOTS.points.map((pt, idx) => {
                                const active = pt.id === activePin;
                                return (
                                    <button
                                        key={pt.id}
                                        type="button"
                                        onClick={() => setActivePin(pt.id)}
                                        className={`text-left p-4 border transition-colors ${
                                            active
                                                ? 'bg-white border-accent shadow-[inset_3px_0_0_#9A4A1C]'
                                                : 'bg-background border-primary/15 hover:border-primary/35'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 font-semibold text-[15px] text-primary">
                                            <span className="font-mono text-xs text-accent">0{idx + 1}</span>
                                            <span>{pt.label}</span>
                                        </div>
                                        {active && (
                                            <p className="mt-2 text-sm text-textMain/75 leading-relaxed m-0">
                                                {pt.detail}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Фишка #3: Матчер вашей ситуации */}
                <div className="bg-surface border border-primary/15 p-5 sm:p-6 mb-8 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-textMain/60 mr-2 w-full sm:w-auto">
                            Что сейчас в доме:
                        </span>
                        {BASE_FILTERS.map((f) => {
                            const active = baseFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => {
                                        setBaseFilter(f.id);
                                        setVisibleCount(6);
                                    }}
                                    className={`min-h-[44px] px-4 text-sm font-semibold border transition-colors ${
                                        active
                                            ? 'bg-accent text-white border-accent'
                                            : 'bg-background text-primary border-primary/20 hover:border-primary'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-textMain/60 mr-2 w-full sm:w-auto">
                            Детали (по желанию):
                        </span>
                        {DETAIL_TAGS.map((t) => {
                            const active = activeTags.includes(t.id);
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => toggleTag(t.id)}
                                    className={`min-h-[38px] px-3.5 text-[13px] font-medium border transition-colors ${
                                        active
                                            ? 'bg-primary text-surface border-primary'
                                            : 'bg-white text-primary/85 border-primary/15 hover:border-primary/45'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-background border border-primary/15 p-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="font-semibold text-[15px] text-primary">
                                {currentBaseMeta.priceTitle}
                            </div>
                            <div className="text-[13px] text-textMain/70 mt-0.5">
                                {isFallback
                                    ? 'Точно такой связки в подборке нет - показываем ближайшие работы по вашей основе.'
                                    : currentBaseMeta.priceSub}
                            </div>
                        </div>

                        {baseFilter === 'railing' && (
                            <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 border border-primary/15">
                                <span className="font-mono text-xs text-textMain/65">Длина:</span>
                                <button
                                    type="button"
                                    aria-label="Уменьшить длину"
                                    onClick={() => setMeters((m) => Math.max(2, m - 1))}
                                    className="w-8 h-8 border border-primary/30 bg-white font-mono font-bold text-primary"
                                >
                                    -
                                </button>
                                <strong className="font-mono text-sm min-w-[42px] text-center">{meters} м</strong>
                                <button
                                    type="button"
                                    aria-label="Увеличить длину"
                                    onClick={() => setMeters((m) => Math.min(30, m + 1))}
                                    className="w-8 h-8 border border-primary/30 bg-white font-mono font-bold text-primary"
                                >
                                    +
                                </button>
                                <span className="font-mono text-xs sm:text-sm font-semibold text-accent ml-1">
                                    от {(meters * 3200).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        )}

                        <a
                            href="#zayavka"
                            onClick={handleSituationAsk}
                            className="min-h-[42px] px-4 bg-primary hover:bg-accent text-surface text-sm font-semibold inline-flex items-center transition-colors"
                        >
                            Спросить по моей ситуации
                        </a>
                    </div>
                </div>

                {/* Сетка работ с видимыми подписями и кнопкой в папку замера */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.slice(0, visibleCount).map((work) => {
                        const firstImg = work.images?.[0];
                        const isSaved = savedIds.includes(work.id);
                        return (
                            <article
                                key={work.id}
                                className="bg-surface border border-primary/15 flex flex-col overflow-hidden transition-shadow hover:shadow-md"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenedWork(work)}
                                    className="group relative aspect-[4/3] w-full overflow-hidden bg-[#E7DED0] text-left"
                                >
                                    {firstImg && (
                                        <img
                                            src={imgSrc(firstImg)}
                                            {...(dimensions[firstImg] || {})}
                                            alt={work.displayTitle}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    )}
                                    <span className="absolute left-3 top-3 bg-[#1A1512]/85 text-[#FAF7F1] font-mono text-[11px] px-2.5 py-1">
                                        {work.baseLabel}{work.material && work.material !== 'Другое' ? ` · ${work.material}` : ''}
                                    </span>
                                    {work.images?.length > 1 && (
                                        <span className="absolute right-3 bottom-3 bg-[#1A1512]/80 text-[#FAF7F1] font-mono text-[11px] px-2 py-0.5">
                                            {work.images.length} фото
                                        </span>
                                    )}
                                </button>

                                <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                                    <div>
                                        <h3 className="font-semibold text-[15.5px] text-primary leading-snug">
                                            {work.displayTitle}
                                        </h3>
                                        <p className="text-[13px] text-textMain/65 mt-1 m-0">
                                            {work.displayCaption}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onToggleSave(work)}
                                        className={`mt-auto min-h-[40px] px-3 w-full border text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                                            isSaved
                                                ? 'bg-primary text-surface border-primary'
                                                : 'bg-background text-primary border-primary/20 hover:border-primary'
                                        }`}
                                    >
                                        {isSaved ? <Check size={15} /> : <Bookmark size={15} />}
                                        {isSaved ? 'В папке замера' : 'Сохранить как ориентир'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Низ секции работ (без упоминания числа работ) */}
                <div className="mt-8 pt-6 border-t border-primary/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-2xl">
                        <p className="text-sm sm:text-[15px] text-textMain/80 m-0">
                            Похожую лестницу посчитаем заново под ваш проём. Если приглянулся вариант, пришлите скриншот и высоту этажа - прикинем порядок стоимости.
                        </p>
                        <a
                            href="/besedki-terrasy-izdeliya-iz-dereva/"
                            className="inline-block mt-2 text-sm text-accent underline underline-offset-4 hover:text-primary"
                        >
                            Кроме лестниц делаем беседки, террасы, арки и мебель из массива (кроме кухонь и корпусной мебели с механизмами)
                        </a>
                    </div>

                    {visibleCount < list.length && (
                        <button
                            type="button"
                            onClick={() => setVisibleCount((c) => c + 6)}
                            className="min-h-[46px] px-7 border border-primary bg-surface hover:bg-primary hover:text-surface text-primary text-sm font-semibold shrink-0 transition-colors"
                        >
                            Показать ещё работы
                        </button>
                    )}
                </div>
            </div>

            {openedWork && (
                <WorkLightbox
                    work={openedWork}
                    onClose={() => setOpenedWork(null)}
                    isSaved={savedIds.includes(openedWork.id)}
                    onToggleSave={onToggleSave}
                />
            )}
        </section>
    );
}
