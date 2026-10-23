import { el } from './dom.js';
import { createThemeToggle } from './theme.js';

export function renderHeader(header, { storage, withToc }) {
  const tocButton = withToc
    ? el('button', { type: 'button', class: 'button button--ghost toc-toggle', 'aria-expanded': 'false', 'aria-controls': 'toc', text: 'Contents' })
    : null;
  header.replaceChildren(
    el('div', { class: 'site-header__inner' }, [
      el('a', { class: 'brand', href: '/' }, [
        el('span', { text: 'Learn Photography' }),
        el('span', { class: 'brand__tag', text: 'from zero' }),
      ]),
      el('nav', { class: 'site-nav', 'aria-label': 'Main' }, [el('a', { href: '/#roadmap', text: 'Roadmap' })]),
      el('div', { class: 'site-header__actions' }, [tocButton, createThemeToggle(storage)]),
    ]),
  );
  return { tocButton };
}

export function renderFooter(footer) {
  footer.replaceChildren(
    el('div', { class: 'site-footer__inner' }, [
      el('p', { text: 'Made for one learner: Sony α7 II, 35mm f/1.4 and 85mm f/1.8, edited in darktable and GIMP.' }),
      el('p', { text: 'Camera and software steps follow the Sony Help Guide and the darktable 5.6 and GIMP 3.2 manuals.' }),
    ]),
  );
}
