import type { ImageKind, ProfileFormState } from './useProfileForm';
import { smallButtonCls } from './formStyles';

interface ImageUploadSectionProps {
  form: ProfileFormState;
  uploading: { kind: ImageKind; progress: number } | null;
  uploadError: string;
  onUpload: (kind: ImageKind, file: File | undefined) => void;
  onClear: (kind: ImageKind) => void;
}

export function ImageUploadSection({
  form,
  uploading,
  uploadError,
  onUpload,
  onClear,
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-3">
      {(['avatar', 'banner'] as const).map((kind) => {
        const current = kind === 'avatar' ? form.avatarUrl : form.bannerUrl;
        return (
          <div key={kind} className="flex flex-wrap items-center gap-3">
            <label className={`${smallButtonCls} flex min-h-11 cursor-pointer items-center focus-within:ring-2 focus-within:ring-green-400/60 sm:min-h-9`}>
              Upload {kind}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label={`Upload ${kind}`}
                onChange={(e) => onUpload(kind, e.target.files?.[0])}
              />
            </label>
            {current && (
              <button
                onClick={() => onClear(kind)}
                className={`${smallButtonCls} flex min-h-11 items-center sm:min-h-9`}
              >
                {kind === 'avatar' ? 'Reset to Spotify avatar' : 'Remove banner'}
              </button>
            )}
            {uploading?.kind === kind && (
              <span className="text-xs text-zinc-400">
                Uploading… {Math.round(uploading.progress * 100)}%
              </span>
            )}
          </div>
        );
      })}
      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
    </div>
  );
}
