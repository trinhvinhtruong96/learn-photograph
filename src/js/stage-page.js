import { PRACTICE_METHOD, stageNeighbors, weeksLabel } from '../data/roadmap.js';
import { el, uid } from './dom.js';

const DESKTOP = window.matchMedia('(min-width: 1080px)');

export function progressBlock(stats, label) {
  const id = uid('progress');
  return el('div', { class: 'progress-block' }, [
    el('label', { for: id, class: 'progress-block__label', text: `${label}: ${stats.done} of ${stats.total}` }),
    el('progress', { id, max: stats.total || 1, value: stats.done }),
  ]);
}

export function renderStageHeader(container, stage, stats) {
  container.replaceChildren(
    el('p', { class: 'stage-kicker' }, [
      el('span', { text: `Stage ${stage.number}` }),
      el('span', { class: `badge badge--${stage.level.toLowerCase()}`, text: stage.level }),
      el('span', { text: weeksLabel(stage.weeks) }),
    ]),
    el('h1', { text: stage.title }),
    el('p', { class: 'stage-summary', text: stage.summary }),
    el('div', { class: 'stage-learn' }, [
      el('p', { class: 'stage-learn__label', text: 'What you will learn' }),
      el('ul', {}, stage.learn.map((item) => el('li', { text: item }))),
    ]),
    progressBlock(stats, 'Practice tasks done'),
  );
}

export function renderChecklist(container, stage, progress, onChange) {
  const items = stage.assignments.map((a) => {
    const id = `task-${stage.id}-${a.id}`;
    const input = el('input', { type: 'checkbox', id, 'aria-describedby': `${id}-task ${id}-check` });
    input.checked = progress.isDone(stage.id, a.id);
    input.addEventListener('change', () => {
      progress.setDone(stage.id, a.id, input.checked);
      onChange();
    });
    return el('li', { class: 'checklist__item' }, [
      el('div', { class: 'checklist__head' }, [input, el('label', { for: id, class: 'checklist__title', text: a.title })]),
      el('p', { id: `${id}-task`, class: 'checklist__task', text: a.task }),
      el('p', { id: `${id}-check`, class: 'checklist__check' }, [el('span', { class: 'checklist__check-label', text: 'Done when: ' }), a.check]),
    ]);
  });
  container.replaceChildren(el('p', { class: 'practice-method', text: PRACTICE_METHOD }), el('ul', { class: 'checklist' }, items));
}

function slugify(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

export function buildToc(toc, main) {
  const headings = [...main.querySelectorAll('h2')];
  const links = headings.map((heading) => {
    const section = heading.closest('section[id]');
    if (!heading.id && !section) heading.id = slugify(heading.textContent);
    const target = heading.id ? heading : section;
    return { link: el('a', { href: `#${target.id}`, text: heading.textContent }), heading };
  });
  toc.replaceChildren(
    el('p', { class: 'toc__title', text: 'On this page' }),
    el('ol', {}, links.map(({ link }) => el('li', {}, [link]))),
  );
  const byHeading = new Map(links.map(({ link, heading }) => [heading, link]));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const { link } of links) link.removeAttribute('aria-current');
      byHeading.get(entry.target)?.setAttribute('aria-current', 'location');
    }
  }, { rootMargin: '0px 0px -70% 0px' });
  for (const heading of headings) observer.observe(heading);
}

export function initDrawer(button, toc) {
  const close = el('button', { type: 'button', class: 'button button--ghost toc__close', text: 'Close' });
  toc.prepend(close);
  const focusables = () => [...toc.querySelectorAll('a, button')].filter((node) => node.offsetParent !== null);
  const open = () => {
    toc.dataset.open = 'true';
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    focusables()[0]?.focus();
  };
  const shut = (returnFocus) => {
    delete toc.dataset.open;
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    if (returnFocus) button.focus();
  };
  button.addEventListener('click', () => (toc.dataset.open ? shut(true) : open()));
  close.addEventListener('click', () => shut(true));
  toc.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || DESKTOP.matches || !toc.dataset.open) return;
    shut(false);
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  toc.addEventListener('keydown', (event) => {
    if (!toc.dataset.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      shut(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  DESKTOP.addEventListener('change', () => {
    if (DESKTOP.matches && toc.dataset.open) shut(false);
  });
}

export function renderPager(nav, stage) {
  const { prev, next } = stageNeighbors(stage.id);
  const link = (target, dir) => el('a', { class: `pager__link pager__link--${dir}`, href: target.path }, [
    el('span', { class: 'pager__dir', text: dir === 'prev' ? 'Previous stage' : 'Next stage' }),
    el('span', { class: 'pager__title', text: `${target.number}. ${target.title}` }),
  ]);
  const finish = el('a', { class: 'pager__link pager__link--next', href: '/#roadmap' }, [
    el('span', { class: 'pager__dir', text: 'You finished the roadmap' }),
    el('span', { class: 'pager__title', text: 'Back to the roadmap' }),
  ]);
  nav.replaceChildren(...[prev && link(prev, 'prev'), next ? link(next, 'next') : finish].filter(Boolean));
}
