import type { ImageKind, ProfileFormState } from './useProfileForm';
import { InitialAvatar } from '../ui';
import { labelCls, smallButtonCls } from './formStyles';

interface ImageUploadSectionProps {
  form: ProfileFormState;
  spotifyDisplayName: string;
  spotifyAvatarUrl: string | null;
  uploading: { kind: ImageKind; progress: number } | null;
  uploadError: string;
  errorKind: ImageKind | null;
  onUpload: (kind: ImageKind, file: File | undefined) => void;
  onClear: (kind: ImageKind) => void;
}

export function ImageUploadSection({
  form,
  spotifyDisplayName,
  spotifyAvatarUrl,
  uploading,
  uploadError,
  errorKind,
  onUpload,
  onClear,
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-3">
      {(['avatar', 'banner'] as const).map((kind) => {
        const current = kind === 'avatar' ? form.avatarUrl : form.bannerUrl;
        const status =
          uploading?.kind === kind
            ? `Uploading… ${Math.round(uploading.progress * 100)}%`
            : errorKind === kind && uploadError
              ? uploadError
              : null;
        return (
          <div key={kind} className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 p-4">
            {kind === 'avatar' ? (
              <InitialAvatar name={spotifyDisplayName} src={form.avatarUrl ?? spotifyAvatarUrl} size="md" />
            ) : form.bannerUrl ? (
              <img src={form.bannerUrl} alt="" className="h-8 w-24 rounded object-cover" />
            ) : (
              <div className="h-8 w-24 rounded bg-zinc-800" />
            )}
            <div className="min-w-0">
              <span className={`${labelCls} mb-0`}>{kind === 'avatar' ? 'Avatar' : 'Banner'}</span>
              {status && (
                <p className={`text-xs ${errorKind === kind && uploadError ? 'text-red-400' : 'text-zinc-600'}`}>
                  {status}
                </p>
              )}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label className={`${smallButtonCls} flex min-h-11 cursor-pointer items-center focus-within:ring-2 focus-within:ring-green-400/60 sm:min-h-9`}>
                Upload
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
