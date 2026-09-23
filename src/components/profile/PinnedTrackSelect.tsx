import type { PinnedTrack, SpotifyTrack } from '../../types';
import { trackToPinned } from './useProfileForm';
import { inputCls, labelCls } from './formStyles';

interface PinnedTrackSelectProps {
  value: PinnedTrack | null;
  topTracks: SpotifyTrack[];
  onChange: (track: PinnedTrack | null) => void;
}

export function PinnedTrackSelect({ value, topTracks, onChange }: PinnedTrackSelectProps) {
  return (
    <div>
      <label htmlFor="pinnedTrack" className={labelCls}>Currently obsessed with</label>
      <select
        id="pinnedTrack"
        className={inputCls}
        value={value?.id ?? ''}
        onChange={(e) => {
          const track = topTracks.find((t) => t.id === e.target.value);
          onChange(track ? trackToPinned(track) : null);
        }}
      >
        <option value="">None</option>
        {topTracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.name} — {track.artists.map((a) => a.name).join(', ')}
          </option>
        ))}
      </select>
    </div>
  );
}
