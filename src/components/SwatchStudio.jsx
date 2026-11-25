import React, { useState } from 'react';
import {
    WOOD_SPECIES,
    STAINS,
    ROOM_LIGHTS,
    ROOM_FLOORS,
    OTHER_WORKS_PRICES,
    INCLUDED_IN_PRICE,
} from '../content/homepage.js';

export default function SwatchStudio({ selectedWood, setSelectedWood, selectedStain, setSelectedStain, onAddWoodToFolder }) {
    const [light, setLight] = useState(ROOM_LIGHTS[0]);
    const [floor, setFloor] = useState(ROOM_FLOORS[0]);
    const [sheen, setSheen] = useState({ x: 50, y: 50, on: false });

    const base = import.meta.env.BASE_URL;

    return (
        <section id="prices" className="w-full pt-6 pb-12 md:pt-8 md:pb-16 px-5 md:px-12 bg-background scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-7">
                    <div>
                        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-2">
                            01 · Породы, выкрасы и стартовые цены
                        </div>
                        <h2 className="font-heading font-semibold text-4xl md:text-5xl text-primary leading-[1.08]">
                            Сколько стоит лестница
                        </h2>
                    </div>
                    <p className="text-textMain/75 max-w-xl text-base leading-relaxed m-0">
                        Ниже стартовые цены для самых простых вариантов - чтобы вы понимали порядок бюджета до звонка.
                        Точную сумму называем в течение суток после замера: она зависит от размеров проёма, конструкции
                        (прямая или поворотная), формы ступеней, балясин и отделки.
                    </p>
                </div>

                {/* Фишка #1: Стол живых выкрасов */}
                <div className="grid lg:grid-cols-12 gap-8 bg-surface border border-primary/15 p-5 sm:p-8 shadow-sm">
                    {/* Левая сцена с доской на фоне пола/двери */}
                    <div
                        className="lg:col-span-6 relative min-h-[360px] sm:min-h-[410px] p-5 sm:p-6 border border-primary/15 flex flex-col justify-between overflow-hidden transition-all duration-300"
                        style={{ background: floor.css }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none transition-colors duration-300"
                            style={{ background: light.tint }}
                        />

                        <div className="relative z-10 flex flex-wrap justify-between gap-2">
                            <span className="bg-surface/95 text-primary font-mono text-[11px] px-2.5 py-1.5 border border-primary/15">
                                Фон: {floor.name}
                            </span>
                            <span className="bg-surface/95 text-primary font-mono text-[11px] px-2.5 py-1.5 border border-primary/15">
                                Свет: {light.kelvin} · {light.name}
                            </span>
                        </div>

                        <div className="relative z-10 my-5 mx-auto w-full max-w-[460px]">
                            <div
                                className="relative h-48 sm:h-52 overflow-hidden border-b-[14px] border-[#5D442D] shadow-[0_22px_40px_rgba(24,18,12,0.28)]"
                                onMouseMove={(e) => {
                                    const r = e.currentTarget.getBoundingClientRect();
                                    setSheen({
                                        x: ((e.clientX - r.left) / r.width) * 100,
                                        y: ((e.clientY - r.top) / r.height) * 100,
                                        on: true,
                                    });
                                }}
                                onMouseLeave={() => setSheen((s) => ({ ...s, on: false }))}
                            >
                                <img
                                    src={`${base}${selectedWood.img}`}
                                    alt={`Образец древесины: ${selectedWood.name}`}
                                    width="900"
                                    height="458"
                                    className="w-full h-full object-cover transition-all duration-300"
                                    style={{ filter: `${selectedStain.filter} ${light.filter}` }}
                                />
                                <div
                                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                                    style={{
                                        background: selectedStain.overlay,
                                        mixBlendMode: selectedStain.blend,
                                    }}
                                />
                                <div
                                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                                    style={{
                                        opacity: sheen.on ? 1 : 0,
                                        background: `radial-gradient(circle 160px at ${sheen.x}% ${sheen.y}%, rgba(255,250,238,0.28), transparent 70%)`,
                                    }}
                                />
                                <div className="absolute right-3 top-3 z-10 bg-surface text-primary px-3 py-2 border border-primary/15 shadow-md">
                                    <div className="font-heading font-semibold text-xl leading-none">{selectedWood.name}</div>
                                    <div className="font-mono text-xs text-accent font-medium mt-1">{selectedWood.price}</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 bg-surface/95 text-textMain/75 text-xs sm:text-[13px] px-3.5 py-2.5 border border-primary/10 leading-snug">
                            Экран передаёт характер волокон, а точный оттенок подбираем живыми выкрасами на вашей породе при свете в вашем доме.
                        </div>
                    </div>

                    {/* Правая панель управления */}
                    <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-textMain/60 mb-2">
                                    1. Порода дерева под ключ
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                    {WOOD_SPECIES.map((sp) => {
                                        const active = sp.id === selectedWood.id;
                                        return (
                                            <button
                                                key={sp.id}
                                                type="button"
                                                onClick={() => setSelectedWood(sp)}
                                                className={`min-h-[56px] px-2 py-2 border text-center transition-colors ${
                                                    active
                                                        ? 'bg-primary text-surface border-primary'
                                                        : 'bg-background text-primary border-primary/15 hover:border-primary/40'
                                                }`}
                                            >
                                                <span className="block text-[13px] font-semibold">{sp.name}</span>
                                                <span className={`block font-mono text-[11px] mt-0.5 ${active ? 'text-amber' : 'text-accent'}`}>
                                                    {sp.priceShort}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-textMain/60 mb-2">
                                    2. Оттенок покрытия или эмаль
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {STAINS.map((st) => {
                                        const active = st.id === selectedStain.id;
                                        return (
                                            <button
                                                key={st.id}
                                                type="button"
                                                onClick={() => setSelectedStain(st)}
                                                className={`min-h-[40px] px-3 py-1.5 border text-[13px] inline-flex items-center gap-2 transition-colors ${
                                                    active
                                                        ? 'bg-white border-primary text-primary font-semibold shadow-[inset_0_0_0_1px_#1A1512]'
                                                        : 'bg-background border-primary/15 text-primary/85 hover:border-primary/40'
                                                }`}
                                            >
                                                <span
                                                    className="w-4 h-4 rounded-full border border-black/25 shrink-0"
                                                    style={{ background: st.swatch }}
                                                />
                                                {st.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-textMain/60 mb-2">
                                        3. Свет в комнате
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {ROOM_LIGHTS.map((lt) => {
                                            const active = lt.id === light.id;
                                            return (
                                                <button
                                                    key={lt.id}
                                                    type="button"
                                                    onClick={() => setLight(lt)}
                                                    className={`min-h-[40px] px-2 text-xs font-mono border transition-colors ${
                                                        active
                                                            ? 'bg-accent text-white border-accent font-medium'
                                                            : 'bg-background text-primary border-primary/15 hover:border-primary/40'
                                                    }`}
                                                >
                                                    {lt.kelvin}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-textMain/60 mb-2">
                                        4. Пол / дверь рядом
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {ROOM_FLOORS.map((fl) => {
                                            const active = fl.id === floor.id;
                                            return (
                                                <button
                                                    key={fl.id}
                                                    type="button"
                                                    onClick={() => setFloor(fl)}
                                                    className={`min-h-[40px] px-2.5 text-xs border transition-colors ${
                                                        active
                                                            ? 'bg-primary text-surface border-primary font-medium'
                                                            : 'bg-background text-primary border-primary/15 hover:border-primary/40'
                                                    }`}
                                                >
                                                    {fl.short}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background border-l-[3px] border-accent px-4 py-3.5">
                                <div className="font-mono text-[11.5px] text-accent font-medium mb-1">
                                    {selectedWood.hardness} · {selectedWood.humidity}
                                </div>
                                <p className="text-sm text-textMain/90 leading-relaxed m-0">
                                    {selectedWood.desc}{' '}
                                    <span className="text-textMain/70">
                                        Оттенок «{selectedStain.name}»: {selectedStain.note.toLowerCase()}.
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <button
                                type="button"
                                onClick={onAddWoodToFolder}
                                className="min-h-[46px] px-5 bg-accent hover:bg-[#7D3A14] text-white text-sm font-semibold transition-colors"
                            >
                                + Добавить выкрас в папку замера
                            </button>
                            <a
                                href={selectedWood.href}
                                className="min-h-[46px] px-5 border border-primary/30 hover:border-primary text-primary text-sm font-medium inline-flex items-center transition-colors"
                            >
                                Подробнее о породе ({selectedWood.name.toLowerCase()})
                            </a>
                        </div>
                    </div>
                </div>

                {/* Отдельные работы + Что входит в цену */}
                <div className="grid lg:grid-cols-12 gap-7 mt-7">
                    <div className="lg:col-span-7">
                        <div className="font-mono text-xs uppercase tracking-[0.12em] text-textMain/60 mb-3">
                            Отдельные работы
                        </div>
                        <div className="border-t border-primary/15 divide-y divide-primary/15">
                            {OTHER_WORKS_PRICES.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="group block py-5 transition-colors"
                                >
                                    <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1.5">
                                        <h3 className="font-semibold text-[17px] text-primary group-hover:text-accent transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="font-mono text-[15px] font-medium text-accent whitespace-nowrap">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p className="text-sm text-textMain/70 leading-relaxed m-0">
                                        {item.desc}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#EDE4D6] border border-primary/15 p-6 sm:p-8 flex flex-col justify-between gap-6">
                        <div>
                            <h3 className="font-heading font-semibold text-2xl sm:text-[26px] text-primary mb-4">
                                Что входит в цену под ключ
                            </h3>
                            <ul className="space-y-3 text-[15px] text-textMain/85">
                                {INCLUDED_IN_PRICE.map((line) => (
                                    <li key={line} className="flex items-start gap-3">
                                        <span className="w-2 h-0.5 bg-accent mt-2.5 shrink-0" />
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <a
                            href="/ceny/"
                            className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-primary transition-colors self-start"
                        >
                            Подробнее о том, из чего складывается цена
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
