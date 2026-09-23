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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">Images</h2>
      <div className="space-y-4">
        {(['avatar', 'banner'] as const).map((kind) => {
          const current = kind === 'avatar' ? form.avatarUrl : form.bannerUrl;
          return (
            <div key={kind} className="flex flex-wrap items-center gap-3">
              <span className="w-24 text-xs uppercase tracking-wider text-zinc-500">
                {kind === 'avatar' ? 'Avatar' : 'Banner'}
              </span>
              <label className={`${smallButtonCls} cursor-pointer focus-within:ring-2 focus-within:ring-green-400/60`}>
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => onUpload(kind, e.target.files?.[0])}
                />
              </label>
              {current && (
                <button onClick={() => onClear(kind)} className={smallButtonCls}>
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
        <p className="text-xs text-zinc-600">
          JPEG, PNG or WebP. Avatars are cropped square; banners to 3:1.
        </p>
      </div>
    </section>
  );
}
