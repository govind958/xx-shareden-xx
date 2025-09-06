/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: '#EEEEEE', // Light gray background
        foreground: '#222831', // Dark text
        card: {
          DEFAULT: '#393E46', // Dark gray card
          foreground: '#EEEEEE', // Light text on card
        },
        popover: {
          DEFAULT: '#393E46',
          foreground: '#EEEEEE',
        },
        primary: {
          DEFAULT: '#222831', // Dark background
          foreground: '#EEEEEE', // Light text
        },
        secondary: {
          DEFAULT: '#393E46', // Dark gray
          foreground: '#EEEEEE',
        },
        accent: {
          DEFAULT: '#00ADB5', // Teal / highlight
          foreground: '#222831',
        },
        destructive: {
          DEFAULT: '#ff4d4f',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#AAAAAA',
          foreground: '#222831',
        },
        border: '#393E46',
        input: '#EEEEEE',
        ring: '#00ADB5',
        chart: {
          '1': '#222831',
          '2': '#393E46',
          '3': '#00ADB5',
          '4': '#EEEEEE',
          '5': '#00ADB5',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
