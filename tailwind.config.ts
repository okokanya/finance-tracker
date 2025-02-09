import Forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboro: ['Roboto', 'sans-serif'],

      },
      boxShadow: {
        thin: 'box-shadow: 0px 4px 8px 0px #E5E7EB',
        def: 'box-shadow: 0px 8px 16px 0px #E5E7EB',
      },
    },
  },
  plugins: [Forms],
} satisfies Config;
