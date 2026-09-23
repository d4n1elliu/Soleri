import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProfileData, ProfileLink, PinnedTrack, SpotifyTrack } from '../../types';
import { PROFILE_LIMITS } from '../../types';
import { fetchProfile, saveProfile, uploadProfileImage, deleteProfile } from '../../api';
import { processProfileImage } from '../../lib';

export type ImageKind = 'avatar' | 'banner';

export interface ProfileFormState {
  displayName: string;
  bio: string;
  pronouns: string;
  location: string;
  links: { label: string; url: string }[];
  pinnedTrack: PinnedTrack | null;
  accentColor: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  showGenres: boolean;
  showArtists: boolean;
  showTracks: boolean;
}

const EMPTY_LINK = { label: '', url: '' };

function toForm(profile: ProfileData | null, spotifyName: string): ProfileFormState {
  return {
    displayName: profile?.displayName ?? spotifyName,
    bio: profile?.bio ?? '',
    pronouns: profile?.pronouns ?? '',
    location: profile?.location ?? '',
    links: [
      ...(profile?.links ?? []).map((l) => ({ label: l.label, url: l.url })),
      ...Array(Math.max(0, PROFILE_LIMITS.links - (profile?.links.length ?? 0))).fill(EMPTY_LINK),
    ].slice(0, PROFILE_LIMITS.links),
    pinnedTrack: profile?.pinnedTrack ?? null,
    accentColor: profile?.accentColor ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    bannerUrl: profile?.bannerUrl ?? null,
    showGenres: profile?.showGenres ?? true,
    showArtists: profile?.showArtists ?? true,
    showTracks: profile?.showTracks ?? true,
  };
}

export function trackToPinned(track: SpotifyTrack): PinnedTrack {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map((a) => a.name).join(', '),
    image: track.album.images[0]?.url ?? '',
  };
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function useProfileForm(token: string, spotifyId: string, spotifyDisplayName: string) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadNonce, setLoadNonce] = useState(0);
  const [form, setForm] = useState<ProfileFormState>(() => toForm(null, spotifyDisplayName));
  const [savedForm, setSavedForm] = useState<ProfileFormState | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{ kind: ImageKind; progress: number } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadErrorKind, setUploadErrorKind] = useState<ImageKind | null>(null);
  const [deleting, setDeleting] = useState(false);
  const clearedImages = useRef<Record<ImageKind, boolean>>({ avatar: false, banner: false });

  const saving = saveState === 'saving';

  useEffect(() => {
    let cancelled = false;
    fetchProfile(spotifyId).then(({ profile, error }) => {
      if (cancelled) return;
      if (error) {
        // Leave the form unpopulated so a save can't wipe the real profile
        setLoadError(error);
        setLoading(false);
        return;
      }
      const initial = toForm(profile, spotifyDisplayName);
      setForm(initial);
      setSavedForm(initial);
      setLoadError(null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [spotifyId, spotifyDisplayName, loadNonce]);

  function reload() {
    setLoading(true);
    setLoadError(null);
    setLoadNonce((n) => n + 1);
  }

  useEffect(() => {
    if (saveState !== 'saved') return;
    const timer = setTimeout(() => setSaveState('idle'), 3000);
    return () => clearTimeout(timer);
  }, [saveState]);

  const dirty = useMemo(
    () => savedForm !== null && JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm],
  );

  useEffect(() => {
    if (!dirty && !saving) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, saving]);

  function set<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaveState('idle');
    setSaveError(null);
  }

  async function handleImage(kind: ImageKind, file: File | undefined) {
    if (!file) return;
    setUploadError('');
    setUploadErrorKind(null);
    try {
      const blob = await processProfileImage(file, kind);
      if (blob.size > PROFILE_LIMITS.imageBytes) {
        setUploadError('That image is too large even after resizing.');
        setUploadErrorKind(kind);
        return;
      }
      setUploading({ kind, progress: 0 });
      const { url, error } = await uploadProfileImage(token, kind, blob, (p) =>
        setUploading({ kind, progress: p }),
      );
      setUploading(null);
      if (error || !url) {
        setUploadError(error ?? 'Upload failed');
        setUploadErrorKind(kind);
        return;
      }
      clearedImages.current[kind] = false;
      // Uploads persist immediately server-side; mirror that in the saved snapshot
      const field = kind === 'avatar' ? 'avatarUrl' : 'bannerUrl';
      setForm((f) => ({ ...f, [field]: url }));
      setSavedForm((f) => (f ? { ...f, [field]: url } : f));
    } catch (err) {
      setUploading(null);
      setUploadError(err instanceof Error ? err.message : 'Could not process that image');
      setUploadErrorKind(kind);
    }
  }

  function clearImage(kind: ImageKind) {
    clearedImages.current[kind] = true;
    set(kind === 'avatar' ? 'avatarUrl' : 'bannerUrl', null);
  }

  async function handleSave() {
    setSaveState('saving');
    setSaveError(null);
    const links: ProfileLink[] = form.links
      .filter((l) => l.url.trim())
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }));
    const { profile, error } = await saveProfile(token, {
      displayName: form.displayName.trim() || null,
      bio: form.bio || null,
      pronouns: form.pronouns.trim() || null,
      location: form.location.trim() || null,
      links,
      pinnedTrack: form.pinnedTrack,
      accentColor: form.accentColor,
      showGenres: form.showGenres,
      showArtists: form.showArtists,
      showTracks: form.showTracks,
      ...(clearedImages.current.avatar ? { avatarUrl: null } : {}),
      ...(clearedImages.current.banner ? { bannerUrl: null } : {}),
    });
    if (error || !profile) {
      setSaveState('error');
      setSaveError(error ?? 'Could not save profile');
      return;
    }
    clearedImages.current = { avatar: false, banner: false };
    const next = toForm(profile, spotifyDisplayName);
    setForm(next);
    setSavedForm(next);
    setSaveState('saved');
  }

  async function handleDelete(): Promise<boolean> {
    setDeleting(true);
    const ok = await deleteProfile(token);
    setDeleting(false);
    if (!ok) {
      setSaveState('error');
      setSaveError('Could not delete profile data');
      return false;
    }
    const cleared = toForm(null, spotifyDisplayName);
    setForm(cleared);
    setSavedForm(cleared);
    setSaveState('idle');
    setSaveError(null);
    return true;
  }

  return {
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
  };
}
