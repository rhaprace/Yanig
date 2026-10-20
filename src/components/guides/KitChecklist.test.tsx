import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
import { KIT_ITEM_IDS } from '@/utils/guide';
import KitChecklist from './KitChecklist';
import { KIT_STORAGE_KEY } from './kitStorage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('KitChecklist', () => {
  let host: HTMLDivElement;
  let root: Root;

  const mount = () => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root.render(<KitChecklist />));
  };
  const unmount = () => {
    act(() => root.unmount());
    host.remove();
  };

  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('en');
    mount();
  });

  afterEach(() => {
    unmount();
    localStorage.clear();
  });

  it('shows the count, keeps ticks after a reload, and resets', () => {
    const total = KIT_ITEM_IDS.length;
    expect(host.textContent).toContain(`0 of ${total} ready`);

    act(() => (host.querySelector('#kit-water') as HTMLInputElement).click());
    act(() => (host.querySelector('#kit-radio') as HTMLInputElement).click());
    expect(host.textContent).toContain(`2 of ${total} ready`);
    expect(JSON.parse(localStorage.getItem(KIT_STORAGE_KEY)!)).toEqual(['radio', 'water']);

    unmount();
    mount();
    expect(host.textContent).toContain(`2 of ${total} ready`);
    expect((host.querySelector('#kit-water') as HTMLInputElement).checked).toBe(true);

    const reset = [...host.querySelectorAll('button')].find((b) => b.textContent === 'Clear all ticks')!;
    act(() => reset.click());
    expect(host.textContent).toContain(`0 of ${total} ready`);
    expect(localStorage.getItem(KIT_STORAGE_KEY)).toBeNull();
  });

  it('uses Philippine-friendly kit text', () => {
    expect(host.textContent).toContain('About 4 litres of water');
    expect(host.textContent).toContain('A battery-powered or hand-crank radio');
    expect(host.textContent).not.toMatch(/gallon|NOAA/i);
  });
});
