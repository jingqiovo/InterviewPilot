/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - almost black for professional feel
        primary: '#111827',
        'primary-foreground': '#FFFFFF',
        
        // Background
        background: '#FFFFFF',
        foreground: '#111827',
        
        // Secondary
        secondary: '#F9FAFB',
        'secondary-foreground': '#111827',
        
        // Muted
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        
        // Accent
        accent: '#F3F4F6',
        'accent-foreground': '#111827',
        
        // Border
        border: '#E5E7EB',
        
        // Status colors
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        
        // Text hierarchy
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
      },
      borderRadius: {
        'radius': '12px',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['15px', { lineHeight: '1.6' }],
        'small': ['13px', { lineHeight: '1.5' }],
        'tiny': ['12px', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
