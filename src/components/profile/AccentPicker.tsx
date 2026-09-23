import { ACCENT_COLORS } from '../../types';
import { labelCls } from './formStyles';

interface AccentPickerProps {
  value: string | null;
  onChange: (color: string | null) => void;
}

export function AccentPicker({ value, onChange }: AccentPickerProps) {
  return (
    <div>
      <span className={labelCls}>Accent colour</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Accent colour">
        {ACCENT_COLORS.map((color) => (
          <button
            key={color}
            role="radio"
            aria-checked={value === color}
            aria-label={`Accent ${color}`}
            onClick={() => onChange(value === color ? null : color)}
            className={`h-8 w-8 rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              value === color ? 'scale-110 ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
