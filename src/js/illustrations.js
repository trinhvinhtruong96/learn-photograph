const files = import.meta.glob('../illustrations/*.svg', { query: '?raw', import: 'default' });

export async function mountIllustrations(root) {
  await Promise.all([...root.querySelectorAll('[data-illus]')].map(async (slot) => {
    const load = files[`../illustrations/${slot.dataset.illus}.svg`];
    if (!load) {
      console.error(`Missing illustration: ${slot.dataset.illus}`);
      return;
    }
    slot.innerHTML = await load();
  }));
}
