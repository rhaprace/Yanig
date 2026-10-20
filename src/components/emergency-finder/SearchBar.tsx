import { Search, X } from 'lucide-react';

interface SearchBarProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  clearLabel: string;
  describedBy?: string;
}

/** A labelled search box in the poster style. */
export const SearchBar: React.FC<SearchBarProps> = ({ id, label, value, onChange, onClear, placeholder, clearLabel, describedBy }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-base font-bold">
      {label}
    </label>
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" aria-hidden="true" />
      <input
        id={id}
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault();
            onClear();
          }
        }}
        className="min-h-12 w-full rounded-sm border-[3px] border-primary bg-card py-2 pl-11 pr-12 text-base placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-primary hover:text-riso-text"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  </div>
);

export default SearchBar;
