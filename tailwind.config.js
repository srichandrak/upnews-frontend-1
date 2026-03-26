/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Netflix-inspired dark theme palette
        surface: '#121212',
        'surface-primary': '#1E1E1E',
        'surface-secondary': '#282828',
        'surface-tertiary': '#323232',

        'on-surface': '#E8E8E8',
        'on-surface-variant': '#B3B3B3',
        'on-surface-muted': '#808080',

        outline: '#646464',
        'outline-variant': '#525252',

        // Accent colors
        primary: '#E50914', // Netflix red
        'primary-container': '#8C0000',
        'on-primary': '#FFFFFF',

        secondary: '#00D4FF', // Cyan accent
        'secondary-container': '#005A73',
        'on-secondary': '#000000',

        tertiary: '#FFB81C', // Gold accent
        'tertiary-container': '#8C6D00',
        'on-tertiary': '#000000',

        // Semantic colors
        success: '#4CAF50',
        'success-container': '#1B5E20',
        'on-success': '#FFFFFF',

        warning: '#FF9800',
        'warning-container': '#E65100',
        'on-warning': '#FFFFFF',

        error: '#F44336',
        'error-container': '#B71C1C',
        'on-error': '#FFFFFF',

        info: '#2196F3',
        'info-container': '#1565C0',
        'on-info': '#FFFFFF',

        // Extended palette for UI
        'neutral-0': '#000000',
        'neutral-10': '#1A1A1A',
        'neutral-20': '#2D2D2D',
        'neutral-30': '#404040',
        'neutral-40': '#535353',
        'neutral-50': '#666666',
        'neutral-60': '#808080',
        'neutral-70': '#99A0A0',
        'neutral-80': '#B3B3B3',
        'neutral-90': '#E8E8E8',
        'neutral-95': '#F2F2F2',
        'neutral-99': '#FFFBFE',
        'neutral-100': '#FFFFFF',
      },

      fontFamily: {
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        // Display typography
        'display-lg': ['57px', { lineHeight: '64px', letterSpacing: '0px' }],
        'display-md': ['45px', { lineHeight: '52px', letterSpacing: '0px' }],
        'display-sm': ['36px', { lineHeight: '44px', letterSpacing: '0px' }],

        // Headline typography
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '0px' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '0px' }],
        'headline-sm': ['24px', { lineHeight: '32px', letterSpacing: '0px' }],

        // Title typography
        'title-lg': ['22px', { lineHeight: '28px', letterSpacing: '0px' }],
        'title-md': ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        'title-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],

        // Body typography
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.4px' }],

        // Label typography
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'label-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      },

      spacing: {
        // Consistent spacing scale
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '56px',
        '7xl': '64px',
      },

      borderRadius: {
        'extra-small': '4px',
        'small': '8px',
        'medium': '12px',
        'large': '16px',
        'extra-large': '28px',
        'full': '9999px',
      },

      boxShadow: {
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'level-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'level-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'level-4': '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
        'level-5': '0 20px 40px rgba(0, 0, 0, 0.2)',
      },

      opacity: {
        '6': '0.06',
        '8': '0.08',
        '12': '0.12',
        '16': '0.16',
        '38': '0.38',
      },

      backgroundImage: {
        'gradient-overlay-dark': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
        'gradient-overlay-light': 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
      },

      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },

  darkMode: 'class',

  plugins: [
    require('tailwindcss/plugin')(function({ addBase, addComponents, addUtilities }) {
      // Add custom utilities
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-truncate': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-4': {
          display: '-webkit-box',
          WebkitLineClamp: '4',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
      })
    }),
  ],
}
