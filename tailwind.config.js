/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#FFFFFF',
        bg: '#FAFAFA',
        border: '#E5E5E5',
        'border-hover': '#D1D5DB',
        primary: '#111111',
        secondary: '#6B7280',
        tertiary: '#9CA3AF',
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
        },
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.04em' }],
        'sm': ['13px', { lineHeight: '20px' }],
        'base': ['15px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['22px', { lineHeight: '32px' }],
        '2xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'xl': '12px',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
