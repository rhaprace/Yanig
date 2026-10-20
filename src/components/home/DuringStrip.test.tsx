import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
import { DuringStrip } from './DuringStrip';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('DuringStrip', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    await i18n.changeLanguage('en');
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    act(() =>
      root.render(
        <MemoryRouter>
          <DuringStrip />
        </MemoryRouter>
      )
    );
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const stepText = () => host.querySelector('[aria-live="polite"]')?.textContent ?? '';
  const current = () => host.querySelector('[aria-current="step"]')?.getAttribute('aria-label');
  const button = (label: string) => [...host.querySelectorAll('button')].find((b) => b.textContent === label)!;

  it('starts at Drop with the guide text and the Tagalog line', () => {
    expect(current()).toBe('Step 1 of 3: Drop');
    expect(stepText()).toContain('Drop to your hands and knees immediately.');
    expect(stepText()).toContain('Yumuko sa iyong mga kamay at tuhod kaagad.');
  });

  it('moves with the arrow keys and focuses the new panel', () => {
    const group = host.querySelector('[role="group"]')!;
    act(() => group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
    expect(current()).toBe('Step 2 of 3: Cover');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Step 2 of 3: Cover');
    act(() => group.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })));
    expect(current()).toBe('Step 3 of 3: Hold on');
    expect(stepText()).toContain('Stay in this position until the shaking stops.');
  });

  it('moves with Back and Next and stops at the ends', () => {
    act(() => button('Back').click());
    expect(current()).toBe('Step 1 of 3: Drop');
    act(() => button('Next step').click());
    act(() => button('Next step').click());
    act(() => button('Next step').click());
    expect(current()).toBe('Step 3 of 3: Hold on');
    expect(button('Next step').getAttribute('aria-disabled')).toBe('true');
  });

  it('warns about doorways', () => {
    expect(host.textContent).toContain('Do not stand in doorways.');
  });
});
