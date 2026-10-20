// Node 25 has its own localStorage global, and it hides the jsdom one in tests. Use a plain in-memory store.
const store = new Map<string, string>();
const memoryStorage: Storage = {
  get length() {
    return store.size;
  },
  clear: () => store.clear(),
  getItem: (key) => store.get(key) ?? null,
  key: (index) => [...store.keys()][index] ?? null,
  removeItem: (key) => void store.delete(key),
  setItem: (key, value) => void store.set(key, String(value)),
};
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true });

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList;
}
