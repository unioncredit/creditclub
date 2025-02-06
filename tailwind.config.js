const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'Berkeley Mono',
          ...defaultTheme.fontFamily.mono
        ],
        sans: [
          'Inter',
          ...defaultTheme.fontFamily.sans
        ]
      },
      colors: {
        'privy-navy': '#160B45',
        'privy-light-blue': '#EFF1FD',
        'privy-blueish': '#D4D9FC',
        'privy-pink': '#FF8271',
        heading: '#ECEEF4',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        highlight: 'var(--highlight)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        flat: '4px 5px 0px rgba(0, 0, 0, 0.2)'
      },
      screens: {
        'sm': {'max': '639px'}, // => @media (max-width: 639px) { ... }
        'md': {'max': '767px'}, // => @media (max-width: 767px) { ... }
        'lg': {'max': '1023px'}, // => @media (max-width: 1023px) { ... }
        'xl': {'max': '1279px'}, // => @media (max-width: 1279px) { ... }
        '2xl': {'max': '1535px'}, // => @media (max-width: 1535px) { ... }
      },
    }
  },
  plugins: [require('@tailwindcss/forms'), require("tailwindcss-animate")],
};
