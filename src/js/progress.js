export const PROGRESS_KEY = 'lp:progress:v1';

export function createProgressStore(storage, stages) {
  const known = new Map(stages.map((stage) => [stage.id, new Set(stage.assignments.map((a) => a.id))]));
  let state = load();

  function load() {
    let raw = null;
    try {
      raw = storage ? storage.getItem(PROGRESS_KEY) : null;
    } catch {
      return {};
    }
    if (!raw) return {};
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {};
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const clean = {};
    for (const [stageId, ids] of Object.entries(parsed)) {
      const valid = known.get(stageId);
      if (!valid || !Array.isArray(ids)) continue;
      const kept = [...new Set(ids.filter((id) => typeof id === 'string' && valid.has(id)))];
      if (kept.length) clean[stageId] = kept;
    }
    return clean;
  }

  function save() {
    try {
      storage?.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch {
      // Storage blocked or full: progress lasts for this page only.
    }
  }

  function stats(done, total) {
    const percent = total ? Math.round((done / total) * 100) : 0;
    let status = 'in-progress';
    if (done === 0) status = 'not-started';
    else if (done >= total) status = 'done';
    return { done, total, percent, status };
  }

  return {
    isDone(stageId, assignmentId) {
      return state[stageId]?.includes(assignmentId) ?? false;
    },
    setDone(stageId, assignmentId, done) {
      if (!known.get(stageId)?.has(assignmentId)) {
        throw new Error(`Unknown assignment "${stageId}/${assignmentId}"`);
      }
      const ids = new Set(state[stageId] ?? []);
      if (done) ids.add(assignmentId);
      else ids.delete(assignmentId);
      const next = { ...state };
      if (ids.size) next[stageId] = [...ids];
      else delete next[stageId];
      state = next;
      save();
    },
    stageStats(stageId) {
      return stats(state[stageId]?.length ?? 0, known.get(stageId)?.size ?? 0);
    },
    overallStats() {
      let done = 0;
      let total = 0;
      for (const [stageId, ids] of known) {
        total += ids.size;
        done += state[stageId]?.length ?? 0;
      }
      return stats(done, total);
    },
    reset() {
      state = {};
      try {
        storage?.removeItem(PROGRESS_KEY);
      } catch {
        // Storage blocked: nothing was saved, so nothing to clear.
      }
    },
  };
}
