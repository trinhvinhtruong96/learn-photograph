// Links must include Vite's base path: "/" in dev, "/<repo>/" on GitHub Pages.
export const siteUrl = (path = '') => `${import.meta.env.BASE_URL}${path}`;
