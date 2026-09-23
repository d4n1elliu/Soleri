import type { ProfileData } from '../types';

export type ProfileSave = Omit<ProfileData, 'spotifyUserId' | 'avatarUrl' | 'bannerUrl'> & {
  // null clears a custom image; undefined leaves it untouched
  avatarUrl?: null;
  bannerUrl?: null;
};

export interface ProfileFetchResult {
  profile: ProfileData | null;
  error: string | null;
}

// 404 means "no profile yet"; other failures must be distinct or a save could wipe the profile
export async function fetchProfile(spotifyId: string): Promise<ProfileFetchResult> {
  try {
    const res = await fetch(`/api/profile?spotifyId=${encodeURIComponent(spotifyId)}`, {
      cache: 'no-store',
    });
    if (res.status === 404) return { profile: null, error: null };
    if (!res.ok) return { profile: null, error: 'Could not load your profile' };
    const data = (await res.json()) as { profile?: ProfileData };
    return { profile: data.profile ?? null, error: null };
  } catch {
    return { profile: null, error: 'Could not load your profile' };
  }
}

function saveErrorMessage(status: number, apiError: string | undefined): string {
  switch (status) {
    case 401:
      return 'Session expired, please log in again';
    case 429:
      return apiError ?? "You're saving too quickly, try again in a minute";
    case 400:
      return apiError ?? 'Could not save profile';
    default:
      return 'Could not save profile — check your connection and try again';
  }
}

export async function saveProfile(
  token: string,
  profile: ProfileSave,
): Promise<{ profile: ProfileData | null; error: string | null; status: number | null }> {
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    const data = (await res.json().catch(() => ({}))) as {
      profile?: ProfileData;
      error?: string;
    };
    if (!res.ok) {
      return { profile: null, error: saveErrorMessage(res.status, data.error), status: res.status };
    }
    return { profile: data.profile ?? null, error: null, status: res.status };
  } catch {
    return {
      profile: null,
      error: 'Could not save profile — check your connection and try again',
      status: null,
    };
  }
}

export function uploadProfileImage(
  token: string,
  kind: 'avatar' | 'banner',
  blob: Blob,
  onProgress?: (fraction: number) => void,
): Promise<{ url: string | null; error: string | null }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/profile-image?kind=${kind}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as { url?: string; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve({ url: data.url, error: null });
        } else {
          resolve({ url: null, error: data.error ?? 'Upload failed' });
        }
      } catch {
        resolve({ url: null, error: 'Upload failed' });
      }
    };
    xhr.onerror = () => resolve({ url: null, error: 'Upload failed' });
    xhr.send(blob);
  });
}

export async function deleteProfile(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/profile', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
