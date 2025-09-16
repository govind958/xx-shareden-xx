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
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#EEEEEE',
  			foreground: '#222831',
  			card: {
  				DEFAULT: '#393E46',
  				foreground: '#EEEEEE'
  			},
  			popover: {
  				DEFAULT: '#393E46',
  				foreground: '#EEEEEE'
  			},
  			primary: {
  				DEFAULT: '#222831',
  				foreground: '#EEEEEE'
  			},
  			secondary: {
  				DEFAULT: '#393E46',
  				foreground: '#EEEEEE'
  			},
  			accent: {
  				DEFAULT: '#00ADB5',
  				foreground: '#222831'
  			},
  			destructive: {
  				DEFAULT: '#ff4d4f',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: '#AAAAAA',
  				foreground: '#222831'
  			},
  			border: '#393E46',
  			input: '#EEEEEE',
  			ring: '#00ADB5',
  			chart: {
  				'1': '#222831',
  				'2': '#393E46',
  				'3': '#00ADB5',
  				'4': '#EEEEEE',
  				'5': '#00ADB5'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
