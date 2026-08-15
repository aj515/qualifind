/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'card-subtle': 'rgb(var(--color-card-subtle) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',

        // Playful Geometric Palette
        'accent-violet': 'rgb(var(--color-accent-violet) / <alpha-value>)',
        'accent-pink': 'rgb(var(--color-accent-pink) / <alpha-value>)',
        'accent-amber': 'rgb(var(--color-accent-amber) / <alpha-value>)',
        'accent-mint': 'rgb(var(--color-accent-mint) / <alpha-value>)',
        'accent-cyan': 'rgb(var(--color-accent-cyan) / <alpha-value>)',

        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'pop-sm': '2px 2px 0px 0px var(--shadow-ink)',
        pop: '4px 4px 0px 0px var(--shadow-ink)',
        'pop-lg': '8px 8px 0px 0px var(--shadow-ink)',
        'pop-pink': '4px 4px 0px 0px var(--shadow-pink)',
        'pop-amber': '4px 4px 0px 0px var(--shadow-amber)',
        'pop-mint': '4px 4px 0px 0px var(--shadow-mint)',
        'pop-violet': '4px 4px 0px 0px var(--shadow-violet)'
      }
    }
  },
  plugins: []
};
