import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Send, ChevronLeft, ChevronRight, Menu, X, ChevronDown } from 'lucide-react';
import { LANDINGS, STAGES } from './content/landings.js';
import LeadForm from './LeadForm.jsx';
import WorksGrid from './WorksGrid.jsx';
import { LEADS_ACCESS_KEY } from './content/forms.js';


gsap.registerPlugin(ScrollTrigger);

// ==========================================
// SVG ICONS - WhatsApp & Max
// ==========================================
function WhatsAppIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function MaxIcon({ size = 20, white = false }) {
    // Official Max Messenger logo (successor to VK Messenger)
    return (
        <svg width={size} height={size} viewBox="0 0 1000 1000" fill="none">
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
                fill={white ? "currentColor" : "#fff"}
                fillRule="evenodd"
                d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"
            />
        </svg>
    );
}



// ==========================================
// A. NAVBAR - "The Floating Island"
// ==========================================
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="hidden md:block">
            {/* Placeholder to reserve space and push Hero down */}
            <div className="h-20 md:h-24 w-full bg-background relative z-40 border-b border-primary/5"></div>

            <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'top-4 md:top-6 pointer-events-none' : 'top-0 pointer-events-auto bg-background'}`}>
                <nav className={`flex items-center transition-all duration-500 pointer-events-auto ${scrolled
                    ? 'gap-4 md:gap-8 rounded-full px-5 md:px-6 py-3 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border border-primary/10 w-fit'
                    : 'w-full max-w-7xl justify-between px-6 md:px-16 h-20 md:h-24 mx-auto'
                    }`}>
                    <a href="/" className="font-heading font-bold text-xl md:text-2xl tracking-tight whitespace-nowrap">Лестницы в Краснодаре</a>

                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
                        <div className="relative group/menu">
                            <button type="button" className="link-hover flex items-center gap-1">
                                Услуги <ChevronDown size={15} />
                            </button>
                            <div className="absolute left-0 top-full pt-3 hidden group-hover/menu:block group-focus-within/menu:block">
                                <div className="bg-white rounded-2xl shadow-xl border border-primary/10 py-2 w-72">
                                    {LANDINGS.map((page) => (
                                        <a key={page.slug} href={`/${page.slug}/`} className="block px-5 py-2.5 text-sm hover:bg-primary/5 hover:text-accent transition-colors">
                                            {page.h1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <a href="/#features" className="link-hover">Преимущества</a>
                        <a href="/#philosophy" className="link-hover">Подход</a>
                        <a href="/#works" className="link-hover">Наши работы</a>
                        <a href="/#protocol" className="link-hover">Этапы работы</a>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <div className={`flex items-center gap-3 md:gap-4 transition-all duration-500 ${scrolled ? 'border-l border-primary/20 pl-3 md:pl-4' : ''}`}>
                            <a href="https://wa.me/79892145276" target="_blank" rel="noopener noreferrer" className="link-hover text-primary hover:text-[#25D366] transition-colors"><WhatsAppIcon size={20} /></a>
                            <a href="https://t.me/+79892145276" target="_blank" rel="noopener noreferrer" className="link-hover text-primary hover:text-[#0088cc] transition-colors"><Send size={20} /></a>
                            <a href="https://max.ru/u/f9LHodD0cOIzDFxgFXUu4MXhGljFSdn3ksgeaCL8ogOH3AwHzQOGU1qDOfo" target="_blank" rel="noopener noreferrer" className="link-hover text-primary hover:text-[#534eef] transition-colors"><MaxIcon size={20} white /></a>
                        </div>

                        <a href="tel:+79892145276" className="hidden md:flex btn-magnetic items-center gap-2 bg-primary text-background px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-primary/20 transition-all whitespace-nowrap min-w-fit">
                            <Phone size={18} />
                            <span>+7 (989) 214-52-76</span>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    );
}


// ==========================================
// МОБИЛЬНАЯ ШАПКА
// Раньше навигации на телефоне не было вообще: десктопная шапка помечена
// hidden md:block. При этом телефоны дают две трети трафика, а с
// появлением внутренних страниц уйти с них стало некуда.
// ==========================================
export function MobileNav() {
    const [open, setOpen] = useState(false);

    // Пока меню открыто, страница под ним не должна прокручиваться.
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const sections = [
        { href: '/#features', label: 'Преимущества' },
        { href: '/#philosophy', label: 'Подход' },
        { href: '/#works', label: 'Наши работы' },
        { href: '/#protocol', label: 'Этапы работы' },
    ];

    return (
        <div className="md:hidden">
            <div className="h-20 w-full bg-background border-b border-primary/10 sticky top-0 z-50 flex items-center justify-between px-5">
                <a href="/" className="font-heading font-bold text-lg tracking-tight">Лестницы в Краснодаре</a>
                <div className="flex items-center gap-2">
                    <a
                        href="tel:+79892145276"
                        aria-label="Позвонить"
                        className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center"
                    >
                        <Phone size={20} />
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Открыть меню"
                        aria-expanded={open}
                        className="w-11 h-11 rounded-full border border-primary/20 text-primary flex items-center justify-center"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-[110] bg-background overflow-y-auto">
                    <div className="h-20 flex items-center justify-between px-5 border-b border-primary/10">
                        <span className="font-heading font-bold text-lg">Меню</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Закрыть меню"
                            className="w-11 h-11 rounded-full border border-primary/20 text-primary flex items-center justify-center"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <nav className="px-5 py-6 flex flex-col gap-8 pb-24">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-textMain/40 mb-2">Услуги</span>
                            {LANDINGS.map((page) => (
                                <a
                                    key={page.slug}
                                    href={`/${page.slug}/`}
                                    onClick={() => setOpen(false)}
                                    className="py-3 border-b border-primary/5 font-medium text-primary"
                                >
                                    {page.h1}
                                </a>
                            ))}
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-textMain/40 mb-2">О нас</span>
                            {sections.map((s) => (
                                <a
                                    key={s.href}
                                    href={s.href}
                                    onClick={() => setOpen(false)}
                                    className="py-3 border-b border-primary/5 text-textMain/80"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-xs uppercase tracking-widest text-textMain/40">Связаться</span>
                            <a href="tel:+79892145276" className="flex items-center gap-3 bg-accent text-white px-6 py-4 rounded-full font-bold justify-center">
                                <Phone size={20} />
                                <span>+7 (989) 214-52-76</span>
                            </a>
                            <div className="flex gap-3">
                                <a href="https://wa.me/79892145276" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex-1 h-14 rounded-2xl border border-primary/15 flex items-center justify-center text-[#25D366]"><WhatsAppIcon size={26} /></a>
                                <a href="https://t.me/+79892145276" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex-1 h-14 rounded-2xl border border-primary/15 flex items-center justify-center text-[#0088cc]"><Send size={26} /></a>
                                <a href="https://max.ru/u/f9LHodD0cOIzDFxgFXUu4MXhGljFSdn3ksgeaCL8ogOH3AwHzQOGU1qDOfo" target="_blank" rel="noopener noreferrer" aria-label="Max" className="flex-1 h-14 rounded-2xl border border-primary/15 flex items-center justify-center text-[#534eef]"><MaxIcon size={26} white /></a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}

// ==========================================
// B. HERO SECTION - "The Opening Shot"
// ==========================================
function Hero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-elem', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative w-full h-[calc(100dvh-5rem)] md:h-[calc(100dvh-6rem)] flex items-end pb-12 md:pb-24 px-6 md:px-16 overflow-hidden mt-[-1px] bg-black">
            {/* Background Image - Final User Choice */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={`${import.meta.env.BASE_URL}hero-stairs-final.webp`}
                    srcSet={`${import.meta.env.BASE_URL}hero-stairs-final-1200.webp 1200w, ${import.meta.env.BASE_URL}hero-stairs-final.webp 1971w`}
                    sizes="100vw"
                    alt="Деревянная лестница на второй этаж, изготовленная на заказ в Краснодаре"
                    width="1971"
                    height="1465"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-[110%] object-cover object-[center_bottom] transition-opacity duration-1000 hero-img"
                    onLoad={(e) => e.target.style.opacity = 1}
                    style={{ opacity: 0 }}
                />

                {/* Visual Polish Overlays */}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>

                {/* Smooth Fade to Next Section at the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-4xl text-left">
                <h1 className="flex flex-col gap-2">
                    <span className="hero-elem font-heading font-extrabold text-4xl md:text-6xl text-white uppercase tracking-wide leading-tight text-shadow-subtle">
                        ИЗГОТОВЛЕНИЕ ЛЕСТНИЦ
                    </span>
                    <span className="hero-elem font-heading font-extrabold text-5xl md:text-7xl text-accent uppercase leading-[0.95] text-shadow-subtle">
                        НА ЗАКАЗ В КРАСНОДАРЕ
                    </span>
                </h1>

                <div className="hero-elem flex items-center gap-3 mt-4 text-accent font-mono text-sm uppercase tracking-[0.2em] font-bold">
                    <div className="w-8 h-[1px] bg-accent" />
                    Более 25 лет на рынке
                </div>

                <p className="hero-elem mt-6 text-xl md:text-2xl text-white/90 font-sans max-w-2xl font-medium text-shadow-subtle">
                    Создаем уникальные лестницы любой сложности напрямую от мастера в Краснодаре: на бетонное основание, на металлоконструкцию, на косоурах.
                </p>

                <div className="hero-elem mt-12">
                    <a href="tel:+79892145276" className="btn-magnetic inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-accent/20">
                        <Phone size={24} />
                        Связаться с нами: +7 (989) 214-52-76
                    </a>
                </div>
            </div>
        </section >
    );
}

// ==========================================
// C. FEATURES - Simple Icon Cards
// ==========================================
function Features() {
    const features = [
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 010-3L12 9" /><path d="M17.64 15L22 10.64" /><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 00-3.94-1.64H9l.92.82A6.18 6.18 0 0112 8.4v1.56l2 2h2.47l2.26 1.91" /></svg>,
            title: 'Своё производство',
            desc: 'Полный цикл: от отбора древесины до финишного покрытия. Без посредников и наценок.'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4" /><path d="M13 7 8.7 2.7a2.41 2.41 0 00-3.4 0L2.7 5.3a2.41 2.41 0 000 3.4L7 13" /><path d="m8 6 2-2" /><path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 00-4-4L3.5 16.5Z" /><path d="m18 16 2-2" /><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17" /></svg>,
            title: 'Любая сложность',
            desc: 'Выполняем сложные конструкции: маршевые, винтовые, с забежными ступенями. Работаем с породами любой твердости.'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>,
            title: 'Гарантия качества',
            desc: 'Отбор древесины лично. Контроль на каждом этапе от заготовки до финишного покрытия.'
        }
    ];

    return (
        <section id="features" className="w-full py-32 px-8 md:px-16 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-heading font-bold text-4xl text-primary">Преимущества работы</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card bg-white rounded-[2rem] p-10 shadow-sm border border-primary/10 flex flex-col gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                                {f.icon}
                            </div>
                            <h3 className="font-heading font-bold text-2xl text-primary">{f.title}</h3>
                            <p className="text-textMain/70 font-sans text-base leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// D. PHILOSOPHY - "The Manifesto"
// ==========================================
function Philosophy() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.phil-line', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            gsap.to('.phil-bg', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: 100
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="philosophy" className="relative w-full py-40 px-8 md:px-16 bg-primary text-background overflow-hidden rounded-[3rem] my-4 mx-2 md:mx-4" style={{ width: 'calc(100% - 1rem)' }}>
            {/* Background - Wood texture */}
            <img
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&auto=format&fit=crop&q=60"
                alt="Мастерская"
                className="phil-bg absolute inset-0 w-full h-[150%] object-cover opacity-15 mix-blend-overlay -top-[25%]"
            />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-12">
                <p className="phil-line font-sans text-xl md:text-3xl text-background/60 max-w-2xl font-medium tracking-tight">
                    Большинство подрядчиков полагаются на типовые проекты и наемные бригады без должной квалификации.
                </p>

                <h2 className="phil-line font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white">
                    Мы делаем ставку{' '}
                    <span className="text-accent tracking-tighter">на личное мастерство</span>
                </h2>
            </div>
        </section>
    );
}

// ==========================================
// E. PROTOCOL - "Sticky Stacking Archive"
// ==========================================
function Protocol() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.prot-card');

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                // Card remains 100% sharp until the NEXT card covers a significant portion (60%)
                // We shift the start point to 'top 60%' as requested
                gsap.to(card, {
                    scale: 0.95,
                    opacity: 1, // Keep fully opaque
                    filter: "blur(0px)", // No blur
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 10%',
                        end: () => `+=${card.offsetHeight}`,
                        scrub: true,
                    }
                });

            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const steps = [
        {
            num: '01',
            title: 'Замер и расчёт',
            desc: 'Вы можете прислать свои размеры для дистанционного расчёта, или мы приедем на замер лично.',
            renderSvg: () => (
                <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-accent" stroke="currentColor" fill="none" strokeWidth="1.5">
                    <rect x="10" y="45" width="80" height="10" rx="1" />
                    <path d="M20 45 L20 50 M30 45 L30 55 M40 45 L40 50 M50 45 L50 55 M60 45 L60 50 M70 45 L70 55 M80 45 L80 50" />
                    <path d="M50 10 L50 90" strokeDasharray="4 4" className="text-primary opacity-30" />
                </svg>
            )
        },
        {
            num: '02',
            title: 'Согласование проекта',
            desc: 'Выбор породы дерева, формы ступеней. Работаем также по вашим проектам и чертежам. Подбор решения под ваш бюджет.',
            renderSvg: () => (
                <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary" stroke="currentColor" fill="none" strokeWidth="1.5">
                    <path d="M20 30 L80 30 L80 70 L20 70 Z" />
                    <path d="M20 50 L80 50 M50 30 L50 70" strokeOpacity="0.3" />
                    <path d="M30 40 L40 40 M30 60 L40 60 M60 40 L70 40" />
                    <circle cx="20" cy="30" r="2" fill="currentColor" />
                    <circle cx="80" cy="30" r="2" fill="currentColor" />
                </svg>
            )
        },
        {
            num: '03',
            title: 'Изготовление в мастерской',
            desc: 'Мы изготовим и покрасим Вашу будущую лестницу на нашем производстве в согласованный срок. Перед покраской делаем образцы цвета (выкрасы) на утверждение.',
            renderSvg: () => (
                <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-accent" stroke="currentColor" fill="none" strokeWidth="1.5">
                    <path d="M20 80 L80 80 M30 65 L80 65 M40 50 L80 50 M50 35 L80 35" strokeLinecap="round" />
                    <path d="M20 80 L20 65 L40 65 L40 50 L60 50 L60 35 L80 35" strokeWidth="1" strokeOpacity="0.4" />
                </svg>
            )
        },
        {
            num: '04',
            title: 'Монтаж от 7 дней',
            desc: 'Аккуратная сборка конструкции на объекте.',
            renderSvg: () => (
                <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary" stroke="currentColor" fill="none" strokeWidth="1.5">
                    <path d="M20 80 L40 80 L40 60 L60 60 L60 40 L80 40 L80 20" />
                    <path d="M35 15 L25 25 M30 20 L40 30" stroke="currentColor" />
                    <rect x="25" y="15" width="15" height="15" transform="rotate(45 32.5 22.5)" />
                </svg>
            )
        }
    ];

    return (
        <section ref={containerRef} id="protocol" className="w-full py-24 bg-background px-8 md:px-16" style={{ minHeight: '300dvh' }}>
            <div className="max-w-5xl mx-auto flex flex-col gap-16">
                <h2 className="font-heading font-bold text-4xl text-primary text-center mb-16">Этапы работы</h2>

                {steps.map((step, idx) => (
                    <a
                        key={idx}
                        href={STAGES[idx] ? `/${STAGES[idx].slug}/` : '#protocol'}
                        className="prot-card group sticky top-[15vh] w-full h-[70vh] bg-white rounded-[3rem] border border-primary/10 hover:border-accent/40 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center shadow-xl shadow-black/5 transition-colors"
                    >
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="font-mono text-xl text-accent font-bold mb-6">ЭТАП {step.num}</div>
                            <h3 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-6 group-hover:text-accent transition-colors">{step.title}</h3>
                            <p className="font-sans text-xl text-textMain/70 max-w-md">{step.desc}</p>
                            <span className="mt-6 text-accent font-medium">Подробнее об этапе</span>
                        </div>
                        <div className="w-full md:w-[40%] aspect-square rounded-[3rem] border border-primary/5 flex items-center justify-center relative overflow-hidden bg-background/50">
                            {/* Visual decor for steps */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                                <div className="w-[150%] h-[150%] border border-primary/20 rounded-full animate-[spin_30s_linear_infinite]" />
                            </div>
                            <div className="relative w-full h-full flex items-center justify-center">
                                {step.renderSvg()}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

// ==========================================
// F. OUR WORKS - "The Portfolio Grid"
// ==========================================
function OurWorks() {
    const [publications, setPublications] = useState({ stairs: [], other: [] });

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}gallery.json`)
            .then((r) => r.json())
            .then(setPublications)
            .catch(() => setPublications({ stairs: [], other: [] }));
    }, []);

    return (
        <>
            <WorksGrid
                id="works"
                items={publications.stairs}
                title="Наши работы"
                subtitle="За двадцать пять лет работы за плечами сотни объектов - здесь часть из них. Каждая лестница делалась под своё помещение и свои пожелания."
            />
            <WorksGrid
                items={publications.other}
                title="Прочие столярные работы"
                subtitle="Берёмся и за другие проекты из натуральной древесины: беседки, ограждения, арки и мебель из массива."
            />
        </>
    );
}

