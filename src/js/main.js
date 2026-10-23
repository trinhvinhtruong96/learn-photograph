import { STAGES, getStage } from '../data/roadmap.js';
import { renderHome } from './home.js';
import { mountIllustrations } from './illustrations.js';
import { renderFooter, renderHeader } from './layout.js';
import { createProgressStore } from './progress.js';
import { buildToc, initDrawer, renderChecklist, renderPager, renderStageHeader } from './stage-page.js';
import { mountWidgets } from './widgets/mount.js';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = getStorage();
const progress = createProgressStore(storage, STAGES);
// A page restored with the Back button shows old progress; reload it so it reads storage again.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.location.reload();
});
const main = document.getElementById('main');
const stageId = main.dataset.stage;
const stage = stageId ? getStage(stageId) : undefined;
if (stageId && !stage) throw new Error(`Unknown stage "${stageId}" in data-stage`);

const { tocButton } = renderHeader(document.getElementById('site-header'), { storage, withToc: Boolean(stage) });
renderFooter(document.getElementById('site-footer'));

if (stage) {
  const header = document.getElementById('stage-header');
  const refresh = () => renderStageHeader(header, stage, progress.stageStats(stage.id));
  refresh();
  renderChecklist(main.querySelector('[data-checklist]'), stage, progress, refresh);
  const toc = document.getElementById('toc');
  buildToc(toc, main);
  initDrawer(tocButton, toc);
  renderPager(document.getElementById('stage-pager'), stage);
} else if (main.dataset.page === 'home') {
  renderHome(main, progress);
}

mountIllustrations(main);
mountWidgets(main);
