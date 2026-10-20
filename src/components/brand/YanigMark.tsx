/** The Yanig mark: a red circle crossed by a seismic line, on poster blue. */
const YanigMark = ({ className = 'h-10 w-10' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="10" fill="#1d3b8b" />
    <circle cx="32" cy="32" r="21" fill="#ff4d2e" />
    <path
      d="M6 34h12l4-9 6 20 6-26 6 22 4-9h14"
      fill="none"
      stroke="#efe6d3"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default YanigMark;
