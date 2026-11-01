/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c0d0ff',
          300: '#93adff',
          400: '#6080ff',
          500: '#3d57ff',
          600: '#2335f5',
          700: '#1b27e2',
          800: '#1a23b8',
          900: '#1c2491',
          950: '#121559',
        },
        surface: {
          DEFAULT: '#0f1117',
          50: '#1a1d27',
          100: '#1e2130',
          200: '#252837',
          300: '#2d3142',
          400: '#373c52',
        },
        accent: {
          purple: '#a855f7',
          pink: '#ec4899',
          teal: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3d57ff 0%, #a855f7 100%)',
        'gradient-surface': 'linear-gradient(180deg, #1a1d27 0%, #0f1117 100%)',
      },
      boxShadow: {
        glass: '0 4px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(61,87,255,0.3)',
        'glow-sm': '0 0 20px rgba(61,87,255,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