export function Footer() {
    return (
        <footer className="w-full bg-[#1A1A1A] text-white rounded-t-[4rem] mt-24 pt-20 pb-12 px-8 md:px-16 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 relative z-10">
                <div className="flex-1">
                    <h2 className="font-heading font-bold text-3xl mb-4">Лестницы в Краснодаре</h2>
                    <p className="text-white/60 font-sans max-w-sm mb-12">
                        Создание надёжных лестниц любой сложности напрямую от мастера для частных домов.
                    </p>

                    <div className="flex items-center gap-4 border border-white/10 w-fit px-4 py-2 rounded-full mb-8">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-mono text-xs text-white/50 tracking-wider">ПРИЕМ ЗАЯВОК: ОТКРЫТ</span>
                    </div>
                </div>

                <div className="flex flex-col gap-8 md:w-1/3">
                    <div>
                        <div className="text-white/40 font-mono text-xs mb-4">КОНСУЛЬТАЦИЯ И ЗАКАЗ</div>
                        <a href="tel:+79892145276" className="link-hover text-3xl md:text-5xl font-heading font-bold tracking-tighter text-accent block hover:text-white transition-colors">
                            +7 (989) 214-52-76
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://wa.me/79892145276" target="_blank" rel="noopener noreferrer" className="btn-magnetic w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-colors">
                            <WhatsAppIcon size={20} />
                        </a>
                        <a href="https://t.me/+79892145276" target="_blank" rel="noopener noreferrer" className="btn-magnetic w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#0088cc] hover:border-transparent transition-colors">
                            <Send size={20} />
                        </a>
                        <a href="https://max.ru/u/f9LHodD0cOIzDFxgFXUu4MXhGljFSdn3ksgeaCL8ogOH3AwHzQOGU1qDOfo" target="_blank" rel="noopener noreferrer" className="btn-magnetic w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#534eef] hover:border-transparent transition-colors">
                            <MaxIcon size={20} white />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/30 font-mono">
                <div>© {new Date().getFullYear()} Лестницы в Краснодаре</div>
                <div>Мастерская ручной работы</div>
            </div>
        </footer>
    );
}

