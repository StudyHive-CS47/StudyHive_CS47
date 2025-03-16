/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '120': '1.2',
      },
      animation: {
        'spin': 'spin 5s linear infinite',
        'wave': 'wave 55s infinite linear',
        'wave-slow': 'wave 50s infinite linear',
        'wave-slower': 'wave 45s infinite linear',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        'teal': {
          DEFAULT: 'rgba(0, 174, 169, 1)',
          'light': 'rgba(0, 174, 169, 0.4)',
        },
      },
    },
  },
  plugins: [],
} 