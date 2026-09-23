import { useState } from 'react';
import type { SpotifyTrack } from '../../types';
import { PROFILE_LIMITS } from '../../types';
import { ProfileHeader } from '../share';
import { ConfirmDialog } from '../ui';
import { useProfileForm } from './useProfileForm';
import { ImageUploadSection } from './ImageUploadSection';
import { LinksEditor } from './LinksEditor';
import { AccentPicker } from './AccentPicker';
import { PinnedTrackSelect } from './PinnedTrackSelect';
import { inputCls, labelCls, smallButtonCls } from './formStyles';

interface EditProfilePageProps {
  token: string;
  spotifyId: string;
  spotifyDisplayName: string;
  spotifyAvatarUrl: string | null;
  topTracks: SpotifyTrack[];
  onBack: () => void;
}

export function EditProfilePage({
  token,
  spotifyId,
  spotifyDisplayName,
  spotifyAvatarUrl,
  topTracks,
  onBack,
}: EditProfilePageProps) {
  const {
    loading,
    form,
    set,
    dirty,
    saving,
    saveMessage,
    uploading,
    uploadError,
    deleting,
    handleImage,
    clearImage,
    handleSave,
    handleDelete,
  } = useProfileForm(token, spotifyId, spotifyDisplayName);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleBack() {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    onBack();
  }

  if (loading) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-500 sm:px-8">Loading profile…</div>
    );
  }

  return (
    <div className="px-4 pb-16 pt-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">Edit profile</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Everything here is public on your share links.
            </p>
          </div>
          <button onClick={handleBack} className={`${smallButtonCls} px-4 py-2 text-sm`}>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Form */}
          <div className="space-y-6">
            <ImageUploadSection
              form={form}
              uploading={uploading}
              uploadError={uploadError}
              onUpload={handleImage}
              onClear={clearImage}
            />

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">About you</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className={labelCls}>Display name</label>
                  <input
                    id="displayName"
                    className={inputCls}
                    maxLength={PROFILE_LIMITS.displayName}
                    value={form.displayName}
                    onChange={(e) => set('displayName', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="bio" className={labelCls}>Bio</label>
                    <span className="text-xs tabular-nums text-zinc-600">
                      {form.bio.length}/{PROFILE_LIMITS.bio}
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    className={`${inputCls} min-h-20 resize-y`}
                    maxLength={PROFILE_LIMITS.bio}
                    value={form.bio}
                    onChange={(e) => set('bio', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pronouns" className={labelCls}>Pronouns</label>
                    <input
                      id="pronouns"
                      className={inputCls}
                      maxLength={PROFILE_LIMITS.pronouns}
                      placeholder="they/them"
                      value={form.pronouns}
                      onChange={(e) => set('pronouns', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className={labelCls}>Location</label>
                    <input
                      id="location"
                      className={inputCls}
                      maxLength={PROFILE_LIMITS.location}
                      placeholder="Sydney, Australia"
                      value={form.location}
                      onChange={(e) => set('location', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <LinksEditor links={form.links} onChange={(links) => set('links', links)} />

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">Flair</h2>
              <div className="space-y-4">
                <PinnedTrackSelect
                  value={form.pinnedTrack}
                  topTracks={topTracks}
                  onChange={(track) => set('pinnedTrack', track)}
                />
                <AccentPicker
                  value={form.accentColor}
                  onChange={(color) => set('accentColor', color)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">Public stats</h2>
              <div className="space-y-2">
                {(
                  [
                    ['showGenres', 'Show top genres'],
                    ['showArtists', 'Show top artists'],
                    ['showTracks', 'Show top tracks'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex min-h-11 items-center gap-3 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => set(key, e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 accent-green-500 focus-visible:ring-2 focus-visible:ring-green-400/60"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="rounded-full bg-green-500 px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              {saveMessage && (
                <span
                  role="status"
                  className={`text-sm ${saveMessage.ok ? 'text-green-400' : 'text-red-400'}`}
                >
                  {saveMessage.text}
                </span>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="ml-auto text-xs text-zinc-500 underline-offset-2 transition-colors hover:text-red-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                Delete my profile data
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
              Live preview
            </h2>
            <ProfileHeader
              profile={{
                displayName: form.displayName.trim() || spotifyDisplayName,
                pronouns: form.pronouns.trim() || null,
                location: form.location.trim() || null,
                bio: form.bio || null,
                links: form.links
                  .filter((l) => l.url.trim())
                  .map((l) => ({ label: l.label.trim() || l.url, url: l.url })),
                pinnedTrack: form.pinnedTrack,
                accentColor: form.accentColor,
                avatarUrl: form.avatarUrl ?? spotifyAvatarUrl,
                bannerUrl: form.bannerUrl,
              }}
            />
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete your profile data?"
          body="This removes your bio, links, images and settings from Soleri. Your share links keep working with just your stats. This cannot be undone."
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={async () => {
            await handleDelete();
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