// ==========================================
// H. MESSENGER WIDGET
// ==========================================
export function MessengerWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const icons = [
        { icon: <WhatsAppIcon size={24} />, color: '#25D366', name: 'WhatsApp', link: 'https://wa.me/79892145276' },
        { icon: <Send size={24} />, color: '#0088cc', name: 'Telegram', link: 'https://t.me/+79892145276' },
        { icon: <MaxIcon size={24} white />, color: '#534eef', name: 'Max', link: 'https://max.ru/u/f9LHodD0cOIzDFxgFXUu4MXhGljFSdn3ksgeaCL8ogOH3AwHzQOGU1qDOfo' }
    ];

    useEffect(() => {
        if (isOpen) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % icons.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            {/* Widget Menu */}
            {isOpen && (
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-primary/10 mb-2 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="font-heading font-bold text-lg text-primary">Мы на связи в мессенджерах</div>
                        <button onClick={() => setIsOpen(false)} className="text-primary/40 hover:text-primary transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {icons.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link || '#'}
                                target={item.link ? "_blank" : undefined}
                                rel={item.link ? "noopener noreferrer" : undefined}
                                onClick={(e) => !item.link && e.preventDefault()}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${item.link ? 'hover:bg-primary/5 active:scale-95' : 'opacity-50 cursor-not-allowed bg-black/5'}`}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 font-medium text-primary">{item.name}</div>
                                {item.link && <ChevronRight size={18} className="text-primary/20" />}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 relative overflow-hidden group"
                style={{
                    backgroundColor: icons[activeIndex].color,
                    boxShadow: `0 10px 30px ${icons[activeIndex].color}40`
                }}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {icons.map((item, idx) => (
                        <div
                            key={idx}
                            className={`absolute transition-all duration-500 transform ${idx === activeIndex && !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                } text-white`}
                        >
                            {item.icon}
                        </div>
                    ))}
                    {isOpen && (
                        <div className="text-white animate-in zoom-in duration-300">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </div>
                    )}
                </div>
                {/* Ripple effect */}
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
            </button>
        </div>
    );
}


// ==========================================
// УСЛУГИ - ссылки на посадочные страницы.
// Без них страницы остаются сиротами: поиск их не обойдёт,
// а посетитель не узнает, что мы делаем не только лестницы.
// ==========================================
function Services() {
    return (
        <section id="services" className="w-full py-24 px-8 md:px-16 bg-background">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <h2 className="font-heading font-bold text-4xl text-primary">Что мы делаем</h2>
                    <p className="text-textMain/60 max-w-xl">
                        Конструкции, породы дерева и смежные работы - подробно о каждом направлении.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LANDINGS.map((page) => (
                        <a
                            key={page.slug}
                            href={`/${page.slug}/`}
                            className="group flex flex-col gap-2 p-6 rounded-2xl border border-primary/10 bg-white/40 hover:border-accent/40 hover:shadow-lg transition-all"
                        >
                            <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors">
                                {page.h1}
                            </h3>
                            <p className="text-sm text-textMain/70 leading-relaxed">{page.lead}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <MobileNav />
            <Hero />
            <Features />
            <Philosophy />
            <OurWorks />
            <Services />
            <Protocol />
            <LeadForm accessKey={LEADS_ACCESS_KEY} source="Главная страница" />
            <Footer />
            <MessengerWidget />

        </div>
    )
}

export default App;
