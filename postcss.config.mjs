// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS plugin.
    tailwindcss: {},
    // Autoprefixer adds vendor prefixes to CSS rules (e.g., -webkit-).
    autoprefixer: {},
  },
};

export default config;