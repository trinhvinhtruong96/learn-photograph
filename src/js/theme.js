export const THEME_KEY = 'lp:theme';

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function createThemeToggle(storage) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button--ghost theme-toggle';
  const sync = () => {
    button.textContent = currentTheme() === 'light' ? 'Giao diện tối' : 'Giao diện sáng';
    button.setAttribute('aria-label', currentTheme() === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
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
