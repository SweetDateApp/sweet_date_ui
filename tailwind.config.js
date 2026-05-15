/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff0f3',
          100: '#ffe0e8',
          200: '#ffc2d4',
          300: '#ff94b0',
          400: '#ff5580',
          500: '#ff2a4e',
          600: '#ed0a35',
          700: '#c8002a',
          800: '#a50327',
          900: '#880925',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-heart': 'pulseHeart 1.5s ease-in-out infinite',
        'typing': 'typing 8s steps(7) infinite',
        'blink': 'blinkCursor 0.8s steps(3) infinite',
        'progress': 'progress 10s linear forwards',
        'spin-once': 'spin 1s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        typing: {
          '0%, 90%, 100%': { width: '0' },
          '30%, 60%': { width: '230px' },
        },
        blinkCursor: {
          '0%, 75%': { opacity: '1' },
          '76%, 100%': { opacity: '0' },
        },
        progress: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
