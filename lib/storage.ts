import { ProjectState } from '@/types/project';
import { INITIAL_PROJECT_STATE } from './seed-data';

const STORAGE_KEY = 'gt_splice_workspace_v4';

export function loadProjectState(): ProjectState {
  if (typeof window === 'undefined') return INITIAL_PROJECT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECT_STATE));
      return INITIAL_PROJECT_STATE;
    }
    return JSON.parse(raw) as ProjectState;
  } catch {
    return INITIAL_PROJECT_STATE;
  }
}

export async function saveProjectState(state: ProjectState): Promise<void> {
  if (typeof window === 'undefined') return;
  const updated: ProjectState = {
    ...state,
    lastUpdated: new Date().toISOString()
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  const syncEndpoint = process.env.NEXT_PUBLIC_FIREBASE_SYNC_URL;
  if (syncEndpoint) {
    try {
      await fetch(syncEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {
      // Mantem salvo localmente
    }
  }
}

export function resetToSeedState(): ProjectState {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECT_STATE));
  }
  return INITIAL_PROJECT_STATE;
}

export function exportStateAsJson(state: ProjectState): void {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(state, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute(
    'download',
    `gt_splice_workspace_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(a);
  a.click();
  a.remove();
}
