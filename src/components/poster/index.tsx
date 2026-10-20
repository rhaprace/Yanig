import type { ReactNode } from 'react';

/** Small uppercase line above a heading, like the label on a printed notice. */
export const Kicker = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`font-display text-base font-bold uppercase tracking-[0.16em] text-riso-text ${className}`}>{children}</p>
);

/** The top of every page: kicker, a heavy poster headline, and a short intro. */
export const PageHero = ({
  kicker,
  title,
  intro,
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) => (
  <section className="page-wrap pb-8 pt-10 md:pt-14">
    {kicker && <Kicker className="mb-3">{kicker}</Kicker>}
    <h1 className="misreg max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] text-primary sm:text-6xl md:text-7xl">
      {title}
    </h1>
    {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85">{intro}</div>}
    {children}
  </section>
);

/** A section heading with the thick blue-and-red poster rule above it. */
export const SectionTitle = ({
  kicker,
  title,
  intro,
  id,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
}) => (
  <header className="poster-rule mb-6 pt-5">
    {kicker && <Kicker className="mb-1">{kicker}</Kicker>}
    <h2 id={id} className="font-display text-3xl font-black uppercase leading-none text-primary md:text-4xl">
      {title}
    </h2>
    {intro && <p className="mt-3 max-w-2xl text-foreground/80">{intro}</p>}
  </header>
);

/** A tilted red rubber stamp, for short labels such as "Example" or "Free". */
export const Stamp = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`stamp text-lg ${className}`}>{children}</span>
);
