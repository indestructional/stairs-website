import React, { useEffect, useRef, useState } from 'react';
import { Phone, Check } from 'lucide-react';
import { PHONE, PHONE_HREF, CITY } from './content/landings.js';

const METRIKA_ID = 108209687;
const MAX_LINK = 'https://max.ru/u/f9LHodD0cOIzDFxgFXUu4MXhGljFSdn3ksgeaCL8ogOH3AwHzQOGU1qDOfo';

/**
 * Форма заявки.
 * Отправка идёт обычной формой в скрытый iframe (единственный стабильный
 * способ без своего сервера для web3forms) + цель Яндекс.Метрики `zayavka`.
 */
export default function LeadForm({
    accessKey,
    source = 'сайт',
    variant = 'light',
    prefillComment = '',
    prefillType = '',
}) {
    const [state, setState] = useState('idle');
    const [sent, setSent] = useState({});
    const [copied, setCopied] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [comment, setComment] = useState(prefillComment);
    const [nuzhno, setNuzhno] = useState(prefillType || 'Лестница на второй этаж');
    const frameRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (prefillComment) setComment(prefillComment);
    }, [prefillComment]);

    useEffect(() => {
        if (prefillType) setNuzhno(prefillType);
    }, [prefillType]);

    useEffect(() => () => clearInterval(timerRef.current), []);

    const submit = (event) => {
        event.preventDefault();
        if (state === 'sending') return;

        const form = event.currentTarget;
        const name = form.elements.name.value.trim();
        const phone = form.elements.phone.value.trim();
        if (!name || !phone) return;

        setState('sending');
        setSent({ name, nuzhno, comment: comment.trim() });

        const post = document.createElement('form');
        post.action = 'https://api.web3forms.com/submit';
        post.method = 'POST';
        post.target = 'lead-sink';
        post.style.display = 'none';
        const add = (key, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            post.appendChild(input);
        };
        add('access_key', accessKey);
        add('subject', `Заявка с сайта: ${name}`);
        add('from_name', 'Сайт лестниц');
        add('name', name);
        add('phone', phone);
        add('nuzhno', nuzhno);
        add('comment', comment.trim());
        add('otkuda', source);
        add('redirect', `${location.origin}/zayavka-prinyata.html`);
        document.body.appendChild(post);
        post.submit();

        let tries = 0;
        timerRef.current = setInterval(() => {
            tries += 1;
            let href = null;
            try { href = frameRef.current?.contentWindow.location.href; } catch { /* ещё у сервиса */ }
            if (href && href.includes('zayavka-prinyata')) {
                clearInterval(timerRef.current);
                post.remove();
                setState('done');
                window.ym?.(METRIKA_ID, 'reachGoal', 'zayavka');
            } else if (tries > 30) {
                clearInterval(timerRef.current);
                post.remove();
                setState('error');
            }
        }, 500);
    };

    const messageText = () => (sent.name
        ? `Здравствуйте! Меня зовут ${sent.name}. Оставил заявку на сайте: ${sent.nuzhno}.${sent.comment ? ' ' + sent.comment : ''}`
        : 'Здравствуйте! Хочу узнать про изготовление лестницы.');

    const whatsappHref = () => `https://wa.me/79892145276?text=${encodeURIComponent(messageText())}`;

    const openMax = async () => {
        try {
            await navigator.clipboard.writeText(messageText());
            setCopied(true);
        } catch {
            // Буфер недоступен - просто открываем чат.
        }
    };

    const isDark = variant === 'dark';

    if (state === 'done') {
        return (
            <section id="zayavka" className={`w-full px-5 md:px-12 py-16 ${isDark ? 'bg-[#0F0C0A] text-[#F5EFE5]' : 'bg-background'}`}>
                <div className="max-w-3xl mx-auto bg-primary text-[#F5EFE5] border border-white/15 rounded-[2rem] px-7 py-10 flex flex-col gap-5 items-start shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-amber text-[#16110D] flex items-center justify-center">
                        <Check size={26} />
                    </div>
                    <h2 className="font-heading font-semibold text-3xl text-[#F5EFE5]">Заявка принята</h2>
                    <p className="text-[#C8BEB0] max-w-xl m-0">
                        Перезвоним с 09:00 до 20:00 и договоримся о замере. Если удобнее переписка, напишите сразу в WhatsApp или MAX.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={whatsappHref()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-magnetic min-h-[46px] px-6 rounded-full bg-amber text-[#16110D] font-semibold inline-flex items-center"
                        >
                            Продолжить в WhatsApp
                        </a>
                        <a
                            href={MAX_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={openMax}
                            className="btn-magnetic min-h-[46px] px-6 rounded-full border border-white/30 text-[#F5EFE5] font-semibold inline-flex items-center"
                        >
                            Продолжить в MAX
                        </a>
                        <a
                            href={`tel:${PHONE_HREF}`}
                            className="btn-magnetic min-h-[46px] px-6 rounded-full border border-white/20 text-[#C8BEB0] inline-flex items-center gap-2"
                        >
                            <Phone size={18} />
                            <span>{PHONE}</span>
                        </a>
                    </div>
                    {copied && (
                        <p className="text-sm text-[#C8BEB0] m-0">
                            Текст обращения скопирован - вставьте его в чат MAX.
                        </p>
                    )}
                </div>
            </section>
        );
    }

    const inputCls = isDark
        ? 'w-full rounded-xl border border-white/15 bg-[#15110E] text-[#F5EFE5] placeholder:text-[#8E8377] px-4 py-3 text-[15px] transition-colors focus:outline-none focus:border-amber'
        : 'w-full rounded-xl border border-primary/20 bg-white text-primary placeholder:text-textMain/45 px-4 py-3 text-[15px] transition-colors focus:outline-none focus:border-accent';

    const labelCls = isDark ? 'text-[13px] text-[#C8BEB0]' : 'text-[13px] text-textMain/70';

    const formBody = (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                    <span className={labelCls}>Ваше имя</span>
                    <input
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Например, Алексей"
                        className={inputCls}
                    />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className={labelCls}>Телефон</span>
                    <input
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+7 (9__) ___-__-__"
                        className={inputCls}
                    />
                </label>
            </div>

            <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Что нужно</span>
                <select
                    name="nuzhno"
                    value={nuzhno}
                    onChange={(e) => setNuzhno(e.target.value)}
                    className={inputCls}
                >
                    <option>Лестница на второй этаж</option>
                    <option>Отделка бетонной лестницы</option>
                    <option>Ступени на металлокаркас</option>
                    <option>Перила и ограждения</option>
                    <option>Беседка, терраса или столярка</option>
                    <option>Пока не решил</option>
                </select>
            </label>

            <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Комментарий (высота этажа, город, пожелания)</span>
                <textarea
                    name="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: высота от пола до пола 2,9 м, Краснодар, интересует ясень"
                    className={`${inputCls} resize-y`}
                />
            </label>

            <label className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#C8BEB0]' : 'text-textMain/70'}`}>
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="mt-1 accent-[#9A4A1C]"
                />
                <span>
                    Согласен на обработку персональных данных в соответствии с{' '}
                    <a
                        href="/privacy/"
                        className={`underline underline-offset-4 ${isDark ? 'text-amber' : 'text-accent'}`}
                    >
                        политикой конфиденциальности
                    </a>
                </span>
            </label>

            <button
                type="submit"
                disabled={state === 'sending' || !agreed}
                className={`btn-magnetic min-h-[48px] px-8 rounded-full font-semibold text-[15px] self-start disabled:opacity-50 ${
                    isDark
                        ? 'bg-amber hover:bg-[#E7B276] text-[#16110D]'
                        : 'bg-accent hover:bg-[#7D3A14] text-white'
                }`}
            >
                {state === 'sending' ? 'Отправляем...' : 'Записаться на замер'}
            </button>

            {state === 'error' && (
                <p className={`text-sm m-0 ${isDark ? 'text-amber' : 'text-accent'}`}>
                    Не получилось отправить. Позвоните по номеру{' '}
                    <a href={`tel:${PHONE_HREF}`} className="font-semibold underline">{PHONE}</a>{' '}
                    или напишите в WhatsApp - так точно дойдёт.
                </p>
            )}

            <iframe ref={frameRef} name="lead-sink" title="Отправка заявки" style={{ display: 'none' }} />
        </form>
    );

    if (isDark) {
        return (
            <section id="zayavka" className="reveal-section relative w-full px-4 md:px-10 pt-2 pb-12 md:pb-16 scroll-mt-24">
                {/* Верхняя часть фона - светлый #F5EFE6, нижняя - тёмный подвал #0F0C0A */}
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 md:h-36 bg-background" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-28 md:top-36 bg-[#0F0C0A]" />

                <div className="relative z-10 max-w-7xl mx-auto bg-[#18130F] text-[#F5EFE5] border border-white/15 rounded-[2rem] shadow-[0_24px_64px_rgba(21,17,14,0.24)] p-6 sm:p-10 lg:p-14 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-5">
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-amber mb-3">
                            06 · Замер и расчёт
                        </div>
                        <h2 className="font-heading font-semibold text-4xl md:text-5xl text-[#F5EFE5] leading-[1.08] mb-5">
                            Записаться на замер или задать вопрос
                        </h2>
                        <p className="text-[#C8BEB0] text-base leading-relaxed mb-7">
                            Оставьте телефон - перезвоним с 09:00 до 20:00, ответим на вопросы и договоримся о замере.
                            Если удобнее переписка, просто напишите в мессенджер: фото проёма или размеры присылать
                            не обязательно, но по ним сможем сразу прикинуть порядок цены.
                        </p>
                        <div className="font-heading text-3xl sm:text-4xl font-semibold text-amber">
                            <a href={`tel:${PHONE_HREF}`} className="hover:underline">{PHONE}</a>
                        </div>
                        <div className="font-mono text-xs text-[#C8BEB0] mt-2 mb-6">
                            Ежедневно с 09:00 до 20:00 · {CITY} и край
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <a
                                href="https://wa.me/79892145276"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-magnetic min-h-[44px] px-5 rounded-full border border-white/25 hover:border-amber hover:text-amber text-sm font-medium inline-flex items-center"
                            >
                                WhatsApp
                            </a>
                            <a
                                href="https://t.me/+79892145276"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-magnetic min-h-[44px] px-5 rounded-full border border-white/25 hover:border-amber hover:text-amber text-sm font-medium inline-flex items-center"
                            >
                                Telegram
                            </a>
                            <a
                                href={MAX_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-magnetic min-h-[44px] px-5 rounded-full border border-white/25 hover:border-amber hover:text-amber text-sm font-medium inline-flex items-center"
                            >
                                MAX
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-[#211B16] border border-white/15 rounded-3xl p-6 sm:p-8">
                        {formBody}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="zayavka" className="w-full px-5 md:px-12 py-12 scroll-mt-24">
            <div className="max-w-3xl mx-auto bg-surface border border-primary/15 rounded-[2rem] px-6 md:px-10 py-10 shadow-sm">
                <h2 className="font-heading font-semibold text-3xl text-primary mb-3">
                    Записаться на замер или задать вопрос
                </h2>
                <p className="text-textMain/75 mb-7 max-w-xl">
                    Перезвоним с 09:00 до 20:00 и договоримся о времени. Замер бесплатный в черте {CITY}а.
                    Если удобнее написать -{' '}
                    <a href="https://wa.me/79892145276" target="_blank" rel="noopener noreferrer" className="text-accent font-medium underline underline-offset-4">WhatsApp</a>,{' '}
                    <a href="https://t.me/+79892145276" target="_blank" rel="noopener noreferrer" className="text-accent font-medium underline underline-offset-4">Telegram</a>{' '}
                    или{' '}
                    <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="text-accent font-medium underline underline-offset-4">MAX</a>.
                </p>
                {formBody}
            </div>
        </section>
    );
}
