import { el } from './dom.js';
import { siteUrl } from './site-url.js';
import { createThemeToggle } from './theme.js';

export function renderHeader(header, { storage, withToc }) {
  const tocButton = withToc
    ? el('button', { type: 'button', class: 'button button--ghost toc-toggle', 'aria-expanded': 'false', 'aria-controls': 'toc', text: 'Mục lục' })
    : null;
  header.replaceChildren(
    el('div', { class: 'site-header__inner' }, [
      el('a', { class: 'brand', href: siteUrl() }, [
        el('span', { text: 'Học Nhiếp Ảnh' }),
        el('span', { class: 'brand__tag', text: 'từ con số 0' }),
      ]),
      el('nav', { class: 'site-nav', 'aria-label': 'Điều hướng chính' }, [el('a', { href: siteUrl('#roadmap'), text: 'Lộ trình' })]),
      el('div', { class: 'site-header__actions' }, [tocButton, createThemeToggle(storage)]),
    ]),
  );
  return { tocButton };
}

export function renderFooter(footer) {
  footer.replaceChildren(
    el('div', { class: 'site-footer__inner' }, [
      el('p', { text: 'Dành riêng cho một người học: máy ảnh Sony, ống 35mm f/1.4 và 85mm f/1.8, chỉnh ảnh bằng darktable và GIMP.' }),
      el('p', { text: 'Các bước trên máy và phần mềm theo Sony Help Guide và hướng dẫn sử dụng darktable 5.6, GIMP 3.2.' }),
    ]),
  );
}
