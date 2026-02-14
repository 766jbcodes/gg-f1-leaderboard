interface ToggleOption<T> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T> {
  label: string;
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = '',
}: ToggleGroupProps<T>) {
  return (
    <div className={`flex flex-col gap-2 items-center sm:items-start ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">{label}</span>
      <div className="flex bg-secondary p-1 rounded-lg w-full max-w-sm relative">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                flex-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                ${isActive 
                  ? 'bg-white text-navy shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
