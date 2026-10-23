import { STAGES, weeksLabel } from '../data/roadmap.js';
import { el } from './dom.js';
import { progressBlock } from './stage-page.js';

const STATUS_TEXT = { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Done' };

function stageCard(stage, stats) {
  return el('a', { class: `stage-card stage-card--${stats.status}`, href: stage.path }, [
    el('span', { class: 'stage-card__number', text: stage.number }),
    el('span', { class: 'stage-card__body' }, [
      el('span', { class: 'stage-card__title', text: stage.title }),
      el('span', { class: 'stage-card__meta' }, [
        el('span', { class: `badge badge--${stage.level.toLowerCase()}`, text: stage.level }),
        el('span', { text: weeksLabel(stage.weeks) }),
      ]),
      el('span', { class: 'stage-card__summary', text: stage.summary }),
      el('span', { class: 'stage-card__status', text: `${STATUS_TEXT[stats.status]}: ${stats.done} of ${stats.total} practice tasks` }),
      el('span', { class: 'meter', 'aria-hidden': 'true' }, [el('span', { class: 'meter__fill', style: `width: ${stats.percent}%` })]),
    ]),
  ]);
}

export function renderHome(main, progress) {
  const roadmap = main.querySelector('[data-roadmap]');
  const overall = main.querySelector('[data-overall]');
  const plan = main.querySelector('[data-plan]');
  const reset = main.querySelector('[data-reset]');

  plan.replaceChildren(el('ol', { class: 'plan' }, STAGES.map((s) => el('li', {}, [
    el('span', { class: 'plan__weeks', text: weeksLabel(s.weeks) }),
    el('a', { href: s.path, text: `${s.number}. ${s.title}` }),
  ]))));

  const draw = () => {
    const card = (s) => el('li', {}, [stageCard(s, progress.stageStats(s.id))]);
    roadmap.replaceChildren(
      el('h3', { class: 'roadmap__label', text: 'Core: stages 1 to 6, in order' }),
      el('ol', { class: 'roadmap__path' }, STAGES.filter((s) => s.group === 'core').map(card)),
      el('h3', { class: 'roadmap__label', text: 'Tracks: any order after stage 6' }),
      el('ul', { class: 'roadmap__tracks' }, STAGES.filter((s) => s.group === 'track').map(card)),
      el('h3', { class: 'roadmap__label', text: 'Finish' }),
      el('ol', { class: 'roadmap__path' }, STAGES.filter((s) => s.group === 'final').map(card)),
    );
    overall.replaceChildren(progressBlock(progress.overallStats(), 'All practice tasks done'));
  };

  reset.addEventListener('click', () => {
    if (window.confirm('Reset all practice progress? This cannot be undone.')) {
      progress.reset();
      draw();
    }
  });
  draw();
}
