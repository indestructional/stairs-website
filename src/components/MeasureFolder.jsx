import React, { useEffect } from 'react';
import { X, Share2, FolderHeart } from 'lucide-react';
import { WA_URL, TG_URL, MAX_URL } from '../content/homepage.js';

const WHY_TAGS = ['нравится цвет', 'нравится форма', 'нравятся перила'];
const imgSrc = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

export default function MeasureFolder({
    open,
    setOpen,
    woodSaved,
    selectedWood,
    selectedStain,
    savedWorks,
    whyMap,
    onToggleWhy,
    onRemoveWork,
    onClearWood,
    onCopyFamilyLink,
    onInjectToForm,
    onCopyForMax,
    toast,
}) {
    const total = savedWorks.length + (woodSaved ? 1 : 0);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, setOpen]);

    const buildMessage = () => {
        const lines = ['Здравствуйте! Смотрим сайт lestniza-krr.ru, хотим прикинуть стоимость лестницы.'];
        if (woodSaved) {
            lines.push(`Присматриваемся к породе: ${selectedWood.name} (${selectedWood.price}), оттенок «${selectedStain.name}».`);
        }
        if (savedWorks.length > 0) {
            lines.push('Понравившиеся примеры с сайта:');
            savedWorks.forEach((w, i) => {
                const tags = (whyMap[w.id] || []).join(', ');
                lines.push(`${i + 1}) ${w.displayTitle}${w.material ? ` (${w.material})` : ''}${tags ? ` - ${tags}` : ''}`);
            });
        }
        return lines.join('\n');
    };

    const message = buildMessage();

    return (
        <>
            {/* Плавающая панель: полностью скрыта при 0 элементов, не пересекается с виджетом мессенджеров справа */}
            <div
                className={`fixed left-3 right-[84px] sm:left-auto sm:right-24 md:right-28 bottom-5 md:bottom-7 z-[75] bg-surface text-primary border-2 border-accent px-3.5 py-2.5 shadow-2xl flex items-center justify-between sm:justify-start gap-3 transition-all duration-300 ${
                    total > 0
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible translate-y-24 pointer-events-none'
                }`}
            >
                <div className="flex items-center gap-2.5">
                    {savedWorks.length > 0 ? (
                        <div className="flex -space-x-1.5">
                            {savedWorks.slice(0, 3).map((w) => (
                                <img
                                    key={w.id}
                                    src={imgSrc(w.images[0])}
                                    alt=""
                                    className="w-9 h-9 object-cover border border-primary/25"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-9 h-9 bg-accent/15 text-accent flex items-center justify-center">
                            <FolderHeart size={18} />
                        </div>
                    )}
                    <div className="leading-tight">
                        <div className="font-semibold text-[13.5px]">Папка замера · {total}</div>
                        <div className="text-[11.5px] text-textMain/65">Скинуть семье или мастеру</div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="min-h-[38px] px-4 bg-primary hover:bg-accent text-surface text-[13px] font-semibold transition-colors shrink-0"
                >
                    Открыть
                </button>
            </div>

            {/* Выдвижная шторка папки замера */}
            {open && (
                <div
                    className="fixed inset-0 z-[110] bg-black/70 flex justify-end"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Папка замера"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full max-w-[440px] h-full overflow-y-auto bg-background text-primary p-5 sm:p-6 flex flex-col gap-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-primary/15 pb-3">
                            <h3 className="font-heading font-semibold text-2xl m-0">Папка замера</h3>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Закрыть папку замера"
                                className="min-w-[40px] min-h-[40px] border border-primary/25 flex items-center justify-center hover:border-primary"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-[13.5px] text-textMain/75 m-0">
                            Соберите до 3 понравившихся примеров и выкрас - подборку можно отправить короткой ссылкой мужу или жене, либо сразу переслать в мессенджер.
                        </p>

                        <div className="bg-surface border border-primary/15 p-3.5 text-[13.5px] flex items-start justify-between gap-2">
                            {woodSaved ? (
                                <>
                                    <div>
                                        <span className="font-mono text-[11px] uppercase text-accent block">Выбранный выкрас</span>
                                        <strong>{selectedWood.name}</strong> ({selectedWood.price}), оттенок «{selectedStain.name}»
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClearWood}
                                        aria-label="Убрать выкрас"
                                        className="text-textMain/50 hover:text-primary px-1 text-lg leading-none"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span className="text-textMain/65">
                                    Выкрас пока не добавлен - выберите породу в блоке «Сколько стоит лестница».
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {savedWorks.length > 0 ? (
                                savedWorks.map((w) => {
                                    const activeWhy = whyMap[w.id] || [];
                                    return (
                                        <div key={w.id} className="bg-surface border border-primary/15 p-3 grid grid-cols-[64px_1fr_auto] gap-3 items-start">
                                            <img src={imgSrc(w.images[0])} alt="" className="w-16 h-16 object-cover" />
                                            <div>
                                                <div className="font-semibold text-[13.5px] leading-snug">{w.displayTitle}</div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {WHY_TAGS.map((tag) => {
                                                        const on = activeWhy.includes(tag);
                                                        return (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                onClick={() => onToggleWhy(w.id, tag)}
                                                                className={`text-[11px] px-2 py-0.5 border transition-colors ${
                                                                    on
                                                                        ? 'bg-primary text-surface border-primary'
                                                                        : 'bg-background text-primary/80 border-primary/20'
                                                                }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onRemoveWork(w.id)}
                                                aria-label="Убрать пример"
                                                className="text-textMain/50 hover:text-primary text-lg leading-none px-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-[13.5px] text-textMain/65">
                                    Пока не отмечено ни одной работы. Нажмите «Сохранить как ориентир» на любой карточке.
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-wider text-textMain/60 mb-1.5">
                                Готовый текст сообщения:
                            </div>
                            <pre className="bg-white border border-primary/15 p-3 font-mono text-[12px] whitespace-pre-wrap text-primary/90 m-0 leading-relaxed">
                                {message}
                            </pre>
                        </div>

                        <div className="mt-auto flex flex-col gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={onCopyFamilyLink}
                                className="min-h-[44px] px-4 bg-primary hover:bg-accent text-surface text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                            >
                                <Share2 size={16} />
                                Скопировать ссылку мужу / жене
                            </button>

                            <div className="grid grid-cols-3 gap-2">
                                <a
                                    href={`${WA_URL}?text=${encodeURIComponent(message)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-h-[42px] bg-accent hover:bg-[#7D3A14] text-white text-[13px] font-semibold flex items-center justify-center"
                                >
                                    WhatsApp
                                </a>
                                <a
                                    href={`${TG_URL}?text=${encodeURIComponent(message)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-h-[42px] bg-accent hover:bg-[#7D3A14] text-white text-[13px] font-semibold flex items-center justify-center"
                                >
                                    Telegram
                                </a>
                                <button
                                    type="button"
                                    onClick={() => onCopyForMax(message, MAX_URL)}
                                    className="min-h-[42px] bg-accent hover:bg-[#7D3A14] text-white text-[13px] font-semibold flex items-center justify-center"
                                >
                                    MAX
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => onInjectToForm(message)}
                                className="min-h-[42px] border border-primary/30 hover:border-primary text-primary text-[13px] font-medium"
                            >
                                Подставить в форму на странице
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Уведомление-тост */}
            {toast && (
                <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[130] bg-primary text-surface border border-amber/60 px-4 py-2.5 text-sm font-medium shadow-xl max-w-[92vw] text-center">
                    {toast}
                </div>
            )}
        </>
    );
}
