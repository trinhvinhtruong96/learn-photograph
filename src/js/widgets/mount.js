const loaders = import.meta.glob(['./*-sim.js', './edit-steps.js']);

export async function mountWidgets(root) {
  await Promise.all([...root.querySelectorAll('[data-widget]')].map(async (host) => {
    const load = loaders[`./${host.dataset.widget}.js`];
    if (!load) {
      console.error(`Unknown widget: ${host.dataset.widget}`);
      return;
    }
    const widget = await load();
    widget.mount(host);
  }));
}
