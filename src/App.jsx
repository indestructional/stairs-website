import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Send, Menu, X, ChevronDown, ChevronRight, ArrowRight, Plus } from 'lucide-react';
import { LANDINGS, PHONE, PHONE_HREF } from './content/landings.js';
import { LEADS_ACCESS_KEY } from './content/forms.js';
import {
    HERO_PHOTO,
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

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// SVG-ИКОНКИ МЕССЕНДЖЕРОВ (WhatsApp и MAX)
// ==========================================
function WhatsAppIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function MaxIcon({ size = 20, white = true }) {
    return (
        <svg width={size} height={size} viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
            {!white && (
                <defs>
                    <linearGradient id="maxGradient" x1="117.847" x2="1000" y1="760.536" y2="500" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#4cf" />
                        <stop offset=".662" stopColor="#53e" />
                        <stop offset="1" stopColor="#93d" />
                    </linearGradient>
                </defs>
            )}
            {!white && <rect width="1000" height="1000" fill="url(#maxGradient)" rx="250" />}
            <path
                fill={white ? 'currentColor' : '#fff'}
                fillRule="evenodd"
                d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"
            />
        </svg>
    );
}

// ==========================================
// ПЛАВАЮЩАЯ ШАПКА "THE FLOATING ISLAND"
// Наверху широкая, при прокрутке отсоединяется и плывёт скруглённой капсулой
// ==========================================
export function Navbar({ dark = false }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const iconBase = dark
        ? 'text-[#D6CCC0] transition-all duration-300 hover:-translate-y-0.5'
        : 'text-primary/80 transition-all duration-300 hover:-translate-y-0.5';

    return (
        <div className="hidden md:block">
            {/* Занимает высоту шапки наверху, чтобы первый экран не прыгал */}
            <div className={`h-[76px] w-full ${dark ? 'bg-[#15110E]' : 'bg-background'}`} />

            <header
                className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
                    scrolled
                        ? 'top-4 pointer-events-none px-4'
                        : `top-0 pointer-events-auto border-b ${
                            dark ? 'bg-[#15110E]/95 border-white/10' : 'bg-background/95 border-primary/10'
                        }`
                }`}
            >
                <div
                    className={`flex items-center transition-all duration-500 pointer-events-auto ${
                        scrolled
                            ? `gap-5 lg:gap-7 rounded-full px-5 lg:px-6 py-2.5 backdrop-blur-xl shadow-[0_14px_40px_rgba(21,17,14,0.22)] border w-fit ${
                                dark
                                    ? 'bg-[#18130F]/90 text-[#F5EFE5] border-white/15'
                                    : 'bg-surface/90 text-primary border-primary/15'
                            }`
                            : `w-full max-w-7xl justify-between px-6 lg:px-10 h-[76px] mx-auto ${
                                dark ? 'text-[#F5EFE5]' : 'text-primary'
                            }`
                    }`}
                >
                    <a href="/" className="shrink-0 group">
                        <div className="font-heading font-semibold text-xl leading-none tracking-tight group-hover:text-amber transition-colors">
                            Лестницы в Краснодаре
                        </div>
                        {!scrolled && (
                            <div className={`font-mono text-[11px] mt-1 ${dark ? 'text-[#C2B6A8]' : 'text-textMain/60'}`}>
                                Мастер Константин · с 2001 года
                            </div>
                        )}
                    </a>

                    <nav className={`hidden xl:flex items-center gap-5 text-sm ${dark ? 'text-[#D6CCC0]' : 'text-textMain/80'}`}>
                        <a href="/#prices" className="link-hover hover:text-amber">Цены</a>
                        <a href="/#works" className="link-hover hover:text-amber">Примеры работ</a>
                        <div className="relative group/menu">
                            <button type="button" className="inline-flex items-center gap-1 hover:text-amber transition-colors py-2">
                                Услуги <ChevronDown size={15} />
                            </button>
                            <div className="absolute left-0 top-full pt-2 hidden group-hover/menu:block group-focus-within/menu:block z-50">
                                <div className="bg-surface text-primary rounded-2xl border border-primary/15 shadow-2xl py-2 w-72 overflow-hidden">
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
                        <a href="/#master" className="link-hover hover:text-amber">Мастер</a>
                        <a href="/#stages" className="link-hover hover:text-amber">Этапы</a>
                        <a href="/#faq" className="link-hover hover:text-amber">Вопросы</a>
                    </nav>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className={`flex items-center gap-3 pr-3 border-r ${dark ? 'border-white/15' : 'border-primary/15'}`}>
                            <a
                                href={WA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Написать в WhatsApp"
                                title="WhatsApp"
                                className={`${iconBase} hover:text-[#25D366]`}
                            >
                                <WhatsAppIcon size={19} />
                            </a>
                            <a
                                href={TG_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Написать в Telegram"
                                title="Telegram"
                                className={`${iconBase} hover:text-[#29A9EB]`}
                            >
                                <Send size={18} />
                            </a>
                            <a
                                href={MAX_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Написать в MAX"
                                title="MAX"
                                className={`${iconBase} hover:text-[#7B74FF]`}
                            >
                                <MaxIcon size={19} white />
                            </a>
                        </div>

                        <a
                            href={`tel:${PHONE_HREF}`}
                            className={`font-mono text-[13.5px] font-medium whitespace-nowrap transition-colors ${dark ? 'text-amber hover:text-white' : 'text-primary hover:text-accent'}`}
                        >
                            {PHONE}
                        </a>
                        <a
                            href="/#zayavka"
                            className={`btn-magnetic min-h-[40px] px-5 rounded-full text-[13.5px] font-semibold inline-flex items-center whitespace-nowrap ${
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
        </div>
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
            <div className={`h-16 w-full sticky top-0 z-50 backdrop-blur-md flex items-center justify-between px-4 border-b ${
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
                <div className="flex items-center gap-2">
                    <a
                        href={`tel:${PHONE_HREF}`}
                        aria-label="Позвонить"
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                            dark ? 'bg-amber text-[#16110D]' : 'bg-accent text-white'
                        }`}
                    >
                        <Phone size={18} />
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Открыть меню"
                        aria-expanded={open}
                        className={`min-w-[42px] min-h-[40px] px-3 rounded-full border text-xs font-mono uppercase inline-flex items-center gap-1.5 ${
                            dark ? 'border-white/25 text-[#F5EFE5]' : 'border-primary/25 text-primary'
                        }`}
                    >
                        <Menu size={18} />
                        <span>Меню</span>
                    </button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-[115] bg-background text-primary overflow-y-auto" role="dialog" aria-modal="true" aria-label="Меню">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-primary/15">
                        <span className="font-heading font-semibold text-xl">Меню</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Закрыть меню"
                            className="w-11 h-11 rounded-full border border-primary/25 flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="px-5 py-5 flex flex-col gap-6 pb-20">
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
                                className="min-h-[46px] rounded-full bg-accent text-white font-semibold flex items-center justify-center gap-2"
                            >
                                <Phone size={18} />
                                <span>{PHONE}</span>
                            </a>
                            <div className="grid grid-cols-3 gap-2">
                                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] rounded-full border border-primary/20 bg-surface flex items-center justify-center gap-1.5 text-sm font-medium">
                                    <WhatsAppIcon size={16} /> WhatsApp
                                </a>
                                <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] rounded-full border border-primary/20 bg-surface flex items-center justify-center gap-1.5 text-sm font-medium">
                                    <Send size={15} /> Telegram
                                </a>
                                <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] rounded-full border border-primary/20 bg-surface flex items-center justify-center gap-1.5 text-sm font-medium">
                                    <MaxIcon size={16} white /> MAX
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}

// ==========================================
// ПЛАВАЮЩИЙ ПЕРЕКЛЮЧАЮЩИЙСЯ ВИДЖЕТ МЕССЕНДЖЕРОВ В УГЛУ
// ==========================================
export function MessengerWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const icons = [
        { icon: <WhatsAppIcon size={24} />, color: '#25D366', name: 'WhatsApp', link: WA_URL },
        { icon: <Send size={22} />, color: '#0088cc', name: 'Telegram', link: TG_URL },
        { icon: <MaxIcon size={24} white />, color: '#534eef', name: 'MAX', link: MAX_URL },
    ];

    useEffect(() => {
        if (isOpen) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % icons.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isOpen, icons.length]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    return (
        <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[85] flex flex-col items-end gap-3">
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Мы на связи в мессенджерах"
                    className="bg-surface/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-primary/15 w-72"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-heading font-semibold text-lg text-primary">Мы на связи в мессенджерах</div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Закрыть окно мессенджеров"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:text-primary hover:bg-background transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {icons.map((item) => (
                            <a
                                key={item.name}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-background transition-all hover:translate-x-0.5"
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex-1 font-medium text-primary">{item.name}</div>
                                <ChevronRight size={18} className="text-primary/30" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Закрыть выбор мессенджера' : 'Написать в WhatsApp, Telegram или MAX'}
                aria-expanded={isOpen}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-90 relative overflow-hidden group"
                style={{
                    backgroundColor: icons[activeIndex].color,
                    boxShadow: `0 10px 28px ${icons[activeIndex].color}55`,
                }}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {icons.map((item, idx) => (
                        <div
                            key={item.name}
                            className={`absolute transition-all duration-500 transform text-white ${
                                idx === activeIndex && !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                        >
                            {item.icon}
                        </div>
                    ))}
                    {isOpen && (
                        <div className="text-white">
                            <X size={26} />
                        </div>
                    )}
                </div>
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
            </button>
        </div>
    );
}

// ==========================================
// ПОДВАЛ (без плашки «ПРИЕМ ЗАЯВОК: ОТКРЫТ»)
// ==========================================
export function Footer() {
    return (
        <footer className="w-full bg-[#0F0C0A] text-[#F5EFE5] border-t border-white/10 pt-10 pb-20 md:py-12 px-5 md:px-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
                <div className="md:col-span-5 flex flex-col gap-3">
                    <div className="font-heading font-semibold text-2xl">Лестницы в Краснодаре</div>
                    <p className="text-sm text-[#C2B6A8] max-w-sm m-0">
                        Изготовление и монтаж деревянных лестниц на заказ с 2001 года.
                    </p>
                    <div className="font-mono text-sm text-amber mt-1">
                        <a href={`tel:${PHONE_HREF}`} className="hover:underline">{PHONE}</a>
                    </div>
                    <div className="font-mono text-xs text-[#A99D8F]">Ежедневно с 09:00 до 20:00</div>
                    <div className="flex gap-3 mt-2">
                        <a
                            href={WA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="btn-magnetic w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-[#D6CCC0] hover:bg-[#25D366] hover:text-white hover:border-transparent"
                        >
                            <WhatsAppIcon size={18} />
                        </a>
                        <a
                            href={TG_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                            className="btn-magnetic w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-[#D6CCC0] hover:bg-[#0088cc] hover:text-white hover:border-transparent"
                        >
                            <Send size={17} />
                        </a>
                        <a
                            href={MAX_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="MAX"
                            className="btn-magnetic w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-[#D6CCC0] hover:bg-[#534eef] hover:text-white hover:border-transparent"
                        >
                            <MaxIcon size={18} white />
                        </a>
                    </div>
                </div>

                <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#C2B6A8]">
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
    const pageRef = useRef(null);
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

    // Плавные современные GSAP-анимации появления и лёгкого параллакса (с учётом prefers-reduced-motion)
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.from('.hero-elem', {
                y: 26,
                opacity: 0,
                duration: 0.8,
                stagger: 0.09,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
            });

            gsap.to('.hero-parallax-img', {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            gsap.utils.toArray('.reveal-section').forEach((sec) => {
                gsap.from(sec, {
                    y: 28,
                    opacity: 0,
                    duration: 0.75,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                    scrollTrigger: {
                        trigger: sec,
                        start: 'top 88%',
                        once: true,
                    },
                });
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

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

    const base = import.meta.env.BASE_URL;

    return (
        <div ref={pageRef} className="w-full min-h-screen bg-background text-textMain">
            <Navbar dark />
            <MobileNav dark />

            <main>
                {/* ПЕРВЫЙ ЭКРАН: фото веера ступеней плавно растворяется прямо в светлый фон #F5EFE6 */}
                <section className="hero-section relative bg-[#15110E] text-[#F5EFE5] overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-y-0 right-0 w-full lg:w-[76%] overflow-hidden">
                            <img
                                src={`${base}${HERO_PHOTO.src}`}
                                alt={HERO_PHOTO.alt}
                                width="985"
                                height="1000"
                                fetchPriority="high"
                                decoding="async"
                                className="hero-parallax-img w-full h-[108%] -top-[4%] relative object-cover object-center"
                            />
                        </div>

                        {/* Мягкое горизонтальное затемнение под текст слева без вертикального шва */}
                        <div
                            className="absolute inset-0 hidden lg:block"
                            style={{
                                background:
                                    'linear-gradient(90deg, rgba(21,17,14,1) 0%, rgba(21,17,14,1) 28%, rgba(21,17,14,0.95) 35%, rgba(21,17,14,0.82) 43%, rgba(21,17,14,0.60) 51%, rgba(21,17,14,0.36) 59%, rgba(21,17,14,0.16) 68%, rgba(21,17,14,0.05) 78%, rgba(21,17,14,0) 90%)',
                            }}
                        />
                        <div
                            className="absolute inset-0 lg:hidden"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(21,17,14,0.66) 0%, rgba(21,17,14,0.74) 45%, rgba(21,17,14,0.58) 76%, rgba(21,17,14,0.22) 100%)',
                            }}
                        />

                        {/* Бесшовное растворение нижней части фото и тёмного фона прямо в #F5EFE6 */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-52 md:h-64"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(245,239,230,0) 0%, rgba(245,239,230,0.015) 12%, rgba(245,239,230,0.055) 23%, rgba(245,239,230,0.125) 34%, rgba(245,239,230,0.225) 44%, rgba(245,239,230,0.355) 54%, rgba(245,239,230,0.505) 63%, rgba(245,239,230,0.655) 72%, rgba(245,239,230,0.79) 80%, rgba(245,239,230,0.895) 87%, rgba(245,239,230,0.965) 93%, rgba(245,239,230,1) 100%)',
                            }}
                        />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-12 pt-8 pb-6 md:pt-12 md:pb-8">
                        <div className="max-w-xl pb-10 md:pb-16">
                            <div className="hero-elem inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-amber mb-3.5">
                                <span className="w-6 h-[1px] bg-amber/70" />
                                {HERO_COPY.eyebrow}
                            </div>

                            <h1 className="hero-elem font-heading font-semibold text-[34px] sm:text-5xl lg:text-[58px] leading-[1.04] tracking-tight text-[#FAF6EE] mb-4">
                                <span>{HERO_COPY.h1Part1}</span>{' '}
                                <span>{HERO_COPY.h1Part2}</span>
                            </h1>

                            <p className="hero-elem text-[15.5px] sm:text-[17px] text-[#D4C9BC] leading-relaxed mb-6">
                                {HERO_COPY.sub}
                            </p>

                            <div className="hero-elem flex flex-wrap gap-3 mb-4">
                                <a
                                    href="#zayavka"
                                    className="btn-magnetic min-h-[48px] px-7 rounded-full bg-amber hover:bg-[#E7B276] text-[#16110D] font-semibold text-[15px] inline-flex items-center"
                                >
                                    {HERO_COPY.ctaPrimary}
                                </a>
                                <a
                                    href={WA_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-magnetic min-h-[48px] px-6 rounded-full border border-white/30 bg-white/5 hover:border-amber hover:text-amber text-[#F5EFE5] font-medium text-[15px] inline-flex items-center gap-2"
                                >
                                    <WhatsAppIcon size={18} />
                                    <span>{HERO_COPY.ctaSecondary}</span>
                                </a>
                            </div>

                            <p className="hero-elem text-[13.5px] text-[#C5B9AA] leading-relaxed m-0">
                                В Краснодаре замер бесплатный. Удобнее переписка - просто напишите в{' '}
                                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">WhatsApp</a>,{' '}
                                <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">Telegram</a>{' '}
                                или{' '}
                                <a href={MAX_URL} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-4">MAX</a>:
                                {' '}ответим на вопросы и подскажем, с чего начать. Если уже есть фото проёма или примерные размеры, можете приложить их для ориентира по цене.
                            </p>
                        </div>

                        {/* Полоса 4 фактов - мягкая скруглённая карточка-мост поверх растворённого фото */}
                        <div className="hero-elem bg-surface/95 backdrop-blur-xl rounded-3xl border border-primary/15 shadow-[0_18px_48px_rgba(21,17,14,0.10)] px-6 py-5 sm:px-8 sm:py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {HERO_COPY.facts.map((fact) => (
                                <div key={fact.val} className="transition-transform duration-300 hover:-translate-y-0.5">
                                    <div className="font-heading font-semibold text-[22px] sm:text-2xl text-accent leading-tight">
                                        {fact.val}
                                    </div>
                                    <div className="text-[13px] text-textMain/75 mt-0.5">{fact.desc}</div>
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

                {/* СВЕТЛЫЙ БЛОК 2: ПРИМЕРЫ РАБОТ И МАТЧЕР СИТУАЦИИ */}
                <WorksMatcher
                    works={galleryStairs}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    onAskSituation={handleAskSituation}
                />

                {/* СВЕТЛЫЙ КОНТРАСТНЫЙ БЛОК 3: МАСТЕР КОНСТАНТИН */}
                <section id="master" className="reveal-section w-full py-12 md:py-16 px-5 md:px-12 bg-[#EAE1D2] border-t border-primary/10 scroll-mt-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-surface border border-primary/15 rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(26,21,18,0.06)]">
                            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
                                <div className="flex flex-row md:flex-col items-center gap-4 shrink-0">
                                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[3px] border-accent/40 shadow-lg bg-[#2A221C] shrink-0 transition-transform duration-500 hover:scale-[1.03]">
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
                                    <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-1.5">
                                        03 · О мастере и условиях работы
                                    </div>
                                    <h2 className="font-heading font-semibold text-3xl sm:text-4xl text-primary leading-tight">
                                        {MASTER_COPY.h2}
                                    </h2>
                                    <p className="font-mono text-xs sm:text-[13px] text-textMain/65 mt-1.5 mb-5">
                                        {MASTER_COPY.sub}
                                    </p>

                                    <blockquote className="font-heading text-xl sm:text-[22px] text-primary leading-[1.4] m-0 mb-6 space-y-3 border-l-[3px] border-accent pl-5">
                                        {MASTER_COPY.quote.map((p) => (
                                            <p key={p} className="m-0">«{p}»</p>
                                        ))}
                                    </blockquote>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-primary/15">
                                        {MASTER_COPY.terms.map((t) => (
                                            <div key={t.title} className="card-lift bg-background rounded-2xl p-4 sm:p-5 border border-primary/10 hover:border-accent/40">
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

                {/* СВЕТЛЫЙ БЛОК 4: 4 ЭТАПА РАБОТЫ */}
                <section id="stages" className="reveal-section w-full py-12 md:py-16 px-5 md:px-12 bg-background border-t border-primary/10 scroll-mt-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-7">
                            <div>
                                <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-1.5">
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
                                    className="group card-lift bg-surface rounded-3xl border border-primary/15 hover:border-accent/50 p-6 flex flex-col justify-between gap-4"
                                >
                                    <div>
                                        <span className="inline-block font-mono text-xs text-accent font-medium bg-accent/10 px-3 py-1 rounded-full">
                                            {st.num}
                                        </span>
                                        <h3 className="font-heading font-semibold text-2xl text-primary mt-3 mb-2 group-hover:text-accent transition-colors">
                                            {st.title}
                                        </h3>
                                        <p className="text-sm text-textMain/75 m-0 leading-relaxed">{st.text}</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent">
                                        Подробнее <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* СВЕТЛЫЙ БЛОК 5: ЧАСТЫЕ ВОПРОСЫ */}
                <section id="faq" className="reveal-section w-full py-12 md:py-16 px-5 md:px-12 bg-background border-t border-primary/10 scroll-mt-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-1.5">
                            05 · Ответы до звонка
                        </div>
                        <h2 className="font-heading font-semibold text-4xl text-primary mb-6">
                            Частые вопросы
                        </h2>

                        <div className="flex flex-col gap-3">
                            {HOME_FAQ.map((item, idx) => (
                                <details
                                    key={item.q}
                                    open={idx === 0}
                                    className="group bg-surface rounded-2xl border border-primary/15 hover:border-accent/40 hover:shadow-md transition-all duration-300 px-5 sm:px-6 py-4"
                                >
                                    <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-semibold text-[16.5px] text-primary">
                                        <span>{item.q}</span>
                                        <span className="w-8 h-8 rounded-full bg-background text-accent flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45">
                                            <Plus size={18} />
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-[15px] text-textMain/75 leading-relaxed max-w-3xl m-0">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ТЁМНЫЙ ФИНАЛЬНЫЙ БЛОК: СКРУГЛЁННАЯ АРХИТЕКТУРНАЯ ПАНЕЛЬ НА СТЫКЕ СВЕТЛОГО ПОЛОТНА И ПОДВАЛА */}
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

            {/* Сквозная папка замера */}
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
