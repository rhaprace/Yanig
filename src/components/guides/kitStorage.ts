/** Saves which emergency kit items a person has ticked. The data stays in this browser only. */
export const KIT_STORAGE_KEY = 'yanig-kit-checklist';

const getStorage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    // Some browsers block storage (private mode, blocked site data). The list then works without saving.
    return null;
  }
};

/** Reads the ticked ids. Unknown ids and bad data are ignored. */
export const loadKitChecks = (validIds: readonly string[]): Set<string> => {
  const valid = new Set(validIds);
  try {
    const raw = getStorage()?.getItem(KIT_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string' && valid.has(id)));
  } catch {
    return new Set();
  }
};

/** Writes the ticked ids. Returns false when the browser does not let us save. */
export const saveKitChecks = (checked: ReadonlySet<string>): boolean => {
  try {
    const storage = getStorage();
    if (!storage) return false;
    if (checked.size === 0) storage.removeItem(KIT_STORAGE_KEY);
    else storage.setItem(KIT_STORAGE_KEY, JSON.stringify([...checked].sort()));
    return true;
  } catch {
    return false;
  }
};

/** Returns a new set with the id added or removed. */
export const toggleKitItem = (checked: ReadonlySet<string>, id: string): Set<string> => {
  const next = new Set(checked);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

/** How many of the listed items are ticked. */
export const countReady = (checked: ReadonlySet<string>, ids: readonly string[]): number =>
  ids.filter((id) => checked.has(id)).length;
