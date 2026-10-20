import { afterEach, describe, expect, it, vi } from 'vitest';
import { KIT_ITEM_IDS } from '@/utils/guide';
import { KIT_STORAGE_KEY, countReady, loadKitChecks, saveKitChecks, toggleKitItem } from './kitStorage';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('kit checklist storage', () => {
  it('saves ticks per item id and reads them back after a reload', () => {
    const checked = toggleKitItem(toggleKitItem(new Set(), 'water'), 'radio');
    expect(saveKitChecks(checked)).toBe(true);
    expect(JSON.parse(localStorage.getItem(KIT_STORAGE_KEY)!)).toEqual(['radio', 'water']);
    expect(loadKitChecks(KIT_ITEM_IDS)).toEqual(new Set(['radio', 'water']));
  });

  it('removes the key when nothing is ticked (reset)', () => {
    saveKitChecks(new Set(['water']));
    saveKitChecks(new Set());
    expect(localStorage.getItem(KIT_STORAGE_KEY)).toBeNull();
    expect(loadKitChecks(KIT_ITEM_IDS).size).toBe(0);
  });

  it('toggles an item off again', () => {
    const on = toggleKitItem(new Set(), 'cash');
    expect(on.has('cash')).toBe(true);
    expect(toggleKitItem(on, 'cash').has('cash')).toBe(false);
  });

  it('ignores unknown ids, such as items removed from the list', () => {
    localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify(['water', 'noaaRadio', 42]));
    expect(loadKitChecks(KIT_ITEM_IDS)).toEqual(new Set(['water']));
  });

  it('returns an empty set for bad data', () => {
    localStorage.setItem(KIT_STORAGE_KEY, '{not json');
    expect(loadKitChecks(KIT_ITEM_IDS).size).toBe(0);
    localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify({ water: true }));
    expect(loadKitChecks(KIT_ITEM_IDS).size).toBe(0);
  });

  it('does not throw when the browser blocks storage', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(loadKitChecks(KIT_ITEM_IDS).size).toBe(0);
    expect(saveKitChecks(new Set(['water']))).toBe(false);
  });

  it('counts only the listed items', () => {
    expect(countReady(new Set(['water', 'radio', 'gone']), KIT_ITEM_IDS)).toBe(2);
  });

  it('has unique item ids', () => {
    expect(new Set(KIT_ITEM_IDS).size).toBe(KIT_ITEM_IDS.length);
  });
});
