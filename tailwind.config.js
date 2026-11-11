/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#58CC02',
          greenDark: '#46A302',
          blue: '#1CB0F6',
          blueDark: '#1899D6',
          purple: '#CE82FF',
          purpleDark: '#A568CC',
          yellow: '#FFC800',
          yellowDark: '#E5A400',
          red: '#FF4B4B',
          redDark: '#E63F3F',
          ink: '#4B4B4B',
          sub: '#777777',
          line: '#E5E7EB',
          soft: '#F7F7F7',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04)',
        pop: '0 12px 32px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shine: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        floatIn: 'floatIn .45s cubic-bezier(.2,.8,.2,1) both',
        popIn: 'popIn .3s cubic-bezier(.2,.8,.2,1) both',
        shine: 'shine 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
