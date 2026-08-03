const STORAGE_KEY = 'nami_session_id';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `nami-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function useSessionId() {
  if (typeof window === 'undefined') return generateId();

  let id = window.sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateId();
    window.sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
