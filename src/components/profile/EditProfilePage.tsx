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
import { VisibilityToggles } from './VisibilityToggles';
import { inputCls, labelCls, sectionTitleCls, smallButtonCls } from './formStyles';

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
    loadError,
    reload,
    form,
    set,
    dirty,
    saving,
    saveState,
    saveError,
    uploading,
    uploadError,
    uploadErrorKind,
    deleting,
    handleImage,
    clearImage,
    handleSave,
    handleDelete,
  } = useProfileForm(token, spotifyId, spotifyDisplayName);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleBack() {
    if (saving && !window.confirm('Your profile is still saving. Leave anyway?')) return;
    if (!saving && dirty && !window.confirm('You have unsaved changes. Leave without saving?')) {
      return;
    }
    onBack();
  }

  if (loading) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-500 sm:px-8">Loading profile…</div>
    );
  }

  if (loadError) {
    return (
      <div className="px-4 pb-16 pt-8 sm:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center">
          <p className="text-sm text-zinc-300">{loadError}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={reload}
              className="rounded-full bg-green-500 px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Retry
            </button>
            <button onClick={onBack} className={`${smallButtonCls} px-4 py-2 text-sm`}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-16 pt-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-light tracking-tight text-white">Edit profile</h1>
          <button onClick={handleBack} className={`${smallButtonCls} shrink-0 px-4 py-2 text-sm`}>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Form */}
          <div className="min-w-0 divide-y divide-zinc-800/60">
            <section className="pb-5">
              <h2 className={sectionTitleCls}>Profile</h2>
              <div className="space-y-4">
                <ImageUploadSection
                  form={form}
                  spotifyDisplayName={spotifyDisplayName}
                  spotifyAvatarUrl={spotifyAvatarUrl}
                  uploading={uploading}
                  uploadError={uploadError}
                  errorKind={uploadErrorKind}
                  onUpload={handleImage}
                  onClear={clearImage}
                />
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
                    className={`${inputCls} min-h-20 max-w-full resize-y`}
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

            <section className="py-5">
              <h2 className={sectionTitleCls}>Links</h2>
              <LinksEditor links={form.links} onChange={(links) => set('links', links)} />
            </section>

            <section className="pt-5">
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
                <VisibilityToggles form={form} onChange={(key, value) => set(key, value)} />
              </div>
            </section>
          </div>

          {/* Live preview */}
          <div className="min-w-0">
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

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className={`min-h-11 rounded-full px-8 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40 ${
              saveState === 'saved'
                ? 'bg-green-600 text-white'
                : 'bg-green-500 text-black hover:bg-green-400'
            }`}
            role={saveState === 'saved' ? 'status' : undefined}
          >
            {saving ? 'Saving…' : saveState === 'saved' ? 'Saved' : 'Save'}
          </button>
          {saveError && (
            <span role="alert" className="text-sm text-red-400">
              {saveError}
            </span>
          )}
        </div>

        <div className="mt-10 border-t border-zinc-800/60 pt-4">
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-zinc-600 underline-offset-2 transition-colors hover:text-red-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            Delete my profile data
          </button>
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
