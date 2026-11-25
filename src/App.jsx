import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { LANDINGS, PHONE, PHONE_HREF } from './content/landings.js';
import { LEADS_ACCESS_KEY } from './content/forms.js';
import {
    HERO_FRAMES,
    HERO_COPY,
    WOOD_SPECIES,
    STAINS,
    MASTER_COPY,
    HOME_STAGES,
    HOME_FAQ,
    WA_URL,
    TG_URL,
    MAX_URL,
    classifyWork,
} from './content/homepage.js';
import SwatchStudio from './components/SwatchStudio.jsx';
import WorksMatcher from './components/WorksMatcher.jsx';
import MeasureFolder from './components/MeasureFolder.jsx';
import LeadForm from './LeadForm.jsx';

// ==========================================
// ШАПКА (общая для главной и 16 посадочных)
// ==========================================
export function Navbar({ dark = false }) {
    const barCls = dark
        ? 'bg-[#15110E]/95 text-[#F5EFE5] border-white/15'
        : 'bg-background/95 text-primary border-primary/15';

    return (
        <header className={`hidden md:block sticky top-0 z-50 backdrop-blur-md border-b ${barCls}`}>
            <div className="max-w-7xl mx-auto px-8 lg:px-12 h-[74px] flex items-center justify-between gap-6">
                <a href="/" className="shrink-0">
                    <div className="font-heading font-semibold text-xl leading-none tracking-tight">
                        Лестницы в Краснодаре
                    </div>
                    <div className={`font-mono text-[11px] mt-1 ${dark ? 'text-[#C2B6A8]' : 'text-textMain/60'}`}>
                        Мастер Константин · с 2001 года
                    </div>
                </a>

                <nav className={`hidden lg:flex items-center gap-6 text-sm ${dark ? 'text-[#D6CCC0]' : 'text-textMain/80'}`}>
                    <a href="/#prices" className="hover:text-amber transition-colors">Цены</a>
                    <a href="/#works" className="hover:text-amber transition-colors">Примеры работ</a>
                    <div className="relative group/menu">
                        <button type="button" className="inline-flex items-center gap-1 hover:text-amber transition-colors py-2">
                            Услуги <ChevronDown size={15} />
                        </button>
                        <div className="absolute left-0 top-full pt-1 hidden group-hover/menu:block group-focus-within/menu:block z-50">
                            <div className="bg-surface text-primary border border-primary/15 shadow-xl py-2 w-72">
                                {LANDINGS.map((page) => (
                                    <a
                                        key={page.slug}
                                        href={`/${page.slug}/`}
                                        className="block px-4 py-2 text-sm hover:bg-background hover:text-accent transition-colors"
                                    >
                                        {page.h1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <a href="/#master" className="hover:text-amber transition-colors">Мастер</a>
                    <a href="/#stages" className="hover:text-amber transition-colors">Этапы</a>
                    <a href="/#faq" className="hover:text-amber transition-colors">Вопросы</a>
                </nav>

                <div className="flex items-center gap-5 shrink-0">
                    <a
                        href={`tel:${PHONE_HREF}`}
                        className={`font-mono text-[13.5px] font-medium whitespace-nowrap ${dark ? 'text-amber hover:text-white' : 'text-primary hover:text-accent'}`}
                    >
                        {PHONE}
                    </a>
                    <a
                        href="/#zayavka"
                        className={`min-h-[42px] px-5 text-[13.5px] font-semibold inline-flex items-center transition-colors whitespace-nowrap ${
                            dark
                                ? 'bg-amber hover:bg-[#E7B276] text-[#16110D]'
                                : 'bg-accent hover:bg-[#7D3A14] text-white'
                        }`}
                    >
                        Записаться на замер
                    </a>
                </div>
            </div>
        </header>
    );
}

// ==========================================
// МОБИЛЬНАЯ ШАПКА + ВЫДВИЖНОЕ МЕНЮ
// ==========================================
export function MobileNav({ dark = false }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="md:hidden">
            <div className={`h-16 w-full sticky top-0 z-50 flex items-center justify-between px-4 border-b ${
                dark
                    ? 'bg-[#15110E]/95 text-[#F5EFE5] border-white/15'
                    : 'bg-background/95 text-primary border-primary/15'
            }`}>
                <a href="/" className="leading-tight">
                    <div className="font-heading font-semibold text-lg leading-none">Лестницы в Краснодаре</div>
                    <div className={`font-mono text-[10.5px] mt-0.5 ${dark ? 'text-[#C2B6A8]' : 'text-textMain/60'}`}>
                        Мастер Константин · с 2001 года
                    </div>
                </a>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Открыть меню"
                    aria-expanded={open}
                    className={`min-w-[44px] min-h-[44px] px-3 border text-xs font-mono uppercase inline-flex items-center gap-1.5 ${
                        dark ? 'border-white/25 text-[#F5EFE5]' : 'border-primary/25 text-primary'
                    }`}
                >
                    <Menu size={18} />
                    <span>Меню</span>
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-[115] bg-background text-primary overflow-y-auto" role="dialog" aria-modal="true" aria-label="Меню">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-primary/15">
                        <span className="font-heading font-semibold text-xl">Меню</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Закрыть меню"
                            className="min-w-[44px] min-h-[44px] border border-primary/25 flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="px-5 py-6 flex flex-col gap-7 pb-24">
                        <div className="flex flex-col divide-y divide-primary/10">
                            {[
                                { href: '/#prices', label: 'Цены и выкрасы' },
                                { href: '/#works', label: 'Примеры работ' },
                                { href: '/#master', label: 'Мастер Константин' },
                                { href: '/#stages', label: 'Этапы работы' },
                                { href: '/#faq', label: 'Частые вопросы' },
                                { href: '/#zayavka', label: 'Записаться на замер' },
                            ].map((s) => (
                                <a
                                    key={s.href}
                                    href={s.href}
                                    onClick={() => setOpen(false)}
                                    className="py-3 font-medium text-base text-primary"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>

                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-widest text-textMain/55 mb-2">
                                Породы и услуги
                            </div>
                            <div className="flex flex-col divide-y divide-primary/10">
                                {LANDINGS.map((page) => (
                                    <a
                                        key={page.slug}
                                        href={`/${page.slug}/`}
                                        onClick={() => setOpen(false)}
                                        className="py-2.5 text-sm text-textMain/85"
                                    >
                                        {page.h1}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <a
                                href={`tel:${PHONE_HREF}`}
                                className="min-h-[48px] bg-accent text-white font-semibold flex items-center justify-center gap-2"
                            >
                                <Phone size={18} />
                                <span>{PHONE}</span>
                            </a>
                            <div className="grid grid-cols-3 gap-2">
                                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] border border-primary/25 bg-surface flex items-center justify-center text-sm font-medium">WhatsApp</a>
                                <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] border border-primary/25 bg-surface flex items-center justify-center text-sm font-medium">Telegram</a>
                                <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] border border-primary/25 bg-surface flex items-center justify-center text-sm font-medium">MAX</a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}

// ==========================================
// НИЖНЯЯ МОБИЛЬНАЯ ПАНЕЛЬ (заменяет плавающий кружок)
// ==========================================
export function MessengerWidget() {
    return (
        <div
            className="md:hidden fixed left-0 right-0 bottom-0 z-[70] bg-[#15110E]/95 backdrop-blur-md border-t border-white/15 px-2.5 pt-2 grid grid-cols-4 gap-1.5"
            style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}
        >
            <a
                href="/#zayavka"
                className="min-h-[42px] bg-amber text-[#16110D] font-semibold text-xs flex items-center justify-center"
            >
                Замер
            </a>
            <a
                href={`tel:${PHONE_HREF}`}
                className="min-h-[42px] border border-white/20 text-[#F5EFE5] font-medium text-xs flex items-center justify-center"
            >
                Позвонить
            </a>
            <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] border border-white/20 text-[#F5EFE5] font-medium text-xs flex items-center justify-center"
            >
                WhatsApp
            </a>
            <a
                href={MAX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] border border-white/20 text-[#F5EFE5] font-medium text-xs flex items-center justify-center"
            >
                MAX
            </a>
        </div>
    );
}

// ==========================================
// ПОДВАЛ (без плашки «ПРИЕМ ЗАЯВОК: ОТКРЫТ»)
// ==========================================
export function Footer() {
    return (
        <footer className="w-full bg-[#0F0C0A] text-[#F5EFE5] border-t border-white/10 pt-14 pb-24 md:pb-14 px-5 md:px-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10">
                <div className="md:col-span-5 flex flex-col gap-3">
                    <div className="font-heading font-semibold text-2xl">Лестницы в Краснодаре</div>
                    <p className="text-sm text-[#C2B6A8] max-w-sm m-0">
                        Изготовление и монтаж деревянных лестниц на заказ с 2001 года.
                    </p>
                    <div className="font-mono text-sm text-amber mt-2">
                        <a href={`tel:${PHONE_HREF}`} className="hover:underline">{PHONE}</a>
                    </div>
                    <div className="font-mono text-xs text-[#A99D8F]">Ежедневно с 09:00 до 20:00</div>
                    <div className="flex flex-wrap gap-3 text-sm text-[#D6CCC0] mt-2">
                        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amber">WhatsApp</a>
                        <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amber">Telegram</a>
                        <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amber">MAX</a>
                    </div>
                </div>

                <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-[#C2B6A8]">
                    {LANDINGS.map((page) => (
                        <a key={page.slug} href={`/${page.slug}/`} className="hover:text-[#F5EFE5] transition-colors">
                            {page.h1}
                        </a>
                    ))}
                    <a href="/etap-zamer/" className="hover:text-[#F5EFE5] transition-colors">Замер и расчёт</a>
                    <a href="/etap-montazh/" className="hover:text-[#F5EFE5] transition-colors">Монтаж лестницы</a>
                    <a href="/privacy/" className="hover:text-[#F5EFE5] transition-colors">Политика конфиденциальности</a>
                </div>
            </div>
        </footer>
    );
}

// ==========================================
// ГЛАВНАЯ СТРАНИЦА
// ==========================================
export default function App() {
    const [heroIdx, setHeroIdx] = useState(0);
    const [galleryStairs, setGalleryStairs] = useState([]);

    // Сквозное состояние выкрасов и папки замера (синхронизируется с URL)
    const [selectedWood, setSelectedWood] = useState(WOOD_SPECIES[3]); // Ясень по умолчанию
    const [selectedStain, setSelectedStain] = useState(STAINS[0]); // Натуральное масло
    const [woodSaved, setWoodSaved] = useState(false);
    const [savedIds, setSavedIds] = useState([]);
    const [whyMap, setWhyMap] = useState({});
    const [folderOpen, setFolderOpen] = useState(false);
    const [toast, setToast] = useState('');
    const [prefillComment, setPrefillComment] = useState('');
    const [prefillType, setPrefillType] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        window.clearTimeout(window.__stairsToast);
        window.__stairsToast = window.setTimeout(() => setToast(''), 3000);
    };

    // Загружаем реальный каталог gallery.json и восстанавливаем подборку из URL
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}gallery.json`)
            .then((r) => r.json())
            .then((data) => setGalleryStairs(data.stairs || []))
            .catch(() => setGalleryStairs([]));

        try {
            const params = new URLSearchParams(window.location.search);
            const w = params.get('wood');
            const st = params.get('stain');
            const refs = params.get('refs');
            if (w) {
                const foundW = WOOD_SPECIES.find((x) => x.id === w);
                if (foundW) {
                    setSelectedWood(foundW);
                    setWoodSaved(true);
                }
            }
            if (st) {
                const foundS = STAINS.find((x) => x.id === st);
                if (foundS) setSelectedStain(foundS);
            }
            if (refs) {
                setSavedIds(refs.split(',').filter(Boolean).slice(0, 3));
            }
        } catch {
            // Игнорируем некорректные параметры URL
        }
    }, []);

    const classifiedById = useMemo(() => {
        const map = new Map();
        galleryStairs.forEach((p) => map.set(p.id, classifyWork(p)));
        return map;
    }, [galleryStairs]);

    const savedWorks = useMemo(
        () => savedIds.map((id) => classifiedById.get(id)).filter(Boolean),
        [savedIds, classifiedById],
    );

    const handleToggleSave = (work) => {
        setSavedIds((prev) => {
            if (prev.includes(work.id)) {
                return prev.filter((id) => id !== work.id);
            }
            if (prev.length >= 3) {
                showToast('В папке замера уже 3 ориентира - уберите один, чтобы добавить новый');
                return prev;
            }
            showToast(`Работа добавлена в папку замера: «${work.displayTitle}»`);
            return [...prev, work.id];
        });
    };

    const handleToggleWhy = (id, tag) => {
        setWhyMap((prev) => {
            const cur = prev[id] || [];
            return { ...prev, [id]: cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag] };
        });
    };

    const handleCopyFamilyLink = async () => {
        const params = new URLSearchParams();
        if (woodSaved) {
            params.set('wood', selectedWood.id);
            params.set('stain', selectedStain.id);
        }
        if (savedIds.length) params.set('refs', savedIds.join(','));
        const url = `${window.location.origin}/?${params.toString()}#works`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Подборка лестниц для замера', url });
                return;
            }
            await navigator.clipboard.writeText(url);
            showToast('Ссылка скопирована - отправьте мужу или жене, откроется ваша подборка');
        } catch {
            showToast('Ссылка готова в адресной строке');
            window.history.replaceState(null, '', `/?${params.toString()}#works`);
        }
    };

    const handleCopyForMax = async (message, url) => {
        try { await navigator.clipboard.writeText(message); } catch { /* ignore */ }
        showToast('Текст запроса скопирован - вставьте в чат MAX');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleInjectToForm = (message) => {
        setPrefillComment(message);
        setFolderOpen(false);
        const el = document.getElementById('zayavka');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAskSituation = (text, baseKey) => {
        setPrefillComment(text);
        const mapType = {
            zero: 'Лестница на второй этаж',
            metal: 'Ступени на металлокаркас',
            concrete: 'Отделка бетонной лестницы',
            railing: 'Перила и ограждения',
        };
        if (mapType[baseKey]) setPrefillType(mapType[baseKey]);
    };

    const activeHero = HERO_FRAMES[heroIdx];
    const base = import.meta.env.BASE_URL;

    return (
        <div className="w-full min-h-screen bg-background text-textMain">
            <Navbar dark />
            <MobileNav dark />

            <main>
                {/* ПЕРВЫЙ ЭКРАН: Тёмный тёплый орех + вшитое фото лестницы с подсветкой */}
                <section className="relative bg-[#15110E] text-[#F5EFE5] overflow-hidden">
                    {/* Фоновое фото (сразу видимое без opacity:0 для быстрого LCP) */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[62%] overflow-hidden">
                            <img
                                src={`${base}${activeHero.src}`}
                                alt={activeHero.alt}
                                width="985"
                                height="1000"
                                fetchPriority="high"
                                decoding="async"
                                className={`w-full h-full object-cover ${activeHero.pos} transition-all duration-500`}
                            />
                        </div>
                        {/* Плавный мягкий переход в тёмный орех */}
                        <div
                            className="absolute inset-0 hidden lg:block"
                            style={{
                                background:
                                    'linear-gradient(90deg, #15110E 35%, rgba(21,17,14,0.88) 49%, rgba(21,17,14,0.28) 74%, rgba(21,17,14,0.12) 100%), linear-gradient(180deg, rgba(21,17,14,0.35) 0%, transparent 25%, rgba(21,17,14,0.92) 100%)',
                            }}
                        />
                        <div
                            className="absolute inset-0 lg:hidden"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(21,17,14,0.68) 0%, rgba(21,17,14,0.88) 65%, #15110E 100%)',
                            }}
                        />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 pt-7 pb-10 md:pt-14 md:pb-14">
                        <div className="grid lg:grid-cols-12 gap-7 md:gap-8 items-end">
                            <div className="lg:col-span-7 max-w-xl">
                                <div className="font-mono text-xs uppercase tracking-[0.12em] text-amber mb-3 md:mb-4">
                                    {HERO_COPY.eyebrow}
                                </div>

                                <h1 className="font-heading font-semibold text-[34px] sm:text-5xl lg:text-[60px] leading-[1.04] tracking-tight text-[#FAF6EE] mb-4 md:mb-5">
                                    <span>{HERO_COPY.h1Part1}</span>{' '}
                                    <span>{HERO_COPY.h1Part2}</span>
                                </h1>

                                <p className="text-[15.5px] sm:text-[17px] text-[#D0C5B8] leading-relaxed mb-5 md:mb-7">
                                    {HERO_COPY.sub}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-5">
                                    <a
                                        href="#zayavka"
                                        className="min-h-[48px] px-7 bg-amber hover:bg-[#E7B276] text-[#16110D] font-semibold text-[15px] inline-flex items-center transition-colors"
                                    >
                                        {HERO_COPY.ctaPrimary}
                                    </a>
                                    <a
                                        href={WA_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="min-h-[48px] px-6 border border-white/30 hover:border-amber hover:text-amber text-[#F5EFE5] font-medium text-[15px] inline-flex items-center transition-colors"
                                    >
                                        {HERO_COPY.ctaSecondary}
                                    </a>
                                </div>

                                <p className="text-[13.5px] text-[#BFB3A4] leading-relaxed m-0">
                                    В Краснодаре замер бесплатный. Не любите звонки - пришлите фото проёма, высоту от пола до пола и пожелания по ограждению в{' '}
                                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">WhatsApp</a>,{' '}
                                    <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">Telegram</a>{' '}
                                    или{' '}
                                    <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">MAX</a>:
                                    {' '}посмотрим и назовём ориентир по цене в переписке.
                                </p>
                            </div>

                            {/* Компактный переключатель 3 ракурсов лестницы с подсветкой */}
                            <div className="lg:col-span-5 flex lg:justify-end">
                                <div className="bg-[#15110E]/85 backdrop-blur-md border border-white/15 p-2.5 flex flex-col gap-2 w-full sm:w-auto">
                                    <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#C2B6A8] px-1">
                                        {activeHero.label}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {HERO_FRAMES.map((frame, i) => {
                                            const active = i === heroIdx;
                                            return (
                                                <button
                                                    key={frame.id}
                                                    type="button"
                                                    onClick={() => setHeroIdx(i)}
                                                    aria-label={`Показать ракурс: ${frame.label}`}
                                                    className={`relative w-full sm:w-24 aspect-[4/3] overflow-hidden border-2 transition-all ${
                                                        active ? 'border-amber opacity-100' : 'border-white/20 opacity-65 hover:opacity-95'
                                                    }`}
                                                >
                                                    <img
                                                        src={`${base}${frame.src}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Полоса 4 фактов */}
                        <div className="mt-9 md:mt-10 pt-6 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {HERO_COPY.facts.map((fact) => (
                                <div key={fact.val}>
                                    <div className="font-heading font-semibold text-2xl sm:text-[26px] text-amber leading-tight">
                                        {fact.val}
                                    </div>
                                    <div className="text-[13px] text-[#C2B6A8] mt-1">{fact.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* СВЕТЛЫЙ БЛОК 1: СТОЛ ЖИВЫХ ВЫКРАСОВ И ЦЕНЫ */}
                <SwatchStudio
                    selectedWood={selectedWood}
                    setSelectedWood={setSelectedWood}
                    selectedStain={selectedStain}
                    setSelectedStain={setSelectedStain}
                    onAddWoodToFolder={() => {
                        setWoodSaved(true);
                        showToast(`Выкрас «${selectedWood.name} · ${selectedStain.name}» добавлен в папку замера`);
                    }}
                />

                {/* СВЕТЛЫЙ БЛОК 2: ПРИМЕРЫ РАБОТ + ТОЧКИ-РАЗБОРЫ + МАТЧЕР СИТУАЦИИ */}
                <WorksMatcher
                    works={galleryStairs}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onAskSituation={handleAskSituation}
                />

                {/* СВЕТЛЫЙ КОНТРАСТНЫЙ БЛОК 3: МАСТЕР КОНСТАНТИН (КРУГЛЫЙ ПОРТРЕТ) */}
                <section id="master" className="w-full py-20 md:py-28 px-5 md:px-12 bg-[#EAE1D2] border-t border-primary/15 scroll-mt-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-surface border border-primary/15 p-6 sm:p-10 lg:p-12 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                                {/* Круглый портрет мастера (164x164 px, легко заменить на свежее фото лица) */}
                                <div className="flex flex-row md:flex-col items-center gap-4 shrink-0">
                                    <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[3px] border-accent/40 shadow-md bg-[#2A221C] shrink-0">
                                        <img
                                            src={`${base}master-konstantin.webp`}
                                            alt="Мастер Константин на монтаже деревянной лестницы"
                                            width="480"
                                            height="480"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="md:text-center">
                                        <div className="font-heading font-semibold text-xl text-primary">Константин</div>
                                        <div className="font-mono text-[11px] text-accent mt-0.5">С деревом с 2001 года</div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-2">
                                        03 · О мастере и условиях работы
                                    </div>
                                    <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-primary leading-tight">
                                        {MASTER_COPY.h2}
                                    </h2>
                                    <p className="font-mono text-xs sm:text-[13px] text-textMain/65 mt-2 mb-6">
                                        {MASTER_COPY.sub}
                                    </p>

                                    <blockquote className="font-heading text-xl sm:text-2xl text-primary leading-[1.42] m-0 mb-8 space-y-4 border-l-[3px] border-accent pl-5">
                                        {MASTER_COPY.quote.map((p) => (
                                            <p key={p} className="m-0">«{p}»</p>
                                        ))}
                                    </blockquote>

                                    <div className="grid sm:grid-cols-2 gap-5 pt-6 border-t border-primary/15">
                                        {MASTER_COPY.terms.map((t) => (
                                            <div key={t.title} className="bg-background p-4 border border-primary/10">
                                                <h3 className="font-semibold text-[15px] text-accent mb-1">{t.title}</h3>
                                                <p className="text-sm text-textMain/75 m-0 leading-relaxed">{t.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* СВЕТЛЫЙ БЛОК 4: 4 ЭТАПА РАБОТЫ (ССЫЛКИ НА ПОСАДОЧНЫЕ) */}
                <section id="stages" className="w-full py-20 md:py-24 px-5 md:px-12 bg-background border-t border-primary/10 scroll-mt-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-2">
                                    04 · Порядок работы
                                </div>
                                <h2 className="font-heading font-semibold text-4xl text-primary">
                                    Как проходит работа
                                </h2>
                            </div>
                            <p className="text-textMain/70 m-0">Четыре шага с понятным результатом на каждом.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {HOME_STAGES.map((st) => (
                                <a
                                    key={st.num}
                                    href={st.href}
                                    className="group bg-surface border border-primary/15 hover:border-accent p-6 flex flex-col justify-between gap-4 transition-colors"
                                >
                                    <div>
                                        <span className="font-mono text-xs text-accent font-medium">{st.num}</span>
                                        <h3 className="font-heading font-semibold text-2xl text-primary mt-2 mb-2 group-hover:text-accent transition-colors">
                                            {st.title}
                                        </h3>
                                        <p className="text-sm text-textMain/75 m-0 leading-relaxed">{st.text}</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent">
                                        Подробнее <ArrowRight size={14} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* СВЕТЛЫЙ БЛОК 5: ЧАСТЫЕ ВОПРОСЫ */}
                <section id="faq" className="w-full py-20 md:py-24 px-5 md:px-12 bg-surface border-t border-primary/10 scroll-mt-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-2">
                            05 · Ответы до звонка
                        </div>
                        <h2 className="font-heading font-semibold text-4xl text-primary mb-8">
                            Частые вопросы
                        </h2>

                        <div className="border-t border-primary/15 divide-y divide-primary/15">
                            {HOME_FAQ.map((item, idx) => (
                                <details key={item.q} open={idx === 0} className="group py-5">
                                    <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-semibold text-[17px] text-primary">
                                        <span>{item.q}</span>
                                        <span className="font-mono text-accent text-xl shrink-0 group-open:hidden">+</span>
                                        <span className="font-mono text-accent text-xl shrink-0 hidden group-open:inline">-</span>
                                    </summary>
                                    <p className="mt-3 text-[15px] text-textMain/75 leading-relaxed max-w-3xl m-0">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ТЁМНЫЙ ФИНАЛЬНЫЙ БЛОК: ЗАПИСЬ НА ЗАМЕР И КОНТАКТЫ */}
                <LeadForm
                    accessKey={LEADS_ACCESS_KEY}
                    source="Главная"
                    variant="dark"
                    prefillComment={prefillComment}
                    prefillType={prefillType}
                />
            </main>

            <Footer />
            <MessengerWidget />

            {/* Фишка #6: Сквозная папка замера */}
            <MeasureFolder
                open={folderOpen}
                setOpen={setFolderOpen}
                woodSaved={woodSaved}
                selectedWood={selectedWood}
                selectedStain={selectedStain}
                savedWorks={savedWorks}
                whyMap={whyMap}
                onToggleWhy={handleToggleWhy}
                onRemoveWork={(id) => setSavedIds((prev) => prev.filter((x) => x !== id))}
                onClearWood={() => setWoodSaved(false)}
                onCopyFamilyLink={handleCopyFamilyLink}
                onInjectToForm={handleInjectToForm}
                onCopyForMax={handleCopyForMax}
                toast={toast}
            />
        </div>
    );
}
