import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        dark: '#1F2937',
        light: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
