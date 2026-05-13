/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          ink: 'rgb(var(--color-ink) / <alpha-value>)',
          background: 'rgb(var(--color-background) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          sidebar: 'rgb(var(--color-sidebar) / <alpha-value>)',
          active: 'rgb(var(--color-active) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',

          // text
          text: 'rgb(var(--color-text) / <alpha-value>)',
          subtext: 'rgb(var(--color-subtext) / <alpha-value>)',

          // messages
          messageSent: 'rgb(var(--color-message-sent) / <alpha-value>)',
          messageReceived: 'rgb(var(--color-message-received) / <alpha-value>)',

          // New premium colors
          gold: 'rgb(var(--color-gold) / <alpha-value>)',
          platinum: 'rgb(var(--color-platinum) / <alpha-value>)',
          emerald: 'rgb(var(--color-emerald) / <alpha-value>)',
          ruby: 'rgb(var(--color-ruby) / <alpha-value>)',
          sapphire: 'rgb(var(--color-sapphire) / <alpha-value>)',
          amethyst: 'rgb(var(--color-amethyst) / <alpha-value>)',
          coral: 'rgb(var(--color-coral) / <alpha-value>)',
          turquoise: 'rgb(var(--color-turquoise) / <alpha-value>)',
          lavender: 'rgb(var(--color-lavender) / <alpha-value>)',
          rose: 'rgb(var(--color-rose) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 18px 55px rgba(15, 23, 42, 0.10)',
        glow: '0 18px 60px rgba(37, 99, 235, 0.24)',
        lift: '0 24px 70px rgba(15, 23, 42, 0.16)',
        'glow-gold': '0 18px 60px rgba(255, 215, 0, 0.24)',
        'glow-emerald': '0 18px 60px rgba(80, 200, 120, 0.24)',
        'glow-ruby': '0 18px 60px rgba(224, 17, 95, 0.24)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(37, 99, 235, 0)' },
          '50%': { boxShadow: '0 0 42px rgba(37, 99, 235, 0.28)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 0 rgba(37, 99, 235, 0))' },
          '50%': { filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(37, 99, 235, 0.4))' },
        },
        'aurora-pan': {
          '0%': { transform: 'translate3d(-2%, -2%, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(2%, 1%, 0) rotate(6deg)' },
          '100%': { transform: 'translate3d(-2%, -2%, 0) rotate(0deg)' },
        },
        'soft-pop': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 650ms cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'pulse-glow': 'pulseGlow 2.8s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'scale-in': 'scale-in 300ms ease-out both',
        'slide-in-right': 'slide-in-right 400ms ease-out both',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'aurora-pan': 'aurora-pan 12s ease-in-out infinite',
        'soft-pop': 'soft-pop 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
