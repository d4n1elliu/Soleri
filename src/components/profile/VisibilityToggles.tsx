import type { ProfileFormState } from './useProfileForm';
import { labelCls } from './formStyles';

type ToggleKey = 'showGenres' | 'showArtists' | 'showTracks';

const TOGGLES: [ToggleKey, string][] = [
  ['showGenres', 'Genres'],
  ['showArtists', 'Artists'],
  ['showTracks', 'Tracks'],
];

interface VisibilityTogglesProps {
  form: ProfileFormState;
  onChange: (key: ToggleKey, value: boolean) => void;
}

export function VisibilityToggles({ form, onChange }: VisibilityTogglesProps) {
  return (
    <div>
      <span className={labelCls}>Show on profile</span>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {TOGGLES.map(([key, label]) => (
          <label key={key} className="flex min-h-11 items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 accent-green-500 focus-visible:ring-2 focus-visible:ring-green-400/60"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
