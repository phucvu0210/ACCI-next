export function RadioGroup({
  title,
  name,
  value,
  options,
  onChange,
  className = '',
  disabled = false,
}: {
  title: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`w-full my-4 ${className}`}>
      <label className="block" style={{ fontFamily: '"Aftersick DEMO", sans-serif' }}>
        {title}
      </label>
      <div className="flex gap-6 mt-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="appearance-none w-5 h-5 border-2 rounded-full"
                style={{ borderColor: '#FCE2A9', backgroundColor: '#FCE2A9' }}
                disabled={disabled}
              />
              {value === opt.value && (
                <div
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: '#F16F33',
                    top: '4px',
                    left: '4px',
                  }}
                />
              )}
            </div>
            <span style={{ fontFamily: 'Goldplay, sans-serif' }}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}