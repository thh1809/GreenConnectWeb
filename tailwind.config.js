export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // 🌈 Gradient chính (primary)
        'gradient-primary':
          'linear-gradient(to right, hsl(var(--gradient-primary-from)), hsl(var(--gradient-primary-to)))',

        // 🌈 Gradient phụ (secondary)
        'gradient-secondary':
          'linear-gradient(to bottom, hsl(var(--gradient-secondary-from)), hsl(var(--gradient-secondary-to)))',
      },
    },
  },
  plugin: [],
};
