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
    <div className={`flex flex-col gap-1 w-72 ${className}`}>
      <span className="text-xs text-navy font-bold uppercase">{label}</span>
      <div className="flex w-full">
        {options.map((option, idx) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-2 py-1 text-xs font-bold transition-colors border-2 border-navy ${
              idx === 0 
                ? 'rounded-l-md border-r-0' 
                : idx === options.length - 1 
                  ? 'rounded-r-md -ml-[2px]' 
                  : 'border-r-0 -ml-[2px]'
            } ${
              value === option.value
                ? 'bg-navy text-white z-10'
                : 'bg-white text-navy hover:bg-silver'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
} 