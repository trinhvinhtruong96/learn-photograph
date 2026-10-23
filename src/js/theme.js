export const THEME_KEY = 'lp:theme';

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function createThemeToggle(storage) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button--ghost theme-toggle';
  const sync = () => {
    button.textContent = currentTheme() === 'light' ? 'Dark theme' : 'Light theme';
    button.setAttribute('aria-label', currentTheme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  };
  button.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      storage?.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the theme lasts for this page only.
    }
    sync();
  });
  sync();
  return button;
}
