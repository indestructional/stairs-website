/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--color-background)',
                primary: 'var(--color-primary)',
                accent: 'var(--color-accent)',
                textMain: 'var(--color-text-main)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Manrope', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
