import React, { useRef, useState } from 'react';
import { Phone, Check } from 'lucide-react';
import { PHONE, PHONE_HREF, CITY } from './content/landings.js';

const METRIKA_ID = 108209687;

/**
 * Форма заявки.
 *
 * Зачем: связаться с мастером можно было только звонком или сообщением
 * в мессенджер. Часть людей на это не готова - вечером, в выходные, или
 * пока только прицениваются. Форма снимает этот барьер.
 *
 * Отправка идёт обычной формой в скрытый кадр, а не запросом из скрипта:
 * браузер не пропускает запросы к сервису рассылки с нашего домена.
 * Проверено, это единственный работающий способ без своего сервера.
 */
export default function LeadForm({ accessKey, source = 'сайт' }) {
    const [state, setState] = useState('idle');
    const [sent, setSent] = useState({});
    const [agreed, setAgreed] = useState(false);
    const frameRef = useRef(null);
    const timerRef = useRef(null);

    const submit = (event) => {
        event.preventDefault();
        if (state === 'sending') return;

        const form = event.currentTarget;
        const name = form.elements.name.value.trim();
        const phone = form.elements.phone.value.trim();
        if (!name || !phone) return;

        setState('sending');
        setSent({ name, nuzhno: form.elements.nuzhno.value, comment: form.elements.comment.value.trim() });

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
        add('nuzhno', form.elements.nuzhno.value);
        add('comment', form.elements.comment.value.trim());
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
                // Цель в Метрике: без неё заявки не попадут в статистику,
                // а мы измеряем миссию именно по обращениям.
                window.ym?.(METRIKA_ID, 'reachGoal', 'zayavka');
            } else if (tries > 30) {
                clearInterval(timerRef.current);
                post.remove();
                setState('error');
            }
        }, 500);
    };

    // Ссылка в WhatsApp с уже написанным текстом: человеку остаётся нажать
    // «отправить», и обращение попадает в мессенджер, куда семья смотрит
    // постоянно. Автоматически отправить заявку в WhatsApp нельзя - для
    // этого нужен платный доступ к их API.
    const whatsappHref = () => {
        const text = sent.name
            ? `Здравствуйте! Меня зовут ${sent.name}. Оставил заявку на сайте: ${sent.nuzhno}.${sent.comment ? ' ' + sent.comment : ''}`
            : 'Здравствуйте! Хочу узнать про изготовление лестницы.';
        return `https://wa.me/79892145276?text=${encodeURIComponent(text)}`;
    };

    if (state === 'done') {
        return (
            <section id="zayavka" className="w-full px-6 md:px-16 py-16">
                <div className="max-w-3xl mx-auto bg-primary text-background rounded-2xl px-8 py-12 flex flex-col gap-5 items-start">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white">
                        <Check size={28} />
                    </div>
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-background">Заявка принята</h2>
                    <p className="opacity-85 max-w-xl">
                        Свяжемся с вами в ближайшее время. Если хочется быстрее - напишите
                        прямо сейчас в WhatsApp, там отвечаем в течение дня.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={whatsappHref()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-magnetic inline-flex items-center gap-3 bg-[#25D366] text-white px-7 py-4 rounded-full font-bold"
                        >
                            Продолжить в WhatsApp
                        </a>
                        <a
                            href={`tel:${PHONE_HREF}`}
                            className="inline-flex items-center gap-3 border border-background/30 px-7 py-4 rounded-full font-medium"
                        >
                            <Phone size={19} />
                            <span>{PHONE}</span>
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="zayavka" className="w-full px-6 md:px-16 py-16 scroll-mt-24">
            <div className="max-w-3xl mx-auto bg-white border border-primary/10 rounded-2xl px-6 md:px-10 py-10 shadow-sm">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-3">
                    Оставьте заявку на замер
                </h2>
                <p className="text-textMain/70 mb-8 max-w-xl">
                    Перезвоним, уточним детали и договоримся о времени. Замер бесплатный
                    в черте {CITY}а. Если удобнее написать - <a href="https://wa.me/79892145276" target="_blank" rel="noopener noreferrer" className="text-accent font-medium link-hover">напишите в WhatsApp</a>.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-textMain/70">Как к вам обращаться</span>
                            <input
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Имя"
                                className="border border-primary/15 rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm text-textMain/70">Телефон</span>
                            <input
                                name="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="+7 (___) ___-__-__"
                                className="border border-primary/15 rounded-xl px-4 py-3.5 focus:outline-none focus:border-accent"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm text-textMain/70">Что нужно</span>
                        <select
                            name="nuzhno"
                            defaultValue="Лестница на второй этаж"
                            className="border border-primary/15 rounded-xl px-4 py-3.5 bg-white focus:outline-none focus:border-accent"
                        >
                            <option>Лестница на второй этаж</option>
                            <option>Отделка бетонной лестницы деревом</option>
                            <option>Ступени на металлокаркас</option>
                            <option>Винтовая лестница</option>
                            <option>Перила и ограждения</option>
                            <option>Беседка, терраса</option>
                            <option>Мебель из массива</option>
                            <option>Пока не решил, нужен совет</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm text-textMain/70">Комментарий, если есть</span>
                        <textarea
                            name="comment"
                            rows={3}
                            placeholder="Размеры проёма, сроки, пожелания по породе дерева"
                            className="border border-primary/15 rounded-xl px-4 py-3.5 resize-y focus:outline-none focus:border-accent"
                        />
                    </label>

                    <label className="flex items-start gap-3 text-sm text-textMain/70">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            required
                            className="mt-1"
                        />
                        <span>
                            Согласен на обработку персональных данных в соответствии
                            с <a href="/privacy/" className="text-accent link-hover">политикой конфиденциальности</a>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={state === 'sending' || !agreed}
                        className="btn-magnetic bg-accent text-white px-8 py-4 rounded-full font-bold text-lg self-start disabled:opacity-50"
                    >
                        {state === 'sending' ? 'Отправляем...' : 'Отправить заявку'}
                    </button>

                    {state === 'error' && (
                        <p className="text-sm text-accent">
                            Не получилось отправить. Позвоните, пожалуйста, по номеру{' '}
                            <a href={`tel:${PHONE_HREF}`} className="font-medium underline">{PHONE}</a>{' '}
                            или напишите в WhatsApp - так точно дойдёт.
                        </p>
                    )}
                </form>

                <iframe ref={frameRef} name="lead-sink" title="Отправка заявки" style={{ display: 'none' }} />
            </div>
        </section>
    );
}
