import { useEffect, useRef, type ReactNode } from 'react';

/**
 * A poster strip fixed to the bottom of the screen.
 * While it shows, the page gets the same space at the bottom, so the strip never hides content.
 */
export const BottomStrip = ({
  title,
  text,
  actions,
  labelId,
}: {
  title: ReactNode;
  text: ReactNode;
  actions: ReactNode;
  labelId: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const root = document.documentElement;
    const body = document.body;
    const previousPadding = body.style.paddingBottom;

    const apply = () => {
      const height = `${node.offsetHeight}px`;
      body.style.paddingBottom = height;
      root.style.setProperty('--yanig-strip-h', height);
    };
    apply();

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply);
    observer?.observe(node);

    return () => {
      observer?.disconnect();
      body.style.paddingBottom = previousPadding;
      root.style.removeProperty('--yanig-strip-h');
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-labelledby={labelId}
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-primary bg-card text-card-foreground shadow-[0_-3px_0_hsl(var(--riso))]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="page-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
        <div className="min-w-0 flex-1 basis-64">
          <p id={labelId} className="font-display text-2xl font-black uppercase leading-none text-primary">
            {title}
          </p>
          <p className="mt-1 text-base">{text}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      </div>
    </div>
  );
};

export default BottomStrip;
